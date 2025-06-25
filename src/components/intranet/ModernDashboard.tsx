
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Calendar,
  Bell,
  MessageSquare,
  Plus,
  ArrowRight,
  Activity
} from "lucide-react";

interface ModernDashboardProps {
  currentUser: {
    name: string;
    role: string;
  };
  onTabChange: (tab: string) => void;
  onAddContent: () => void;
  onAddUserPost: () => void;
}

const ModernDashboard = ({ currentUser, onTabChange, onAddContent, onAddUserPost }: ModernDashboardProps) => {
  const stats = [
    {
      title: "Comunicados Ativos",
      value: "12",
      change: "+2 esta semana",
      icon: Bell,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Links Úteis",
      value: "8",
      change: "+1 novo",
      icon: FileText,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Eventos",
      value: "5",
      change: "Este mês",
      icon: Calendar,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Posts no Feed",
      value: "24",
      change: "+6 hoje",
      icon: MessageSquare,
      color: "from-orange-500 to-red-500"
    }
  ];

  const quickActions = [
    {
      title: "Nova Publicação",
      description: "Compartilhe uma atualização no feed",
      icon: MessageSquare,
      action: onAddUserPost,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Ver Comunicados",
      description: "Últimas notícias e anúncios",
      icon: Bell,
      action: () => onTabChange("announcements"),
      color: "from-green-500 to-blue-500"
    },
    {
      title: "Calendário",
      description: "Próximos eventos e reuniões",
      icon: Calendar,
      action: () => onTabChange("calendar"),
      color: "from-purple-500 to-pink-500"
    }
  ];

  if (currentUser.role === 'admin') {
    quickActions.unshift({
      title: "Adicionar Conteúdo",
      description: "Criar comunicado, link ou evento",
      icon: Plus,
      action: onAddContent,
      color: "from-indigo-500 to-purple-500"
    });
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Bem-vindo, {currentUser.name}! 👋
            </h1>
            <p className="text-gray-300">
              Aqui está um resumo das atividades da AndCont hoje.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
              <Activity className="h-12 w-12 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                  <p className="text-green-400 text-sm mt-1">{stat.change}</p>
                </div>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="bg-black/40 backdrop-blur-xl border-white/20 hover:border-white/30 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer group"
              onClick={action.action}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`bg-gradient-to-r ${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Novo comunicado publicado", time: "2 horas atrás", type: "announcement" },
              { action: "Evento adicionado ao calendário", time: "4 horas atrás", type: "event" },
              { action: "Link útil atualizado", time: "1 dia atrás", type: "link" },
              { action: "Nova publicação no feed", time: "2 dias atrás", type: "post" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-white">{activity.action}</span>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDashboard;
