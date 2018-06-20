import React from "react";
import { registerComponent } from "@reactioncommerce/reaction-components";
import "./intro.js.less";
import PropTypes from "prop-types";

export const TakeTour = ({ startIntro }) => <a onClick={startIntro}>Tour App</a>;

const images = [
  "v1529138816/Screen_Shot_2018-06-16_at_9.33.23_AM.png",
  "v1529138815/Screen_Shot_2018-06-16_at_9.33.49_AM.png",
  "v1529138818/Screen_Shot_2018-06-16_at_9.34.09_AM.png",
  "v1529138816/Screen_Shot_2018-06-16_at_9.34.35_AM.png",
  "v1529138816/Screen_Shot_2018-06-16_at_9.35.03_AM.png",
  "v1529138817/Screen_Shot_2018-06-16_at_9.35.32_AM.png",
  "v1529138818/Screen_Shot_2018-06-16_at_9.35.56_AM.png"
];

export const steps = images.map(item => ({
  element: "#reactionAppContainer > div > a",
  intro: `<img style='height:80vh; width:80vw' src='https://res.cloudinary.com/eventmanager/image/upload/${item}' />`
}));

TakeTour.propTypes = {
  startIntro: PropTypes.func
};
registerComponent("takeTour", TakeTour);
