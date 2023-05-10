import React, { useState, useEffect, useRef} from "react";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./css/SignupPage.css";

function SignupPage() {
  const movePage = useNavigate();
  const finishClick = () => {
    signupPost();
  }
  const dupClick = () => {
    dupCheck();
  }
  const emailInputRef = useRef(null);
  //입력 값 저장
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_check, setPasswordCheck] = useState('');
  const [nickname, setNickname] = useState('');

  //오류 메시지 저장
  
  const [emailMessage, setEmailMessage] = useState('');
  const [passwordLengthMessage, setPasswordLengthMessage] = useState('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState('');

  //유효성검사
  
  const [isEmail, setIsEmail] = useState(false)
  const [isDup, setIsDup] = useState(false)
  const [isPassword, setIsPassword] = useState(false)
  const [isPasswordLength, setIsPasswordLength] = useState(false)
  const [isNickname, setIsNickname] = useState(false)
  
  const onChangeEmail = (e) => {
    const emailRegex =
      /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    const emailCurrent = e.target.value
    setEmail(emailCurrent)

    if (!emailRegex.test(emailCurrent)) {
      setIsEmail(false)
      setIsDup(false)
      setEmailMessage('이메일 형식이 올바르지 않습니다.')
    } else {
      setIsEmail(true)
      setIsDup(false)
      setEmailMessage('이메일 중복검사를 해주세요')      
    }
  }
  //동기적 처리 
  useEffect(() => {
    if (isEmail){
      setIsEmail(true);
    }
    else{
      setIsEmail(false);
    }
  }, [isEmail]);
  useEffect(() => {
    if (password !==''){
      if(password.length >= 7 ){
        setPasswordLengthMessage('')
        setIsPasswordLength(true)
      }
      else{
        setPasswordLengthMessage('비밀번호는 7자이상으로 구성해주세요')
        setIsPasswordLength(false)
      }
    }
    else{
        setPasswordLengthMessage('')
        setIsPasswordLength(false)
    }
  }, [password, isPasswordLength]);
  useEffect(() => {
    if (password === password_check){
      setPasswordCheckMessage('비밀번호가 일치합니다.')
      setIsPassword(true)
    }else{
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.')
      setIsPassword(false)
    }
  }, [password, password_check, isPassword]);
  useEffect(() => {
    if (nickname !==''){
      setIsNickname(true);
    }
    else if (nickname === ''){
      setIsNickname(false);
    }
  }, [nickname, isNickname]);
  
  const dupCheck = async () => {
    const usersRef = firebase.database().ref("users");
    let isDuplicate = false;
  
    await usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          isDuplicate = true;
        }
      });
  
    if (isDuplicate) {
      console.log("중복");
      setEmailMessage("이미 가입된 이메일입니다.");
      setIsDup(false);
    } else {
      setEmailMessage("사용 가능한 이메일입니다.");
      setIsDup(true);
    }
  };
  const signupPost = async (e) => {
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      
      // Firestore에 사용자 정보 저장
      const userRef = db.collection("users").doc(result.user.uid);
      await userRef.set({
        email: email,
        uid: result.user.uid,
        nickname: nickname,
      });

      // Realtime Database에 사용자 정보 저장
      const userRealtimeRef = firebase.database().ref(`users/${result.user.uid}`);
      await userRealtimeRef.set({
        email: email,
        uid: result.user.uid,
        nickname: nickname,
      });

      movePage("/login");
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  return (
    <div className="signup-background">
        <div className="signup-box">
        <div className="signup-title">회원가입</div>
        <div className="inputForm">
            <div className="inputDiv">
              <input placeholder="이메일" className="signup-inputBox emailBox" type="text" value={email} onChange={(e) => onChangeEmail(e)} ref={emailInputRef}></input>
              <button className="dupBtn" onClick={dupClick} disabled={!(isEmail)}>중복확인</button>
              {email.length > 0 && (
              <div className={`message ${isDup ? 'success' : 'error'}`}>{emailMessage}</div>
          )}
            </div>
            <div className="inputDiv">
              <input className="signup-inputBox passwordBox" placeholder="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
              {password > 0 && (
              <div className={`message ${password.length > 6 ? 'success' : 'error'}`}>{passwordLengthMessage}</div>
          )}
            </div>
            <div className="inputDiv">
              <input className="signup-inputBox passwordBox" placeholder="비밀번호 확인" type="password" value={password_check} onChange={(e) => setPasswordCheck(e.target.value)}></input>
              {password_check.length > 0 && (
              <div className={`message ${isPassword ? 'success' : 'error'}`}>{passwordCheckMessage}</div>
          )}
            </div>
            <div className="inputDiv">
              <input className="signup-inputBox nicknameBox" placeholder="닉네임" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}></input>
            </div>
        </div>
        <button className="finishBtn" onClick={finishClick} disabled={!(isEmail && isPassword && isPasswordLength && isNickname && isDup)}>가입하기</button>
    </div>
    </div>
  );
}

export default SignupPage;