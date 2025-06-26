
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Users, Activity, Settings, UserCog } from "lucide-react";
import { toast } from "sonner";
import ActivityLog from "@/components/admin/ActivityLog";
import UsersList from "@/components/admin/UsersList";
import UserManagement from "@/components/admin/UserManagement";
import TeamList from "@/components/admin/TeamList";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";

const Admin = () => {
  const navigate = useNavigate();
  const { profile, loading, isAuthenticated, isAdmin } = useAuth();
  const { selectedGradient } = useTheme();
  const [activeTab, setActiveTab] = useState("users");

  // Redirect if not authenticated or not admin
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center text-white">
          <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold mb-2">Carregando...</h1>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    toast.error("Acesso negado. Apenas administradores podem acessar esta área.");
    navigate("/intranet");
    return null;
  }

  return (
    <div className={`min-h-screen ${selectedGradient.value} w-full`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/intranet")}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar à Intranet
            </Button>
            <h1 className="text-3xl font-bold text-white">Painel Administrativo</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-black/40 backdrop-blur-xl border border-white/20 p-1 rounded-full mb-6">
            <TabsTrigger value="users" className="flex items-center px-4 py-2.5 text-white data-[state=active]:bg-white/20">
              <UserCog className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center px-4 py-2.5 text-white data-[state=active]:bg-white/20">
              <Users className="mr-2 h-4 w-4" />
              Equipe
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center px-4 py-2.5 text-white data-[state=active]:bg-white/20">
              <Activity className="mr-2 h-4 w-4" />
              Atividades
            </TabsTrigger>
            <TabsTrigger value="legacy" className="flex items-center px-4 py-2.5 text-white data-[state=active]:bg-white/20">
              <Settings className="mr-2 h-4 w-4" />
              Lista Legada
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="team">
            <TeamList />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLog />
          </TabsContent>

          <TabsContent value="legacy">
            <UsersList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
