
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Index = () => {
  const navigate = useNavigate();
  const { selectedGradient } = useTheme();
  
  useEffect(() => {
    // Verificar se o usuário está logado
    const user = localStorage.getItem("andcont_user");
    
    if (user) {
      // Usuário logado, redireciona para a intranet interna
      navigate("/intranet");
    } else {
      // Usuário não logado, redireciona para a página de login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center w-full ${selectedGradient.value}`}>
      <div className="text-center text-white">
        <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="text-4xl font-bold mb-4">Redirecionando...</h1>
        <p className="text-xl">Aguarde enquanto o redirecionamos.</p>
      </div>
    </div>
  );
};

export default Index;
