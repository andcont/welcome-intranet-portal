
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";

const Auth = () => {
  const navigate = useNavigate();
  const { selectedGradient } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });

  useEffect(() => {
    // Check if user is already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/intranet");
      }
    });
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          },
          emailRedirectTo: `${window.location.origin}/intranet`
        }
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Conta criada com sucesso! Verifique seu e-mail para confirmar.");
      }
    } catch (error) {
      toast.error("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login realizado com sucesso!");
        navigate("/intranet");
      }
    } catch (error) {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${selectedGradient.value} w-full`}>
      {/* Lado esquerdo - Banner */}
      <div className="flex-1 hidden lg:flex flex-col justify-center items-center text-white p-8">
        <div className="max-w-lg">
          <img 
            src="/lovable-uploads/705b7447-780b-42c6-9d66-f39cc7a86438.png" 
            alt="AndCont Banner" 
            className="w-full h-auto mb-12" 
          />
          <h1 className="text-4xl font-bold mb-4 text-white">Contabilidade no terceiro setor é com a AndCont!</h1>
          <p className="text-xl text-white/90">
            Conectamos pessoas e números. Acesse nossa intranet para ver todas as ferramentas disponíveis.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulários */}
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

          <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-white">AndCont Intranet</CardTitle>
              <CardDescription className="text-white/80">
                Faça login ou crie sua conta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-black/20">
                  <TabsTrigger value="signin" className="text-white data-[state=active]:bg-white/20">
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-white data-[state=active]:bg-white/20">
                    Criar Conta
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-white">E-mail</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-white">Senha</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
                        placeholder="********"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name" className="text-white">Nome Completo</Label>
                      <Input
                        id="signup-name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email" className="text-white">E-mail</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-password" className="text-white">Senha</Label>
                      <Input
                        id="signup-password"
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        className="bg-black/20 border-white/30 text-white placeholder:text-white/50"
                        placeholder="********"
                        minLength={6}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando..." : "Criar Conta"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center">
                <Link to="/" className="text-white/70 hover:text-white underline">
                  ← Voltar ao início
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
