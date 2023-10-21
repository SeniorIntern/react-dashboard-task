export type RoomType = {
  name: string;
  players: [
    {
      name: string;
      id: string;
    },
  ];
};

export type RoomChatType = {
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

export type ChatObjectType = {
  id: string;
  created_at: string;
  updated_at: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  roomsId: string;
};
