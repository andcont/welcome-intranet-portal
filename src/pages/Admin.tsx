
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UsersList from "@/components/admin/UsersList";
import ActivityLog from "@/components/admin/ActivityLog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

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
              src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
              alt="AndCont Logo" 
              className="h-12 mr-4" 
            />
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          </div>
          <div className="flex items-center">
            <span className="mr-4 text-white">Olá, {currentUser.name}</span>
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/30"
            >
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </Button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-xl border border-white/20 p-6">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full mb-6 bg-black/20">
              <TabsTrigger value="users" className="text-white flex-1">Usuários</TabsTrigger>
              <TabsTrigger value="activities" className="text-white flex-1">Atividades</TabsTrigger>
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
