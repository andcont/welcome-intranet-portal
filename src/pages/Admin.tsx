
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/admin/UsersList";
import ActivityLog from "@/components/admin/ActivityLog";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Users, Clock, Home } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { selectedGradient } = useTheme();

  useEffect(() => {
    // Verificar se o usuário é admin
    const user = localStorage.getItem("andcont_user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const parsedUser = JSON.parse(user);
    setCurrentUser(parsedUser);
    
    if (parsedUser.role !== 'admin') {
      toast.error("Acesso não autorizado");
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("andcont_user");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const goToIntranet = () => {
    navigate("/");
  };

  const handleCreateContent = () => {
    navigate("/");
    // Use localStorage to set the active tab and open the content form when the page loads
    localStorage.setItem("andcont_open_content_form", "true");
  };

  if (!currentUser) {
    return (
      <div className="site-background h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="site-background min-h-screen w-full">
      <div className="intranet-container max-w-6xl mx-auto">
        <div className="intranet-header py-4 w-full mb-6">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/705b7447-780b-42c6-9d66-f39cc7a86438.png" 
                  alt="AndCont Logo" 
                  className="h-12 mr-4" 
                />
                <h1 className="text-3xl font-bold text-gradient">Painel Administrativo</h1>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={goToIntranet}
                  variant="outline" 
                  className="bg-black/30 hover:bg-black/40 text-white border-[#7B68EE]/30"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Voltar para Intranet
                </Button>
                <Button 
                  onClick={handleCreateContent} 
                  variant="default" 
                  className="button-gradient text-white hover:opacity-90"
                >
                  <Plus className="mr-2 h-4 w-4" /> Novo Conteúdo
                </Button>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="bg-black/30 hover:bg-black/40 text-white border-[#7B68EE]/30"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Usuários Ativos</CardTitle>
              <CardDescription className="text-white/70">Total de usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center text-white">
                <Users className="mr-3 h-8 w-8 text-[#7B68EE]" />
                {(JSON.parse(localStorage.getItem('andcont_users') || '[]')).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Publicações</CardTitle>
              <CardDescription className="text-white/70">Total de conteúdos publicados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center text-white">
                <Plus className="mr-3 h-8 w-8 text-[#D946EF]" />
                {(
                  JSON.parse(localStorage.getItem('andcont_announcements') || '[]').length +
                  JSON.parse(localStorage.getItem('andcont_links') || '[]').length +
                  JSON.parse(localStorage.getItem('andcont_events') || '[]').length
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Atividades</CardTitle>
              <CardDescription className="text-white/70">Logs de atividades recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center text-white">
                <Clock className="mr-3 h-8 w-8 text-[#9B5DE5]" />
                {(JSON.parse(localStorage.getItem('andcont_activities') || '[]')).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="tabs-container w-full mb-6">
              <TabsTrigger value="users" className="tab-trigger flex-1">Usuários</TabsTrigger>
              <TabsTrigger value="activities" className="tab-trigger flex-1">Atividades</TabsTrigger>
            </TabsList>
            <TabsContent value="users">
              <UsersList />
            </TabsContent>
            <TabsContent value="activities">
              <ActivityLog />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
