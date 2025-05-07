
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Calendar, Link as LinkIcon, Bell, Plus, LayoutDashboard, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import IntranetHeader from "@/components/intranet/IntranetHeader";
import AnnouncementsList from "@/components/intranet/AnnouncementsList";
import LinksList from "@/components/intranet/LinksList";
import CalendarView from "@/components/intranet/CalendarView";
import AdminPostForm from "@/components/intranet/AdminPostForm";
import FeedList from "@/components/intranet/FeedList";
import PostDetail from "@/components/intranet/PostDetail";

const Intranet = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPostForm, setShowPostForm] = useState(false);
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

  const handleCloseForm = () => {
    setShowPostForm(false);
  };

  const goToAdmin = () => {
    navigate("/admin");
  };

  const handleSelectPost = (id: string, type: 'announcement' | 'link' | 'event' | 'feed') => {
    setSelectedPost({ id, type });
  };

  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-andcont">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-andcont">
      <IntranetHeader currentUser={currentUser} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white/25 backdrop-blur-xl rounded-lg shadow-xl border border-white/30 p-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Portal AndCont</h2>
            
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {currentUser.role === 'admin' && (
                <>
                  <Button 
                    onClick={goToAdmin}
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <LayoutDashboard size={16} className="mr-2" /> Admin
                  </Button>
                  <Button 
                    onClick={handleAddContent}
                    className="bg-gradient-to-r from-andcont-blue to-andcont-purple hover:opacity-90"
                  >
                    <Plus size={16} className="mr-2" /> Adicionar
                  </Button>
                </>
              )}
            </div>
          </div>

          {showPostForm && currentUser.role === 'admin' ? (
            <AdminPostForm onClose={handleCloseForm} activeCategory={activeTab} />
          ) : selectedPost ? (
            <PostDetail 
              postId={selectedPost.id} 
              postType={selectedPost.type} 
              onClose={handleClosePostDetail} 
            />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 bg-black/15">
                <TabsTrigger value="announcements" className="text-white flex-1">
                  <Bell className="mr-2 h-4 w-4" /> Comunicados
                </TabsTrigger>
                <TabsTrigger value="links" className="text-white flex-1">
                  <LinkIcon className="mr-2 h-4 w-4" /> Links Úteis
                </TabsTrigger>
                <TabsTrigger value="calendar" className="text-white flex-1">
                  <Calendar className="mr-2 h-4 w-4" /> Calendário
                </TabsTrigger>
                <TabsTrigger value="feed" className="text-white flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" /> Feed
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="announcements">
                <AnnouncementsList 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'announcement')}
                />
              </TabsContent>
              
              <TabsContent value="links">
                <LinksList 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'link')}
                />
              </TabsContent>
              
              <TabsContent value="calendar">
                <CalendarView 
                  isAdmin={currentUser.role === 'admin'} 
                  onSelectPost={(id) => handleSelectPost(id, 'event')}
                />
              </TabsContent>
              
              <TabsContent value="feed">
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
