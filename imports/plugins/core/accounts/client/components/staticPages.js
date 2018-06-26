import React from "react";
import PropType from "prop-types";
import { registerComponent } from "@reactioncommerce/reaction-components";
import { Reaction } from "/lib/api";

class StaticPagesComponent extends React.Component {
    static propType = {
      pages: PropType.array
    }

    routeToStaticPage = (page) => {
      Reaction.Router.go(`/static-pages/${page.pageAddress}`);
    }

    renderStaticPagesComponent = () => {
      const { pages } = this.props;
      // console.log(page.pageAddress);
      return (
        <div className="static-page dropdown" role="menu" data-delay="1000">
          <div className="dropdown-toggle tog" data-toggle="dropdown">
          Information
            <span className="caret" />
          </div>
          <ul className="dropdown-menu">
            {pages.map(page => {
              return (
                <li key={page._id}>
                  <a className="static-dropdown" onClick={() => this.routeToStaticPage(page)}>
                    {page.pageName}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    render() {
      return (
        <div className="static-pages" role="menu">
          {this.renderStaticPagesComponent()}
        </div>
      );
    }
}

registerComponent("StaticPagesComponent", StaticPagesComponent);
export default StaticPagesComponent;
