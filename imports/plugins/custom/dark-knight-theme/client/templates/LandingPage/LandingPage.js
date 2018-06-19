import { Components } from "@reactioncommerce/reaction-components";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import Footer from "./../../components/footer";
import Carousel from "./../../components/carousel";
import Testimony from "./../../components/testimony";
import TopProducts from "./../../components/topProducts";
/*
  Landing page helper
*/
Template.landingPage.helpers({
  isAdmin() {
    return Reaction.hasAdminAccess();
  },
  getTopProducts() {
    return {
      component: TopProducts
    };
  },
  getProductList() {
    return Components.Products;
  },
  getCarousel() {
    return {
      component: Carousel
    };
  },
  getTestimony() {
    return {
      component: Testimony
    };
  },
  getFooter() {
    return {
      component: Footer
    };
  }
});
