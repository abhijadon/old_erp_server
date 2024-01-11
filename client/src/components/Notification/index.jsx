import { useState, useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, message, Modal, List, Space } from 'antd';

const Notifications = ({ setNotificationCount }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setLocalNotificationCount] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/lead/getNotifications`);
        const data = await response.json();

        if (data.success && data.notifications && Array.isArray(data.notifications.notifications)) {
          setNotifications(data.notifications.notifications);
          setLocalNotificationCount(data.notifications.notificationCount);
          setNotificationCount(data.notifications.notificationCount);
          message.success('Notifications fetched successfully');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        message.error('Error fetching notifications');
      }
    };

    fetchNotifications();
  }, [setNotificationCount]);

  const showDeleteModal = (notificationId) => {
    setDeleteModalVisible(true);
    setSelectedNotificationId(notificationId);
  };

  const handleDeleteNotification = async () => {
    try {
      if (!selectedNotificationId) {
        console.error('No selected notification to delete');
        return;
      }

      // Use the selectedNotificationId to find the notification
      const notificationToDelete = notifications.find((n) => n.id === selectedNotificationId);

      if (!notificationToDelete) {
        console.error('Notification not found');
        return;
      }

      const messageToDelete = notificationToDelete.message;
      console.log('Message to delete:', messageToDelete); // Log the message parameter

      // Call your backend API to delete the notification using its message
      const response = await fetch(`${import.meta.env.VITE_BACKEND_SERVER}api/lead/deleteNotificationByMessage/${messageToDelete}`, {
        method: 'DELETE',
      });

      const responseData = await response.json();

      if (response.ok) {
        // Update state and notification count after successful deletion
        const updatedNotifications = notifications.filter((n) => n.id !== selectedNotificationId);
        setNotifications(updatedNotifications);
        setLocalNotificationCount(updatedNotifications.length);
        setNotificationCount(updatedNotifications.length);
        message.success('Notification deleted successfully');
      } else {
        console.error('Error deleting notification:', responseData.message);
        message.error('Error deleting notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      message.error('Error deleting notification');
    } finally {
      // Close the delete modal
      setDeleteModalVisible(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  return (
    <div className="notifications whiteBox shadow">
      <div className="pad20">
        <Space>
          <strong>Notifications ({notificationCount})</strong>
          <Button type="text" shape="circle" className="del-notif" onClick={() => showDeleteModal(null)}>
            <DeleteOutlined />
          </Button>
        </Space>
      </div>
      <div className="line"></div>
      <div className="notif-list">
        {notifications.length > 0 ? (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                actions={[
                  <Space key="notificat">
                    <Button type="text" className="notif-btn" onClick={() => showDeleteModal(notification.id)}>
                      <span>Email: {notification.email}</span>

                      <span>Message: {notification.message}</span>

                      <span>Time: {new Date(notification.timestamp).toLocaleTimeString()}</span>
                    </Button>
                  </Space>,
                ]}
              ></List.Item>
            )}
          />
        ) : (
          <p>No notifications</p>
        )}
      </div>

      {/* Delete Modal */}
      <Modal
        title="Delete Notification"
        visible={deleteModalVisible}
        onOk={handleDeleteNotification}
        onCancel={handleCloseDeleteModal}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this notification?</p>
      </Modal>
    </div>
  );
};

export default Notifications;
