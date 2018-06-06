import React from "react";
import "./style.less";
// import PropTypes from "prop-types";
// import classnames from "classnames/dedupe";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SocialContents = () => {
  return (
    <div className="row">
      <div className="col-md-2">&nbsp;</div>
      <div className="col-md-8">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/AliExpress/"
          data-tabs="timeline, events, messages"
          data-width="500"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote cite="https://www.facebook.com/AliExpress/" className="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/AliExpress/">Our Shop</a>
          </blockquote>
        </div>
      </div>
      <div className="col-md-2">&nbsp;</div>
      <script>
        {(function (d, s, id) {
          const fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          const js = d.createElement(s);
          js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=648304275501258&autoLogAppEvents=1";
          fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk")}
      </script>
    </div>
  );
};
registerComponent("SocialContents", SocialContents);

export default SocialContents;
