import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { ArrowLeft, Save, Eye } from "lucide-react";
import ReactMarkdown from "react-markdown";

export function AdminBlogEditor() {
  const [, params] = useRoute("/admin/blog/edit/:id");
  const [, navigate] = useLocation();
  const postId = params?.id ? parseInt(params.id) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [showPreview, setShowPreview] = useState(false);

  // Carregar post existente se estiver editando
  const { data: postData } = trpc.blog.getPostBySlug.useQuery(
    { slug: "" }, // Precisaríamos do slug, mas vamos usar getAdminPosts
    { enabled: false }
  );

  const createMutation = trpc.blog.createPost.useMutation({
    onSuccess: () => {
      alert("Post criado com sucesso!");
      navigate("/admin/blog");
    },
  });

  const updateMutation = trpc.blog.updatePost.useMutation({
    onSuccess: () => {
      alert("Post atualizado com sucesso!");
      navigate("/admin/blog");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title,
      content,
      excerpt: excerpt || undefined,
      category: category || undefined,
      tags: tags || undefined,
      metaDescription: metaDescription || undefined,
      status,
    };

    if (postId) {
      updateMutation.mutate({ id: postId, ...postData });
    } else {
      createMutation.mutate(postData);
    }
  };

  const categories = [
    "Dicas de Currículo",
    "Carreira Internacional",
    "LinkedIn e Redes",
    "Desenvolvimento Profissional",
    "Entrevistas",
    "Mercado de Trabalho",
  ];

  return (
    <div className="container py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/admin/blog">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            {postId ? "Editar Post" : "Novo Post"}
          </h1>
          <p className="text-muted-foreground">
            Crie conteúdo otimizado para SEO
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPreview(!showPreview)}
        >
          <Eye className="h-4 w-4 mr-2" />
          {showPreview ? "Editar" : "Preview"}
        </Button>
      </div>

      {showPreview ? (
        <div className="prose prose-lg max-w-none border rounded-lg p-8 bg-background">
          <h1>{title || "Título do Post"}</h1>
          <p className="text-muted-foreground">{excerpt}</p>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Como Criar um Currículo ATS-Friendly"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Resumo (Excerpt)</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descrição do post (aparece na listagem)"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
            <Textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)"
              maxLength={160}
              rows={2}
            />
            <p className="text-xs text-muted-foreground">
              {metaDescription.length}/160 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="ATS, currículo, recrutamento, otimização"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo (Markdown) *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Título Principal&#10;&#10;## Subtítulo&#10;&#10;Seu conteúdo aqui..."
              rows={20}
              className="font-mono text-sm"
              required
            />
            <p className="text-xs text-muted-foreground">
              Use Markdown para formatar o conteúdo. Suporta títulos (##), listas (*), negrito (**), etc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value: "draft" | "published" | "archived") =>
                  setStatus(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {postId ? "Atualizar Post" : "Criar Post"}
            </Button>
            <Link href="/admin/blog">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
