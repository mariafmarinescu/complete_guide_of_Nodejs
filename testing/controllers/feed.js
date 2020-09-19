const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');

const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async ( req, res, next ) => {
  const current = req.query.page || 1;
  const perPage = 2;
  try {
    const total = await Post.find().countDocuments();
    const posts = await Post.find()
      .skip((current - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Posts successfully fetched.',
      posts: posts,
      totalItems: total
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  };
};

exports.createPost = async ( req, res, next ) => {
  const errors = validationResult(req);  

  if (!errors.isEmpty()) {
    const error = new Error('Incorrect data.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const imageUrl = req.file.path;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });

  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const savedUser = await user.save();
    res.status(201).json({
      message: 'Post successfully created!',
      creator: { _id: user._id, name: user.name },
      post: post
    });
    return savedUser;
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.getPost = async ( req, res, next ) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error('Inexistent post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ 
      message: 'Post successfully fetched.', 
      post: post 
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.updatePost = async ( req, res, next ) => {
  const postId = req.params.postId;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Incorrect data.');
    error.statusCode = 422;
    throw error;
  };

  const title = req.body.title;
  const content = req.body.content;
  let image = req.body.image;
  if (req.file) {
    image = req.file.path;
  };
  if (!image) {
    const error = new Error('No file chosen.');
    error.statusCode = 422;
    throw error;
  };

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Inexistent post.');
      error.statusCode = 404;
      throw error;
    };

    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    };

    if (image !== post.image) {
      clearImage(post.image);
    };

    post.title = title;
    post.imageUrl = image;
    post.content = content;

    const result = await post.save();

    res.status(200).json({ 
      message: 'Post successfully updated!', 
      post: result 
    });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(e);
  }
};

exports.deletePost = async ( req, res, next ) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    };
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    };

    clearImage(post.imageUrl);

    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();

    res.status(200).json({ message: 'Post successfully deleted.' });
  } catch (e) {
    if (!e.statusCode) {
      e.statusCode = 500;
    }
    next(er);
  };
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
