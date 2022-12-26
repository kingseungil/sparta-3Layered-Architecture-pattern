const express = require('express');
const router = express.Router();

const PostController = require('../controllers/posts.controller');
const postsController = new PostController();

router.get('/', postsController.getPosts);
router.post('/', postsController.createPost);

module.exports = router;
