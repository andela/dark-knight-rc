/* eslint camelcase: 0 */
import moment from "moment";
import { Meteor } from "meteor/meteor";
import { check, Match } from "meteor/check";
import { Reaction, Logger } from "/server/api";
import { ProductSearch, OrderSearch, AccountSearch, Orders, Products, Accounts, Shops } from "/lib/collections";
import utils from "./common";
import { transformations } from "./transformations";


const requiredFields = {};
requiredFields.products = ["_id", "hashtags", "shopId", "handle", "price", "isVisible", "isSoldOut", "isLowQuantity", "isBackorder", "createdAt", "vendor", "averageRating"];
requiredFields.orders = ["_id", "shopId", "shippingName", "shippingPhone", "billingName", "userEmails",
  "shippingAddress", "billingAddress", "shippingStatus", "billingStatus", "orderTotal", "orderDate"];
requiredFields.accounts = ["_id", "shopId", "emails", "profile"];

// https://docs.mongodb.com/manual/reference/text-search-languages/#text-search-languages
// MongoDb supports a subset of languages for analysis of the text data which includes
// things like stop words and stems. With this language support the quality of the search matches
// and weighting increases, however without this search will still work and delivery good results.
// We currently support the languages which are supported by Mongo by default but more languages
// are available through custom configuration.
const supportedLanguages = ["da", "nl", "en", "fi", "fr", "de", "hu", "it", "nb", "pt", "ro", "ru", "es", "sv", "tr"];


function filterFields(customFields) {
  const fieldNames = [];
  const fieldKeys = Object.keys(customFields);
  for (const fieldKey of fieldKeys) {
    if (customFields[fieldKey]) {
      fieldNames.push(fieldKey);
    }
  }
  return fieldNames;
}

// get the weights for all enabled fields
function getScores(customFields, settings, collection = "products") {
  const weightObject = {};
  for (const weight of Object.keys(settings[collection].weights)) {
    if (customFields.includes(weight)) {
      weightObject[weight] = settings[collection].weights[weight];
    }
  }
  return weightObject;
}

function getSearchLanguage() {
  const shopId = Reaction.getShopId();
  const shopLanguage = Shops.findOne(shopId).language;
  if (supportedLanguages.includes(shopLanguage)) {
    return { default_language: shopLanguage };
  }
  return { default_language: "en" };
}

export function getSearchParameters(collection = "products") {
  const settings = utils.getPackageSettings();
  const customFields = filterFields(settings[collection].includes);
  const fieldSet = requiredFields[collection].concat(customFields);
  const weightObject = getScores(customFields, settings);
  return { fieldSet: fieldSet, weightObject: weightObject, customFields: customFields };
}

export function buildProductSearchRecord(productId) {
  const product = Products.findOne(productId);
  if (product.type === "simple") {
    const { fieldSet } = getSearchParameters();
    const productRecord = {};
    for (const field of fieldSet) {
      if (transformations.products[field]) {
        productRecord[field] = transformations.products[field](product[field]);
      } else {
        productRecord[field] = product[field];
      }
    }
    const productSearchRecord = ProductSearch.insert(productRecord);
    ensureProductSearchIndex();
    return productSearchRecord;
  }
  return undefined;
}

export function buildProductSearch(cb) {
  check(cb, Match.Optional(Function));
  Logger.debug("Start (re)Building ProductSearch Collection");
  ProductSearch.remove({});
  const { fieldSet, weightObject, customFields } = getSearchParameters();
  const products = Products.find({ type: "simple" }).fetch();
  for (const product of products) {
    const productRecord = {};
    for (const field of fieldSet) {
      if (transformations.products[field]) {
        productRecord[field] = transformations.products[field](product[field]);
      } else {
        productRecord[field] = product[field];
      }
    }
    ProductSearch.insert(productRecord);
  }
  const indexObject = {};
  for (const field of customFields) {
    indexObject[field] = "text";
  }

  const rawProductSearchCollection = ProductSearch.rawCollection();
  rawProductSearchCollection.dropIndexes("*");
  rawProductSearchCollection.createIndex(indexObject, weightObject, getSearchLanguage());
  if (cb) {
    cb();
  }
}

// we build this immediately on startup so that search will not throw an error
export function buildEmptyProductSearch() {
  const { weightObject, customFields } = getSearchParameters();
  const indexObject = {};
  for (const field of customFields) {
    indexObject[field] = "text";
  }
  const rawProductSearchCollection = ProductSearch.rawCollection();
  rawProductSearchCollection.dropIndexes("*");
  rawProductSearchCollection.createIndex(indexObject, weightObject, getSearchLanguage());
}

export function rebuildProductSearchIndex(cb) {
  check(cb, Match.Optional(Function));
  const { customFields, weightObject } = getSearchParameters();
  const indexObject = {};
  for (const field of customFields) {
    indexObject[field] = "text";
  }
  const rawProductSearchCollection = ProductSearch.rawCollection();
  rawProductSearchCollection.dropIndexes("*");
  rawProductSearchCollection.createIndex(indexObject, weightObject, getSearchLanguage());
  if (cb) {
    cb();
  }
}

