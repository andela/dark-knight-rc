import React, { Component } from "react";
import PropTypes from "prop-types";
import { Components } from "@reactioncommerce/reaction-components";
import { Meteor } from "meteor/meteor";
import { Router } from '/client/api';
import { landingTour, paymentTour, productsTour } from '../../../../custom/customer-tour/client/customerTour'

// TODO: Delete this, and do it the react way - Mike M.
async function openSearchModalLegacy(props) {
  if (Meteor.isClient) {
    const { Blaze } = await import("meteor/blaze");
    const { Template } = await import("meteor/templating");
    const { $ } = await import("meteor/jquery");

    const searchTemplate = Template[props.searchTemplate];

    Blaze.renderWithData(searchTemplate, {}, $("html").get(0));

    $("body").css("overflow", "hidden");
    $("#search-input").focus();
  }
}

class NavBar extends Component {
  static propTypes = {
    brandMedia: PropTypes.object,
    hasProperPermission: PropTypes.bool,
    searchEnabled: PropTypes.bool,
    shop: PropTypes.object
  }

  state = {
    navBarVisible: false
  }

  toggleNavbarVisibility = () => {
    const isVisible = this.state.navBarVisible;
    this.setState({ navBarVisible: !isVisible });
  }

  handleCloseNavbar = () => {
    this.setState({ navBarVisible: false });
  }

  handleOpenSearchModal = () => {
    openSearchModalLegacy(this.props);
  }

  renderLanguage() {
    return (
      <div className="languages hidden-xs">
        <Components.LanguageDropdown />
      </div>
    );
  }

  renderCurrency() {
    return (
      <div className="currencies hidden-xs">
        <Components.CurrencyDropdown />
      </div>
    );
  }

  renderBrand() {
    const shop = this.props.shop || { name: "" };
    const logo = this.props.brandMedia && this.props.brandMedia.url();

    return (
      <Components.Brand
        logo={logo}
        title={shop.name}
      />
    );
  }

  renderSearchButton() {
    if (this.props.searchEnabled) {
      return (
        <div className="search">
          <Components.FlatButton
            icon="fa fa-search"
            kind="flat"
            onClick={this.handleOpenSearchModal}
          />
        </div>
      );
    }
  }

  renderStaticPage() {
    return (
      <Components.StaticPagesComponent />
    );
  }

  renderNotificationIcon() {
    if (this.props.hasProperPermission) {
      return (
        <Components.Notification />
      );
    }
  }

  renderCartContainerAndPanel() {
    return (
      <div className="cart-container">
        <div className="cart">
          <Components.CartIcon />
        </div>
        <div className="cart-alert">
          <Components.CartPanel />
        </div>
      </div>
    );
  }

  renderMainDropdown() {
    return (
      <Components.MainDropdown />
    );
  }

  renderHamburgerButton() {
    return (
      <div className="showmenu"><Components.Button icon="bars" onClick={this.toggleNavbarVisibility} /></div>
    );
  }

  renderTagNav() {
    return (
      <div className="menu">
        <Components.TagNav
          isVisible={this.state.navBarVisible}
          closeNavbar={this.handleCloseNavbar}
        >
          <Components.Brand />
        </Components.TagNav>
      </div>
    );
  }

  renderCustomerTourButton() {
    let label, method;
    switch (Router.current().route.path) {
      case "/":
        method = () => landingTour();
        break;
      case "/tag/all-product":
        method = () => productsTour();
        break;
      case "/account/wallet":
        method = () => paymentTour();
        break;
      default:
        label = null;
        method = null;
        break;
    }
    return (
      <div >
        <button
          className="btn btn-md tour-button"
          onClick={() => method()}>Tour Shop
        </button>
      </div>
    )
  }

  render() {
    return (
      <div className="rui navbar">
        {this.renderHamburgerButton()}
        {this.renderBrand()}
        {this.renderTagNav()}
        {this.renderCustomerTourButton()}
        {this.renderSearchButton()}
        {this.renderNotificationIcon()}
        {this.renderStaticPage()}
        {this.renderMainDropdown()}
        {this.renderCartContainerAndPanel()}
      </div>
    );
  }
}

export default NavBar;
