
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Activity {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: 'login' | 'register';
  timestamp: string;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Buscar atividades do localStorage
    const storedActivities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
    // Ordenar por timestamp (mais recente primeiro)
    storedActivities.sort((a: Activity, b: Activity) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setActivities(storedActivities);
  }, []);

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'login':
        return 'Login';
      case 'register':
        return 'Cadastro';
      default:
        return type;
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Registro de Atividades</h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8 text-white">
          <p>Nenhuma atividade registrada.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/30">
              <TableRow>
                <TableHead className="text-white">Usuário</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Tipo</TableHead>
                <TableHead className="text-white">Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{activity.userName}</TableCell>
                  <TableCell className="text-white">{activity.userEmail}</TableCell>
                  <TableCell className="text-white">
                    <span className={`px-2 py-1 rounded text-xs ${
                      activity.type === 'login' ? 'bg-andcont-blue/30' : 'bg-andcont-green/30'
                    }`}>
                      {getActivityTypeLabel(activity.type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-white">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true, locale: ptBR })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
