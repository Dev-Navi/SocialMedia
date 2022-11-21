import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";

const router = express.Router();

// Create Post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({ msg: "Post updated Successfully", post: savedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Some error on server" });
  }
});

// Update Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.body);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      return res.status(400).json({ msg: "The post has been updated" });
    } else {
      return res.status(400).json({ error: "You can update only your post" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error on server" });
  }
});

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.body);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      return res.status(400).json({ msg: "The post has been deleted" });
    } else {
      return res.status(400).json({ error: "You can delete only your post" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error on server" });
  }
});

// Like Post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ msg: "User has been liked this post" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(400).json({ error: "User has been disliked this post" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error on server" });
  }
});

// Get a Post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ msg: "Single Post", post: post });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error on server" });
  }
});

// Get Timeline Post
router.get("/timeline/all", async (req, res) => {
  try {
    console.log(req.body);
    const currentUser = await User.findById(req.body.userId);
    console.log(currentUser);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts))
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Some error on server" });
  }
});

export default router;
