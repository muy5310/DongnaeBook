import React, { useEffect } from "react";
import "./css/FullPage.css";
import CategoryBar from "../components/CategoryBar";
import SideBar from "../components/SideBar";
import BoardPage from "./BoardPage.js";
import { auth } from "../firebaseConfig";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

function MainPage({searchTerm}) {
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            const userRef = firebase.database().ref(`users/${user.uid}`);
            userRef.once('value').then((snapshot) => {
              console.log(snapshot.val());
            });
            console.log("로그인"); // 로그인 상태일 때 메시지 출력
          } else {
            console.log("로그인 필요"); // 로그인되어 있지 않을 때 메시지 출력
          }
        });
    
        return () => {
          unsubscribe();
        };
      }, []);
  return (
    <div>
        <CategoryBar></CategoryBar>
        <div className="main-background">
        <SideBar></SideBar>
        <BoardPage searchTerm={searchTerm}></BoardPage>
        </div>
    </div>
  );
}

export default MainPage;