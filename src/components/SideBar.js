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
                localStorage.setItem("lat", lat);
                localStorage.setItem("lon", lon);
                localStorage.setItem("town", address);
                setTown(address);
                dispatchStorageEvent("town", address);
              },
              (error) => {
                console.error("Error fetching location:", error);
              }
            );
          } catch (error) {
            console.error("Error getting user location:", error);
          }
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