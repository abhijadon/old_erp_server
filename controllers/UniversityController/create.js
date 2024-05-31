const University = require('@/models/University');

const create = async (req, res) => {
  try {
    const name = req.body.name;

    // Check if name is in uppercase
    if (name !== name.toUpperCase()) {
      return res.status(400).json({
        success: false,
        message: 'University name must be in uppercase',
        error: null,
      });
    }

    // Check if permissions for the provided name already exist
    const existingUniversity = await University.findOne({ name });

    if (existingUniversity) {
      // University for the provided name already exists
      return res.status(400).json({
        success: false,
        message: 'University for the provided name already exists',
        error: null,
      });
    }

    // Create new University if no existing University found for the provided name
    const newUniversity = new University(req.body);
    const result = await newUniversity.save();

    res.status(200).json({
      success: true,
      result: result,
      message: 'New University created successfully',
    });
  } catch (error) {
    console.error('Error saving to the database:', error);

    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        result: null,
        message: 'Required fields are not supplied',
        error: error,
      });
    } else {
      res.status(500).json({
        success: false,
        result: null,
        message: error.message,
        error: error,
      });
    }
  }
};

module.exports = create;
