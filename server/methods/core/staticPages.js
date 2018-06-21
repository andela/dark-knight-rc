import * as Collections from "/lib/collections";
import * as Schemas from "../../../lib/collections/schemas";
import { StaticPages } from "../../../lib/collections";
import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";

Meteor.methods({
  /**
     * Create a new Static Page
     */
  createStaticPage: (pageName,
    pageAddress,
    pageContent,
    userId,
    shopId,
    isEnabled,
    createdAt
  ) => {
    check(pageName, String);
    check(pageAddress, String);
    check(pageContent, String);
    check(userId, String);
    check(shopId, String);
    check(isEnabled, Boolean);
    check(createdAt, Date);

    const pageDetails = {
      pageName,
      pageAddress,
      pageContent,
      userId,
      shopId,
      isEnabled,
      createdAt
    };

    check(pageDetails, Schemas.StaticPages);
    return Collections.StaticPages.insert(pageDetails);
  },

  /**
     * Update a new Static Page
     */

  editStaticPage: (_id, pageName,
    pageAddress,
    pageContent,
    userId,
    shopId,
    isEnabled,
    createdAt,
    updatedAt,
  ) => {
    check(_id, String);
    check(pageName, String);
    check(pageAddress, String);
    check(pageContent, String);
    check(userId, String);
    check(shopId, String);
    check(isEnabled, Boolean);
    check(createdAt, Date);
    check(updatedAt, Date);

    const pageDetails = {
      pageName,
      pageAddress,
      pageContent,
      userId,
      shopId,
      isEnabled,
      createdAt,
      updatedAt
    };

    check(pageDetails, Schemas.StaticPages);
    return Collections.StaticPages.update(_id, { $set: pageDetails });
  },

  /**
   * Delete a static page
   */
  deleteStaticPage: (_id) => {
    check(_id, String);
    StaticPages.remove(_id);
  }

});
