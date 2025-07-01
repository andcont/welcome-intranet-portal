
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

interface IntranetHeaderProps {
  currentUser: {
    name: string;
    role: string;
    profilePic?: string;
  };
  onLogout: () => void;
}

const IntranetHeader = ({ currentUser, onLogout }: IntranetHeaderProps) => {
  const navigate = useNavigate();
  
  // Ensure we have valid values even if currentUser has issues
  const userName = currentUser?.name || "Usuário";
  const userRole = currentUser?.role || "user";
  const userProfilePic = currentUser?.profilePic;
  
  const goToProfile = () => {
    navigate("/profile");
  };
  
  const goToAdmin = () => {
    navigate("/admin");
  };
  
  return (
    <header className="intranet-header py-4 w-full">
      <div className="container mx-auto px-4 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src="/lovable-uploads/ea36e87c-48ec-4941-9032-e9c72e4aa87d.png" 
              alt="AndCont Logo" 
              className="h-12 animate-fade-in" 
            />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gradient animate-fade-in hidden sm:block">
                Intranet AndCont
              </h1>
              <span className="text-xs text-white/80 hidden sm:block">
                Há 30 anos conectando pessoas e números
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {userRole === 'admin' && (
              <Button 
                onClick={goToAdmin} 
                variant="outline" 
                size="sm"
                className="button-gradient text-white border-transparent hover:opacity-90 animate-fade-in"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" /> 
                <span className="hidden sm:inline">Área Admin</span>
              </Button>
            )}
            
            <div 
              onClick={goToProfile} 
              className="flex items-center cursor-pointer hover:bg-black/50 rounded-full py-1 px-3 transition-colors animate-fade-in"
            >
              <Avatar className="h-8 w-8 mr-2 border border-[#7B68EE]/50">
                {userProfilePic ? (
                  <AvatarImage src={userProfilePic} alt={userName} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-[#7B68EE] to-[#D946EF] text-white">
                    {userName ? userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="text-white font-medium hidden sm:block">{userName}</span>
            </div>
            
            <Button 
              onClick={onLogout} 
              variant="outline" 
              size="sm"
              className="bg-black/30 hover:bg-black/50 text-white border-[#7B68EE]/30 animate-fade-in"
            >
              <LogOut className="mr-2 h-4 w-4" /> 
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default IntranetHeader;
