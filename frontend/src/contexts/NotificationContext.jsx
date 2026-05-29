import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    localStorage.setItem('notifications_cleared', Date.now());
  }, []);

  const addNotification = useCallback((note) => {
    const id = Date.now() + Math.random();
    const entry = { id, ...note, read: false, created_at: new Date().toISOString() };
    setNotifications((prev) => [entry, ...prev]);
    setUnreadCount((prev) => prev + 1);
    localStorage.removeItem('notifications_cleared');
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications deve ser usado dentro de NotificationProvider');
  return ctx;
}