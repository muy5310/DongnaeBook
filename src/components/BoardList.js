import React from "react";
import BoardItem from './BoardItem';
import "./css/BoardList.css";

function BoardList({items, onChatButtonClick }) {
  // const filteritem = items.filter(data => data.subject === "exchange");

  return (
    <div className="boardlist-background">
        {
            items.map((item) => 
                <BoardItem key={item.id} item = {item} onChatButtonClick={onChatButtonClick} />
            )
        }
    </div>
  );
}

export default BoardList;