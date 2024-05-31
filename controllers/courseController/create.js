const Course = require('@/models/Course');

const create = async (req, res) => {
  try {
   let { name, courseType } = req.body;

    // Convert name and courseType to uppercase
    name = name.toUpperCase();
    courseType = courseType.toUpperCase();

    // Check if name is in uppercase
    if (name !== req.body.name || courseType !== req.body.courseType) {
      return res.status(400).json({
        success: false,
        message: 'Course name and course type must be in uppercase',
        error: null,
      });
    }


    // Check if permissions for the provided name already exist
    const existingCourse = await Course.findOne({ name });

    if (existingCourse) {
      // Course for the provided name already exists
      return res.status(400).json({
        success: false,
        message: 'Course for the provided name already exists',
        error: null,
      });
    }

    // Create new Course if no existing Course found for the provided name
    const newCourse = new Course(req.body);
    const result = await newCourse.save();

    res.status(200).json({
      success: true,
      result: result,
      message: 'New Course created successfully',
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
