import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { SocialContents } from "/imports/plugins/core/ui/client/components";


const Testimony = () => {
  return (
    <div className="testimony theme-bg-color">
      <SocialContents />
    </div>
  );
};

registerComponent(
  "Testimony",
  Testimony,
);
export default (Testimony);
