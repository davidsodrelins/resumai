import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock, Activity, Save, Loader2, MapPin } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import GlobalNavigation from "@/components/GlobalNavigation";
import { useState } from "react";
import { toast } from "sonner";
import PasswordStrengthIndicator from "@/components/PasswordStrengthIndicator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COUNTRIES = [
  { value: "BR", label: "Brasil" },
  { value: "US", label: "Estados Unidos" },
  { value: "PT", label: "Portugal" },
  { value: "ES", label: "Espanha" },
  { value: "AR", label: "Argentina" },
  { value: "MX", label: "México" },
  { value: "CO", label: "Colômbia" },
  { value: "CL", label: "Chile" },
  { value: "PE", label: "Peru" },
  { value: "UY", label: "Uruguai" },
  { value: "OTHER", label: "Outro" },
];

export default function Profile() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  
  // Edit name state
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  
  // Edit email state
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || "");
  
  // Change password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // Location state
  const [editingLocation, setEditingLocation] = useState(false);
  const [newCountry, setNewCountry] = useState(user?.country || "");
  const [newState, setNewState] = useState(user?.state || "");
  const [newCity, setNewCity] = useState(user?.city || "");

  const { data: usageStats } = trpc.usage.getStats.useQuery();

  // Update name mutation
  const updateNameMutation = trpc.user.updateName.useMutation({
    onSuccess: () => {
      toast.success("Nome atualizado com sucesso!");
      setEditingName(false);
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar nome", {
        description: error.message,
      });
    },
  });

  // Update email mutation
  const updateEmailMutation = trpc.user.updateEmail.useMutation({
    onSuccess: () => {
      toast.success("Email atualizado com sucesso!");
      setEditingEmail(false);
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar email", {
        description: error.message,
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = trpc.user.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    },
    onError: (error) => {
      toast.error("Erro ao alterar senha", {
        description: error.message,
      });
    },
  });
  
  // Update location mutation
  const updateLocationMutation = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Localização atualizada com sucesso!");
      setEditingLocation(false);
      utils.auth.me.invalidate();
    },
    onError: (error) => {
      toast.error("Erro ao atualizar localização", {
        description: error.message,
      });
    },
  });

  const handleSaveName = () => {
    if (!newName.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }
    updateNameMutation.mutate({ name: newName });
  };

  const handleSaveEmail = () => {
    if (!newEmail.trim()) {
      toast.error("Email não pode estar vazio");
      return;
    }
    updateEmailMutation.mutate({ email: newEmail });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    changePasswordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };
  
  const handleSaveLocation = () => {
    updateLocationMutation.mutate({
      country: newCountry || undefined,
      state: newState || undefined,
      city: newCity || undefined,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <GlobalNavigation />
        <div className="container mx-auto py-20 text-center">
          <p className="text-xl text-gray-600">Você precisa estar logado para ver seu perfil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <GlobalNavigation />
      
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informações pessoais e configurações</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">
              <User className="w-4 h-4 mr-2" />
              Conta
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="w-4 h-4 mr-2" />
              Atividade
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            {/* Edit Name */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Nome
                </CardTitle>
                <CardDescription>
                  Seu nome será exibido nos currículos gerados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingName ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Novo Nome</Label>
                      <Input
                        id="name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveName}
                        disabled={updateNameMutation.isPending}
                      >
                        {updateNameMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingName(false);
                          setNewName(user.name || "");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Nome atual</p>
                    </div>
                    <Button variant="outline" onClick={() => setEditingName(true)}>
                      Editar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Email */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </CardTitle>
                <CardDescription>
                  Usado para login e recuperação de senha
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingEmail ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Novo Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveEmail}
                        disabled={updateEmailMutation.isPending}
                      >
                        {updateEmailMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingEmail(false);
                          setNewEmail(user.email || "");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">Email atual</p>
                    </div>
                    <Button variant="outline" onClick={() => setEditingEmail(true)}>
                      Editar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Edit Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Localização
                </CardTitle>
                <CardDescription>
                  Ajude-nos a entender de onde nossos usuários estão acessando
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {editingLocation ? (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor="country">País</Label>
                        <Select value={newCountry} onValueChange={setNewCountry}>
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Selecione o país" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRIES.map((c) => (
                              <SelectItem key={c.value} value={c.value}>
                                {c.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado/Província</Label>
                        <Input
                          id="state"
                          value={newState}
                          onChange={(e) => setNewState(e.target.value)}
                          placeholder="Ex: São Paulo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={newCity}
                          onChange={(e) => setNewCity(e.target.value)}
                          placeholder="Ex: São Paulo"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveLocation}
                        disabled={updateLocationMutation.isPending}
                      >
                        {updateLocationMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingLocation(false);
                          setNewCountry(user.country || "");
                          setNewState(user.state || "");
                          setNewCity(user.city || "");
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      {user.country || user.state || user.city ? (
                        <>
                          <p className="font-medium">
                            {[user.city, user.state, COUNTRIES.find(c => c.value === user.country)?.label].filter(Boolean).join(", ") || "Não informado"}
                          </p>
                          <p className="text-sm text-muted-foreground">Localização atual</p>
                        </>
                      ) : (
                        <>
                          <p className="font-medium text-muted-foreground">Não informado</p>
                          <p className="text-sm text-muted-foreground">Adicione sua localização</p>
                        </>
                      )}
                    </div>
                    <Button variant="outline" onClick={() => setEditingLocation(true)}>
                      {user.country || user.state || user.city ? "Editar" : "Adicionar"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Change Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Alterar Senha
                </CardTitle>
                <CardDescription>
                  Mantenha sua conta segura com uma senha forte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                  />
                  <PasswordStrengthIndicator password={newPassword} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Digite novamente a nova senha"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending}
                  className="w-full"
                >
                  {changePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Alterando...
                    </>
                  ) : (
                    "Alterar Senha"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Uso</CardTitle>
                <CardDescription>
                  Resumo da sua atividade na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">
                      {usageStats?.resumesThisMonth || 0}
                    </div>
                    <div className="text-sm text-gray-600">
                      Currículos este mês
                    </div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">
                      {usageStats?.limit || 5}
                    </div>
                    <div className="text-sm text-gray-600">
                      Limite mensal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>
                  Acesse seu histórico completo de currículos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Button variant="outline" asChild>
                    <a href="/history">Ver Histórico Completo</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
