const Institute = require('../models/Institute');

exports.createInstitute = async (req, res) => {
  try {
    const institute = new Institute(req.body);
    await institute.save();
    res.status(201).json(institute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.json(institutes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.json(institute);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
