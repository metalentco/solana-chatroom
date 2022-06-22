// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ICollection } from "@/interfaces/Collection";
import {
  GETSTREAM_API_KEY,
  GETSTREAM_API_SECRECT_KEY,
  GETSTREAM_OWNER_ID,
} from "@/libs/constants";
import { checkHoldNFT } from "@/libs/utils";
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
    res.status(400).json({ error: "It should be POST method." });
  }

  try {
    const { userId, address, collections } = req.body;
    if (
      userId &&
      address &&
      collections &&
      GETSTREAM_API_KEY &&
      GETSTREAM_API_SECRECT_KEY
    ) {
      const serverClient = StreamChat.getInstance(
        GETSTREAM_API_KEY,
        GETSTREAM_API_SECRECT_KEY
      );

      collections.forEach(async (collection: ICollection) => {
        const channel = serverClient.channel("messaging", collection.id);
        const holdNft = await checkHoldNFT(address, collection.contract);
        if (holdNft) {
          channel.addMembers([userId]);
        } else {
          channel.removeMembers([userId]);
        }
      });
      return res.status(200).json({ message: "Success" });
    }
    res.status(400).json({ error: "Eror occured on updating membership." });
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: e?.message });
  }
}
