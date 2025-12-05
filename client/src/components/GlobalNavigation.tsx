import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { FileText, Home, LayoutGrid, BarChart3, LogOut, Heart, Shield, CreditCard } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

import DonationModal from "./DonationModal";

export default function GlobalNavigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Clear JWT token from localStorage
      localStorage.removeItem("auth_token");
      toast.success("Logout realizado com sucesso!");
      window.location.href = "/";
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const navItems = [
    { path: "/", label: "Início", icon: Home },
    { path: "/generator", label: "Criar", icon: FileText },
    { path: "/resources", label: "Recursos", icon: LayoutGrid },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { path: "/payment-history", label: "Pagamentos", icon: CreditCard },
    ...(user?.role === "admin" ? [{ path: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <FileText className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block">
                ResumAI
              </h1>
              <h1 className="text-xl font-bold text-slate-800 sm:hidden">
                ResumAI
              </h1>
            </a>
          </Link>

          {/* Navigation Links */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setShowDonationModal(true)}
                  className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Apoiar</span>
                </Button>
                <span className="text-sm text-slate-600 hidden sm:block">
                  Olá, {user?.name}
                </span>
                {user?.role === "admin" && (
                  <Link href="/admin">
                    <Button
                      variant={isActive("/admin") ? "default" : "outline"}
                      size="sm"
                      className="gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="hidden sm:inline">Admin</span>
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </>
            ) : (
              <Button asChild size="sm">
                <a href={getLoginUrl()}>Entrar</a>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && (
          <nav className="md:hidden flex items-center gap-1 mt-3 overflow-x-auto pb-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant={active ? "default" : "ghost"}
                    size="sm"
                    className="gap-2 whitespace-nowrap"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        )}
      </div>
      
      {/* Donation Modal */}
      <DonationModal open={showDonationModal} onOpenChange={setShowDonationModal} />
    </header>
  );
}
