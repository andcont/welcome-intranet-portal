
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Calendar, Link as LinkIcon, Bell, Plus, LayoutDashboard, MessageSquare, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import IntranetHeader from "@/components/intranet/IntranetHeader";
import AnnouncementsList from "@/components/intranet/AnnouncementsList";
import LinksList from "@/components/intranet/LinksList";
import CalendarView from "@/components/intranet/CalendarView";
import AdminPostForm from "@/components/intranet/AdminPostForm";
import FeedList from "@/components/intranet/FeedList";
import PostDetail from "@/components/intranet/PostDetail";
import UserPostForm from "@/components/intranet/UserPostForm";

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

  const goToAdmin = () => {
    navigate("/admin");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const handleSelectPost = (id: string, type: 'announcement' | 'link' | 'event' | 'feed') => {
    setSelectedPost({ id, type });
  };

  const handleClosePostDetail = () => {
    setSelectedPost(null);
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-andcont-blue to-andcont-purple">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-andcont-blue to-andcont-purple">
      <header className="border-b border-white/20 bg-white/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
                alt="AndCont Logo" 
                className="h-10 mr-4" 
              />
              <h1 className="text-2xl font-bold text-white hidden sm:block">Intranet AndCont</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div onClick={goToProfile} className="flex items-center mr-2 cursor-pointer hover:bg-white/10 rounded-full py-1 px-3 transition-colors">
                <Avatar className="h-8 w-8 mr-2 border border-white/30">
                  {currentUser.profilePic ? (
                    <AvatarImage src={currentUser.profilePic} alt={currentUser.name} />
                  ) : (
                    <AvatarFallback className="bg-andcont-purple/50 text-white">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-white font-medium text-sm leading-tight">{currentUser.name}</div>
                  <div className="text-white/70 text-xs leading-tight">
                    {currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </div>
                </div>
              </div>
              
              {currentUser.role === 'admin' && (
                <Button 
                  onClick={goToAdmin}
                  variant="outline"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <LayoutDashboard size={16} className="mr-2" /> Admin
                </Button>
              )}
              
              <Button 
                onClick={handleLogout} 
                variant="outline" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <LogOut className="mr-2 h-4 w-4" /> 
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="bg-white/40 backdrop-blur-xl rounded-lg shadow-xl border border-white/30 p-6">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Portal AndCont</h2>
            
            <div className="flex space-x-2 mt-2 sm:mt-0">
              {activeTab === 'feed' && (
                <Button 
                  onClick={handleAddUserPost}
                  className="bg-gradient-to-r from-andcont-blue to-andcont-purple hover:opacity-90 text-white"
                >
                  <Plus size={16} className="mr-2" /> Nova Publicação
                </Button>
              )}
              
              {currentUser.role === 'admin' && activeTab !== 'feed' && (
                <Button 
                  onClick={handleAddContent}
                  className="bg-gradient-to-r from-andcont-blue to-andcont-purple hover:opacity-90 text-white"
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
              <TabsList className="w-full mb-6 bg-black/10 rounded-full">
                <TabsTrigger value="announcements" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-full flex-1">
                  <Bell className="mr-2 h-4 w-4" /> Comunicados
                </TabsTrigger>
                <TabsTrigger value="links" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-full flex-1">
                  <LinkIcon className="mr-2 h-4 w-4" /> Links Úteis
                </TabsTrigger>
                <TabsTrigger value="calendar" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-full flex-1">
                  <Calendar className="mr-2 h-4 w-4" /> Calendário
                </TabsTrigger>
                <TabsTrigger value="feed" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-gray-800 data-[state=active]:shadow-sm rounded-full flex-1">
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
