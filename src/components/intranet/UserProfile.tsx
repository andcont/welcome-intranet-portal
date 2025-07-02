import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Edit2, Save, Calendar, Mail, Building, Camera } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileData {
  id: string;
  name: string;
  email: string;
  profile_image?: string | null;
  about_me?: string | null;
  birthday?: string | null;
  department_id?: string | null;
  created_at: string;
}

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

const UserProfile = ({ userId, onClose }: UserProfileProps) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    about_me: "",
    birthday: ""
  });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const isOwnProfile = user?.id === userId;

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      console.log('Loading profile for userId:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar perfil:', error);
        toast.error('Erro ao carregar perfil');
        return;
      }

      if (!data) {
        console.log('Profile not found for userId:', userId);
        toast.error('Perfil não encontrado');
        return;
      }

      console.log('Profile loaded successfully:', data);
      setProfile(data);
      setEditForm({
        name: data.name || "",
        about_me: data.about_me || "",
        birthday: data.birthday || ""
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      toast.error('Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !isOwnProfile) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Erro no upload:', uploadError);
        toast.error('Erro ao fazer upload da imagem');
        return;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image: data.publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Erro ao atualizar perfil:', updateError);
        toast.error('Erro ao atualizar foto do perfil');
        return;
      }

      toast.success('Foto atualizada com sucesso!');
      loadProfile();
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!isOwnProfile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: editForm.name,
          about_me: editForm.about_me,
          birthday: editForm.birthday || null
        })
        .eq('id', userId);

      if (error) {
        console.error('Erro ao atualizar perfil:', error);
        toast.error('Erro ao atualizar perfil');
        return;
      }

      toast.success('Perfil atualizado com sucesso!');
      setEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatBirthday = (dateString?: string | null) => {
    if (!dateString) return "Não informado";
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/80">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        <div className="text-center py-12">
          <p className="text-white/80">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Perfil do Usuário</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20 ring-2 ring-white/30">
                {profile.profile_image ? (
                  <AvatarImage src={profile.profile_image} alt={profile.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-2xl">
                    {profile.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {isOwnProfile && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="flex-1">
              {editing && isOwnProfile ? (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white text-sm">Nome</Label>
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Seu nome"
                  />
                </div>
              ) : (
                <>
                  <CardTitle className="text-white text-2xl">{profile.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-white/80 mt-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                </>
              )}
            </div>
            {isOwnProfile && (
              <div className="flex space-x-2">
                {editing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditing(false)}
                      className="text-white hover:bg-white/20"
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSave}
                      className="text-white hover:bg-white/20"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(true)}
                    className="text-white hover:bg-white/20"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* About Me Section */}
          <div>
            <Label className="text-white font-medium mb-2 block">Sobre mim</Label>
            {editing && isOwnProfile ? (
              <Textarea
                value={editForm.about_me}
                onChange={(e) => setEditForm({ ...editForm, about_me: e.target.value })}
                className="bg-white/10 border-white/20 text-white min-h-[100px]"
                placeholder="Conte um pouco sobre você..."
              />
            ) : (
              <div className="bg-white/5 rounded-lg p-4 min-h-[100px]">
                <p className="text-white/90">
                  {profile.about_me || "Nenhuma informação adicionada ainda."}
                </p>
              </div>
            )}
          </div>

          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white font-medium mb-2 block flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Aniversário
              </Label>
              {editing && isOwnProfile ? (
                <Input
                  type="date"
                  value={editForm.birthday}
                  onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                />
              ) : (
                <p className="text-white/80">{formatBirthday(profile.birthday)}</p>
              )}
            </div>

            <div>
              <Label className="text-white font-medium mb-2 block flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Membro desde
              </Label>
              <p className="text-white/80">{formatDate(profile.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;