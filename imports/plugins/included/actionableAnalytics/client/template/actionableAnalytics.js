import { Template } from "meteor/templating";
import { Report } from "../container/Report";

Template.analytics.helpers({
  displayAnalysis() {
    return {
      component: Report
    };
  }
});
