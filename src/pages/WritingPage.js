import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [town, setTown] = useState("");
  const movePage = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      const userRef = firebase.database().ref(`users/${result.user.uid}`);
      userRef.set({
        email: email,
        nickname: nickname,
        town: town,
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      movePage('/chat');
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

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
  const signOut = async () => {
    try {
      await auth.signOut();
      console.log("로그아웃 성공");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
        <button onClick={signOut}>Log Out</button>
      <form onSubmit={signUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="text"
          placeholder="Town"
          value={town}
          onChange={(e) => setTown(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <form onSubmit={signIn}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default Login;
