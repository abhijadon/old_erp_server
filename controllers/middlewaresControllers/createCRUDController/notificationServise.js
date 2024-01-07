const notifications = [];
let notificationCount = 0;

function addNotification(type, action, message, email) {
  const notification = {
    type,
    action,
    message,
    email,
    timestamp: new Date(),
  }

  notifications.push(notification);
  notificationCount += 1;

  // You can customize this part to send notifications to other services or databases.
  console.log('New Notification:', notification);

  return notification;
}

function deleteNotification(message) {
  const indexToDelete = notifications.findIndex((notification) => notification.message === message);

  if (indexToDelete !== -1) {
    console.log('Deleting notification:', notifications[indexToDelete]);
    notifications.splice(indexToDelete, 1);
    notificationCount -= 1;
    console.log(`Notification with message "${message}" deleted.`);
  } else {
    console.warn(`Notification with message "${message}" not found.`);
  }
}

function getNotifications() {
  return {
    success: true,
    notifications: notifications.map((notification) => ({
      type: notification.type,
      action: notification.action,
      message: notification.message,
      email: notification.email,
      timestamp: notification.timestamp.toISOString(),
    })),
    notificationCount: notificationCount,
  };
}

module.exports = {
  addNotification,
  deleteNotification,
  getNotifications,
};
