// server/src/routes/resources.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Analysis = require('../models/Analysis');
const Startup = require('../models/Startup');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Protect all routes
router.use(protect);

// Get personalized resources based on startup stage and challenges
router.get('/recommendations', async (req, res) => {
    try {
        // Get user's startup info
        const startup = await Startup.findOne({ userId: req.user.id });
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup profile not found'
            });
        }

        // Get contextual recommendations
        const prompt = `Given a ${startup.stage} stage startup in ${startup.industry} industry
                       with challenges: ${startup.currentChallenges.join(', ')},
                       provide specific resources and recommendations.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-0314",  // Using GPT-4-O model
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 1000
        });

        // Store analysis
        await Analysis.create({
            userId: req.user.id,
            question: "Resource recommendations",
            response: completion.choices[0].message.content,
            context_used: [
                { source: 'startup_profile', relevance: 1.0 }
            ]
        });

        res.json({
            success: true,
            recommendations: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('Resource recommendation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating recommendations'
        });
    }
});

// Get resource by category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const startup = await Startup.findOne({ userId: req.user.id });

        const categoryPrompt = `Provide ${category} resources for a ${startup.stage} stage 
                              startup in ${startup.industry} industry.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4-0314",  // Using GPT-4-O model
            messages: [{ role: "user", content: categoryPrompt }],
            temperature: 0.7,
            max_tokens: 1000
        });

        res.json({
            success: true,
            category,
            resources: completion.choices[0].message.content
        });
    } catch (error) {
        console.error('Category resource error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category resources'
        });
    }
});

// Rest of the code remains the same...

router.post('/save', async (req, res) => {
    try {
        const { title, url, notes, category } = req.body;
        
        const startup = await Startup.findOne({ userId: req.user.id });
        if (!startup) {
            return res.status(404).json({
                success: false,
                message: 'Startup not found'
            });
        }

        const analysis = await Analysis.create({
            userId: req.user.id,
            question: `Custom resource: ${title}`,
            response: notes,
            context_used: [
                { source: 'user_saved', relevance: 1.0 }
            ]
        });

        res.status(201).json({
            success: true,
            message: 'Resource saved successfully',
            resource: {
                id: analysis._id,
                title,
                url,
                notes,
                category
            }
        });
    } catch (error) {
        console.error('Save resource error:', error);
        res.status(500).json({
            success: false,
            message: 'Error saving resource'
        });
    }
});

router.get('/saved', async (req, res) => {
    try {
        const analyses = await Analysis.find({
            userId: req.user.id,
            'context_used.source': 'user_saved'
        }).sort({ timestamp: -1 });

        res.json({
            success: true,
            resources: analyses
        });
    } catch (error) {
        console.error('Fetch saved resources error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching saved resources'
        });
    }
});

module.exports = router;