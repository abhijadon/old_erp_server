const mongoose = require('mongoose');
const Admin = mongoose.model('User');
const Team = mongoose.model('Team'); // Import Team model

const create = async (req, res) => {
  try {
   let { username, password, phone } = req.body;
if (!username || !password || !phone)
  return res.status(400).json({
    success: false,
    result: null,
    message: "Username or password or phone fields haven't been entered.",
  });

    // Check if the username or phone already exists
    const existingAdmin = await Admin.findOne({ $or: [{ username: username }, { phone: phone }] });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'An account with this username or phone already exists.',
      });
    }

    if (password.length < 8)
      return res.status(400).json({
        success: false,
        result: null,
        message: 'The password needs to be at least 8 characters long.',
      });

    // Optional: Role validation
    if (!['admin', 'subadmin', 'teamleader', 'user'].includes(req.body.role)) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Invalid role specified.',
      });
    }

    var newAdmin = new Admin(req.body);

    const passwordHash = newAdmin.generateHash(password);
    newAdmin.password = passwordHash;

    const result = await newAdmin.save();
    if (!result) {
      return res.status(403).json({
        success: false,
        result: null,
        message: "Document couldn't save correctly",
      });
    }

   return res.status(200).send({
  success: true,
  result: {
    _id: result._id,
    enabled: result.enabled,
    username: result.username,
    phone: result.phone,
    fullname: result.fullname,
    photo: result.photo,
    role: result.role,
  },
  message: 'Admin document saved correctly',
});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error', error });
  }
};

module.exports = create;
