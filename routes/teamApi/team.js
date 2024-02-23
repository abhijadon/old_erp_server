// Import necessary modules
const express = require('express');
const router = express.Router();
const Team = require('@/models/Team');
const { Applications } = require('@/models/Application'); // Adjust the path accordingly
const authenticate = require('@/middlewares/authenticate');
const checkUserRole = require('@/middlewares/checkUserRole');

// Team route
router.get('/teams', authenticate, checkUserRole, async (req, res) => {
  try {
    const user = req.user;

    if (user.role === 'admin') {
      // Fetch all teams for admin
      const teams = await Team.find();
      return res.json(teams);
    }

    if (user.role === 'teamleader') {
      // Fetch team data for the team leader
      const team = await Team.findOne({ user: user._id }).populate('teamMembers');

      // Extract user IDs from the team members
      const teamMemberIds = team.teamMembers.map(member => member._id);

      // Fetch applications for team members
      const applications = await Applications.find({ userId: { $in: teamMemberIds } });

      return res.json({ team, applications });
    }

    // Handle other roles as needed

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
