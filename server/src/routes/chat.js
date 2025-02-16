// server/src/routes/chat.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

        // Get OpenAI response
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        const aiResponse = completion.choices[0].message.content;

        // Store AI response
        user.chatHistory.push({
            role: 'assistant',
            content: aiResponse
        });

        await user.save();

        res.json({
            success: true,
            message: aiResponse,
            chatHistory: user.chatHistory
        });
    } catch (error) {
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
        res.status(500).json({
            success: false,
            message: 'Error fetching chat history'
        });
    }
});

module.exports = router;