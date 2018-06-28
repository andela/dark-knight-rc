import React from "react";
import { registerComponent } from "/imports/plugins/core/components/lib";
import { getHOCs } from "/imports/plugins/core/components/lib";

const Footer = () => {
  return (<div className="footer container-fluid theme-bg-color">
    <div className="row">
      <div className="col-xs-2 align-center">
        <a className="navbar-brand text-white" href="#">Dark-RC</a>
      </div>
      <div className="col-xs-4 col-md-3 align-center">
        <h4>Payment methods</h4>
        <span className="fa fa-cc-visa fa-2x"/>
        <span className="fa fa-cc-mastercard fa-2x"/>
        <span className="fa fa-credit-card fa-2x"/>
      </div>
      <div className="col-xs-4 col-md-3 align-center">
        <h4>Useful Links</h4>
        <p><a href="/static-pages/terms-conditions">T&amp;C Policy</a></p>
        <p><a href="/static-pages/shipping">Shipping and Returns</a></p>
        <p><a href="/static-pages/about">About us</a></p>
      </div>
      <div className="col-xs-2 col-md-3 align-center social">
        <h4>Contact Us</h4>
        <div className="row">
          <div className="col-xs-6 col-md-4 social-icon">
            <a href="#">
              <span className="fa fa-2x fa-envelope" />
            </a>
          </div>
          <div className="col-xs-6 col-md-4 social-icon">
            <a href="#">
              <span className="fa fa-2x fa-instagram" />
            </a>
          </div>
          <div className="col-xs-6 col-md-4 social-icon">
            <a href="#">
              <span className="fa fa-2x fa-facebook" />
            </a>
          </div>
          <div className="col-xs-6 col-md-4 social-icon">
            <a href="#">
              <span className="fa fa-2x fa-twitter" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

registerComponent("Footer", Footer, getHOCs("Products"));

export default Footer;
