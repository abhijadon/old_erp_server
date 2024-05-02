const MenuOptions = require('@/models/menuOptionsModel');

const createMenuOptions = async (req, res) => {
  try {
    // Check if menuOptions for the provided role already exist
    const existingMenuOptions = await MenuOptions.findOne({ role: req.body.role });

    if (existingMenuOptions) {
      // MenuOptions for the provided role already exist
      return res.status(400).json({
        success: false,
        message: `Menu options for the role '${req.body.role}' already exist`,
        error: null,
      });
    }

    // Create new menuOptions if no existing menuOptions found for the provided role
    const newMenuOptions = new MenuOptions(req.body);
    const result = await newMenuOptions.save();

    res.status(201).json({
      success: true,
      result: result,
      message: 'Menu options created successfully',
    });
  } catch (error) {
    console.error('Error saving to the database:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied or invalid',
        error: error,
      });
    } else {
      res.status(500).json({
        success: false,
        result: null,
        message: 'Internal server error',
        error: error,
      });
    }
  }
};

module.exports = createMenuOptions;
