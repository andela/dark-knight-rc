import { Template } from "meteor/templating";
import Footer from "./../../components/footer";

/*
  Footer helper
*/
Template.footer.helpers({
  getFooter() {
    return {
      component: Footer
    };
  }
});
