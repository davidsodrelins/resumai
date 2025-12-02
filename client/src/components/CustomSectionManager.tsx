import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { AdditionalSection } from "@/../../shared/resumeTypes";

interface CustomSectionManagerProps {
  sections: AdditionalSection[];
  onUpdate: (sections: AdditionalSection[]) => void;
}

const SECTION_TEMPLATES = [
  { title: "Projetos", content: "Descreva seus projetos relevantes..." },
  { title: "Publicações", content: "Liste suas publicações acadêmicas ou artigos..." },
  { title: "Voluntariado", content: "Descreva suas experiências de voluntariado..." },
  { title: "Prêmios e Reconhecimentos", content: "Liste prêmios e reconhecimentos recebidos..." },
  { title: "Atividades Extracurriculares", content: "Descreva atividades extracurriculares relevantes..." },
];

export function CustomSectionManager({ sections, onUpdate }: CustomSectionManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;

    const newSection: AdditionalSection = {
      title: newSectionTitle,
      content: newSectionContent,
    };

    onUpdate([...sections, newSection]);
    setNewSectionTitle("");
    setNewSectionContent("");
    setSelectedTemplate(null);
    setIsDialogOpen(false);
  };

  const handleRemoveSection = (index: number) => {
    onUpdate(sections.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, field: "title" | "content", value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    onUpdate(updated);
  };

  const handleSelectTemplate = (template: { title: string; content: string }) => {
    setNewSectionTitle(template.title);
    setNewSectionContent(template.content);
    setSelectedTemplate(template.title);
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === sections.length - 1)
    ) {
      return;
    }

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [
      newSections[targetIndex],
      newSections[index],
    ];
    onUpdate(newSections);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Seções Adicionais</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Seção
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Seção</DialogTitle>
              <DialogDescription>
                Adicione uma seção customizada ao seu currículo ou escolha um template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Templates Pré-definidos</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SECTION_TEMPLATES.map((template) => (
                    <Button
                      key={template.title}
                      variant={selectedTemplate === template.title ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSelectTemplate(template)}
                      className="justify-start"
                    >
                      {template.title}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-title">Título da Seção</Label>
                <Input
                  id="section-title"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  placeholder="Ex: Projetos, Publicações, Voluntariado..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-content">Conteúdo</Label>
                <Textarea
                  id="section-content"
                  value={newSectionContent}
                  onChange={(e) => setNewSectionContent(e.target.value)}
                  rows={6}
                  placeholder="Descreva o conteúdo desta seção..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddSection} disabled={!newSectionTitle.trim()}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {sections.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Nenhuma seção adicional. Clique em "Adicionar Seção" para criar uma.
          </p>
        ) : (
          sections.map((section, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, "up")}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <GripVertical className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveSection(index, "down")}
                    disabled={index === sections.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <GripVertical className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 space-y-2">
                  <Input
                    value={section.title}
                    onChange={(e) => handleUpdateSection(index, "title", e.target.value)}
                    placeholder="Título da seção"
                    className="font-medium"
                  />
                  <Textarea
                    value={section.content}
                    onChange={(e) => handleUpdateSection(index, "content", e.target.value)}
                    rows={4}
                    placeholder="Conteúdo da seção"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSection(index)}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
