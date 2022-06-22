import { GETSTREAM_API_KEY } from "@/libs/constants";
import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  ChannelList,
  LoadingIndicator,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";

type ChatRoomProps = {
  userToken: string;
  userId: string;
  userName: string;
  avatar: string;
};

const ChatRoom = ({ userToken, userId, userName, avatar }: ChatRoomProps) => {
  const [chatClient, setChatClient] = useState(null);
  const filters = { type: "messaging", members: { $in: [userId] } };
  const sort = { last_message_at: -1 };

  useEffect(() => {
    const initChat = async () => {
      const client = StreamChat.getInstance(GETSTREAM_API_KEY);

      await client.connectUser(
        {
          id: userId,
          name: userName,
          image: avatar,
        },
        userToken
      );

      // @ts-ignore
      setChatClient(client);
    };

    initChat();
  }, []);

  if (!chatClient) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={chatClient} theme="messaging light">
      <ChannelList
        filters={filters}
        // @ts-ignore
        sort={sort}
      />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
};

export default ChatRoom;
