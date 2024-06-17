// controllers/commentController.js

const { Comment } = require('@/models/Comment');
const { Applications } = require('@/models/Application');
const { Payment } = require('@/models/Payment');

const createComment = async (req, res) => {
  try {
    const userId = req.user._id;
    const { applicationId } = req.params;
    const { commentText, followUpDate, removeFollowUp } = req.body;

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

    let newCommentData = {
      applicationId,
      userId,
      commentText,
    };

    if (removeFollowUp) {
      payment.followStatus = null;
      payment.followUpDate = null;
    } else {
      // Otherwise, include follow-up date and status in both comment and payment
      newCommentData.followStatus = 'follow-up';
      newCommentData.followUpDate = followUpDate;
      payment.followStatus = 'follow-up';
      payment.followUpDate = followUpDate;
    }

    const newComment = new Comment(newCommentData);
    const savedComment = await newComment.save();
    await payment.save();

    res.status(200).json({ message: 'Comment created successfully.', comment: savedComment });

  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


module.exports = {
  createComment,
};
