import React, { useState, useEffect, useRef, useCallback } from "react";
import { db, auth } from "../firebaseConfig";
import "./css/ChatPage.css";
import { useLocation } from 'react-router-dom';


function ChatPage() {
  const [user, setUser] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [otherUserId, setOtherUserId] = useState("");
  const location = useLocation();
  const [otherUserEmail, setOtherUserEmail] = useState(location.state && location.state.otherUserEmail);
  const [otherUserNicknames, setOtherUserNicknames] = useState({});
  const messagesEndRef = useRef(null);
  // const [rows, setRows] = useState(1);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }
  const textRef = useRef();
    const handleResizeHeight = useCallback(() => {
      textRef.current.style.height = 'auto';
      textRef.current.style.height = textRef.current.scrollHeight + "px";
  }, []);
  // useEffect(() => {
  //   const newRowCount = Math.min(Math.max(input.split("\n").length, 1), 4);
  //   console.log('입력');
  //   if (newRowCount !== rows) {
  //     setRows(newRowCount);
  //   }
  // }, [input, rows]);
  
  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    console.log("otherUserEmail:", otherUserEmail); // Add this line
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
        .onSnapshot((snapshot) => {
          setChatRooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
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
  useEffect(() => {
    const sortChatRoomsByLatestMessage = async () => {
      const sortedChatRooms = await Promise.all(
        chatRooms.map(async (chatRoom) => {
          const latestMessage = await getLatestMessageTimestamp(chatRoom.id);
          return { ...chatRoom, latestMessage };
        })
      );
  
      sortedChatRooms.sort((a, b) => b.latestMessage - a.latestMessage);
      setChatRooms(sortedChatRooms);
    };
  
    if (chatRooms.length > 0) {
      sortChatRoomsByLatestMessage();
    }
  }, [chatRooms]);
  const getLatestMessageTimestamp = async (chatRoomId) => {
  try {
    const snapshot = await db
      .collection("chatRooms")
      .doc(chatRoomId)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data().timestamp;
    }
  } catch (error) {
    console.error("Error fetching latest message timestamp:", error);
  }

  return 0;
};

const findOrCreateChatRoom = async (otherUserEmail) => {
  if (otherUserEmail === user.email) {
    console.log("Cannot create a chat room with yourself");
    return;
  }

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
useEffect(() => {
  if (user) {
    const fetchOtherUserNicknames = async () => {
      const newOtherUserNicknames = {};
      for (const chatRoom of chatRooms) {
        const otherUserEmail = chatRoom.members.find(
          (memberEmail) => memberEmail !== user.email
        );
        if (otherUserEmail) {
          const otherUserSnapshot = await db
            .collection("users")
            .where("email", "==", otherUserEmail)
            .get();
          if (!otherUserSnapshot.empty) {
            const otherUser = otherUserSnapshot.docs[0].data();
            newOtherUserNicknames[chatRoom.id] = otherUser.nickname;  // assuming 'nickname' is the field name
          }
        }
      }
      setOtherUserNicknames(newOtherUserNicknames);
    };

    fetchOtherUserNicknames();
  }
}, [chatRooms, user, db]);
  const chatRoomTitle = (chatRoom) => {
    const otherMember = chatRoom.members.filter((member) => member !== user.uid)[0];
    return otherMember || 'Unknown';
  };
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (!selectedRoom) {
        await findOrCreateChatRoom(otherUserEmail);
      }
  
      const messageData = {
        text: input,
        sender: user.uid,
        timestamp: new Date().getTime(),
      };
  
      const chatRoomRef = db.collection("chatRooms").doc(selectedRoom);
  
      // Add the message to the chat room's messages collection
      await chatRoomRef.collection("messages").add(messageData);
  
      // Update the chat room in the chat list
      await chatRoomRef.set(
        {
          members: [user.email, otherUserEmail],
          latestMessage: messageData.timestamp,
        },
        { merge: true }
      );
  
      setInput("");
    }
  };

  
  return (
    <div className="chat-background">
      <div className="chat-list">
        {chatRooms.map((chatRoom) => {
          const otherUserEmail = chatRoom.members.find(
            (memberEmail) => memberEmail !== user.email
          );
  
          return (
            <button className="chat-button"
              key={chatRoom.id}
              onClick={() => setSelectedRoom(chatRoom.id)}
            >
              {otherUserNicknames[chatRoom.id]}
            </button>
          );
        })}
      </div>
     <div className="chat-room">
      {selectedRoom && (
        <div>
          <div className="chat-room-messages">
            {messages.map((message, index) => (
              <p
                key={index}
                className={message.sender === user.uid ? 'message-sender' : 'message-receiver'}
              >
                {message.text}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-room-input">
              <div className="chat-room-form" onSubmit={sendMessage}>
                <textarea
                  className="chat-input"
                  ref={textRef}
                  value={input}
                  rows={1}
                  onInput={handleResizeHeight}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder="메시지를 입력하세요"
                />
                <button type="submit" className="send-button" onClick={sendMessage}>전송</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
 }
 export default ChatPage;
 ///마지막버전 쳇