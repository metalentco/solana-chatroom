// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  GETSTREAM_API_KEY,
  GETSTREAM_API_SECRECT_KEY,
  GETSTREAM_APP_ID,
} from "@/libs/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { StreamChat } from "stream-chat";
import { connect } from "getstream";

type Data = {
  userChatToken?: string;
  userActivityToken?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method != "POST") {
    return res.status(400).json({ error: "It should be POST method." });
  }

  try {
    const { userId } = req.body;
    if (userId && GETSTREAM_API_KEY && GETSTREAM_API_SECRECT_KEY) {
      const serverClient = StreamChat.getInstance(
        GETSTREAM_API_KEY,
        GETSTREAM_API_SECRECT_KEY
      );
      const userChatToken = serverClient.createToken(userId);

      const client = connect(
        GETSTREAM_API_KEY,
        GETSTREAM_API_SECRECT_KEY,
        GETSTREAM_APP_ID
      );
      const userActivityToken = client.createUserToken(userId);

      return res.status(200).json({ userChatToken, userActivityToken });
    } else {
      return res.status(400).json({ error: "Parameters are incorrect." });
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e?.message });
  }
}
