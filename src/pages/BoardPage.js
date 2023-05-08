import React, {useEffect, useState} from "react";
import "./css/BoardPage.css";
import { realtimeDB as db, auth } from "../firebaseConfig";
import BoardList from '../components/BoardList';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function BoardPage() {
  
  //더미데이터
  // const list = [{id:1, user:"3", nickname:"화분", subject:"교환", age:"10", job:"학생", tag:"우울", title:"우울할 때 읽기 좋은 책 추천해 주세요", contents:"요즘 너무 힘들고, 인생이 외롭네요.. 이럴 때 읽기 좋은 책 추천부탁드려요..", town:"삼각산동"},
  //               {id:2, user:"5", nickname:"하삼", subject:"리뷰", age:"0", job:"주부", tag:"성격", title:"dd", contents:"3", date:"2023.01.03", comment:4, town:"삼각산동"},
  //               {id:3, user:"1", nickname:"하사", subject:"추천", age:"", job:"학생", tag:"자존감", title:"dd", contents:"5", date:"2023.01.03", comment:4, town:"희동"},
  //               {id:4, user:"1", nickname:"하사", subject:"추천", age:"", job:"학생", tag:"자존감", title:"dd", contents:"5", date:"2023.01.03", comment:4, town:"삼각산동"},
  //               {id:5, user:"1", nickname:"하사", subject:"교환", age:"", job:"학생", tag:"자존감", title:"dd", contents:"5", date:"2023.01.03", comment:4, town:"삼각산동"},
  //               {id:6, user:"1", nickname:"하사", subject:"교환", age:"", job:"학생", tag:"자존감", title:"dd", contents:"5", date:"2023.01.03", comment:4, town:"서구"}
  // ]
  
  const navigate = useNavigate();

  const handleChatButtonClick = (email, writer) => {
    if (auth.currentUser.email === writer) {
      navigate("/chat");
    } else {
      navigate("/chat", { state: { otherUserEmail: email } });
    }
  };

  const [title, setTitle] = useState("전체 게시판");
  const [subject, setSubject] = useState(localStorage.getItem("subject") || "whole");
  const [age, setAge] = useState(localStorage.getItem("age") || "전체");
  const [job, setJob] = useState(localStorage.getItem("job") || "전체");
  const [hashtag, setHashtag] = useState(localStorage.getItem("hashtag") || "전체");
  const [townStatus, setTownStatus] = useState(localStorage.getItem("town_status") === "true");
  const [town, setTown] = useState(localStorage.getItem("town") || "");

  //글 목록 가져오기
  const [postList, setPostList] = useState([]);
  //scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToTop();
  }, [subject, age, job, hashtag, townStatus]);

  useEffect(() => {
    const fetchData = async () => {
      db.ref('postList').on('value', (snapshot) => {
        const data = snapshot.val();
        const fetchedPosts = [];
  
        for (const key in data) {
          fetchedPosts.push({
            id: key,
            ...data[key],
          });
        }
        setPostList(fetchedPosts);
      });
    };
  
    fetchData();
  
    return () => {
      db.ref('postList').off(); // 컴포넌트가 언마운트될 때 이벤트 리스너를 삭제합니다.
    };
  }, []);

  //타이틀 설정
  useEffect(() => {
    if (subject === "whole") {
      setTitle("전체 게시판");
    } else if (subject === "교환") {
      setTitle("BOOK 교환 게시판");
    } else if (subject === "추천") {
      setTitle("BOOK 추천 게시판");
    } else if (subject === "리뷰") {
      setTitle("BOOK 리뷰 게시판");
    }
  }, [subject]);

  useEffect(() => {
    // 값이 변경될 때마다 상태를 업데이트합니다.
    const handleStorageChange = (e) => {
      console.log("스토리지바뀜");
      if (e.key === "subject") setSubject(e.newValue);
      if (e.key === "age") setAge(e.newValue);
      if (e.key === "job") setJob(e.newValue);
      if (e.key === "hashtag") setHashtag(e.newValue);
      if (e.key === "town_status") setTownStatus(e.newValue);
      if (e.key === "town") setTown(e.newValue);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  //필터링
  
  const filteredList = postList.filter((item) => {
    const subjectMatches = subject === "whole" || item.subject === subject;
    const ageMatches = age === "전체" || item.age === age;
    const jobMatches = job === "전체" || item.job === job;
    const tagMatches = hashtag === "전체" || item.hashtag === hashtag;
    let townMatches = true;
  
    if (townStatus) {
      townMatches = item.town === town;
    } else if (item.subject === "교환") {
      townMatches = item.town === town;
    }
  
    return subjectMatches && ageMatches && jobMatches && tagMatches && townMatches;
  });
  
  return (
    <div className="boardpage-background">
      <div className="boardname"><div className="boardname-line">{title}</div></div>
      <div><BoardList items={filteredList.reverse()} onChatButtonClick={handleChatButtonClick}></BoardList></div>
    </div>
  );
}

export default BoardPage;