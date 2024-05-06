export function getUnreadNotifications(notifications) {
  return notifications.filter((n) => n.isRead === false);
}
