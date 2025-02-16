const Resource = require('../models/Resource');

exports.getResources = async (req, res) => {
  try {
    const { category } = req.query;

    // Fetch resources, filtered by category if provided
    const query = category ? { category } : {};
    const resources = await Resource.find(query);

    res.status(200).json({
      success: true,
      resources
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching resources'
    });
  }
};

exports.saveResource = async (req, res) => {
  try {
    const { title, url, notes, category } = req.body;

    const resource = await Resource.create({
      title,
      url,
      notes,
      category,
      userId: req.user._id
    });

    res.status(201).json({
      success: true,
      resource
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving resource'
    });
  }
};
