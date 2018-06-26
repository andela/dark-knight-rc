import React from "react";
import "./style.less";
import { InstagramPlugin } from "./instagramScript";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SocialContents = () => {
  return (
    <div className="instagram-content">
      <div className="elfsight-app-b5bc02a8-dbc2-4843-9caf-03b43d84aa6e" />
      {InstagramPlugin.render()}
    </div>
  );
};
registerComponent("SocialContents", SocialContents);

export default SocialContents;
