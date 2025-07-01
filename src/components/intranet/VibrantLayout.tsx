
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Bell, 
  Search, 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Link as LinkIcon,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  Palette,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import GradientSelector from "./GradientSelector";
import { useTheme } from "@/contexts/ThemeContext";

interface VibrantLayoutProps {
  children: React.ReactNode;
  currentUser: {
    name: string;
    role: string;
    profilePic?: string;
  };
  onLogout: () => void;
  activeSection?: string;
  onTabChange?: (tab: string) => void;
}

const VibrantLayout = ({ children, currentUser, onLogout, activeSection, onTabChange }: VibrantLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGradientSelector, setShowGradientSelector] = useState(false);
  const navigate = useNavigate();
  const { selectedGradient } = useTheme();

  const menuItems = [
    { icon: Home, label: "Dashboard", id: "dashboard" },
    { icon: Bell, label: "Comunicados", id: "announcements" },
    { icon: LinkIcon, label: "Links Úteis", id: "links" },
    { icon: Calendar, label: "Calendário", id: "calendar" },
    { icon: MessageSquare, label: "Feed", id: "feed" },
    { icon: Users, label: "Equipe", id: "team" },
    { icon: Sparkles, label: "Aniversariantes", id: "birthdays" },
  ];

  const handleMenuClick = (itemId: string) => {
    if (onTabChange) {
      onTabChange(itemId);
    }
    setSidebarOpen(false);
  };

  return (
    <div className={`min-h-screen ${selectedGradient.value} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-white/10 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-20 h-20 bg-white/10 rounded-full blur-md animate-bounce"></div>
      </div>

      {/* Header with enhanced glass effect */}
      <header className="relative bg-black/20 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-50 shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-full p-3"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="/lovable-uploads/07664a7b-d471-41cd-848e-88de04532275.png" 
                  alt="AndCont Logo" 
                  className="h-10 w-10 drop-shadow-lg" 
                />
                <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white drop-shadow-lg">AndCont Intranet</h1>
                <p className="text-sm text-white/80 font-medium">Conectamos pessoas e números</p>
              </div>
            </div>
          </div>

          {/* Center - Enhanced Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar na intranet..."
                className="w-full pl-12 pr-6 py-3 bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 shadow-lg"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-full p-3"
              onClick={() => setShowGradientSelector(!showGradientSelector)}
            >
              <Palette className="h-6 w-6" />
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-white/20 transition-all duration-300 rounded-full p-3 relative"
            >
              <Bell className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
            
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:bg-white/20 rounded-2xl px-4 py-3 transition-all duration-300 backdrop-blur-sm"
              onClick={() => navigate("/profile")}
            >
              <Avatar className="h-10 w-10 ring-2 ring-white/30">
                {currentUser.profilePic ? (
                  <AvatarImage src={currentUser.profilePic} alt={currentUser.name} />
                ) : (
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-bold text-white drop-shadow">{currentUser.name}</p>
                <p className="text-xs text-white/80">{currentUser.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-white hover:bg-red-500/20 transition-all duration-300 rounded-full p-3"
            >
              <LogOut className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Enhanced Gradient Selector */}
        {showGradientSelector && (
          <div className="absolute top-full right-6 mt-4 z-50 animate-in slide-in-from-top-2">
            <div className="bg-black/30 backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl">
              <GradientSelector onClose={() => setShowGradientSelector(false)} />
            </div>
          </div>
        )}
      </header>

      <div className="flex relative">
        {/* Enhanced Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-black/20 backdrop-blur-2xl border-r border-white/20 transform transition-all duration-500 ease-out shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col h-full pt-20 lg:pt-6">
            <nav className="flex-1 px-6 pb-6 space-y-3">
              <div className="mb-8">
                <h3 className="px-4 text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center">
                  <Sparkles className="h-3 w-3 mr-2" />
                  Navegação
                </h3>
                {menuItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={`w-full justify-start text-left text-white hover:bg-white/20 transition-all duration-300 rounded-2xl p-4 mb-2 backdrop-blur-sm ${
                      activeSection === item.id ? 'bg-white/20 border-l-4 border-yellow-400 shadow-lg' : ''
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <item.icon className="h-6 w-6 mr-4" />
                    <span className="font-medium">{item.label}</span>
                    <ChevronRight className="h-5 w-5 ml-auto opacity-60" />
                  </Button>
                ))}
              </div>

              {currentUser.role === 'admin' && (
                <div>
                  <h3 className="px-4 text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center">
                    <Settings className="h-3 w-3 mr-2" />
                    Administração
                  </h3>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left text-white hover:bg-white/20 transition-all duration-300 rounded-2xl p-4 backdrop-blur-sm"
                    onClick={() => navigate("/admin")}
                  >
                    <Settings className="h-6 w-6 mr-4" />
                    <span className="font-medium">Painel Admin</span>
                    <ChevronRight className="h-5 w-5 ml-auto opacity-60" />
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </aside>

        {/* Enhanced Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content with enhanced styling */}
        <main className="flex-1 lg:ml-0 min-h-screen relative">
          <div className="p-8">
            <div className="relative">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VibrantLayout;
