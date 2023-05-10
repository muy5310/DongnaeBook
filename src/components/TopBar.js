import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./css/TopBar.css";

function TopBar({onSearch}) {
  const movePage = useNavigate();
  const [loginStatus, setLoginStatus] = useState(false);
  const [logButton, setLogButton] = useState("로그아웃");
  const [searchTerm, setSearchTerm] = useState("");
  
  const searchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchClick = () => {
    console.log('검색', searchTerm);
    if(searchTerm !== ""){

      onSearch(searchTerm); // BoardPage에 검색어 전달
      movePage('/');
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoginStatus(true); // 로그인 상태
        setLogButton("로그아웃");
        const userRef = firebase.database().ref(`users/${user.uid}`);
        userRef.once('value').then((snapshot) => {
          console.log(snapshot.val());
        });
      } else {
        setLoginStatus(false); // 로그아웃 상태
        setLogButton("로그인/회원가입");
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  const signOut = async () => {
    try {
      await auth.signOut();
      console.log("로그아웃 성공");
      window.location.reload(true);
      localStorage.setItem("subject", "whole");
      localStorage.setItem("age", "전체");
      localStorage.setItem("job", "전체");
      localStorage.setItem("hashtag", "전체");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  const logoClick = () => {
    movePage('/');
    window.location.reload(true);
    localStorage.setItem("subject", "whole");
      localStorage.setItem("age", "전체");
      localStorage.setItem("job", "전체");
      localStorage.setItem("hashtag", "전체");
  }
  const logClick = () => {
    if(loginStatus){
      //로그인 상태이면 로그아웃 실행
      signOut();
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('nickname');
      movePage('/');

    }else{
      //로그아웃 상태이면 로그인 페이지 이동
      movePage('/login');
    }
  }
  const postClick = () => {
    if(loginStatus){
      movePage('/post');
    }
    else{
      movePage('/login');
    }    
  }
  const chatClick = () => {
    if(loginStatus){
      movePage('/chat');
    }else{
      movePage('/login');
    }
  }
  const myinfoClick = () => {
    if(loginStatus){
      movePage('/myinfo');
    }else{
      movePage('/login');
    }
  }
  return (
    <div>
      {/* <div className="top-line">로그인</div> */}
    <div className="top-background">
        <div className="logo" onClick={logoClick}  ></div>
        <form className="search-form" onSubmit={(e) => {e.preventDefault(); searchClick();}}>
          <input className="search-input" type="text" placeholder="도서명, 해시태그 등 입력" value={searchTerm} onChange={searchChange}></input>
          <button className="search-button" type="button" onClick={searchClick}></button>
        </form>
        <button className="topbar-button write-button" type="button" onClick={postClick}></button>
        <button className="topbar-button chat-button" type="button" onClick={chatClick}></button>
        <button className="topbar-button myinfo-button" type="button" onClick={myinfoClick}></button>
        <div className="log-button" onClick={logClick}>{logButton}</div>
    </div>
    
    </div>
  );

}

export default TopBar;