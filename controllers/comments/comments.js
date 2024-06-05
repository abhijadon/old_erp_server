// controllers/commentController.js

const { Comment } = require('@/models/Comment');
const { Applications } = require('@/models/Application');
const { Payment } = require('@/models/Payment');

const createComment = async (req, res) => {
  console.log('req.body', req.body);
  try {
    const userId = req.user._id;
    const { applicationId } = req.params;
    const { commentText, followUpDate, removeFollowUp } = req.body; // Add removeFollowUp flag to request body

    if (!commentText) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }

    const application = await Applications.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found.' });
    }

    const payment = await Payment.findOne({ applicationId });
    if (!payment) {
      return res.status(404).json({ message: 'No payment associated with this application.' });
    }

    const newComment = new Comment({
      applicationId,
      userId,
      commentText,
      createdAt: Date.now(),
    });

    const savedComment = await newComment.save();

    if (removeFollowUp) { // Check if removeFollowUp flag is true
      payment.followStatus = null; // Remove follow-up status
      payment.followUpDate = null; // Reset follow-up date
      await payment.save();
    } else {
      payment.followStatus = 'follow-up';
      payment.followUpDate = followUpDate;
      await payment.save();
    }

    res.status(200).json({ message: 'Comment created successfully and followStatus updated.', comment: savedComment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createComment,
};
