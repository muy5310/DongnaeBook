import React, { useState} from "react";
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatPage from './pages/ChatPage';
import MyinfoPage from './pages/MyinfoPage';
import PostPage from './pages/PostPage';
import TopBar from "./components/TopBar";
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  if (!localStorage.getItem("subject")||!localStorage.getItem("lat")) {
    localStorage.setItem("subject", "whole");
    localStorage.setItem("age", "전체");
    localStorage.setItem("job", "전체");
    localStorage.setItem("tag", "전체");
    localStorage.setItem("town", "내 동네");
    localStorage.setItem("lat", "none");
    localStorage.setItem("lon", "none");
    localStorage.setItem("town_status", false);
  }
  function resetBoardStatus() {
    localStorage.setItem("subject", "whole");
    localStorage.setItem("age", "전체");
    localStorage.setItem("job", "전체");
    localStorage.setItem("hashtag", "전체");
  }
  
  window.onbeforeunload = resetBoardStatus;
  return (
    <div className="App">
      <Router>
      <div className="full-background">
      <TopBar onSearch={handleSearch}></TopBar>
    </div>
        <Routes>
          <Route path='/' element={<MainPage searchTerm={searchTerm}/>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          <Route path='/post' element={<PostPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/myinfo' element={<MyinfoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
