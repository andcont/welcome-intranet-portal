
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      // Simulação de login (em um cenário real, você conectaria com uma API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validação simples de dados de login
      if (email && password) {
        // Salvar o token no localStorage (simulado)
        localStorage.setItem('andcont_user', JSON.stringify({ email }));
        toast.success("Login realizado com sucesso!");
        
        // Redirecionar para a intranet da AndCont
        window.location.href = "https://intranetandcont.vercel.app/";
      } else {
        toast.error("Por favor, preencha todos os campos.");
      }
    } catch (error) {
      console.error("Erro de login:", error);
      toast.error("Falha no login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Login Portal Intranet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              <Input 
                id="email" 
                type="email" 
                placeholder="seu.email@andcont.com.br" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3">
              <Lock className="h-4 w-4 text-gray-500 mr-2" />
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          Esqueceu sua senha? Entre em contato com o suporte.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
