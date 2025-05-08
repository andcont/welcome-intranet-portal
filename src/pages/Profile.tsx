
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Camera, LogOut, ArrowLeft } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Verificar usuário
    const userStr = localStorage.getItem("andcont_user");
    if (!userStr) {
      navigate("/login");
      return;
    }
    
    try {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      setName(user.name || "");
      setProfilePic(user.profilePic || null);
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("andcont_user");
    toast.success("Logout realizado com sucesso!");
    navigate("/login");
  };

  const handleUpdateProfile = () => {
    if (!name.trim()) {
      toast.error("Por favor, informe seu nome");
      return;
    }
    
    try {
      // Update user in localStorage
      const userStr = localStorage.getItem("andcont_user");
      if (!userStr) {
        navigate("/login");
        return;
      }
      
      const user = JSON.parse(userStr);
      const updatedUser = {
        ...user,
        name: name.trim(),
        profilePic: profilePic
      };
      
      // Update in localStorage
      localStorage.setItem("andcont_user", JSON.stringify(updatedUser));
      
      // Update users list if exists
      const usersStr = localStorage.getItem("andcont_users");
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, name: name.trim(), profilePic: profilePic } : u
        );
        localStorage.setItem("andcont_users", JSON.stringify(updatedUsers));
      }
      
      setCurrentUser(updatedUser);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil");
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

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-andcont">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
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
                    <AvatarImage src={profilePic} alt={name} />
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
                <p className="text-lg font-medium text-white">{currentUser.email}</p>
                <span className="inline-block px-3 py-1 mt-1 bg-black/20 text-white rounded-full text-sm font-medium">
                  {currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Nome</Label>
              <Input 
                id="name" 
                placeholder="Seu nome" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
              />
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
                className="bg-andcont-blue/80 hover:bg-andcont-blue text-white"
              >
                Salvar Alterações
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
