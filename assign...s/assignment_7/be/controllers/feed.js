const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');


const getPosts = ( req, res, next ) => {
    const page = req.query.page || 1;
    const perPage = 2;
    let total;

    Post.find()
        .countDocuments()
        .then( result => {
            total = result;
            return Post.find()
                .skip((currentPage - 1) * perPage)
                .limit(perPage)
        })
        .then( posts => {
            res.status(200).json({
                message: 'Fetched posts successfully.',
                posts: posts, 
                totalItems: total
            });
        }).catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            };
            next(e);
        });
};

exports.updatePost = ( req, res, next ) => {
    const postId = req.params.postId;
    const error = validationResult(req);

    if(!errors.isEmpty()) {
        const error = new Error('Incorrect data.');
        error.statusCode = 422;
        throw error;
    };

    const title = req.body.title;
    const image = req.body.image;
    const content = req.body.content;

    if (req.file) {
        imageUrl = req.file.path;
    };

    if (!image) {
        const error = new Error('No file received.');
        error.statusCode = 422;
        throw error;
    };

    Post.findById(postId)
        .then(post => {
            if (!post) {
                const error = new Error('Post not found.');
                error.statusCode = 404;
                throw error;
            };
            if (post.creator.toString() !== req.userId) {
                const error = new Error('Authorization failed!');
                error.statusCode = 403;
                throw error;
            };

            if (imageUrl !== post.imageUrl) {
                clearImage(post.imageUrl);
            };
            post.title = title;
            post.imageUrl = image;
            post.content = content;
            return post.save();
        })
        .then(result => {
            res.status(200).json({ 
                message: 'Post successfully updated!', 
                post: result 
            });
        }).catch(e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            }
            next(e);
        });
    };
    
    exports.deletePost = ( req, res, next ) => {
      const postId = req.params.postId;

      Post.findById(postId)
        .then( post => {

          if (!post) {
            const error = new Error('Post not found.');
            error.statusCode = 404;
            throw error;
          };

          if (post.creator.toString() !== req.userId) {
            const error = new Error('Authorization failed!');
            error.statusCode = 403;
            throw error;
          };

            clearImage(post.imageUrl);
            return Post.findByIdAndRemove(postId);
        })
        .then( result => {
            return User.findById(req.userId);
        })
        .then( user => {
            user.posts.pull(postId);
            return user.save();
        })
        .then(result => {
            res.status(200).json({ 
                message: 'Post successfully deleted.' 
            });
        }).catch( e => {
            if (!e.statusCode) {
                e.statusCode = 500;
            };
            next(e);
        });
    };
    
const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};
    