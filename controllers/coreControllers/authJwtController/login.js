const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const mongoose = require('mongoose');

const Admin = mongoose.model('Admin');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // URL address
    const address = req.get('origin');

    // Call parse() method using url module
    const urlObject = new URL(address);

    const originalHostname = urlObject.hostname;

    let isLocalhost = false;
    if (originalHostname === 'localhost') {
      // Connection is from localhost
      isLocalhost = true;
    }

    // validate
    const objectSchema = Joi.object({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().required(),
    });

    const { error, value } = objectSchema.validate({ email, password });
    if (error) {
      return res.status(409).json({
        success: false,
        result: null,
        error: error,
        message: 'Invalid Password',
        errorMessage: error.message, // Provide more detailed error message to the client
      });
    }

    const admin = await Admin.findOne({ email: email, removed: false });

    if (!admin)
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No account with this email has been registered.',
      });

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch)
      return res.status(403).json({
        success: false,
        result: null,
        message: 'Invalid credentials.',
      });

    // Set the token expiration time to 1 hour by default
    const expiresIn = '1h';

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn });

    const result = await Admin.findOneAndUpdate(
      { _id: admin._id },
      { $set: { isLoggedIn: 1 }, $push: { loggedSessions: token } },
      { new: true }
    ).exec();

    res
      .cookie('token', token, {
        maxAge: req.body.remember ? 365 * 24 * 60 * 60 * 1000 : expiresIn,
        sameSite: 'none',
        httpOnly: true,
        secure: true,
        domain: req.hostname,
        path: '/',
      })
      .json({
        success: true,
        result: {
          _id: result._id,
          name: result.name,
          surname: result.surname,
          role: result.role,
          email: result.email,
          photo: result.photo,
          isLoggedIn: result.isLoggedIn > 0 ? true : false,
        },
        message: 'Successfully login admin',
      });
  } catch (error) {
    res.status(500).json({ success: false, result: null, message: error.message, error: error });
  }
};

module.exports = login;