// this only creates the index if it doesn't already exist, `ensureIndex` is deprecated
export function ensureProductSearchIndex() {
  const { customFields, weightObject } = getSearchParameters();
  const indexObject = {};
  for (const field of customFields) {
    indexObject[field] = "text";
  }
  const rawProductSearchCollection = ProductSearch.rawCollection();
  rawProductSearchCollection.createIndex(indexObject, weightObject, getSearchLanguage());
}

export function buildOrderSearchRecord(orderId) {
  const order = Orders.findOne(orderId);
  const user = Meteor.users.findOne(order.userId);
  const anonymousUserEmail = order.email;

  const userEmails = [];
  if (user && user.emails.length) {
    for (const email of user.emails) {
      userEmails.push(email.address);
    }
  } else {
    if (anonymousUserEmail) {
      userEmails.push(anonymousUserEmail);
    }
  }
  const orderSearch = {};
  for (const field of requiredFields.orders) {
    if (transformations.orders[field]) {
      orderSearch[field] = transformations.orders[field](order[field]);
    } else {
      orderSearch[field] = order[field];
    }
  }
  // get the billing object for the current shop on the order (and not hardcoded [0])
  const shopBilling = order.billing && order.billing.find(
    billing => billing && billing.shopId === Reaction.getShopId()
  ) || {};

  // get the shipping object for the current shop on the order (and not hardcoded [0])
  const shopShipping = order.shipping.find(
    shipping => shipping.shopId === Reaction.getShopId()
  ) || {};

  orderSearch.billingName = shopBilling.address && shopBilling.address.fullName;
  orderSearch.billingPhone = shopBilling.address && shopBilling.address.phone.replace(/\D/g, "");
  orderSearch.shippingName = shopShipping.address && shopShipping.address.fullName;
  if (shopShipping.address && shopShipping.address.phone) {
    orderSearch.shippingPhone = shopShipping.address && shopShipping.address.phone.replace(/\D/g, "");
  }

  orderSearch.billingAddress = {
    address: shopBilling.address && shopBilling.address.address1,
    postal: shopBilling.address && shopBilling.address.postal,
    city: shopBilling.address && shopBilling.address.city,
    region: shopBilling.address && shopBilling.address.region,
    country: shopBilling.address && shopBilling.address.country
  };
  orderSearch.shippingAddress = {
    address: shopShipping.address && shopShipping.address.address1,
    postal: shopShipping.address && shopShipping.address.postal,
    city: shopShipping.address && shopShipping.address.city,
    region: shopShipping.address && shopShipping.address.region,
    country: shopShipping.address && shopShipping.address.country
  };
  orderSearch.userEmails = userEmails;
  orderSearch.orderTotal = shopBilling.invoice && shopBilling.invoice.total;
  orderSearch.orderDate = moment(order.createdAt).format("YYYY/MM/DD");
  orderSearch.billingStatus = shopBilling.paymentMethod && shopBilling.paymentMethod.status;
  orderSearch.billingCard = shopBilling.paymentMethod && shopBilling.paymentMethod.storedCard;
  orderSearch.currentWorkflowStatus = order.workflow.status;
  if (shopShipping.shipped) {
    orderSearch.shippingStatus = "Shipped";
  } else if (shopShipping.packed) {
    orderSearch.shippingStatus = "Packed";
  } else {
    orderSearch.shippingStatus = "New";
  }
  orderSearch.product = {};
  orderSearch.variants = {};
  orderSearch.product.title = order.items.map(item => item.product && item.product.title);
  orderSearch.variants.title = order.items.map(item => item.variants && item.variants.title);
  orderSearch.variants.optionTitle = order.items.map(item => item.variants && item.variants.optionTitle);

  OrderSearch.insert(orderSearch);
}

export function buildOrderSearch(cb) {
  check(cb, Match.Optional(Function));
  const orders = Orders.find({}).fetch();
  for (const order of orders) {
    buildOrderSearchRecord(order._id);
  }
  const rawOrderSearchCollection = OrderSearch.rawCollection();
  rawOrderSearchCollection.dropIndexes("*");
  rawOrderSearchCollection.createIndex({ shopId: 1, shippingName: 1, billingName: 1, userEmails: 1 });
  if (cb) {
    cb();
  }
}


export function buildAccountSearch(cb) {
  check(cb, Match.Optional(Function));
  AccountSearch.remove({});
  const accounts = Accounts.find({}).fetch();
  for (const account of accounts) {
    buildAccountSearchRecord(account._id);
  }
  const rawAccountSearchCollection = AccountSearch.rawCollection();
  rawAccountSearchCollection.dropIndexes("*");
  rawAccountSearchCollection.createIndex({ shopId: 1, emails: 1 });
  if (cb) {
    cb();
  }
}

export function buildAccountSearchRecord(accountId) {
  Logger.debug("building account search record");
  check(accountId, String);
  const account = Accounts.findOne(accountId);
  // let's ignore anonymous accounts
  if (account && account.emails && account.emails.length) {
    const accountSearch = {};
    for (const field of requiredFields.accounts) {
      if (transformations.accounts[field]) {
        accountSearch[field] = transformations.accounts[field](account[field]);
      } else {
        accountSearch[field] = account[field];
      }
    }
    AccountSearch.insert(accountSearch);
    const rawAccountSearchCollection = AccountSearch.rawCollection();
    rawAccountSearchCollection.createIndex({ shopId: 1, emails: 1 });
  }
}
