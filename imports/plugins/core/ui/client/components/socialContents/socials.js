import React from "react";
import "./style.less";
import { InstagramPlugin } from "./instagramScript";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SocialContents = () => {
  return (
    <div className="instagram-content">
      <div className="elfsight-app-5d0f9911-1aa0-41b8-aa08-5adf68710d3c" />
      {InstagramPlugin.render()}
    </div>
  );
};
registerComponent("SocialContents", SocialContents);

export default SocialContents;
