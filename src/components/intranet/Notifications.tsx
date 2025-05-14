
import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';

interface Notification {
  id: string;
  type: 'post' | 'comment' | 'event' | 'announcement' | 'link';
  message: string;
  read: boolean;
  timestamp: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState<string>(localStorage.getItem('andcont_last_checked') || '');
  const { selectedGradient } = useTheme();
  
  // Check for new notifications when component mounts and whenever the page becomes visible
  useEffect(() => {
    checkForNewContent();
    
    // Set up an interval to check for new content every 30 seconds
    const intervalId = setInterval(() => {
      checkForNewContent();
    }, 30000);
    
    // Check for notifications when the tab becomes visible again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForNewContent();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  const checkForNewContent = () => {
    const currentUser = JSON.parse(localStorage.getItem('andcont_user') || '{}');
    if (!currentUser?.id) return;
    
    const now = new Date().toISOString();
    const lastChecked = lastCheckedTimestamp || '2000-01-01T00:00:00Z';
    
    // Check for new announcements
    const announcements = JSON.parse(localStorage.getItem('andcont_announcements') || '[]');
    const newAnnouncements = announcements.filter((a: any) => 
      a.createdAt > lastChecked && a.createdBy !== currentUser.name
    );
    
    // Check for new feed posts
    const feedPosts = JSON.parse(localStorage.getItem('andcont_feed') || '[]');
    const newFeedPosts = feedPosts.filter((p: any) => 
      p.createdAt > lastChecked && p.createdBy !== currentUser.name
    );
    
    // Check for new events
    const events = JSON.parse(localStorage.getItem('andcont_events') || '[]');
    const newEvents = events.filter((e: any) => 
      e.createdAt > lastChecked && e.createdBy !== currentUser.name
    );
    
    // Check for new links
    const links = JSON.parse(localStorage.getItem('andcont_links') || '[]');
    const newLinks = links.filter((l: any) => 
      l.createdAt > lastChecked && l.createdBy !== currentUser.name
    );
    
    // Check for new comments
    const comments = JSON.parse(localStorage.getItem('andcont_comments') || '[]');
    const newComments = comments.filter((c: any) => 
      c.createdAt > lastChecked && c.createdBy !== currentUser.name
    );
    
    // Create notifications for new content
    const newNotifications: Notification[] = [
      ...newAnnouncements.map((a: any) => ({
        id: `ann-${a.id}`,
        type: 'announcement' as const,
        message: `Novo comunicado: ${a.title}`,
        read: false,
        timestamp: a.createdAt
      })),
      ...newFeedPosts.map((p: any) => ({
        id: `post-${p.id}`,
        type: 'post' as const,
        message: `Nova publicação: ${p.title}`,
        read: false,
        timestamp: p.createdAt
      })),
      ...newEvents.map((e: any) => ({
        id: `event-${e.id}`,
        type: 'event' as const,
        message: `Novo evento: ${e.title}`,
        read: false,
        timestamp: e.createdAt
      })),
      ...newLinks.map((l: any) => ({
        id: `link-${l.id}`,
        type: 'link' as const,
        message: `Novo link: ${l.title}`,
        read: false,
        timestamp: l.createdAt
      })),
      ...newComments.map((c: any) => ({
        id: `comment-${c.id}`,
        type: 'comment' as const,
        message: `Novo comentário de ${c.createdBy}`,
        read: false,
        timestamp: c.createdAt
      }))
    ];
    
    // Show toast notifications for new content
    if (newNotifications.length > 0) {
      if (newNotifications.length === 1) {
        toast.info(newNotifications[0].message, {
          duration: 5000,
        });
      } else {
        toast.info(`Você tem ${newNotifications.length} novas notificações`, {
          duration: 5000,
        });
      }
      
      // Reproduzir som de notificação
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Não foi possível reproduzir o som de notificação'));
    }
    
    // Update notifications in localStorage
    const existingNotifications = JSON.parse(localStorage.getItem('andcont_notifications') || '[]');
    const updatedNotifications = [...newNotifications, ...existingNotifications].slice(0, 50); // Limitar a 50 notificações
    localStorage.setItem('andcont_notifications', JSON.stringify(updatedNotifications));
    
    // Update last checked timestamp
    setLastCheckedTimestamp(now);
    localStorage.setItem('andcont_last_checked', now);
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.read).length);
  };

  return (
    <div className="notification-container">
      <Bell 
        className={`notification-icon ${unreadCount > 0 ? 'animate-pulse text-[#D946EF]' : 'text-white/80'}`} 
        size={20} 
      />
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
      )}
    </div>
  );
};

export default Notifications;
