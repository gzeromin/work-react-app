import { Switch, Route } from "react-router-dom";
import React, { Suspense, memo } from 'react';
import Auth from "../hoc/auth";
import { Spin } from "antd";

import NavBar from "./views/NavBar/NavBar";
import SubNavBar from "./views/SubNavBar/SubNavBar";
import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import Footer from "./views/Footer/Footer";
import EmployeeWorkSheet from "./views/Employee/WorkSheet/WorkSheet";
import EmployeePassword from  "./views/Employee/Password/Password";
import AdminEmployee from "./views/Admin/Employee/Employee";
import AdminWorkSheet from "./views/Admin/WorkSheet/WorkSheet";
import NotFound from './views/NotFound/NotFound';
import ForgetPasswordPage from './views/ForgetPasswordPage/ForgetPasswordPage';

import { useSelector } from "react-redux";


function App() {
  const isLoading = useSelector(state => state.common.isLoading) || false;
  const showSubNav = useSelector(state => {
    return state.user && state.user.userData && state.user.userData.isAuth;
  });
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      {showSubNav && 
        <SubNavBar /> 
      }
      <div className={`views ${ showSubNav && 'views-sub'}`}>
        <Spin 
          spinning={isLoading}
          size='large'
          className='loading'
        >
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, true)} />
            <Route exact path="/employee/workSheet" component={Auth(EmployeeWorkSheet, true)} />
            <Route exact path="/employee/password" component={Auth(EmployeePassword, true)} />
            <Route exact path="/admin/employee/:subFunc" component={Auth(AdminEmployee, true, true)} />
            <Route exact path="/admin/workSheet/:subFunc" component={Auth(AdminWorkSheet, true, true)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/forgetPassword" component={Auth(ForgetPasswordPage, false)} />
            <Route component={Auth(NotFound, true)} />
          </Switch>
        </Spin>
      </div>
      <Footer />
    </Suspense>
  );
}

export default memo(App);
