
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Link as LinkIcon, Bell, Plus, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import AnnouncementsList from "@/components/intranet/AnnouncementsList";
import LinksList from "@/components/intranet/LinksList";
import CalendarView from "@/components/intranet/CalendarView";
import AdminPostForm from "@/components/intranet/AdminPostForm";
import FeedList from "@/components/intranet/FeedList";
import PostDetail from "@/components/intranet/PostDetail";
import UserPostForm from "@/components/intranet/UserPostForm";
import IntranetHeader from "@/components/intranet/IntranetHeader";

const Intranet = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [showUserPostForm, setShowUserPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState("announcements");
  const [selectedPost, setSelectedPost] = useState<{ id: string; type: 'announcement' | 'link' | 'event' | 'feed' } | null>(null);

  useEffect(() => {
    // Verificar usuário
    const userStr = localStorage.getItem("andcont_user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      
      // Check if we should open the content form from Admin page redirection
      const shouldOpenForm = localStorage.getItem("andcont_open_content_form");
      if (shouldOpenForm === "true" && user.role === 'admin') {
        setShowPostForm(true);
        localStorage.removeItem("andcont_open_content_form");
      }
      
      // Registrar atividade de acesso à intranet
      const activities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
      activities.push({
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        type: 'intranet_access',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('andcont_activities', JSON.stringify(activities));
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("andcont_user");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
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

  const getTabClasses = (tabValue: string) => {
    const isActive = activeTab === tabValue;
    return `tab-trigger ${isActive ? 'tab-trigger-active' : ''} flex items-center px-4 py-2.5`;
  };

  return (
    <div className="site-background bg-gradient-to-br from-[#050A18] via-[#0A1128] to-[#0F172A] min-h-screen">
      <IntranetHeader currentUser={currentUser} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6">
        <div className="glass-card p-6 animate-fade-in">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gradient">Portal AndCont</h2>
            
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {activeTab === 'feed' && (
                <Button 
                  onClick={handleAddUserPost}
                  className="btn-primary"
                >
                  <Plus size={16} className="mr-2" /> Nova Publicação
                </Button>
              )}
              
              {currentUser.role === 'admin' && activeTab !== 'feed' && (
                <Button 
                  onClick={handleAddContent}
                  className="btn-primary"
                >
                  <Plus size={16} className="mr-2" /> Adicionar
                </Button>
              )}
            </div>
          </div>

          {(showPostForm && currentUser.role === 'admin') ? (
            <AdminPostForm onClose={handleCloseForm} activeCategory={activeTab} />
          ) : showUserPostForm ? (
            <UserPostForm onClose={handleCloseForm} />
          ) : selectedPost ? (
            <PostDetail 
              postId={selectedPost.id} 
              postType={selectedPost.type} 
              onClose={handleClosePostDetail} 
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="tabs-container w-full mb-6">
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
              </TabsList>
              
              <TabsContent value="announcements" className={`tab-announcements p-6 fade-in`}>
                <AnnouncementsList 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'announcement')}
                />
              </TabsContent>
              
              <TabsContent value="links" className={`tab-links p-6 fade-in`}>
                <LinksList 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'link')}
                />
              </TabsContent>
              
              <TabsContent value="calendar" className={`tab-calendar p-6 fade-in`}>
                <CalendarView 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'event')}
                />
              </TabsContent>
              
              <TabsContent value="feed" className={`tab-feed p-6 fade-in`}>
                <FeedList 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'feed')}
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Intranet;
