import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/dbConnect";
import Product from "../../../../../../models/Product"; // Update to use Product model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, description, price, category } = req.body; // Assuming product properties
      const newProduct = new Product({ name, description, price, category });
      await newProduct.save();
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
