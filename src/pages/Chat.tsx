import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import { apiResource } from "../helpers/types/apiResource";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal";

const Chat: React.FC = () => {
  const { user } = useContext(UserContext);
  type RoomType = {
    name: string;
    players: [
      {
        name: string;
        id: string;
      },
    ];
  };

  type RoomChatType = {
    name: string;
    chats: ChatObjectType[];
    players: [
      {
        id: string;
        created_at: string;
        updated_at: string;
        name: string;
        email: string;
        password?: string;
        country: string;
        role: string;
        active: string;
        refresh_key?: string;
      },
    ];
  };

  type ChatObjectType = {
    id: string;
    created_at: string;
    updated_at: string;
    sender_id: string;
    receiver_id: string;
    message: string;
    roomsId: string;
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [roomMessages, setRoomMessages] = useState<string[]>([]);
  const [roomName, setRoomName] = useState("");
  const [leaveRoomName, setLeaveRoomName] = useState("");
  const [roomMessageInput, setRoomMessageInput] = useState(""); // Define roomMessageInput state variable
  const [sseEvents, setSSEEvents] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);
  const [roomChat, setRoomChat] = useState<RoomChatType>({} as RoomChatType);

  const showPlayActionModal = () => {
    setIsModalOpen(true);
  };

  const closePlayActionModal = () => {
    setIsModalOpen(false);
  };

  const socket = io("ws://localhost:3000", {
    extraHeaders: {
      authorization: `Bearer ${user.accessToken}`,
    },
  });

  const fetchRoomDetails = async (roomName: string) => {
    try {
      const res = await axios.get(`${apiResource.roomChat + roomName}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log("room details fetch=", res);

      setRoomChat(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
    });

    socket.on("privateMessage", (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    socket.on("message_room", (data: any) => {
      setRoomMessages((prevRoomMessages) => [
        ...prevRoomMessages,
        data.message,
      ]);
    });

    socket.on("disconnect", () => {
      console.log("disconnected");
    });

    const fetchRooms = async () => {
      try {
        const res = await axios.get(apiResource.allRoom, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        console.log("rooms res=", res);
        setAvailableRooms(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3000/sse/event");
    eventSource.onmessage = (event) => {
      setSSEEvents((prevEvents) => [...prevEvents, "New Event: " + event.data]);
    };
    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput) {
      socket.emit("privateMessage", {
        message: messageInput,
        recipientId: user.id,
      });
      setMessageInput("");
    }
  };

  const handleJoinRoom = () => {
    if (roomName) {
      socket.emit("join_room", { roomName }, (res: any) => {
        setRoomMessages((prevRoomMessages) => [
          ...prevRoomMessages,
          res.message,
        ]);
        alert(res.message);
      });
      setRoomName("");
    }
  };

  const handleSendRoomMessage = () => {
    const roomName = document.getElementById("messageRoomId")?.value;
    if (roomMessageInput) {
      socket.emit("message_room", {
        roomName: roomName, // You can change the roomName if needed
        message: roomMessageInput,
      });
      setRoomMessageInput("");
      document.getElementById("messageRoomId")?.innerText("lul done!");
    }
  };

  const handleLeaveRoom = () => {
    if (leaveRoomName) {
      socket.emit("leave_room", { roomName: leaveRoomName }, (res: any) => {
        setLeaveRoomName("");
      });
    }
  };

  return (
    <div>
      <div className="bg-gray-400">
        <p className="text-white font-bold">Available Rooms:</p>
        <div>
          {availableRooms.map((room) => (
            <div key={room.name}>
              <span>
                Name:
                {room.name}
                <button
                  onClick={() => {
                    /* setSelectedPlayer(player); */
                    showPlayActionModal();
                    console.log(`room selected==`, room);
                    fetchRoomDetails(room.name);
                  }}
                  className="bg-[var(--blue)] rounded-lg text-white py-1 px-4 text-center cursor-pointer"
                >
                  info
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Modal isOpen={isModalOpen} onClose={closePlayActionModal}>
          <div>Room Name: {roomChat.name}</div>

          <div>
            <p className="text-center text-[1.25rem]">Players</p>
            <div className="grid gap-4">
              {roomChat.players?.map((player, index) => (
                <span key={index} className="bg-green-200 p-2">
                  <p>Name: {player.name}</p>
                  <p>Nationality: {player.country}</p>
                  <p>Status: {player.active ? "Active" : "Inactive"}</p>
                </span>
              ))}
            </div>
          </div>
          {roomChat?.chats?.length > 0 && (
            <div>
              <p>Chats:</p>
              <div className="overflow-y-auto border-2 border-[var(--blue)] rounded-lg p-4">
                <ul>
                  {roomChat.chats.map((chat, index) => (
                    <li key={index} className="grid gap-0">
                      <p className="text-gray-600 text-[0.75rem]">
                        {new Date(chat.created_at).toLocaleString()}
                      </p>
                      <span>
                        <p className="bg-[var(--blue)] py-1 px-4 rounded-lg text-white w-fit">
                          {chat.message}
                        </p>
                        <p className="text-gray-600 text-[0.75rem]">
                          By: {chat.sender_id}
                        </p>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="pt-4 w-full flex justify-center">
            <button className="btn btn-orange" onClick={closePlayActionModal}>
              Close
            </button>
          </div>
        </Modal>
      </div>
      <h1>Socket Connection</h1>
      <div id="chat">
        <div id="messages">
          {messages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <input
          id="message"
          placeholder="Type a message..."
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
        <div>
          <button
            id="send"
            onClick={handleSendMessage}
            className="btn btn-orange"
          >
            Send
          </button>
          (uses recipient id to send private message to other connected users)
        </div>
      </div>
      <div id="room">
        <p className="text-center text-[var(--orange)]">
          Message from the server:
        </p>
        <div id="server_message">
          {roomMessages.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
        <input
          id="roomInput"
          placeholder="Enter Room Name"
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />
        <button
          id="joinRoom"
          className="btn btn-orange"
          onClick={handleJoinRoom}
        >
          Join Room
        </button>
      </div>
      <div id="message_room">
        <div className="">
          <p className="text-center text-[var(--orange)]">
            Message from the server:
          </p>

          <div id="room_messages">
            {roomMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        </div>
        <div className="border-2 border-[var(--green)] p-2">
          <input
            id="roomMessageInput"
            placeholder="Enter Room message"
            type="text"
            value={roomMessageInput}
            onChange={(e) => setRoomMessageInput(e.target.value)}
          />
          <div>
            <input
              id="messageRoomId"
              placeholder="enter room name"
              type="text"
            />
            <button
              id="sendRoomMessage"
              onClick={handleSendRoomMessage}
              className="btn btn-orange"
            >
              Send
            </button>
            (broadcast to all the users in the given room)
          </div>
        </div>
      </div>
      <div id="leave_room">
        <div id="leave_message"></div>
        <input
          id="leave_room_name"
          placeholder="Enter Room Name"
          type="text"
          value={leaveRoomName}
          onChange={(e) => setLeaveRoomName(e.target.value)}
        />
        <button
          id="leaveRoom"
          onClick={handleLeaveRoom}
          className="btn btn-orange"
        >
          LeaveRoom
        </button>
      </div>
      <h2>SSE Connection</h2>
      <div id="sseEvents">
        {sseEvents.map((event, index) => (
          <div key={index}>{event}</div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
