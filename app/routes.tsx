import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { Header, Footer, FeedbackButton } from "./components/layouts";
import Home from "./components/home";
import ArticleSearch from "./components/articleSearch";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import LocationListener from "./components/locationListener";
import "normalize.css";
import "./root.scss";

const routesMap = (
  <div>
    <Header />
    <LocationListener />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/search" component={ArticleSearch} />
      <Route path="/users" component={AuthComponent} />
      <Route path="/:errorNum" component={ErrorPage} />
    </Switch>
    <DialogComponent />
    <Footer />
    <FeedbackButton />
  </div>
);

export default routesMap;
