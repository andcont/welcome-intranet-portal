
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Camera, LogOut, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }
    
    if (profile) {
      setName(profile.name || "");
      setProfilePic(profile.profile_image || null);
    }
  }, [user, profile, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error("Erro ao fazer logout");
      } else {
        toast.success("Logout realizado com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Erro ao fazer logout");
    }
  };

  const uploadProfileImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !user) {
      toast.error("Por favor, informe seu nome");
      return;
    }
    
    setLoading(true);
    try {
      let imageUrl = profilePic;
      
      // If profilePic is a data URL (newly selected image), upload it
      if (profilePic && profilePic.startsWith('data:')) {
        const response = await fetch(profilePic);
        const blob = await response.blob();
        const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
        
        const uploadedUrl = await uploadProfileImage(file);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          profile_image: imageUrl
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        toast.error("Erro ao atualizar perfil");
        return;
      }

      setProfilePic(imageUrl);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const goBack = () => {
    navigate("/");
  };

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-andcont">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-andcont-blue via-andcont-purple to-andcont-pink p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 text-white hover:bg-white/20"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Intranet
        </Button>
        
        <Card className="bg-black/30 backdrop-blur-xl border border-white/30 rounded-lg shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-white">Seu Perfil</CardTitle>
            <CardDescription className="text-white/80">Edite suas informações pessoais</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 border-2 border-white">
                  {profilePic ? (
                    <AvatarImage src={profilePic} alt={name} className="object-cover" />
                  ) : (
                    <AvatarFallback className="bg-andcont-blue text-white text-3xl">
                      {name ? name.charAt(0).toUpperCase() : <User className="h-16 w-16" />}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 bg-white hover:bg-gray-100"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="hidden" 
                />
              </div>
              
              <div className="text-center mb-4">
                <p className="text-lg font-medium text-white">{profile.email}</p>
                <span className="inline-block px-3 py-1 mt-1 bg-black/20 text-white rounded-full text-sm font-medium">
                  {profile.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome de Exibição</Label>
              <Input 
                id="name" 
                placeholder="Seu nome de exibição" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
              />
              <p className="text-white/60 text-sm">Este nome será exibido nos seus comentários e posts</p>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="bg-red-600/70 hover:bg-red-700/70"
              >
                <LogOut className="mr-2 h-4 w-4" /> Sair
              </Button>
              
              <Button 
                onClick={handleUpdateProfile}
                disabled={loading}
                className="bg-andcont-blue/80 hover:bg-andcont-blue text-white"
              >
                {loading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
