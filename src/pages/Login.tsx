
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  // Verificar se o usuário já está logado
  useEffect(() => {
    const user = localStorage.getItem("andcont_user");
    if (user) {
      // Usuário já logado, redireciona direto para a intranet interna
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex bg-gradient-andcont">
      {/* Lado esquerdo - Banner colorido */}
      <div className="flex-1 hidden lg:flex flex-col justify-center items-center text-white p-8">
        <div className="max-w-lg">
          <img 
            src="/lovable-uploads/705b7447-780b-42c6-9d66-f39cc7a86438.png" 
            alt="AndCont Banner" 
            className="w-full h-auto mb-12" 
          />
          <h1 className="text-4xl font-bold mb-4">Contabilidade no terceiro setor é com a AndCont!</h1>
          <p className="text-xl">
            Conectamos pessoas e números. Acesse nossa intranet para ver todas as ferramentas disponíveis.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Logo para dispositivos móveis */}
          <div className="lg:hidden mb-8">
            <img 
              src="/lovable-uploads/705b7447-780b-42c6-9d66-f39cc7a86438.png" 
              alt="AndCont Logo" 
              className="w-full max-w-xs mx-auto" 
            />
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
