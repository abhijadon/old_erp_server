const Institute = require('@/models/Institute');

// Create a new institute
exports.createInstitute = async (req, res) => {
  try {
    const institute = new Institute(req.body);
    await institute.save();
    res.status(201).json(institute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find();
    res.status(200).json(institutes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get an institute by ID
exports.getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.status(200).json(institute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an institute by ID
exports.updateInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.status(200).json(institute);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an institute by ID
exports.deleteInstitute = async (req, res) => {
  try {
    const institute = await Institute.findByIdAndDelete(req.params.id);
    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }
    res.status(200).json({ message: 'Institute deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
