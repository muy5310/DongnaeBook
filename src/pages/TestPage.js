import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import "./css/ChatPage.css";
import { useLocation } from 'react-router-dom';


function Chat() {
  const [user, setUser] = useState(null);
 const [chatRooms, setChatRooms] = useState({});
  const [selectedRoom, setSelectedRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const location = useLocation();
  const [otherUserEmail, setOtherUserEmail] = useState(location.state && location.state.otherUserEmail);
  

  useEffect(() => {
  if (otherUserEmail && user) {
    findOrCreateChatRoom(otherUserEmail);
  }
}, [otherUserEmail, user]);

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
        const newChatRooms = {};

        for (const doc of snapshot.docs) {
          const chatRoomId = doc.id;
          const chatRoomData = doc.data();

          // Get the other user's email and nickname
          const otherUserEmail = chatRoomData.members.find((memberEmail) => memberEmail !== user.email);
          const otherUserSnapshot = await db.collection("users").where("email", "==", otherUserEmail).get();

          // Check if otherUserSnapshot.docs is not empty
          if (!otherUserSnapshot.empty) {
            const otherUserNickname = otherUserSnapshot.docs[0].data().nickname;

            // Get the latest message and timestamp
            const messagesSnapshot = await db
              .collection("chatRooms")
              .doc(chatRoomId)
              .collection("messages")
              .orderBy("timestamp", "desc")
              .limit(1)
              .get();

            const latestMessage = messagesSnapshot.docs[0]?.data()?.text;
            const lastMessageTimestamp = messagesSnapshot.docs[0]?.data()?.timestamp;

            newChatRooms[chatRoomId] = {
              ...chatRoomData,
              otherUserNickname,
              latestMessage,
              lastMessageTimestamp,
            };
          }
        }

        setChatRooms(newChatRooms);
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
  const findOrCreateChatRoom = async (otherUserEmail) => {
  try {
    const otherUserSnapshot = await db
      .collection("users")
      .where("email", "==", otherUserEmail)
      .get();

    if (!otherUserSnapshot.empty) {
      const otherUser = otherUserSnapshot.docs[0].data();

      // Get all chat rooms that contain the current user
      const chatRoomSnapshot = await db
        .collection("chatRooms")
        .where("members", "array-contains", user.email)
        .get();

      // Find an existing chat room between the two users
      const existingChatRoom = chatRoomSnapshot.docs.find(
        (doc) => doc.data().members.includes(otherUser.email)
      );

      if (existingChatRoom) {
        // If a chat room already exists, select it
        setSelectedRoom(existingChatRoom.id);
      } else {
        // If a chat room doesn't exist, create a new one
        const newChatRoom = await db.collection("chatRooms").add({
          members: [user.email, otherUser.email],
        });

        setSelectedRoom(newChatRoom.id);
      }
    } else {
      console.log("User with the given email not found");
    }
  } catch (error) {
    console.error("Error finding or creating chat room:", error);
  }
};
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

  
  return (
    <div className="chat-background">
    <div className="chat-list">
      {Object.entries(chatRooms).map(([chatRoomId, chatRoomData]) => {
        return (
          <button
            className="chat-button"
            key={chatRoomId}
            onClick={() => setSelectedRoom(chatRoomId)}
          >
            {chatRoomData.otherUserNickname} - {chatRoomData.latestMessage} -{" "}
            {new Date(chatRoomData.lastMessageTimestamp).toLocaleDateString()}
          </button>
        );
      })}
    </div>
<div className="chat-room">
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
      )} </div>
      <div>
       
        <input
          type="text"
          placeholder="Other user's email"
          value={otherUserEmail}
          onChange={(e) => setOtherUserEmail(e.target.value)}
        />
        {/* <button onClick={() => findOrCreateChatRoom(otherUserEmail)}>
          Find or create chat room
        </button> */}
      </div>
    </div>
  );
}

export default Chat;