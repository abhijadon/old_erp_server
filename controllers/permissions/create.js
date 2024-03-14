const Permission = require('@/models/Permission')

const create = async (req, res) => {
  try {
    // Check if a team with the same user already exists
    const existingTeam = await Permission.findOne({ user: req.body.user });

    if (existingTeam) {
      // Team with the same user already exists
      return res.status(400).json({
        success: false,
        message: 'Permissions with the provided user already exists',
        error: null,
      });
    }

    // Create a new team if user is not duplicate
    const result = await Permission.create(req.body);

    res.status(200).json({
      success: true,
      result: result,
      message: 'Permission are ready',
    });
  } catch (error) {
    console.error('Error saving to the database:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        result,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      res.status(500).json({
        success: false,
        result,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = create;
