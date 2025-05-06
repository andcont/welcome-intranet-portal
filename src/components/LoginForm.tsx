
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, LogIn, User } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar se é admin
      if (email === "admin" && password === "admin") {
        localStorage.setItem('andcont_user', JSON.stringify({ 
          id: 'admin',
          name: 'Administrador',
          email: 'admin',
          role: 'admin' 
        }));

        toast.success("Login de administrador realizado com sucesso!");
        
        // Redirecionar para a página de admin
        navigate("/admin");
        return;
      }

      // Verificar usuários registrados
      const users = JSON.parse(localStorage.getItem('andcont_users') || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        // Login bem-sucedido
        const userToSave = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };

        localStorage.setItem('andcont_user', JSON.stringify(userToSave));

        // Registrar atividade de login
        const activities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
        activities.push({
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          type: 'login',
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('andcont_activities', JSON.stringify(activities));

        toast.success("Login realizado com sucesso!");
        
        // Redirecionar para a intranet da AndCont
        window.location.href = "https://intranetandcont.vercel.app/";
      } else {
        toast.error("Credenciais inválidas. Verifique seu email e senha.");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      toast.error("Falha no login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg backdrop-blur-sm bg-white/10 border-white/20">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Login Portal Intranet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3 bg-black/20">
              <User className="h-4 w-4 text-gray-300 mr-2" />
              <Input 
                id="email" 
                type="text" 
                placeholder="seu.email@andcont.com.br" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Senha</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3 bg-black/20">
              <Lock className="h-4 w-4 text-gray-300 mr-2" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-andcont hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Entrando...
              </div>
            ) : (
              <div className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" /> Entrar
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <p className="text-sm text-gray-300">
          Esqueceu sua senha? Entre em contato com o suporte.
        </p>
        <p className="text-sm text-gray-300">
          Não tem uma conta? <Link to="/register" className="text-andcont-blue hover:underline">Cadastre-se</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
