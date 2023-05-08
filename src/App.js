import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BoardPage from './pages/BoardPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import PostPage from './pages/PostPage';
import TopBar from "./components/TopBar";
import CategoryBar from "./components/CategoryBar";
import SideBar from "./components/SideBar";
import './App.css';

function App() {
  if (!localStorage.getItem("subject")) {
    localStorage.setItem("subject", "whole");
    localStorage.setItem("age", "전체");
    localStorage.setItem("job", "전체");
    localStorage.setItem("tag", "전체");
    localStorage.setItem("town", "내 동네");
    localStorage.setItem("town_status", false);
  }
  function resetBoardStatus() {
    localStorage.setItem("subject", "whole");
    localStorage.setItem("age", "전체");
    localStorage.setItem("job", "전체");
    localStorage.setItem("tag", "전체");
  }
  
  window.onbeforeunload = resetBoardStatus;
  return (
    <div className="App">
      <BrowserRouter>
      <div className="full-background">
        <TopBar></TopBar>
        {/* <CategoryBar></CategoryBar>
        <SideBar></SideBar> */}
    </div>
        <Routes>
          <Route path='/' element={<MainPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/post' element={<PostPage />} />
          <Route path='/chat' element={<ChatPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
