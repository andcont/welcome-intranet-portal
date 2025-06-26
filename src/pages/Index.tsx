
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  
  useEffect(() => {
    console.log('Index - Auth state:', { loading, isAuthenticated });
    
    if (loading) {
      console.log('Index - Still loading auth...');
      return; // Wait for auth to load
    }
    
    if (isAuthenticated) {
      console.log('Index - User is authenticated, redirecting to intranet');
      navigate("/intranet", { replace: true });
    } else {
      console.log('Index - User is not authenticated, redirecting to auth');
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center text-white">
        <div className="animate-spin h-12 w-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <h1 className="text-4xl font-bold mb-4">Redirecionando...</h1>
        <p className="text-xl">Aguarde enquanto verificamos sua autenticação.</p>
      </div>
    </div>
  );
};

export default Index;
