
import { useState, useEffect } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ModernDashboardProps {
  currentUser: {
    name: string;
    role: string;
  };
  onTabChange: (tab: string) => void;
  onAddContent: () => void;
  onAddUserPost: () => void;
}

interface Activity {
  id: string;
  type: 'announcement' | 'feed' | 'event' | 'link';
  title: string;
  created_at: string;
  author_name: string;
}

interface Stats {
  announcements: number;
  links: number;
  events: number;
  feedPosts: number;
}

const ModernDashboard = ({ currentUser, onTabChange, onAddContent, onAddUserPost }: ModernDashboardProps) => {
  const [stats, setStats] = useState<Stats>({
    announcements: 0,
    links: 0,
    events: 0,
    feedPosts: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    try {
      const [announcementsRes, linksRes, eventsRes, feedRes] = await Promise.all([
        supabase.from('announcements').select('id', { count: 'exact', head: true }),
        supabase.from('useful_links').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('feed_posts').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        announcements: announcementsRes.count || 0,
        links: linksRes.count || 0,
        events: eventsRes.count || 0,
        feedPosts: feedRes.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadRecentActivities = async () => {
    try {
      // Carregar atividades de diferentes tabelas
      const [announcementsRes, feedRes, eventsRes, linksRes] = await Promise.all([
        supabase
          .from('announcements')
          .select('id, title, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('feed_posts')
          .select('id, title, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('events')
          .select('id, title, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('useful_links')
          .select('id, title, created_at, created_by')
          .order('created_at', { ascending: false })
          .limit(3)
      ]);

      // Carregar perfis dos autores
      const allAuthorIds = [
        ...(announcementsRes.data || []).map(a => a.created_by),
        ...(feedRes.data || []).map(f => f.created_by),
        ...(eventsRes.data || []).map(e => e.created_by),
        ...(linksRes.data || []).map(l => l.created_by)
      ];

      const uniqueAuthorIds = [...new Set(allAuthorIds)];
      
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', uniqueAuthorIds);

      const profilesMap = new Map(profilesData?.map(p => [p.id, p.name]) || []);

      // Combinar todas as atividades
      const activities: Activity[] = [
        ...(announcementsRes.data || []).map(a => ({
          id: a.id,
          type: 'announcement' as const,
          title: a.title,
          created_at: a.created_at,
          author_name: profilesMap.get(a.created_by) || 'Usuário'
        })),
        ...(feedRes.data || []).map(f => ({
          id: f.id,
          type: 'feed' as const,
          title: f.title,
          created_at: f.created_at,
          author_name: profilesMap.get(f.created_by) || 'Usuário'
        })),
        ...(eventsRes.data || []).map(e => ({
          id: e.id,
          type: 'event' as const,
          title: e.title,
          created_at: e.created_at,
          author_name: profilesMap.get(e.created_by) || 'Usuário'
        })),
        ...(linksRes.data || []).map(l => ({
          id: l.id,
          type: 'link' as const,
          title: l.title,
          created_at: l.created_at,
          author_name: profilesMap.get(l.created_by) || 'Usuário'
        }))
      ];

      // Ordenar por data de criação (mais recente primeiro) e pegar apenas os 6 mais recentes
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setRecentActivities(activities.slice(0, 6));
    } catch (error) {
      console.error('Error loading recent activities:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadStats(), loadRecentActivities()]);
      setLoading(false);
    };

    loadData();

    // Recarregar dados a cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'announcement':
        return 'Comunicado publicado';
      case 'feed':
        return 'Post no feed';
      case 'event':
        return 'Evento adicionado';
      case 'link':
        return 'Link adicionado';
      default:
        return 'Atividade';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return Bell;
      case 'feed':
        return MessageSquare;
      case 'event':
        return Calendar;
      case 'link':
        return FileText;
      default:
        return Activity;
    }
  };

  const statsData = [
    {
      title: "Comunicados Ativos",
      value: stats.announcements.toString(),
      change: "Total",
      icon: Bell,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Links Úteis",
      value: stats.links.toString(),
      change: "Disponíveis",
      icon: FileText,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Eventos",
      value: stats.events.toString(),
      change: "Programados",
      icon: Calendar,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Posts no Feed",
      value: stats.feedPosts.toString(),
      change: "Publicados",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
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
        {statsData.map((stat, index) => (
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
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>Nenhuma atividade recente encontrada.</p>
              </div>
            ) : (
              recentActivities.map((activity) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-4 h-4 text-purple-400" />
                      <div>
                        <span className="text-white font-medium">{getActivityTypeLabel(activity.type)}</span>
                        <p className="text-gray-300 text-sm">"{activity.title}" por {activity.author_name}</p>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">
                      {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDashboard;
