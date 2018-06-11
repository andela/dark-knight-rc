/* eslint-disable */
import { Meteor } from "meteor/meteor";

Meteor.publish("getAllProducts", function () {
  return Collections.Products.find().fetch();
});

Meteor.publish("getOrders", function () {
  return Collections.Products.find().fetch();
});
