import { Template } from "meteor/templating";
import StaticPageContainer from "../../containers/staticPages";

Template.staticPageNavBar.helpers({
  showStaticPages() {
    return {
      component: StaticPageContainer
    };
  }
});
