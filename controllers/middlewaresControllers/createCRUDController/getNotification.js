const { formatDistanceToNow } = require('date-fns');
const Notification = require('@/models/appModels/Notication'); // Adjust the path based on your project structure

const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().exec();

    // Format timestamps to human-readable format
    const formattedNotifications = notifications.map((notification) => {
      const distanceToNow = formatDistanceToNow(new Date(notification.timestamp), {
        addSuffix: true,
      });
      return {
        ...notification._doc,
        timeAgo: distanceToNow,
      };
    });

    return res.json({
      success: true,
      notifications: formattedNotifications,
      notificationCount: notifications.length,
    });
  } catch (error) {
    console.error('Error fetching notifications from the database:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

const deleteNotificationById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedNotification = await Notification.findByIdAndDelete(id).exec();

    if (!deletedNotification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    // Notify clients about the deleted notification (you may send this notification through WebSocket)
    // Example WebSocket code:
    // wss.clients.forEach(client => {
    //   client.send(JSON.stringify({ type: 'notificationDeleted', data: deletedNotification }));
    // });

    return res.json({
      success: true,
      message: 'Notification deleted successfully',
      deletedNotification: deletedNotification,
    });
  } catch (error) {
    console.error('Error deleting notification from the database:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
    });
  }
};

module.exports = {
  getAllNotifications,
  deleteNotificationById,
};
