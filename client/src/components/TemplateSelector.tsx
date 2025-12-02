import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { ResumeTemplate } from "@/../../shared/resumeTypes";

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onSelect: (template: ResumeTemplate) => void;
}

const TEMPLATES = [
  {
    id: "classic" as ResumeTemplate,
    name: "Clássico",
    description: "Design tradicional e profissional, ideal para setores conservadores",
    preview: {
      bg: "bg-white",
      headerBg: "bg-slate-100",
      accentColor: "bg-slate-700",
      textColor: "text-slate-900",
    },
  },
  {
    id: "modern" as ResumeTemplate,
    name: "Moderno",
    description: "Design contemporâneo com cores vibrantes, perfeito para startups e tech",
    preview: {
      bg: "bg-white",
      headerBg: "bg-gradient-to-r from-blue-500 to-purple-600",
      accentColor: "bg-blue-600",
      textColor: "text-slate-900",
    },
  },
  {
    id: "minimal" as ResumeTemplate,
    name: "Minimalista",
    description: "Clean e simples, foca no conteúdo sem distrações visuais",
    preview: {
      bg: "bg-white",
      headerBg: "bg-white border-b-2 border-slate-300",
      accentColor: "bg-slate-400",
      textColor: "text-slate-800",
    },
  },
  {
    id: "executive" as ResumeTemplate,
    name: "Executivo",
    description: "Formal e sofisticado, ideal para cargos de liderança",
    preview: {
      bg: "bg-slate-50",
      headerBg: "bg-slate-800",
      accentColor: "bg-amber-600",
      textColor: "text-slate-900",
    },
  },
  {
    id: "creative" as ResumeTemplate,
    name: "Criativo",
    description: "Design ousado e diferenciado para profissionais criativos",
    preview: {
      bg: "bg-gradient-to-br from-pink-50 to-purple-50",
      headerBg: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
      accentColor: "bg-purple-600",
      textColor: "text-slate-900",
    },
  },
];

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escolha um Template</CardTitle>
        <CardDescription>
          Selecione o estilo visual do seu currículo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`relative p-4 border-2 rounded-lg transition-all hover:shadow-lg ${
                selectedTemplate === template.id
                  ? "border-blue-600 shadow-lg"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Template Preview */}
              <div className={`${template.preview.bg} rounded-lg overflow-hidden shadow-sm mb-3`}>
                <div className={`${template.preview.headerBg} h-16 flex items-center justify-center`}>
                  <div className="w-12 h-2 bg-white/80 rounded"></div>
                </div>
                <div className="p-3 space-y-2">
                  <div className={`h-2 ${template.preview.accentColor} rounded w-3/4`}></div>
                  <div className="h-1 bg-slate-300 rounded w-full"></div>
                  <div className="h-1 bg-slate-300 rounded w-5/6"></div>
                  <div className="h-1 bg-slate-300 rounded w-4/6"></div>
                  <div className="mt-3 space-y-1">
                    <div className={`h-2 ${template.preview.accentColor} rounded w-2/3`}></div>
                    <div className="h-1 bg-slate-300 rounded w-full"></div>
                    <div className="h-1 bg-slate-300 rounded w-full"></div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="text-left">
                <h3 className="font-semibold text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-slate-600">{template.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
