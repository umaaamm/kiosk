import React, { useState, useEffect } from "react";
import './index.scss';

import { Routes, Route } from 'react-router-dom';
import { Layout } from "antd";
// style
import {
  Login,
  Dashboard,
  NotFound
} from "../pages";
import * as listRoutes from "../../config/routes/listRoutes";
// import PrivateRoute from "../../helpers/privateRoute";
// import AuthProvider from "../../helpers/authProvider";
function App() {

  return (
    // <AuthProvider>
      <Layout className="kioks-wrapper">
        <Routes>
          <Route exact path={listRoutes.Default} element={<Login />} />
          <Route
            exact 
            path={listRoutes.Dashboard} 
            element={
              // <PrivateRoute>
                <Dashboard />
              // </PrivateRoute>
            }
          >

          </Route>
          {/* <Route 
            exact 
            path={listRoutes.Dashboard} 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            <Route exact path={listRoutes.DashboardListUser} />
            <Route exact path={listRoutes.DashboardListAdmin} />
            <Route exact path={listRoutes.DashboardListNegara} />
            <Route exact path={listRoutes.DashboardListTag} />
            <Route exact path={listRoutes.DashboardListKategoriGame} />
            <Route exact path={listRoutes.DashboardListSubKategoriGame} />
            <Route exact path={listRoutes.DashboardListTeam} />
            <Route exact path={listRoutes.DashboardListMasterSeason} />
            <Route exact path={listRoutes.DashboardListSeason} />
            <Route exact path={listRoutes.DashboardListVideo} />
            <Route exact path={listRoutes.DashboardListLineUp} />
            <Route exact path={listRoutes.DashboardListArticle} />
            <Route exact path={listRoutes.DashboardDetailArticle} />
            <Route exact path={listRoutes.DashboardListJadwalPertandingan} />
            <Route exact path={listRoutes.DashboardListSkemaGame} />
            <Route exact path={listRoutes.DashboardListSkema} />
          </Route>
          <Route exact path={listRoutes.Profile} element={<Login />} />
          <Route exact path={listRoutes.Setting} element={<Login />} />
          <Route exact path={listRoutes.Logout} element={<Login />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    // </AuthProvider>
  );
}

export default App;