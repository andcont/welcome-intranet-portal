
import RegisterForm from "@/components/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      {/* Lado esquerdo - Banner colorido */}
      <div className="flex-1 hidden lg:flex flex-col justify-center items-center text-gray-800 p-8">
        <div className="max-w-lg">
          <img 
            src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
            alt="AndCont Banner" 
            className="w-full h-auto mb-12" 
          />
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Faça parte da nossa equipe!</h1>
          <p className="text-xl text-gray-600">
            Cadastre-se para ter acesso à nossa intranet e conheça todas as ferramentas disponíveis.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário de Cadastro */}
      <div className="flex-1 flex justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Logo para dispositivos móveis */}
          <div className="lg:hidden mb-8">
            <img 
              src="/lovable-uploads/ccec8aba-57c1-4908-af76-9e3f5effa934.png" 
              alt="AndCont Logo" 
              className="w-full max-w-xs mx-auto" 
            />
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
