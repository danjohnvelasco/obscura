const router = require('express').Router();

// import controllers here...
const postsController = require('../controllers/postsController.js');
const usersController = require('../controllers/usersController.js');

// routes and route handlers (controllers)

//for the posts
router.get('/getPosts', postsController.getPosts);       // get all posts
router.get('/viewPost/:pid', postsController.viewPost);  // get single post

//for the users
router.put('/updateProfile/:id', usersController.update); 
router.get('/search', usersController.search);

module.exports = router;