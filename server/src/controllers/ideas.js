const Idea = require('../models/Idea');

exports.createIdea = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    const idea = await Idea.create({
      title,
      description,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      idea
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating idea'
    });
  }
};

exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ userId: req.user._id });
    res.status(200).json({
      success: true,
      ideas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ideas'
    });
  }
};

