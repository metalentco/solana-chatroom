// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  GETSTREAM_API_KEY,
  GETSTREAM_API_SECRECT_KEY,
  GETSTREAM_OWNER_ID,
} from "@/libs/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import { StreamChat } from "stream-chat";

type Data = {
  message?: string;
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
    const { userId, contractAddress, collectionName, collectionId, avatar } =
      req.body;
    if (
      userId &&
      contractAddress &&
      avatar &&
      collectionName &&
      GETSTREAM_API_KEY &&
      GETSTREAM_API_SECRECT_KEY
    ) {
      const serverClient = StreamChat.getInstance(
        GETSTREAM_API_KEY,
        GETSTREAM_API_SECRECT_KEY
      );
      const channel = serverClient.channel("messaging", collectionId, {
        name: collectionName,
        members: [userId],
        image: avatar,
        contract: contractAddress,
        owner: userId,
        created_by_id: GETSTREAM_OWNER_ID,
      });

      await channel.create();
      return res.status(200).json({ message: "Success" });
    } else {
      return res.status(400).json({ error: "Parameters are incorrect." });
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e?.message });
  }
}
