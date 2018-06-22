import { Template } from "meteor/templating";
import { StaticPages } from "/lib/collections";
import { Meteor } from "meteor/meteor";
import { Router } from "/client/api";

Template.staticPageDisplay.helpers({
  showStaticPageDetails() {
    const currentpageAddress = Router.current().params.staticPageAddress;
    const subscription = Meteor.subscribe("StaticPages");
    if (subscription.ready()) {
      const page = StaticPages.find({
        pageAddress: currentpageAddress
      }).fetch();
      if (page.length > 0) {
        // window.console.log("right page", page);
        return page;
      }
      // window.console.log("wrong page", page);
    }
  }
});
