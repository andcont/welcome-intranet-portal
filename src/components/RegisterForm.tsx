
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, UserPlus, User, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar campos
      if (!name || !email || !password) {
        toast.error("Por favor, preencha todos os campos.");
        setIsLoading(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast.error("As senhas não coincidem.");
        setIsLoading(false);
        return;
      }

      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Obter usuários existentes ou iniciar array vazio
      const existingUsers = JSON.parse(localStorage.getItem('andcont_users') || '[]');
      
      // Verificar se o email já existe
      if (existingUsers.some((user: any) => user.email === email)) {
        toast.error("Este e-mail já está registrado.");
        setIsLoading(false);
        return;
      }
      
      // Adicionar novo usuário
      const newUser = { 
        id: Date.now().toString(), 
        name, 
        email, 
        password, // Em um app real, nunca armazene senhas em texto puro
        role: 'user',
        createdAt: new Date().toISOString()
      };
      
      existingUsers.push(newUser);
      localStorage.setItem('andcont_users', JSON.stringify(existingUsers));
      
      // Registrar atividade
      const activities = JSON.parse(localStorage.getItem('andcont_activities') || '[]');
      activities.push({
        id: Date.now().toString(),
        userId: newUser.id,
        userName: newUser.name,
        userEmail: newUser.email,
        type: 'register',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('andcont_activities', JSON.stringify(activities));
      
      toast.success("Registro realizado com sucesso! Faça o login para continuar.");
      
      // Redirecionar para login após um breve delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      
    } catch (error) {
      console.error("Erro no registro:", error);
      toast.error("Falha no registro. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg backdrop-blur-sm bg-white/10 border-white/20">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">Cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Nome</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3 bg-black/20">
              <User className="h-4 w-4 text-gray-300 mr-2" />
              <Input 
                id="name" 
                type="text" 
                placeholder="Seu nome completo" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">E-mail</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3 bg-black/20">
              <Mail className="h-4 w-4 text-gray-300 mr-2" />
              <Input 
                id="email" 
                type="email" 
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
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
            <div className="flex items-center border rounded-md focus-within:ring-1 focus-within:ring-andcont-blue px-3 bg-black/20">
              <Lock className="h-4 w-4 text-gray-300 mr-2" />
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
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
                Cadastrando...
              </div>
            ) : (
              <div className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" /> Cadastrar
              </div>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-300">
          Já tem uma conta? <Link to="/login" className="text-andcont-blue hover:underline">Entrar</Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
