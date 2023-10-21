import { useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { UserContext } from "../context/UserContext";
import axios from "axios";
import { apiResource } from "../helpers/types/apiResource";

export default function Chat() {
  const { user } = useContext(UserContext);
  const socket = io("ws://localhost:3000", {
    extraHeaders: {
      authorization: `${user.accessToken}`,
    },
  });
  type AvailableRoomType = {
    name: string;
    player: [
      {
        id: string;
        name: string;
      },
    ];
  };
  /* room state */
  const [room, setRoom] = useState("");
  const [availableRooms, setAvailableRooms] = useState<
    AvailableRoomType[] | null
  >(null);

  /* message state */
  const [message, setMessage] = useState("");
  const [messageRecieved, setMessageRecieved] = useState("");

  const joinRoom = () => {
    console.log("room ==", room);

    if (room !== "") socket.emit("join_room", room);
  };

  const sendMessage = () => {
    // send current room along with message when emiting send_message. Specify who we are sending message
    socket.emit("message_room", { message, roomName: room });
  };

  const refreshRooms = async () => {
    const res = await axios.get(apiResource.allRoom, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    console.log("available room res=", res);
    setAvailableRooms(res.data);
  };

  useEffect(() => {
    refreshRooms();
  }, []);

  useEffect(() => {
    socket.on("recieve_message", (data) => setMessageRecieved(data.message));
  }, [socket]);
  return (
    <section className="w-full flex min-h-full">
      <div className="w-1/5 bg-red-50 flex flex-col  border-r border-[var(--green)]">
        <span className="bg-[var(--green)] p-4 w-full flex justify-between">
          <p className="text-white text-center inline">Available Rooms:</p>
          <button onClick={refreshRooms}>🔄</button>
        </span>
        <div className="bg-red-400">
          {availableRooms !== undefined ? (
            <div>
              <ul>
                {availableRooms?.map((room) => <li>Room:{room.name}</li>)}
              </ul>
            </div>
          ) : (
            <div>no room found</div>
          )}
        </div>
      </div>
      <div className="w-3/5 flex flex-col gap-6 bg-gray-100 rounded-lg">
        <div className="w-full p-4 flex justify-between">
          <input
            className="w-3/5"
            placeholder="Room Number..."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button className="btn btn-orange" onClick={joinRoom}>
            Join Room
          </button>
        </div>
        <div className="w-full p-4 flex justify-between">
          <input
            className="w-3/5"
            placeholder="message"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-orange" onClick={sendMessage}>
            Send Message
          </button>
        </div>
        <div className="bg-gray-600 text-white">
          <h1 className="text-center text-[1.25rem] border-2 border-[var(--green)]">
            Chat History
          </h1>
          {messageRecieved}
        </div>
      </div>
    </section>
  );
}
