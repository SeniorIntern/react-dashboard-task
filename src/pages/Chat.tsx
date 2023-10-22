import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal";
import { RoomChatType, RoomType } from "../helpers/types/GroupChatTypes";
import { apiResource } from "../helpers/apiResource";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toast.css";

const Chat: React.FC = () => {
  const { user } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [roomMessages, setRoomMessages] = useState<string[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomMessageInput, setRoomMessageInput] = useState(""); // Define roomMessageInput state variable
  const [sseEvents, setSSEEvents] = useState<string[]>([]);
  const [availableRooms, setAvailableRooms] = useState<RoomType[]>([]);
  const [roomChat, setRoomChat] = useState<RoomChatType>({} as RoomChatType);
  const [recieverId, setRecieverId] = useState<string>("");
  const [isUpdatingChat, setIsUpdaingChat] = useState<boolean>(false);
  const [personalMessages, setPersonalMessages] = useState<
    PersonalMessageType[]
  >([]);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(apiResource.allRoom, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log("rooms fetch res=", res);
      console.log("availble rooms ", res.data);

      setAvailableRooms(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPersonalChat = async () => {
    try {
      const endpoint = `${apiResource.personalConversation}?senderId=${user.id}&receiverId=${recieverId}`;
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log(`chat fetch res:`, res);
      setPersonalMessages(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const showModal = async () => {
    setIsModalOpen(true);
    await fetchPersonalChat();
  };

  const closeModal = () => {
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
      console.log(`private message recieved:`, data);
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
    if (messageInput && recieverId) {
      socket.emit("privateMessage", {
        message: messageInput,
        recipientId: recieverId,
      });
      setMessageInput("");
      setRecieverId("");
      setIsModalOpen(false);
    }
  };

  const handleJoinRoom = () => {
    if (roomName) {
      socket.emit("join_room", { roomName }, (res: any) => {
        setRoomMessages((prevRoomMessages) => [
          ...prevRoomMessages,
          res.message,
        ]);
        /* alert(res.message); */
        toast.success(`${res.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
      setRoomName("");
    }
    fetchRooms();
  };

  const handleSendRoomMessage = () => {
    if (roomMessageInput) {
      socket.emit("message_room", {
        roomName: roomChat.name, // You can change the roomName if needed
        message: roomMessageInput,
      });
      setIsUpdaingChat(true);
      setTimeout(() => {
        fetchRoomDetails(roomChat.name);
        setIsUpdaingChat(false);
      }, 2000);
      setRoomMessageInput("");
    }
  };

  const handleLeaveRoom = async (roomName: string) => {
    console.log("leaving room:", roomName);

    socket.emit(
      "leave_room",
      { roomName: roomName },
      (res: { message: string }) => {
        /* alert(res.message); */
        toast.success(`${res.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      },
    );
    await fetchRooms();
  };

  return (
    <div className="min-h-[2rem] flex flex-col">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />

      <div id="message_room" className="w-full h-full">
        <p>room count: {availableRooms.length}</p>
        {roomMessages.map((message, index) => (
          <p className="inline text-center text-[var(--orange)]" key={index}>
            {message}
          </p>
        ))}
      </div>

      <div className="w-full flex min-h-[calc(100vh-10rem)] bg-gray-200 rounded-lg">
        <div className="h-[calc(100vh-10rem)] overflow-y-scroll border-2 border-r-[var(--blue)] flex flex-col justify-between p-2">
          <div>
            {availableRooms.length < 0 && (
              <div className="">
                <p className="text-white font-bold">No Room Found!</p>
                <p>Create Room</p>
              </div>
            )}
            <div>
              {availableRooms.map((room, index) => (
                <div
                  key={index}
                  className="flex justify-between mb-2 bg-white p-1 rounded-lg cursor-pointer h-12"
                  onClick={() => {
                    fetchRoomDetails(room.name);
                  }}
                >
                  {room.name}

                  {room.players.map((p, index) =>
                    p.id == user.id ? (
                      <button
                        key={index}
                        className="btn-small btn-orange"
                        onClick={() => {
                          handleLeaveRoom(room.name);
                        }}
                      >
                        Leave
                      </button>
                    ) : null,
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div id="room" className="w-full">
              <input
                id="roomInput"
                placeholder="Room Name"
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full p-2 rounded-lg"
              />
              <button
                id="joinRoom"
                className="btn btn-blue min-w-full"
                onClick={handleJoinRoom}
              >
                Join/Create Room
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-between w-full">
          <div className="flex w-full h-full">
            <div className="w-4/5">
              {roomChat?.chats?.length > 0 ? (
                <div className="h-full flex flex-col justify-between">
                  <div className="h-[calc(100vh-14rem)] overflow-y-auto border-2 rounded-lg p-4">
                    <ul className="grid gap-4">
                      {roomChat.chats.map((chat, index) => (
                        <li
                          key={index}
                          className={
                            chat.sender_id === user.id
                              ? `grid gap-0 justify-end`
                              : `grid gap-0`
                          }
                        >
                          <p className="text-gray-600 text-[0.75rem]">
                            {new Date(chat.created_at).toLocaleString()}
                          </p>
                          <span>
                            <p className="bg-[var(--blue)] py-1 px-4 rounded-lg text-white w-fit">
                              {chat.message}
                            </p>

                            <span className="text-gray-600 text-[0.75rem]">
                              By:
                              {chat.sender_id === user.id ? (
                                <p className="inline text-[var(--blue)] font-extrabold">
                                  YOU
                                </p>
                              ) : (
                                chat.sender_id
                              )}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="h-fit p-2 w-full flex justify-between bg-white border-r-gray-200 border-b-gray-200 border-2">
                    <input
                      id="roomMessageInput"
                      placeholder="Message"
                      type="text"
                      value={roomMessageInput}
                      className="p-2 rounded-lg bg-gray-200 w-full"
                      onChange={(e) => setRoomMessageInput(e.target.value)}
                    />
                    {Object.keys(roomChat).length > 0 ? (
                      <button
                        id="sendRoomMessage"
                        onClick={handleSendRoomMessage}
                        className="btn btn-orange"
                      >
                        {isUpdatingChat ? (
                          <span>Updating...</span>
                        ) : (
                          <span>Send</span>
                        )}
                      </button>
                    ) : (
                      <button className="btn bg-gray-400">Send</button>
                    )}
                    {/* (broadcast to all the users in the given room) */}
                  </div>
                </div>
              ) : (
                <p className="text-center text-[1.25rem] text-gray-600">
                  Join a room to view conversation
                </p>
              )}
            </div>
            {roomChat.name && (
              <div className="flex flex-col w-1/5 border-l-2 min-h-[calc(100vh-12rem)] border-[var(--blue)]">
                <p>Room Name: {roomChat.name}</p>

                <div>
                  <p className="text-center text-gray-600 text-[1.25rem] border-2 border-b-[var(--blue)]">
                    Joined Players
                  </p>
                  <div className="grid gap-4">
                    {roomChat.players?.map((player, index) => (
                      <span key={index} className="bg-blue-200 p-2">
                        {player.name}({player.country})
                        {player.active ? (
                          <p title="active" className="inline">
                            ✅
                          </p>
                        ) : (
                          <p title="Inactive" className="inline">
                            🟥
                          </p>
                        )}
                        <div className="w-full flex justify-center">
                          {player.id !== user.id ? (
                            <button
                              onClick={() => {
                                setRecieverId(player.id);
                                showModal();
                              }}
                              className="btn-blue btn-small"
                            >
                              message
                            </button>
                          ) : (
                            <p>(you)</p>
                          )}
                        </div>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <h2>SSE Connection</h2>
      <div id="sseEvents">
        {sseEvents.map((event, index) => (
          <div key={index}>{event}</div>
        ))}
      </div> */}
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* Private Message */}

        <div id="chat" className="grid gap-4">
          <div id="messages">
            {messages.map((message, index) => (
              <p key={index} className="font-bold">
                {message}
              </p>
            ))}
          </div>
          {/* <input
            id="message"
            placeholder="Enter friend user ID"
            type="text"
            value={recieverId}
            onChange={(e) => setRecieverId(e.target.value)}
          /> */}
          <p>Reciever: {recieverId}</p>
          <input
            id="message"
            placeholder="Type a message..."
            type="text"
            value={messageInput}
            className="formInput"
            onChange={(e) => setMessageInput(e.target.value)}
          />

          <div className="w-full flex justify-center">
            <button
              id="send"
              onClick={handleSendMessage}
              className="btn btn-orange"
            >
              Send
            </button>
          </div>
        </div>
        <div>
          {personalMessages.length > 0 ? (
            <p className="text-center text-gray-600">Conversation:</p>
          ) : (
            <p className="text-center text-gray-600">
              You have not started a converstation with this person yet!
            </p>
          )}
          <div>
            <div className="h-[calc(100vh-30rem)] overflow-y-auto rounded-lg p-4 border-2 border-[var(--blue)]">
              <ul className="grid gap-4">
                {personalMessages.length > 0 &&
                  personalMessages.map((message, index) => (
                    <li
                      key={index}
                      className={
                        message.sender_id === user.id
                          ? `grid gap-0 justify-end`
                          : `grid gap-0`
                      }
                    >
                      <p className="text-gray-600 text-[0.75rem]">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                      <span>
                        <p className="bg-[var(--blue)] py-1 px-4 rounded-lg text-white w-fit">
                          {message.message}
                        </p>
                        <span className="text-gray-600 text-[0.75rem]">
                          By:
                          {message.sender_id === user.id ? (
                            <p className="inline text-[var(--blue)] font-bold">
                              YOU
                            </p>
                          ) : (
                            message.sender_id
                          )}
                        </span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
