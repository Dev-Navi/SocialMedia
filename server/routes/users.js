import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
const router = express.Router();

// Update User
router.put("/:id", async (req, res) => {
  console.log(req.body.userId, req.param.id);
  try {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          console.log(err);
          return res.status(500).json({ error: "Some error on server" });
        }
      }

      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });

        return res.status(200).json({ msg: "Account has been Updated" });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Some error on server" });
      }
    } else {
      return res
        .status(400)
        .json({ error: "You can update only your account" });
    }
  } catch (err) {}
});

// Delete User
router.delete("/:id", async (req, res) => {
  console.log(req.body.userId, req.params.id);
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ msg: "Account has been Deleted" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Some error on server" });
    }
  } else {
    res.status(400).json({ error: "You can Deleted only your account" });
  }
});

// Get User
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, createdAt, ...other } = user._doc;
    return res.status(200).json({ msg: "Your Details is", user: other });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Some error on server" });
  }
});

//  Follow User
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentuser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json({ msg: "User has been followed" });
      } else {
        res.status(400).json({ error: "You already follow this user" });
      }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Server Error" });
    }
  } else {
    res.status(400).json({ error: "You con't follow your self" });
  }
});

// Unfollow User
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentuser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({ msg: "User has been unfollowed" });
      } else {
        res.status(400).json({ error: "You don't follow this user" });
      }
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Server Error" });
    }
  } else {
    res.status(400).json({ error: "You con't unfollow your self" });
  }
});

export default router;
