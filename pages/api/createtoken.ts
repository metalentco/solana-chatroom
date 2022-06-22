// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GETSTREAM_API_KEY, GETSTREAM_API_SECRECT_KEY } from "@/libs/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { StreamChat } from "stream-chat";

type Data = {
  userToken?: string;
  error?: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method != "POST") {
    res.status(400).json({ error: "It should be POST method." });
  }

  try {
    const { userId } = req.body;
    if (userId && GETSTREAM_API_KEY && GETSTREAM_API_SECRECT_KEY) {
      const serverClient = StreamChat.getInstance(
        GETSTREAM_API_KEY,
        GETSTREAM_API_SECRECT_KEY
      );
      const userToken = serverClient.createToken(userId);
      return res.status(200).json({ userToken });
    }
    res.status(400).json({ error: "Eror occured on creating token." });
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e?.message });
  }
}
