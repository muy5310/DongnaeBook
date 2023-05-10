import React, {useEffect, useState} from "react";
import "./css/MyinfoPage.css";
import { realtimeDB as db, auth } from "../firebaseConfig";
import BoardList from '../components/BoardList';
// import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function MyinfoPage() {
  
  const userEmail = localStorage.getItem('email');
  const userNickname = localStorage.getItem('nickname');
  const userTown = localStorage.getItem('town');
  const navigate = useNavigate();

  const handleChatButtonClick = (email, writer) => {
    if (auth.currentUser.email === writer) {
      navigate("/chat");
    } else {
      navigate("/chat", { state: { otherUserEmail: email } });
    }
  };

  //글 목록 가져오기
  const [postList, setPostList] = useState([]);
  //scroll

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


  

  //필터링
  
  const filteredList = postList.filter((item) => {
    // Add this condition
    const userMatches = auth.currentUser.email === item.email;
  
    return userMatches ;
  });
  
  return (
    <div>
          
      <div className="myinfo-background">
         
        <div className="myinfo-name">
          
          <div className="info-div">
            <div className="myinfo-title">
            내 정보
          </div>
          </div>
          
      </div>
      <div className="info-div">
            <div className="info-left">ㆍ이메일</div>
            <div className="info-right">{userEmail}</div>
          </div>
        <div className="info-div">
          <div className="info-left">ㆍ닉네임</div>
          <div className="info-right">{userNickname}</div>
        </div> 
        <div className="info-div">
          <div className="info-left">ㆍ내동네</div>
          <div className="info-right">{userTown}</div>
        </div> 
        <div className="info-div myinfo-name-line">
          <div className="info-left">ㆍ내가 작성한 글</div>
          <div className="info-right myinfo-right">{filteredList.length} 개</div>
        </div> 
        <div><BoardList items={filteredList.reverse()} onChatButtonClick={handleChatButtonClick}></BoardList></div>
      </div>
    </div>
    
  );
}

export default MyinfoPage;