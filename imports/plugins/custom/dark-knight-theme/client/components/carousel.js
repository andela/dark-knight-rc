import React from "react";
import {  registerComponent  } from "@reactioncommerce/reaction-components";

const Carousel = () => {
  return (
    <div className="first-page">
      <div id="myCarousel" className="carousel slide" data-ride="carousel">
        <ol className="carousel-indicators">
          <li data-target="#myCarousel" data-slide-to="0" className="active" />
          <li data-target="#myCarousel" data-slide-to="1" />
          <li data-target="#myCarousel" data-slide-to="2" />
        </ol>
        <a className="carousel-indicators carousel-control carousel-slide-down" href="#top-products">
          <span className="fa fa-chevron-down" />
          <span className="sr-only">Slide down</span>
        </a>

        <div className="carousel-inner">

          <div className="item active">
            <img src="/custom/cam_morin.jpg" alt="Los Angeles" />
            <div className="carousel-caption" />
          </div>

          <div className="item">
            <img src="/custom/hero_pitti-duo1.jpg" alt="Chicago"/>
            <div className="carousel-caption" />
          </div>

          <div className="item">
            <img src="/custom/hero_193-piccadilly21.jpg" alt="New York" />
            <div className="carousel-caption" />
          </div>

        </div>

        <a className="left carousel-control" href="#myCarousel" data-slide="prev">
          <span className="control-left fa fa-chevron-left" />
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#myCarousel" data-slide="next">
          <span className="control-right fa fa-chevron-right" />
          <span className="sr-only">Next</span>
        </a>
      </div>
    </div>
  );
};

registerComponent(
  "Carousel",
  Carousel
);
export default (Carousel);
