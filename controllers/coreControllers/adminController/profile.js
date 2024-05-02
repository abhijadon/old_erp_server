const mongoose = require('mongoose');
const Admin = mongoose.model('User');

const profile = async (req, res) => {
  try {
    //  Query the database for a list of all results
    if (!req.Admin) {
      return res.status(404).json({
        success: false,
        result: null,
        message: "couldn't found  Admin Profile ",
      });
    }
    let result = {
      _id: req.Admin._id,
      email: req.Admin.email,
      name: req.Admin.name,
      surname: req.Admin.surname,
      photo: req.Admin.photo,
      role: req.Admin.role,
    };

    return res.status(200).json({
      success: true,
      result,
      message: 'Successfully found Profile',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error,
    });
  }
};
module.exports = profile;
