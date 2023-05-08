import React,{useState} from "react";
import "./css/BoardItem.css";

function BoardItem({item, onChatButtonClick}) {
  let subjectClassName = "";

  switch (item.subject) {
    case "BOOK 교환":
      subjectClassName = "board-subject-exchange";
      break;
    case "BOOK 추천":
      subjectClassName = "board-subject-recommend";
      break;
    case "BOOK 리뷰":
      subjectClassName = "board-subject-review";
      break;
    default:
      subjectClassName = "board-subject-default";
      break;
  }
  return (
   <div className="board-div">
    <div className="board-top">
      <div className="board-title">{item.title}</div>
      <div className="board-chat" onClick={() => onChatButtonClick(item.email)}>
        <div className="board-user">{item.nickname}</div>
        <div className="board-chat-icon"></div>
      </div>
      
    </div>
    <div className="board-mid">
    <div className={`board-subject ${subjectClassName}`}>{item.subject}</div>
      <div className="board-date">{item.date}</div>
      <div className="board-town">{item.town}</div>
    </div>
      <div className="board-contents">{item.content}</div>
    </div>

  );
}

export default BoardItem;