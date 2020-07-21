import React, { Component, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import { constantRoutes } from "@conf/routes";

class PublicLayout extends Component {
  renderRoute = (routes) => {
    return routes.map((route) => {
      return (
        <Route
          key={route.path}
          path={route.path}
          component={route.component}
          exact={true}
        />
      );
    });
  };

  render() {
    // 我们使用懒加载的时候，需要使用suspense标签包裹
    return <Suspense fallback = {<div>...Loading</div>}><Switch>{this.renderRoute(constantRoutes)}</Switch></Suspense>;
  }
}

export default PublicLayout;
