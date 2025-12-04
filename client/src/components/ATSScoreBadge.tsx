import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import type { ResumeData } from "@shared/resumeTypes";

interface ATSScoreBadgeProps {
  resumeData: ResumeData;
  className?: string;
}

export default function ATSScoreBadge({ resumeData, className = "" }: ATSScoreBadgeProps) {
  const [score, setScore] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);

  // Mutation ATS score
  const atsScoreMutation = trpc.analysis.atsScore.useMutation();

  useEffect(() => {
    if (resumeData && score === null && !atsScoreMutation.isPending) {
      atsScoreMutation.mutateAsync({ resumeData }).then((result) => {
        setScore(result.overall);
        setBreakdown(result.breakdown);
      }).catch((error) => {
        console.error("Error fetching ATS score:", error);
      });
    }
  }, [resumeData]);

  if (score === null) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500 hover:bg-green-600";
    if (score >= 60) return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-4 w-4" />;
    if (score >= 60) return <AlertCircle className="h-4 w-4" />;
    return <AlertCircle className="h-4 w-4" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bom";
    return "Precisa Melhorar";
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            className={`${getScoreColor(score)} text-white cursor-pointer transition-all duration-300 ${className}`}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            ATS: {score}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="left" className="w-80">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getScoreIcon(score)}
                <span className="font-semibold">Pontuação ATS: {score}/100</span>
              </div>
              <Badge variant="outline">{getScoreLabel(score)}</Badge>
            </div>

            {breakdown && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Breakdown:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Formatação:</span>
                    <span className="font-semibold">{breakdown.formatting}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Palavras-chave:</span>
                    <span className="font-semibold">{breakdown.keywords}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verbos de Ação:</span>
                    <span className="font-semibold">{breakdown.actionVerbs}/25</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Quantificação:</span>
                    <span className="font-semibold">{breakdown.quantification}/25</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              {score >= 80
                ? "Seu currículo está muito bem otimizado para ATS!"
                : score >= 60
                ? "Seu currículo está bom, mas pode melhorar."
                : "Seu currículo precisa de otimizações importantes."}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
