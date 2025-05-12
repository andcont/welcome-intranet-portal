
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/admin/UsersList";
import ActivityLog from "@/components/admin/ActivityLog";
import { Button } from "@/components/ui/button";
import { LogOut, Plus, Users, Clock, Home } from "lucide-react";
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
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/705b7447-780b-42c6-9d66-f39cc7a86438.png" 
              alt="AndCont Logo" 
              className="h-12 mr-4" 
            />
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={goToIntranet}
              variant="outline" 
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-700 border-blue-200/50"
            >
              <Home className="mr-2 h-4 w-4" />
              Voltar para Intranet
            </Button>
            <Button 
              onClick={handleCreateContent} 
              variant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white border border-blue-400 shadow-sm"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Conteúdo
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="bg-white/50 hover:bg-white/60 text-gray-700 border-gray-200/50"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-gradient-to-br from-blue-100/80 to-indigo-100/80 backdrop-blur-xl border border-white/50 text-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Usuários Ativos</CardTitle>
              <CardDescription className="text-gray-600">Total de usuários cadastrados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <Users className="mr-3 h-8 w-8 text-blue-500" />
                {(JSON.parse(localStorage.getItem('andcont_users') || '[]')).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-indigo-100/80 to-purple-100/80 backdrop-blur-xl border border-white/50 text-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Publicações</CardTitle>
              <CardDescription className="text-gray-600">Total de conteúdos publicados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <Plus className="mr-3 h-8 w-8 text-indigo-500" />
                {(
                  JSON.parse(localStorage.getItem('andcont_announcements') || '[]').length +
                  JSON.parse(localStorage.getItem('andcont_links') || '[]').length +
                  JSON.parse(localStorage.getItem('andcont_events') || '[]').length
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-100/80 to-blue-100/80 backdrop-blur-xl border border-white/50 text-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-800">Atividades</CardTitle>
              <CardDescription className="text-gray-600">Logs de atividades recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold flex items-center">
                <Clock className="mr-3 h-8 w-8 text-purple-500" />
                {(JSON.parse(localStorage.getItem('andcont_activities') || '[]')).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="backdrop-blur-xl bg-white/70 border border-white/50 rounded-lg p-6 shadow-lg">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full mb-6 bg-white/60 backdrop-blur-md rounded-full">
              <TabsTrigger value="users" className="text-gray-700 flex-1 data-[state=active]:bg-blue-100/70">Usuários</TabsTrigger>
              <TabsTrigger value="activities" className="text-gray-700 flex-1 data-[state=active]:bg-blue-100/70">Atividades</TabsTrigger>
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
