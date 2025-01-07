import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/dbConnect";
import User from "../../../../../../models/Users";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  } else if (req.method === "POST") {
    try {
      const { name, email, age } = req.body;
      const newUser = new User({ name, email, age });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to create user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
