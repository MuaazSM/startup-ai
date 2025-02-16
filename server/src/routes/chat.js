const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const openaiService = require('../services/openai'); // Import the instance directly

router.use(protect); // Protect all chat routes

router.post('/message', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id;

        // Store user message
        const user = await User.findById(userId);
        user.chatHistory.push({
            role: 'user',
            content: message
        });

        // Get response from Python service
        const aiResponse = await openaiService.generateResponse(message, userId);

        // Store AI response
        user.chatHistory.push({
            role: 'assistant',
            content: aiResponse.response
        });

        await user.save();

        res.json({
            success: true,
            message: aiResponse.response,
            context: aiResponse.context_used,
            chatHistory: user.chatHistory
        });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing message'
        });
    }
});

// Get chat history
router.get('/history', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            success: true,
            chatHistory: user.chatHistory
        });
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history'
        });
    }
});

// Clear chat history
router.delete('/history', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.chatHistory = [];
        await user.save();
        
        res.json({
            success: true,
            message: 'Chat history cleared'
        });
    } catch (error) {
        console.error('History clear error:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing chat history'
        });
    }
});

module.exports = router;