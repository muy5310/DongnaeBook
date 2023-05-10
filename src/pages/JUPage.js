import React, { useState, useEffect } from "react";
import "./css/MainPage.css";

function MainPage() {
    const Destination = function(name, time, description) {
        this.name = name;
        this.time = time;
        this.description = description;
    };

    const destinations = [
        new Destination("블루모스크", 2, "블루모스크 설명."),
        new Destination("핑크모스크", 3, "핑크모스크 설명."),
        new Destination("자스민 마사지", 1, "자스민 마사지 설명."),
        new Destination("워터프론트", 3, "워터프론트 설명."),
        new Destination("필라피노 야시장", 4, "야시장 설명."),
        new Destination("반딧불 투어", 1, "반딧불 투어 설명."),
        new Destination("스노쿨링", 2, "스노쿨링 설명."),
        new Destination("섬투어", 6, "섬투어 설명."),
        new Destination("호텔", 1, "호텔 설명."),
        new Destination("액티비티", 1, "액티비티 설명."),
    ];

    const [recommendedDestinations, setRecommendedDestinations] = useState([]);
    const [remainingTime, setRemainingTime] = useState(11);
    const [buttons, setButtons] = useState([]);

    useEffect(() => {
        generateNewButtons();
    }, [remainingTime, recommendedDestinations]);

    const generateNewButtons = () => {
        let availableDestinations = destinations.filter(destination => {
            return destination.time <= remainingTime && !recommendedDestinations.includes(destination);
        });

        if (availableDestinations.length === 0 || remainingTime < 0) {
            return;
        }

        let newButtons = [];

        for (let i = 0; i < 3; i++) {
            let randomIndex = Math.floor(Math.random() * availableDestinations.length);
            let selectedDestination = availableDestinations[randomIndex];
            newButtons.push(selectedDestination);

            availableDestinations.splice(randomIndex, 1);
        }

        setButtons(newButtons);
    };

    const handleButtonClick = (destination) => {
        if (remainingTime >= destination.time) {
            setRecommendedDestinations([...recommendedDestinations, destination]);
            setRemainingTime(remainingTime - destination.time);
        }
    };

    return (
        <div>
            <div id="site-description">
                <h1>여행지 추천 웹서비스</h1>
                <p>
                    이 사이트는 여행지 추천을 위한 것입니다.<br/>
                    추천된 여행지 중에서 선택한 여행지는 다시 추천되지 않습니다. <br/>
                    새로고침 버튼을 눌러 새로운 추천을 받을 수    있습니다.
                </p>
            </div>

            <div id="remaining-time">{remainingTime} hours</div>
            <button id="recommendation-button" onClick={generateNewButtons}>새로고침</button>
            <div id="buttons-container">
                {buttons.map((destination, index) => (
                    <button 
                        key={index}
                        className="destination-button"
                        onClick={() => handleButtonClick(destination)}
                    >
                        {destination.name}
                    </button>
                ))}
            </div>
            <div id="selected-destinations">
                <ul>
                    {recommendedDestinations.map((destination, index) => (
                        <li key={index}>
                            {destination.name} ({destination.time}시간)
                            <button className="reserve-button" onClick={() => {/* 서버부터 연결하고 구현. */}}>
                                예약하기
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default MainPage;

