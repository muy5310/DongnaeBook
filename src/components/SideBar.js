import React, {useState, useEffect} from "react";
import "./css/SideBar.css";
import gpsicon from "../images/icons/maps.png";

function SideBar() {
    const [town, setTown] = useState(
        localStorage.getItem("town")
    );
    const [town_status, setTownStatus] = useState(
        localStorage.getItem("town_status") === "true"
    );
    const [subject, setSubject] = useState("whole");
    
    // const [white, setWhite] = useState("whole");

    useEffect(() => {
        localStorage.setItem("subject", subject);
    }, [subject]);
    function dispatchStorageEvent(key, value) {
        const event = new Event("storage");
        event.key = key;
        event.newValue = value;
        window.dispatchEvent(event);
      }
    const checkClick = () =>{
        console.log("checkclick")
        if(town_status){
            localStorage.setItem("town_status", false);
            setTownStatus(false);
            dispatchStorageEvent("town_status", false);
        }else{
            if (localStorage.getItem("town") === "내 동네") {
                townInfo();
            }
            console.log('확인');
            localStorage.setItem("town_status", true);
            setTownStatus(true);
            dispatchStorageEvent("town_status", true);
        }
    }
    const townInfo = () => {
        console.log("동네정보");
        localStorage.setItem("town", "삼각산동");
        dispatchStorageEvent("town", "삼각산동");
    }
    const wholeClick = () =>{
        setSubject("whole");
        dispatchStorageEvent("subject", "whole");
    }
    const exchangeClick = () =>{
        if (!localStorage.getItem("town")) {
            townInfo();
        }
        setSubject("BOOK 교환")
        dispatchStorageEvent("subject", "BOOK 교환");
    }
    const recommendClick = () =>{
        setSubject("BOOK 추천");
        dispatchStorageEvent("subject", "BOOK 추천");
    }
    const reviewClick = () =>{
        setSubject("BOOK 리뷰");
        dispatchStorageEvent("subject", "BOOK 리뷰");
        
    }
    return (
    <div className="side-background">
        <div className="town-div">
            <div className="town-button" onClick={townInfo}>
                <img src={gpsicon} className="gps-icon" alt="gps icon"/>
                <div className="town-text" >{town}</div>
            </div>
            <input className="town-check" type="checkbox" id="town_check" checked={town_status} onClick={checkClick}></input>
            <label htmlFor="town_check"></label>
        </div>
        <div className="board-box">
        
            <div className={`board-button-first ${subject==="whole" ? 'white-first' : "board-button-first"}`} onClick={wholeClick}>전체</div>
            <div className={`board-button ${subject==="BOOK 교환" ? 'white' : "board-button"}`} onClick={exchangeClick}>책 교환</div>
            <div className={`board-button ${subject==="BOOK 추천" ? 'white' : "board-button"}`}onClick={recommendClick}>책 추천</div>
            <div className={`board-button-last ${subject==="BOOK 리뷰" ? 'white-last' : "board-button-last"}`} onClick={reviewClick}>책 리뷰</div>
        </div>
    </div>
  );
}

export default SideBar;