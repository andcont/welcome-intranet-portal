
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Link as LinkIcon, Bell, Plus, MessageSquare, Cake } from "lucide-react";
import { toast } from "sonner";
import AnnouncementsList from "@/components/intranet/AnnouncementsList";
import LinksList from "@/components/intranet/LinksList";
import CalendarView from "@/components/intranet/CalendarView";
import AdminPostForm from "@/components/intranet/AdminPostForm";
import FeedList from "@/components/intranet/FeedList";
import PostDetail from "@/components/intranet/PostDetail";
import UserPostForm from "@/components/intranet/UserPostForm";
import IntranetLayout from "@/components/intranet/IntranetLayout";
import ModernDashboard from "@/components/intranet/ModernDashboard";
import UserProfile from "@/components/intranet/UserProfile";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/hooks/useAuth";
import BirthdayList from "@/components/intranet/BirthdayList";

const Intranet = () => {
  const navigate = useNavigate();
  const { user, profile, loading, signOut, isAuthenticated, isAdmin } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [showUserPostForm, setShowUserPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPost, setSelectedPost] = useState<{ id: string; type: 'announcement' | 'link' | 'event' | 'feed' } | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { selectedGradient } = useTheme();

  useEffect(() => {
    console.log('Intranet - Auth state:', { loading, isAuthenticated, profile });
    
    if (loading) {
      console.log('Still loading auth...');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to auth');
      navigate("/auth");
      return;
    }
    
    console.log('User is authenticated, showing intranet');
  }, [isAuthenticated, loading, navigate]);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/auth");
  };

  const handleAddContent = () => {
    setShowPostForm(true);
  };

  const handleAddUserPost = () => {
    setShowUserPostForm(true);
  };

  const handleCloseForm = () => {
    setShowPostForm(false);
    setShowUserPostForm(false);
  };

  const handleSelectPost = (id: string, type: 'announcement' | 'link' | 'event' | 'feed') => {
    setSelectedPost({ id, type });
  };

  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowPostForm(false);
    setShowUserPostForm(false);
    setSelectedPost(null);
    setSelectedUser(null);
  };

  const handleUserClick = (userId: string) => {
    setSelectedUser(userId);
    setSelectedPost(null);
    setShowPostForm(false);
    setShowUserPostForm(false);
  };

  const handleCloseProfile = () => {
    setSelectedUser(null);
  };

  const getTabClasses = (tabValue: string) => {
    const isActive = activeTab === tabValue;
    return `tab-trigger ${isActive ? 'tab-trigger-active' : ''} flex items-center px-4 py-2.5`;
  };

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Carregando intranet...</h1>
          <p className="text-sm text-white/70">Autenticando usuário...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, should redirect');
    return null; // Will redirect in useEffect
  }

  // Create a basic current user object even if profile is null
  const currentUser = {
    name: profile?.name || user?.email || 'Usuário',
    role: profile?.role || 'user',
    id: profile?.id || user?.id || '',
    email: profile?.email || user?.email || ''
  };

  console.log('Rendering intranet with currentUser:', currentUser);

  return (
    <IntranetLayout 
      currentUser={currentUser} 
      onLogout={handleLogout}
      activeSection={activeTab}
      onTabChange={handleTabChange}
      onUserClick={handleUserClick}
    >
      {(showPostForm && currentUser?.role === 'admin') ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <AdminPostForm onClose={handleCloseForm} activeCategory={activeTab} />
        </div>
      ) : showUserPostForm ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <UserPostForm onClose={handleCloseForm} />
        </div>
      ) : selectedPost ? (
        <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <PostDetail 
            postId={selectedPost.id} 
            postType={selectedPost.type} 
            onClose={handleClosePostDetail} 
          />
        </div>
      ) : selectedUser ? (
        <UserProfile 
          userId={selectedUser} 
          onClose={handleCloseProfile} 
        />
      ) : (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-black/40 backdrop-blur-xl border border-white/20 p-1 rounded-full mb-6">
            <TabsTrigger value="dashboard" className={getTabClasses('dashboard')}>
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="announcements" className={getTabClasses('announcements')}>
              <Bell className="mr-2 h-4 w-4" /> Comunicados
            </TabsTrigger>
            <TabsTrigger value="links" className={getTabClasses('links')}>
              <LinkIcon className="mr-2 h-4 w-4" /> Links Úteis
            </TabsTrigger>
            <TabsTrigger value="calendar" className={getTabClasses('calendar')}>
              <Calendar className="mr-2 h-4 w-4" /> Calendário
            </TabsTrigger>
            <TabsTrigger value="feed" className={getTabClasses('feed')}>
              <MessageSquare className="mr-2 h-4 w-4" /> Feed
            </TabsTrigger>
            <TabsTrigger value="birthdays" className={getTabClasses('birthdays')}>
              <Cake className="mr-2 h-4 w-4" /> Aniversariantes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="fade-in">
            <ModernDashboard 
              currentUser={currentUser}
              onTabChange={handleTabChange}
              onAddContent={handleAddContent}
              onAddUserPost={handleAddUserPost}
              onUserClick={handleUserClick}
            />
          </TabsContent>
          
          <TabsContent value="announcements" className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Comunicados</h2>
              {currentUser?.role === 'admin' && (
                <Button onClick={handleAddContent} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus size={16} className="mr-2" /> Adicionar
                </Button>
              )}
            </div>
            <AnnouncementsList 
              isAdmin={currentUser?.role === 'admin'} 
              onSelectPost={(id) => handleSelectPost(id, 'announcement')}
            />
          </TabsContent>
          
          <TabsContent value="links" className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Links Úteis</h2>
              {currentUser?.role === 'admin' && (
                <Button onClick={handleAddContent} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus size={16} className="mr-2" /> Adicionar
                </Button>
              )}
            </div>
            <LinksList 
              isAdmin={currentUser?.role === 'admin'} 
              onSelectPost={(id) => handleSelectPost(id, 'link')}
            />
          </TabsContent>
          
          <TabsContent value="calendar" className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Calendário</h2>
              {currentUser?.role === 'admin' && (
                <Button onClick={handleAddContent} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus size={16} className="mr-2" /> Adicionar
                </Button>
              )}
            </div>
            <CalendarView 
              isAdmin={currentUser?.role === 'admin'} 
              onSelectPost={(id) => handleSelectPost(id, 'event')}
            />
          </TabsContent>
          
          <TabsContent value="feed" className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Feed</h2>
              <Button onClick={handleAddUserPost} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Plus size={16} className="mr-2" /> Nova Publicação
              </Button>
            </div>
            <FeedList 
              isAdmin={currentUser?.role === 'admin'} 
              onSelectPost={(id) => handleSelectPost(id, 'feed')}
            />
          </TabsContent>
          
          <TabsContent value="birthdays" className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Aniversariantes</h2>
            </div>
            <BirthdayList />
          </TabsContent>
        </Tabs>
      )}
    </IntranetLayout>
  );
};

export default Intranet;
