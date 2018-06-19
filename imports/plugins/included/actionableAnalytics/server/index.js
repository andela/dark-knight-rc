import { Meteor } from "meteor/meteor";
// import Collections from "";

Meteor.publish("getAllProducts", function () {
  return Collections.Products.find().fetch();
});

Meteor.publish("getOrders", function () {
  return Collections.Products.find().fetch();
});
