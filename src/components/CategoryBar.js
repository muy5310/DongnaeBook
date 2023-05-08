import React, {useState, useEffect} from "react";
import "./css/CategoryBar.css";

function CategoryBar() {
  const ageList = ["전체", "10대 미만", "10대", "20대", "30대", "40대", "50대", "60대 이상"];
  const jobList = ["전체", "학생", "주부", "교직", "전문직", "관리직", "사무직", "기능직", "서비스직", "자영업", "기타"];
  const hashtagList = ["전체", "힐링", "우울", "성격", "자존감", "동기부여", "자기계발", "가족", "대인관계", "사회생활",  "시간/돈 관리", "기타"];
  const [age, setAge] = useState("전체");
  const [job, setJob] = useState("전체");
  const [hashtag, setHashtag] = useState("전체");
  
  function dispatchStorageEvent(key, value) {
    const event = new Event("storage");
    event.key = key;
    event.newValue = value;
    window.dispatchEvent(event);
  }
  useEffect(() => {
    localStorage.setItem("age", age);
    dispatchStorageEvent("age", age);
  }, [age]);
  useEffect(() => {
    localStorage.setItem("job", job);
    dispatchStorageEvent("job", job);
  }, [job]);
  useEffect(() => {
    localStorage.setItem("hashtag", hashtag);
    dispatchStorageEvent("hashtag", hashtag);
  }, [hashtag]);
  const handleAge = (e) => {
    setAge(e.target.value);
  };
  const handleJob = (e) => {
    setJob(e.target.value);
  };
  const handleHashtag = (e) => {
    setHashtag(e.target.value);
  };
    return (
    <div className="ca-background">
      <div className="ca-form">
        <div className="ca-list">나이</div>
        <select className="select-from" onChange={handleAge} value={age}>
          {ageList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="ca-form">
        <div className="ca-list">직업</div>
        <select className="select-from" onChange={handleJob} value={job}>
          {jobList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="ca-form">
        <div className="ca-list">해시태그</div>
        <select className="select-from" onChange={handleHashtag} value={hashtag}>
          {hashtagList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
}

export default CategoryBar;