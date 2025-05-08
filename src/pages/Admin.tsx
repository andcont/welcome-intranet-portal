
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/admin/UsersList";
import ActivityLog from "@/components/admin/ActivityLog";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Admin = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

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
      <div className="h-screen flex items-center justify-center bg-gradient-andcont">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-andcont p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/705b7447-780b-42c6-9d66-f39cc7a86438.png" 
              alt="AndCont Logo" 
              className="h-12 mr-4" 
            />
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={goToIntranet}
              variant="outline" 
              className="bg-white/15 hover:bg-white/25 text-white border-white/30"
            >
              Voltar para Intranet
            </Button>
            <Button 
              onClick={handleCreateContent} 
              variant="default" 
              className="btn-primary"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Conteúdo
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="bg-white/15 hover:bg-white/25 text-white border-white/30"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="glass-card text-white">
            <CardHeader className="pb-2">
              <CardTitle>Usuários Ativos</CardTitle>
              <CardDescription className="text-white/70">Total de usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <Users className="mr-3 h-8 w-8 text-andcont-blue" />
                {(JSON.parse(localStorage.getItem('andcont_users') || '[]')).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-white">
            <CardHeader className="pb-2">
              <CardTitle>Publicações</CardTitle>
              <CardDescription className="text-white/70">Total de conteúdos publicados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <Plus className="mr-3 h-8 w-8 text-andcont-green" />
                {(
                  JSON.parse(localStorage.getItem('andcont_announcements') || '[]').length +
                  JSON.parse(localStorage.getItem('andcont_links') || '[]').length +
                  JSON.parse(localStorage.getItem('andcont_events') || '[]').length
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card text-white">
            <CardHeader className="pb-2">
              <CardTitle>Atividades</CardTitle>
              <CardDescription className="text-white/70">Logs de atividades recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <Clock className="mr-3 h-8 w-8 text-andcont-orange" />
                {(JSON.parse(localStorage.getItem('andcont_activities') || '[]')).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="glass-card p-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full mb-6 bg-white/20 backdrop-blur-md">
              <TabsTrigger value="users" className="text-white flex-1 data-[state=active]:bg-white/30">Usuários</TabsTrigger>
              <TabsTrigger value="activities" className="text-white flex-1 data-[state=active]:bg-white/30">Atividades</TabsTrigger>
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
