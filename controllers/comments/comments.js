const { Comment } = require('@/models/Comment'); // Import the Comment model
const { Applications } = require('@/models/Application'); // To ensure applicationId exists

const createComment = async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user
    const { applicationId } = req.params; // Get the application ID from the route parameter
    const { commentText } = req.body; // Get the comment text from the request body

    if (!commentText) { // Validate required fields
      return res.status(400).json({ message: 'comment text are required.' });
    }

    const application = await Applications.findById(applicationId);
if (!application) {
  return res.status(404).json({ message: 'Application not found.' });
}

    const newComment = new Comment({
      applicationId,
      userId,
      commentText,
    });

    const savedComment = await newComment.save(); // Save the comment
    res.status(200).json({ message: 'Comment created successfully.', comment: savedComment });
 
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
module.exports = {
  createComment,
};
