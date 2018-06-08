import React from "react";
import "./style.less";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SocialContents = () => {
  return (
    <div className="row">
      <div className="col-md-2">&nbsp;</div>
      <div className="col-md-8">
        <div
          className="fb-page fb_iframe_widget fb_iframe_widget_fluid"
          data-href="https://www.facebook.com/AliExpress/"
          data-tabs="timeline, events, messages"
          data-width="500"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <span className="iframe-style">
            <iframe
              name="f2f10d3d1b133a4"
              width="500px"
              height="1000px"
              frameBorder="0"
              allowTransparency="true"
              allowFullScreen="true"
              scrolling="no"
              title="fb:page Facebook Social Plugin"
              src="https://www.facebook.com/v3.0/plugins/page.php?adapt_container_width=true&amp;app_id=648304275501258&amp;channel=http%3A%2F%2Fstaticxx.facebook.com%2Fconnect%2Fxd_arbiter%2Fr%2FEIL5DcDc3Zh.js%3Fversion%3D42%23cb%3Dfe2221dda618%26domain%3Dlocalhost%26origin%3Dhttp%253A%252F%252Flocalhost%253A3000%252Ff1fb820cf9fe8a4%26relation%3Dparent.parent&amp;container_width=660&amp;hide_cover=false&amp;href=https%3A%2F%2Fwww.facebook.com%2FAliExpress%2F&amp;locale=en_US&amp;sdk=joey&amp;show_facepile=true&amp;small_header=false&amp;tabs=timeline%2C%20events%2C%20messages&amp;width=500"
              className="fb-content"
            />
          </span>
        </div>
      </div>
      <div className="col-md-2">&nbsp;</div>
    </div>
  );
};
registerComponent("SocialContents", SocialContents);

export default SocialContents;
