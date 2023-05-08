import React from "react";
import "./css/FullPage.css";
// import TopBar from "components/TopBar";
// import CategoryBar from "components/CategoryBar";
// import SideBar from "components/SideBar";
import BoardPage from "./BoardPage.js";

function FullPage() {
  return (
    <div>
    {/* <div className="full-background">
        <TopBar></TopBar>
        <CategoryBar></CategoryBar>
        <SideBar></SideBar>
        
    </div> */}
    <BoardPage></BoardPage></div>
  );
}

export default FullPage;