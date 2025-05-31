import React from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "./config";
import SideMenu from "@/components/layout/sideMenu";

function AppRoutes() {
  return (
    <div className="flex h-screen min-h-0 relative">
      <SideMenu />
      <div className="flex-1 h-full">
        <Routes>
          {routes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
    </div>
  );
}

export default AppRoutes;
