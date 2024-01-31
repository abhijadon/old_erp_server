const WebSocket = require('ws');
const Notification = require('@/models/appModels/Notication');

const server = new WebSocket.Server({ noServer: true });

const notifications = [];
let notificationCount = 0;

function addNotification(type, action, full_name, email) {
  const notification = new Notification({
    type,
    action,
    full_name,
    email,
    timestamp: new Date(),
  });

  return notification
    .save()
    .then((savedNotification) => {
      notifications.push(savedNotification);
      notificationCount += 1;

      // Broadcast the new notification to all connected clients
      server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(savedNotification));
        }
      });

      return savedNotification;
    })
    .catch((err) => {
      console.error('Error saving notification to the database:', err);
      throw err;
    });
}

module.exports = {
  addNotification,
  server, // export the WebSocket server instance
};
