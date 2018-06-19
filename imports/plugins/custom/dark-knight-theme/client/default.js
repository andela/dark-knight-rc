import {  Session } from "meteor/session";

const indexTemplate = {};

indexTemplate.template = "landingPage";

Session.set("INDEX_OPTIONS", indexTemplate);
