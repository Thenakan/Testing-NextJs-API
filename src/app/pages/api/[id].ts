import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../lib/dbConnect";
import User from "../../../../../models/Users";
import { Types } from "mongoose";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  if (!id || !Types.ObjectId.isValid(id as string)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  if (req.method === "GET") {
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  } else if (req.method === "PATCH") {
    try {
      const { name, email, age } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, age },
        { new: true, runValidators: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  } else if (req.method === "DELETE") {
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
