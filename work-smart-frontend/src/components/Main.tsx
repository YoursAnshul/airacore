import { Outlet } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import PageFooter from "../components/Common/PageFooter";
import Header from "./Header/Header";
import VerticalMenu from "./LeftMenu/VerticalMenu";
import { useEffect } from "react";
import WebService from "../Services/WebService";

const Main = () => {
  return (
    <>
      <Header />
      <div id="main-app" className="layout-veritcle-menu">
        <VerticalMenu />
        <div className="app-body">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Main;
