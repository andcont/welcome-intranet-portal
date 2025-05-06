
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LogOut, Calendar, Link as LinkIcon, Bell, Plus } from "lucide-react";
import { toast } from "sonner";
import IntranetHeader from "@/components/intranet/IntranetHeader";
import AnnouncementsList from "@/components/intranet/AnnouncementsList";
import LinksList from "@/components/intranet/LinksList";
import CalendarView from "@/components/intranet/CalendarView";
import AdminPostForm from "@/components/intranet/AdminPostForm";

const Intranet = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [activeTab, setActiveTab] = useState("announcements");

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
        <div className="bg-black/30 backdrop-blur-xl rounded-lg shadow-xl border border-white/20 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Portal AndCont</h2>
            {currentUser.role === 'admin' && (
              <Button 
                onClick={handleAddContent}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <Plus size={16} className="mr-2" /> Adicionar conteúdo
              </Button>
            )}
          </div>

          {showPostForm && currentUser.role === 'admin' ? (
            <AdminPostForm onClose={handleCloseForm} activeCategory={activeTab} />
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-6 bg-black/40">
                <TabsTrigger value="announcements" className="text-white flex-1">
                  <Bell className="mr-2 h-4 w-4" /> Comunicados
                </TabsTrigger>
                <TabsTrigger value="links" className="text-white flex-1">
                  <LinkIcon className="mr-2 h-4 w-4" /> Links Úteis
                </TabsTrigger>
                <TabsTrigger value="calendar" className="text-white flex-1">
                  <Calendar className="mr-2 h-4 w-4" /> Calendário
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="announcements">
                <AnnouncementsList isAdmin={currentUser.role === 'admin'} />
              </TabsContent>
              
              <TabsContent value="links">
                <LinksList isAdmin={currentUser.role === 'admin'} />
              </TabsContent>
              
              <TabsContent value="calendar">
                <CalendarView isAdmin={currentUser.role === 'admin'} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
};

export default Intranet;
