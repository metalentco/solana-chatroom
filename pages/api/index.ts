// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  ok: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { method } = req;

  // This will allow OPTIONS request
  if (method === "OPTIONS") {
    return res.status(200).send({ ok: "success" });
  }
}
