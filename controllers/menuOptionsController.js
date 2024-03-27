// menuOptionsController.js

const MenuOptions = require('@/models/menuOptionsModel');

exports.getAllMenu = async (req, res) => {
  try {
    const menuOptions = await MenuOptions.find();
    res.json(menuOptions);
  } catch (error) {
    console.error('Error fetching menu options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllMenuOptions = async (req, res) => {
  try {
    // Assuming you have the user's role available in req.user.role after authentication
    const userRole = req.user.role;
    // Fetch menu options based on the user's role
    const menuOptions = await MenuOptions.findOne({ role: userRole });
    if (!menuOptions) {
      // If no menu options found for the user's role, return 404
      return res.status(404).json({ message: 'Menu options not found for the user\'s role' });
    }

    res.json(menuOptions);
  } catch (error) {
    console.error('Error fetching menu options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.saveMenuOptions = async (req, res) => {
    const { role, options } = req.body;
    try {
        const existingMenuOptions = await MenuOptions.findOne({ role });
        if (existingMenuOptions) {
            return res.status(409).json({ message: 'Menu options already exist for this role' });
        }

        const menuOptions = new MenuOptions({ role, options });
        await menuOptions.save();
        res.status(201).json({ message: 'Menu options saved successfully' });
    } catch (error) {
        console.error('Error saving menu options:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateMenuOptions = async (req, res) => {
  const { id } = req.params;
  const { role, options } = req.body;
  try {
    // Find menu options by ID
    let menuOptions = await MenuOptions.findById(id);
    if (!menuOptions) {
      return res.status(404).json({ message: 'Menu options not found with this ID' });
    }

    // Check if the role field is included in the request body
    if (role && role !== menuOptions.role) {
      return res.status(400).json({ message: 'Cannot update role field' });
    }

    // Update only the options field
    menuOptions.options = options;
    await menuOptions.save();
    res.json({ message: 'Menu options updated successfully' });
  } catch (error) {
    console.error('Error updating menu options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.getRead = async (req, res) => {
  const { id } = req.params;
  try {
    // Find menu options by ID
    const menuOptions = await MenuOptions.findById(id);
    if (!menuOptions) {
      return res.status(404).json({ message: 'Menu options not found with this ID' });
    }

    res.json(menuOptions);
  } catch (error) {
    console.error('Error fetching menu options:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

