import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/dbConnect";
import Product from "../../../../../../models/Product";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
