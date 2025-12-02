import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Pencil, Save, X, Plus, Trash2 } from "lucide-react";
import type { ResumeData, Experience, Education } from "@/../../shared/resumeTypes";
import { CustomSectionManager } from "./CustomSectionManager";

interface ResumeEditorProps {
  resumeData: ResumeData;
  onUpdate: (updatedData: ResumeData) => void;
}

export function ResumeEditor({ resumeData, onUpdate }: ResumeEditorProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<ResumeData>(resumeData);

  const handleStartEdit = (section: string) => {
    setEditingSection(section);
    setTempData(resumeData);
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setTempData(resumeData);
  };

  const handleSaveEdit = () => {
    onUpdate(tempData);
    setEditingSection(null);
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setTempData({
      ...tempData,
      personalInfo: {
        ...tempData.personalInfo,
        [field]: value,
      },
    });
  };

  const addExperience = () => {
    setTempData({
      ...tempData,
      experience: [
        ...tempData.experience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const updated = [...tempData.experience];
    updated[index] = { ...updated[index], [field]: value };
    setTempData({ ...tempData, experience: updated });
  };

  const removeExperience = (index: number) => {
    setTempData({
      ...tempData,
      experience: tempData.experience.filter((_, i) => i !== index),
    });
  };

  const addEducation = () => {
    setTempData({
      ...tempData,
      education: [
        ...tempData.education,
        {
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
        },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const updated = [...tempData.education];
    updated[index] = { ...updated[index], [field]: value };
    setTempData({ ...tempData, education: updated });
  };

  const removeEducation = (index: number) => {
    setTempData({
      ...tempData,
      education: tempData.education.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    setTempData({
      ...tempData,
      skills: [...tempData.skills, ""],
    });
  };

  const updateSkill = (index: number, value: string) => {
    const updated = [...tempData.skills];
    updated[index] = value;
    setTempData({ ...tempData, skills: updated });
  };

  const removeSkill = (index: number) => {
    setTempData({
      ...tempData,
      skills: tempData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Info Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Informações Pessoais</CardTitle>
          {editingSection !== "personal" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartEdit("personal")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingSection === "personal" ? (
            <>
              <div>
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  value={tempData.personalInfo.fullName || ""}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={tempData.personalInfo.email || ""}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={tempData.personalInfo.phone || ""}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  value={tempData.personalInfo.location || ""}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="summary">Resumo Profissional</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={tempData.personalInfo.summary || ""}
                  onChange={(e) => updatePersonalInfo("summary", e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="space-y-2 text-sm">
              <p><strong>Nome:</strong> {resumeData.personalInfo.fullName}</p>
              <p><strong>Email:</strong> {resumeData.personalInfo.email}</p>
              {resumeData.personalInfo.phone && (
                <p><strong>Telefone:</strong> {resumeData.personalInfo.phone}</p>
              )}
              {resumeData.personalInfo.location && (
                <p><strong>Localização:</strong> {resumeData.personalInfo.location}</p>
              )}
              {resumeData.personalInfo.summary && (
                <p><strong>Resumo:</strong> {resumeData.personalInfo.summary}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Experiência Profissional</CardTitle>
          {editingSection !== "experience" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartEdit("experience")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingSection === "experience" ? (
            <>
              {tempData.experience.map((exp: Experience, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Experiência {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Empresa</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(index, "company", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Cargo</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          updateExperience(index, "position", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Data Início</Label>
                      <Input
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(index, "startDate", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Data Fim</Label>
                      <Input
                        value={exp.endDate || ""}
                        onChange={(e) =>
                          updateExperience(index, "endDate", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea
                      rows={3}
                      value={exp.description || ""}
                      onChange={(e) =>
                        updateExperience(index, "description", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addExperience} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Experiência
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {resumeData.experience.map((exp: Experience, index: number) => (
                <div key={index} className="pb-4 border-b last:border-0">
                  <h4 className="font-medium">{exp.position}</h4>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.endDate || "Presente"}
                  </p>
                  {exp.description && (
                    <p className="text-sm mt-2">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Education Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Educação</CardTitle>
          {editingSection !== "education" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartEdit("education")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingSection === "education" ? (
            <>
              {tempData.education.map((edu: Education, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Formação {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEducation(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Instituição</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) =>
                          updateEducation(index, "institution", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Grau</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(index, "degree", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Área</Label>
                      <Input
                        value={edu.field || ""}
                        onChange={(e) =>
                          updateEducation(index, "field", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label>Período</Label>
                      <Input
                        value={`${edu.startDate} - ${edu.endDate || ""}`}
                        onChange={(e) => {
                          const [start, end] = e.target.value.split(" - ");
                          updateEducation(index, "startDate", start || "");
                          updateEducation(index, "endDate", end || "");
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addEducation} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Formação
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              {resumeData.education.map((edu: Education, index: number) => (
                <div key={index} className="pb-4 border-b last:border-0">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  {edu.field && (
                    <p className="text-sm text-muted-foreground">{edu.field}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate || "Presente"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Habilidades</CardTitle>
          {editingSection !== "skills" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStartEdit("skills")}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSaveEdit}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {editingSection === "skills" ? (
            <>
              {tempData.skills.map((skill: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => updateSkill(index, e.target.value)}
                    placeholder="Nome da habilidade"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addSkill} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Habilidade
              </Button>
            </>
          ) : (
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Sections */}
      <CustomSectionManager 
        sections={tempData.additionalSections}
        onUpdate={(sections) => {
          setTempData({ ...tempData, additionalSections: sections });
          onUpdate({ ...resumeData, additionalSections: sections });
        }}
      />
    </div>
  );
}
