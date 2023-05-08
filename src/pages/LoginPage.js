import React, { useState, useEffect, useRef} from "react";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./css/LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //오류메시지
    const [errorMessage, setErrorMessage] = useState('');
    const [error, setError] = useState(false);

    const onEmailHandler = (e) => {
      setEmail(e.target.value);
    }
    const onPasswordHandler = (e) => {
      setPassword(e.target.value);
    }
  
    const isLogin = async (e) => {
    //   e.preventDefault();
        try {
            const result = await auth.signInWithEmailAndPassword(email, password);
            const token = await result.user.getIdToken();
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            console.log('로그인성공');
            // 닉네임 검색 및 로컬 스토리지 저장
            const userRef = firebase.database().ref(`users/${result.user.uid}`);
            const snapshot = await userRef.once("value");
            const userData = snapshot.val();
        if (userData && userData.nickname) {
            localStorage.setItem('nickname', userData.nickname);
        }
        movePage('/');
      } catch (error) {
        setError(true);
          setErrorMessage('이메일 또는 비밀번호가 일치하지 않습니다.');
          console.log('로그인실패');
          console.error("Error signing in:", error);
      }
    };
    const movePage = useNavigate();
  
    const signupClick = () => {
      movePage("/signup")
    }
    const loginClick = () => {
        if(email === ''){
            setError(true);
            setErrorMessage('이메일을 입력해 주세요');
        }else if(password === ''){
            setError(true);
            setErrorMessage('비밀번호를 입력해 주세요');
        }else{
            isLogin();
        }
    }
  
  return (
    <div className="login-background">
        <div className="login-box">
        <div className="login-title">로그인하기</div>
        <div className="inputForm">
            <div className="inputDiv">
              <input placeholder="이메일" className="login-inputBox" type="text" value={email} onChange={onEmailHandler}></input>
            </div>
            <div className="inputDiv">
              <input className="login-inputBox passwordBox" placeholder="비밀번호" type="password" value={password} onChange={onPasswordHandler}></input>
              {error && (
              <div className={`login-message`}>{errorMessage}</div>
          )}
            </div>
        </div>
        <button className="login-button" onClick={loginClick}>로그인</button>
    </div>
    </div>
  );
}

export default LoginPage;