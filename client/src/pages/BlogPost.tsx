import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "../lib/trpc";
import { Button } from "../components/ui/button";
import { Calendar, Eye, ArrowLeft, Loader2 } from "lucide-react";
import { trackBlogPostView } from "../lib/analytics";
import ReactMarkdown from "react-markdown";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const { data: post, isLoading } = trpc.blog.getPostBySlug.useQuery(
    { slug },
    { enabled: !!slug }
  );

  // Track view
  useEffect(() => {
    if (post) {
      trackBlogPostView(post.title, post.category || "Sem categoria");
    }
  }, [post]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
          <Link href="/blog">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Blog
            </Button>
          </Link>

          {post.category && (
            <div className="text-sm font-medium text-blue-600 mb-2">
              {post.category}
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Rascunho"}
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              {post.viewCount} visualizações
            </div>
            {post.authorName && (
              <div>Por {post.authorName}</div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {post.featuredImage && (
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-8" />
          )}

          <article className="prose prose-lg max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 pt-8 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.split(",").map((tag) => (
                  <span
                    key={tag.trim()}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white text-center">
            <h3 className="text-2xl font-bold mb-2">
              Pronto para criar seu currículo profissional?
            </h3>
            <p className="mb-4 opacity-90">
              Use o ResumAI e tenha um currículo impecável em minutos!
            </p>
            <Link href="/create">
              <Button size="lg" variant="secondary">
                Criar Meu Currículo Grátis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
