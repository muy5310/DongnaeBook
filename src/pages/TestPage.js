import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { db, auth } from "../firebaseConfig";
import "./css/ChatPage.css";


function Chat() {
  const [user, setUser] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUserId, setOtherUserId] = useState("");

  const location = useLocation();
  const otherUserEmail = location.state && location.state.otherUserEmail;

  useEffect(() => {
    if (otherUserEmail) {
      console.log("또확인", otherUserEmail)
      createChatRoom(otherUserEmail);
    }
  }, [otherUserEmail]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log('확인',user);
      }
    });
    return () => {
      unsubscribe();
    };
    ;
  }, []);

  useEffect(() => {
    if (user) {
      db.collection("chatRooms")
        .where("members", "array-contains", user.email)
        .onSnapshot(async (snapshot) => {
          const chatRoomsWithNickname = await Promise.all(
            snapshot.docs.map(async (doc) => {
              const otherUserEmail = doc.data().members.find(
                (memberEmail) => memberEmail !== user.email
              );
              const otherUserSnapshot = await db
                .collection("users")
                .where("email", "==", otherUserEmail)
                .get();
              const otherUserNickname = otherUserSnapshot.empty
                ? "Unknown"
                : otherUserSnapshot.docs[0].data().nickname;
  
              return { id: doc.id, ...doc.data(), otherUserNickname };
            })
          );
          setChatRooms(chatRoomsWithNickname);
        });
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      db.collection("chatRooms")
        .doc(selectedRoom)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [selectedRoom]);
  const chatRoomTitle = (chatRoom) => {
    const otherMember = chatRoom.members.filter((member) => member !== user.uid)[0];
    return otherMember || 'Unknown';
  };
  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      db.collection("chatRooms")
        .doc(selectedRoom)
        .collection("messages")
        .add({
          text: input,
          sender: user.uid,
          timestamp: new Date().getTime(),
        });
      setInput("");
    }
  };

  const createChatRoom = async (otherUserEmail) => {
    try {
      const otherUserSnapshot = await db
        .collection("users")
        .where("email", "==", otherUserEmail)
        .get();
  
      if (!otherUserSnapshot.empty) {
        const otherUser = otherUserSnapshot.docs[0].data();
        const newChatRoom = await db.collection("chatRooms").add({
          members: [user.email, otherUser.email],
        });
  
        setSelectedRoom(newChatRoom.id);
      } else {
        console.log("User with the given email not found");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
    }
  };
  

  return (
    <div className="chat-background">
      <div>
      {chatRooms.map((chatRoom) => (
    <button key={chatRoom.id} onClick={() => setSelectedRoom(chatRoom.id)}>
      {chatRoom.otherUserNickname}
    </button>
  ))}
</div>
      {selectedRoom && (
        <div>
          <div>
            {messages.map((message, index) => (
              <p
              key={index}
              style={{
                color: message.sender === user.uid ? "black" : "yellow",
              }}
            >
              {message.text}
            </p>
            ))}
          </div>
          <form onSubmit={sendMessage}>
            <input className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Type a message"
            />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
       <div>
        <input
          type="text"
          placeholder="Other user's ID"
          value={otherUserId}
          onChange={(e) => setOtherUserId(e.target.value)}
        />
        <button onClick={() => createChatRoom(otherUserId)}>
          Create new chat room
        </button>
      </div>
    </div>
  );
}