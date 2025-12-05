import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { FileText, Home, LayoutGrid, BarChart3, LogOut, Heart, Shield, CreditCard, Bell, TrendingUp, FileDown, ChevronDown, User, Settings, Gift } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import DonationModal from "./DonationModal";
import { LanguageSelector } from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function GlobalNavigation() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation();
  const [showDonationModal, setShowDonationModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Clear JWT token from localStorage
      localStorage.removeItem("auth_token");
      toast.success(t("messages.logoutSuccess"));
      window.location.href = "/";
    } catch (error) {
      toast.error(t("common.error"));
    }
  };

  const navItems = [
    { path: "/", label: t("nav.home"), icon: Home },
    { path: "/generator", label: t("nav.create"), icon: FileText },
    { path: "/blog", label: "Blog", icon: FileText },
    { path: "/resources", label: t("nav.resources"), icon: LayoutGrid },
    { path: "/dashboard", label: t("nav.dashboard"), icon: BarChart3 },
    { path: "/referral", label: "Indique e Ganhe", icon: Gift },
    { path: "/payment-history", label: t("nav.payments"), icon: CreditCard },
  ];

  const adminItems = [
    { path: "/admin", label: t("nav.panel"), icon: Shield },
    { path: "/admin/metrics", label: t("nav.metrics"), icon: TrendingUp },
    { path: "/admin/notifications", label: t("nav.notifications"), icon: Bell },
    { path: "/admin/reports", label: t("nav.reports"), icon: FileDown },
    { path: "/admin/blog", label: "Gerenciar Blog", icon: FileText },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent hidden sm:block">
                  ResumAI
                </h1>
              </a>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link key={item.path} href={item.path}>
                      <Button
                        variant={active ? "default" : "ghost"}
                        size="sm"
                        className={`gap-2 ${active ? "shadow-sm" : ""}`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden xl:inline">{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
                
                {/* Admin Dropdown Menu */}
                {user?.role === "admin" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={location.startsWith("/admin") ? "default" : "ghost"}
                        size="sm"
                        className={`gap-2 ${location.startsWith("/admin") ? "shadow-sm" : ""}`}
                      >
                        <Shield className="h-4 w-4" />
                        <span className="hidden xl:inline">Admin</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {adminItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem key={item.path} asChild>
                            <Link href={item.path}>
                              <a className="flex items-center gap-2 w-full cursor-pointer">
                                <Icon className="h-4 w-4" />
                                {item.label}
                              </a>
                            </Link>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </nav>
            )}

            {/* Right Side - Language + User Menu */}
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <LanguageSelector />
              {isAuthenticated ? (
                <>
                  {/* Donation Button */}
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowDonationModal(true)}
                    className="gap-2 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white shadow-md hidden sm:flex"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="hidden md:inline">{t("nav.donate")}</span>
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2 h-10">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs font-semibold">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:flex flex-col items-start">
                          <span className="text-sm font-medium leading-none">
                            {user?.name?.split(" ")[0] || t("nav.user")}
                          </span>
                          <span className="text-xs text-muted-foreground leading-none mt-0.5">
                            {user?.role === "admin" ? t("admin.admin") : t("nav.user")}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <a className="flex items-center gap-2 w-full cursor-pointer">
                            <User className="h-4 w-4" />
                            {t("nav.profile")}
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">
                          <a className="flex items-center gap-2 w-full cursor-pointer">
                            <BarChart3 className="h-4 w-4" />
                            {t("nav.dashboard")}
                          </a>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="sm:hidden">
                        <button
                          onClick={() => setShowDonationModal(true)}
                          className="flex items-center gap-2 w-full cursor-pointer"
                        >
                          <Heart className="h-4 w-4" />
                          Apoiar Projeto
                        </button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full cursor-pointer text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          Sair
                        </button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="sm" className="shadow-sm">
                      Cadastrar
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          {isAuthenticated && (
            <div className="lg:hidden border-t py-2 flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={active ? "default" : "ghost"}
                      size="sm"
                      className="gap-1.5 text-xs whitespace-nowrap"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
              {user?.role === "admin" && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={location.startsWith("/admin") ? "default" : "ghost"}
                      size="sm"
                      className="gap-1.5 text-xs whitespace-nowrap"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      Admin
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.path} asChild>
                          <Link href={item.path}>
                            <a className="flex items-center gap-2 w-full cursor-pointer">
                              <Icon className="h-4 w-4" />
                              {item.label}
                            </a>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Donation Modal */}
      <DonationModal
        open={showDonationModal}
        onOpenChange={setShowDonationModal}
      />
    </>
  );
}
