import React, { useState, useEffect, useRef} from "react";
import { realtimeDB as db, auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "./css/PostPage.css";
import gpsicon from "../images/icons/maps.png";

function PostPage() {
    const titleInputRef = useRef(null);
    const contentInputRef = useRef(null);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    //글 주제, 카테고리
    const subjectList = ["BOOK 교환", "BOOK 추천", "BOOK 리뷰"];
    const ageList = ["전체", "10대 미만", "10대", "20대", "30대", "40대", "50대", "60대 이상"];
    const jobList = ["전체", "학생", "주부", "교직", "전문직", "관리직", "사무직", "기능직", "서비스직", "자영업", "기타"];
    const hashtagList = ["전체", "힐링", "우울", "성격", "자존감", "동기부여", "자기계발", "가족", "대인관계", "사회생활",  "시간/돈 관리", "기타"];
    const [subject, setSubject] = useState("BOOK 교환");
    const [age, setAge] = useState("전체");
    const [job, setJob] = useState("전체");
    const [hashtag, setHashtag] = useState("전체");
    const [town, setTown] = useState(localStorage.getItem("town"));

   
    const movePage = useNavigate();
  
    const handleTitle = (e) => {
        setTitle(e.target.value);
    }
    const handleContent = (e) => {
        setContent(e.target.value);
    }
    const handleSubject = (e) => {
        setSubject(e.target.value);
    };
    const handleAge = (e) => {
        setAge(e.target.value);
    };
    const handleJob = (e) => {
        setJob(e.target.value);
    };
    const handleHashtag = (e) => {
        setHashtag(e.target.value);
    };
    
    // 현재 사용자 정보를 저장하는 상태 변수
    const [currentUser, setCurrentUser] = useState(null);

    // 현재 사용자 정보 가져오기
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          // 사용자가 로그인되지 않았을 경우 다른 페이지로 이동합니다.
          movePage("/");
        }
      });
      return () => {
        unsubscribe();
      };
    }, []);
    //위치 가져오기
    const getKakaoAddress = async (latitude, longitude) => {
      const API_KEY = 'aa29e63fe27035e56f624827b0bbcb08';
      const API_URL = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
    
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `KakaoAK ${API_KEY}`,
        },
      });
      const data = await response.json();
      const address = data.documents[0].address_name;
      return address;
    };
  const townInfo = () => {
      try {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const address = await getKakaoAddress(latitude, longitude);
              localStorage.setItem("town", address);
              setTown(address);
              console.log('add',address)
            },
            (error) => {
              console.error("Error fetching location:", error);
            }
          );
        } catch (error) {
          console.error("Error getting user location:", error);
        }
  }
    //날짜 가져오기
    function getCurrentDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
      
        return `${year}.${month}.${day}`;
    }
    const postClick = async () => {
        if(title === ''){
            titleInputRef.current.focus();
        }else if(content === ''){
            contentInputRef.current.focus();
        }else{
            postPost();
        }
    };
    const postPost = async () => {
        // 유저 닉네임, 아이디, 등록한 날짜를 포함한 데이터 객체 생성
        const postData = {
          title,
          content,
          subject,
          age,
          job,
          hashtag,
          town,
          user_id: currentUser.uid,
          email: localStorage.getItem("email"),
          nickname: localStorage.getItem("nickname"),
          date: getCurrentDate(),
        };
      
        try {
          // 파이어베이스 realtime database에 postData 객체 저장
          await db.ref("postList").push(postData);
          // 글 등록 후 이동할 페이지 설정
          movePage("/");
        } catch (error) {
          console.error("글 등록 실패:", error);
        }
      };
  return (
    <div className="post-background">
        <div className="post-title">게시물 작성</div>
        <div className="black-background">
            <div className="post-town" onClick={townInfo}>
                <img src={gpsicon} className="post-gps-icon" alt="gps icon"/>
                <div className="">{town}</div>
            </div>
            <select className="subject-input" onChange={handleSubject} value={subject}>
            {subjectList.map((item) => (
                <option value={item} key={item}>
                    {item}
                </option>
            ))}
            </select>
            <input className="title-input" ref={titleInputRef} placeholder="제목을 입력하세요" type="text" value={title} onChange={handleTitle}></input>
            <textarea className="content-input" ref={contentInputRef} placeholder="내용을 입력하세요" type="text" value={content} onChange={handleContent}></textarea >
            <div className="post-category">
      <div className="ca-form">
        <div className="ca-list">나이</div>
        <select className="select-from select-white" onChange={handleAge} value={age}>
          {ageList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="ca-form">
        <div className="ca-list">직업</div>
        <select className="select-from select-white" onChange={handleJob} value={job}>
          {jobList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="ca-form">
        <div className="ca-list">해시태그</div>
        <select className="select-from select-white" onChange={handleHashtag} value={hashtag}>
          {hashtagList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      
    </div>
        </div>
        <button className="post-button" onClick={postClick}>등록</button>
    </div>
  );
}

export default PostPage;