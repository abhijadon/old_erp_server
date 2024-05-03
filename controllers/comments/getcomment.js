const { Comment } = require('@/models/Comment'); // Import the Comment model

const getCommentsByStudent = async (req, res) => {
  try {
    // Extract the userId or applicationId from the request parameters
    const { userId, applicationId } = req.params;

    let comments;

    // Get comments by userId if specified
    if (applicationId) {
      comments = await Comment.find({ applicationId }).populate('userId');
    }
    // If neither parameter is provided, return a bad request response
    else {
      return res.status(400).json({ message: 'No userId or applicationId provided.' });
    }

    // If no comments are found, return a not found response
    if (!comments.length) {
      return res.status(404).json({ message: 'No comments found.' });
    }

    // Return the comments if found
    return res.status(200).json({ comments });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getCommentsByStudent };
