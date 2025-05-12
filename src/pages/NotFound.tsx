
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900">
      <div className="text-center glass-card p-10 max-w-md">
        <h1 className="text-5xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-gray-300 mb-6">Página não encontrada</p>
        <a href="/" className="btn-primary py-2 px-6 rounded-lg inline-block">
          Retornar à Página Inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;
