
import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Buscar usuários do localStorage
    const storedUsers = JSON.parse(localStorage.getItem('andcont_users') || '[]');
    setUsers(storedUsers);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-white">Usuários Cadastrados</h2>
      
      {users.length === 0 ? (
        <div className="text-center py-8 text-white">
          <p>Nenhum usuário cadastrado.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-black/30">
              <TableRow>
                <TableHead className="text-white">Nome</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Função</TableHead>
                <TableHead className="text-white">Data de Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="text-white font-medium">{user.name}</TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell className="text-white">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</TableCell>
                  <TableCell className="text-white">
                    {user.createdAt 
                      ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true, locale: ptBR }) 
                      : 'N/A'}
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

export default UsersList;
