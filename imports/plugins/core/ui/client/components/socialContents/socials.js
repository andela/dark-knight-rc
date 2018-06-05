import React from "react";
import "./style.less";
// import PropTypes from "prop-types";
// import classnames from "classnames/dedupe";
import { registerComponent } from "@reactioncommerce/reaction-components";

export const SocialContents = props => {
  return (
    <div className="row">
      <div id="fb-root" />
      <div className="col-lg-6 col1">
        <div
          className="fb-page"
          data-href="https://www.facebook.com/tipsgalaxy/"
          data-tabs="timeline, events, messages"
          data-width="500"
          data-small-header="false"
          data-adapt-container-width="true"
          data-hide-cover="false"
          data-show-facepile="true"
        >
          <blockquote cite="https://www.facebook.com/tipsgalaxy/" className="fb-xfbml-parse-ignore">
            <a href="https://www.facebook.com/tipsgalaxy/">Tips-Galaxy</a>
          </blockquote>
        </div>
      </div>
      &nbsp;
      <div className="col-lg-6 col2">
        <a className="twitter-timeline" data-theme="dark" href="https://twitter.com/AnaezeN?ref_src=twsrc%5Etfw">
          Tweets by AnaezeN
        </a>
        <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8" />
      </div>
      <script>
        {(function (d, s, id) {
          const fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          const js = d.createElement(s);
          js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0&appId=648304275501258&autoLogAppEvents=1";
          fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "facebook-jssdk")}
        {(function (d, s, id) {
          const fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          const js = d.createElement(s);
          js.id = id;
          js.src = "https://platform.twitter.com/widgets.js";
          fjs.parentNode.insertBefore(js, fjs);
        })(document, "script", "twitter-wjs")}
      </script>
    </div>
  );
};
registerComponent("SocialContents", SocialContents);

export default SocialContents;
