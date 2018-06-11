import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import { check } from "meteor/check";

Meteor.methods({
  getOrdersFromDb: (DetailsToGet) => {
    check(DetailsToGet, Object);
    check(DetailsToGet.fromDate, Date);
    check(DetailsToGet.toDate, Date);

    return Collections.Orders.find({
      createdAt: {
        $gte: new Date(DetailsToGet.fromDate),
        $lte: new Date(DetailsToGet.toDate)
      }
    }).fetch();
  },
  getOrders: () => {
    return Collections.Orders.find({}).fetch();
  }

});
