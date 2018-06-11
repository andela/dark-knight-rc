// register.js
import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Analytics",
  name: "Analytics",
  icon: "fa fa-bar-chart",
  autoEnable: true,
  settings: {
    name: "Analysis"
  },
  registry: [
    {
      route: "/dashboard/analytics",
      provides: "dashboard",
      name: "Analytics",
      label: "Data Analytics",
      description: "View Analysis",
      icon: "fa fa-bar-chart",
      priority: 1,
      container: "core",
      workflow: "coreDashboardWorkflow",
      template: "analytics"
    }
  ]
});
