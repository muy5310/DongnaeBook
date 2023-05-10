import React, {useEffect, useState} from "react";
import "./css/BoardPage.css";
import { realtimeDB as db, auth } from "../firebaseConfig";
import BoardList from '../components/BoardList';
import { useNavigate } from "react-router-dom";


function BoardPage({searchTerm}) {

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
  const [lat, setLat] = useState(localStorage.getItem("lat") || "");
  const [lon, setLon] = useState(localStorage.getItem("lon") || "");
  const [town, setTown] = useState(localStorage.getItem("town") || "");

  //글 목록 가져오기
  const [postList, setPostList] = useState([]);
  //scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  useEffect(() => {
    scrollToTop();
  }, [subject, age, job, hashtag, townStatus]);
  useEffect(() => {
    window.onbeforeunload = function pushRefresh() {
      window.scrollTo(0, 0);
    };

}, []);
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
      if (e.key === "lat") setLat(e.newValue);
      if (e.key === "lon") setLon(e.newValue);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  //반경
  const getDistanceFromLatLonInM = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 1000; // Distance in m
}

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
}
  //필터링
  
  const filteredList = postList.filter((item) => {
    const subjectMatches = subject === "whole" || item.subject === subject;
    const ageMatches = age === "전체" || item.age === age;
    const jobMatches = job === "전체" || item.job === job;
    const tagMatches = hashtag === "전체" || item.hashtag === hashtag;
    let distanceMatches = true;
    console.log('주제', item.subject)
    if (townStatus) {
      console.log('타운트루 계산')
      distanceMatches = getDistanceFromLatLonInM(lat, lon, item.lat, item.lon) <= 4000;
    } else if (item.subject === "BOOK 교환") {
      console.log('교환주제 계산')
      distanceMatches = getDistanceFromLatLonInM(lat, lon, item.lat, item.lon) <= 4000;
    }
    const searchTermMatches = searchTerm === "" || item.title.includes(searchTerm) || item.content.includes(searchTerm);
  
    return subjectMatches && ageMatches && jobMatches && tagMatches && distanceMatches && searchTermMatches;
  });
  
  return (
    <div className="boardpage-background">
      <div className="boardname"><div className="boardname-line">{searchTerm !== "" ? '"' + searchTerm + '"에 대한 검색결과' : title}</div></div>
      <div><BoardList items={filteredList.reverse()} onChatButtonClick={handleChatButtonClick}></BoardList></div>
    </div>
  );
}

export default BoardPage;