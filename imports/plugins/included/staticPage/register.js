// register.js
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Static Page Management",
  name: "static-page-management",
  icon: "fa fa-file",
  autoEnable: true,
  settings: {
    name: "static-page"
  },
  registry: [{
    route: "/static-pages/static",
    name: "static-pages",
    provides: ["dashboard"],
    label: "Static Page Management",
    description: "Manage static",
    icon: "fa fa-file",
    container: "core",
    template: "staticPage",
    workflow: "coreDashboardWorkflow",
    priority: 1,
    permissions: [{
      label: "static-pages/static",
      permissions: "static-pages/static"
    }
    ]
  }]
  // layout: [
  //   {
  //     layout: "coreLayout",
  //     workflow: "coreProductWorkflow",
  //     collection: "StaticPages",
  //     theme: "default",
  //     enabled: true,
  //     structure: {
  //       template: "staticPage",
  //       layoutHeader: "layoutHeader",
  //       layoutFooter: "",
  //       notFound: "productNotFound",
  //       dashboardHeader: "productDetailSimpleToolbar",
  //       dashboardControls: "productDetailDashboardControls",
  //       dashboardHeaderControls: "",
  //       adminControlsFooter: "adminControlsFooter"
  //     }
  //   }
  // ]
});
