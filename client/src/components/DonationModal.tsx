import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee, Candy, Sandwich, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";

interface DonationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DONATION_OPTIONS = [
  {
    id: "coffee",
    amount: 500, // R$ 5.00
    icon: Coffee,
    title: "Me pague um café",
    description: "Um cafézinho para manter o código rodando ☕",
    color: "bg-amber-100 text-amber-700 hover:bg-amber-200",
  },
  {
    id: "chocolate",
    amount: 1000, // R$ 10.00
    icon: Candy,
    title: "Chocolate pra Luluzinha",
    description: "Faça a filhinha do dev feliz! 🍫",
    color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
  },
  {
    id: "sandwich",
    amount: 1500, // R$ 15.00
    icon: Sandwich,
    title: "Me pague um sanduíche",
    description: "Ajude o dev a não morrer de fome 🥪",
    color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  },
];

export default function DonationModal({ open, onOpenChange }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const createCheckoutMutation = trpc.donation.createCheckout.useMutation({
    onSuccess: (data) => {
      // Redirect to Stripe checkout
      window.location.href = data.url;
    },
    onError: (error) => {
      alert(`Erro ao criar checkout: ${error.message}`);
    },
  });

  const handleDonate = () => {
    const amount = isCustom ? parseFloat(customAmount) * 100 : selectedAmount;

    if (!amount || amount < 100) {
      alert("Valor mínimo de doação: R$ 1,00");
      return;
    }

    const description = isCustom
      ? "💝 Doação personalizada"
      : DONATION_OPTIONS.find((opt) => opt.amount === amount)?.title || "Doação";

    createCheckoutMutation.mutate({
      amount: Math.round(amount),
      description,
    });
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(cents / 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Heart className="h-6 w-6 text-red-500" />
            Apoie o ResumAI
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Olá! Sou David Sodré, desenvolvedor do ResumAI. Esta ferramenta é gratuita e sempre será.
            Se ela te ajudou, considere fazer uma doação para manter o projeto vivo e ajudar mais pessoas! 💙
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset Options */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Escolha um valor:</Label>
            <div className="grid gap-3">
              {DONATION_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedAmount === option.amount && !isCustom;

                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSelectedAmount(option.amount);
                      setIsCustom(false);
                    }}
                    className={`
                      flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left
                      ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className={`p-3 rounded-full ${option.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900">{option.title}</div>
                      <div className="text-sm text-slate-600">{option.description}</div>
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      {formatCurrency(option.amount)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Ou escolha seu valor:</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600">
                  R$
                </span>
                <Input
                  type="number"
                  placeholder="10.00"
                  min="1"
                  step="0.01"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setIsCustom(true);
                    setSelectedAmount(null);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Donate Button */}
          <Button
            onClick={handleDonate}
            disabled={(!selectedAmount && !customAmount) || createCheckoutMutation.isPending}
            className="w-full h-12 text-base"
            size="lg"
          >
            {createCheckoutMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Processando...
              </>
            ) : (
              <>
                <Heart className="mr-2 h-5 w-5" />
                Fazer Doação
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-slate-500">
            Pagamento seguro via Stripe. Você será redirecionado para completar a doação.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
