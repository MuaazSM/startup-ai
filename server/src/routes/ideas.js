// server/src/routes/ideas.js
const express = require('express');
const { protect } = require('../middleware/auth');
const { 
  createIdea, 
  getIdeas 
} = require('../controllers/ideas');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.route('/')
  .post(createIdea)
  .get(getIdeas);

module.exports = router;