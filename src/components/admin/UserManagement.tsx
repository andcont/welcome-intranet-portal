
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Users, Edit, Trash2, UserPlus } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  department_id?: string;
  profile_image?: string;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

const UserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadProfiles();
    loadDepartments();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading profiles:', error);
        toast.error('Erro ao carregar usuários');
        return;
      }

      setProfiles(data || []);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error loading departments:', error);
        return;
      }

      setDepartments(data || []);
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editingUser.name,
          role: editingUser.role,
          department_id: editingUser.department_id
        })
        .eq('id', editingUser.id);

      if (error) {
        console.error('Error updating user:', error);
        toast.error('Erro ao atualizar usuário');
        return;
      }

      toast.success('Usuário atualizado com sucesso!');
      setIsDialogOpen(false);
      setEditingUser(null);
      loadProfiles();
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error('Error deleting user:', error);
        toast.error('Erro ao excluir usuário');
        return;
      }

      toast.success('Usuário excluído com sucesso!');
      loadProfiles();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return 'Não definido';
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Não definido';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Gerenciamento de Usuários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-white">Nome</TableHead>
                  <TableHead className="text-white">E-mail</TableHead>
                  <TableHead className="text-white">Função</TableHead>
                  <TableHead className="text-white">Departamento</TableHead>
                  <TableHead className="text-white">Data de Cadastro</TableHead>
                  <TableHead className="text-white">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id} className="border-white/10 hover:bg-white/5">
                    <TableCell className="text-white font-medium">{profile.name}</TableCell>
                    <TableCell className="text-white">{profile.email}</TableCell>
                    <TableCell className="text-white">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        profile.role === 'admin' 
                          ? 'bg-purple-500/20 text-purple-300' 
                          : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {profile.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </TableCell>
                    <TableCell className="text-white">{getDepartmentName(profile.department_id)}</TableCell>
                    <TableCell className="text-white">{formatDate(profile.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog open={isDialogOpen && editingUser?.id === profile.id} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingUser(profile)}
                              className="text-white/70 hover:text-white hover:bg-white/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-black/90 border border-white/20">
                            <DialogHeader>
                              <DialogTitle className="text-white">Editar Usuário</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                              <div>
                                <Label htmlFor="name" className="text-white">Nome</Label>
                                <Input
                                  id="name"
                                  value={editingUser?.name || ''}
                                  onChange={(e) => setEditingUser(prev => 
                                    prev ? { ...prev, name: e.target.value } : null
                                  )}
                                  className="bg-black/20 border-white/30 text-white"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="role" className="text-white">Função</Label>
                                <Select
                                  value={editingUser?.role || ''}
                                  onValueChange={(value) => setEditingUser(prev => 
                                    prev ? { ...prev, role: value } : null
                                  )}
                                >
                                  <SelectTrigger className="bg-black/20 border-white/30 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">Usuário</SelectItem>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="department" className="text-white">Departamento</Label>
                                <Select
                                  value={editingUser?.department_id || ''}
                                  onValueChange={(value) => setEditingUser(prev => 
                                    prev ? { ...prev, department_id: value } : null
                                  )}
                                >
                                  <SelectTrigger className="bg-black/20 border-white/30 text-white">
                                    <SelectValue placeholder="Selecione um departamento" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {departments.map((dept) => (
                                      <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => setIsDialogOpen(false)}
                                  className="bg-transparent border-white/30 text-white hover:bg-white/10"
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  type="submit"
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                >
                                  Salvar
                                </Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(profile.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
