
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IntranetHeaderProps {
  currentUser: {
    name: string;
    role: string;
  };
  onLogout: () => void;
}

const IntranetHeader = ({ currentUser, onLogout }: IntranetHeaderProps) => {
  return (
    <header className="border-b border-white/20 bg-white/20 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
              alt="AndCont Logo" 
              className="h-10 mr-4" 
            />
            <h1 className="text-2xl font-bold text-white hidden sm:block">Intranet AndCont</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-white flex items-center">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{currentUser.name}</span>
              <span className="ml-2 bg-white/30 text-white text-xs px-2 py-1 rounded-full">
                {currentUser.role === 'admin' ? 'Admin' : 'Usuário'}
              </span>
            </div>
            
            <Button 
              onClick={onLogout} 
              variant="outline" 
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
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
