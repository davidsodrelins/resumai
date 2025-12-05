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

          <article className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:border-b prose-h2:pb-2
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-6
            prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
            prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-p:text-gray-700
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ul:my-6 prose-ul:space-y-2
            prose-ol:my-6 prose-ol:space-y-2
            prose-li:text-gray-700 prose-li:leading-relaxed
            prose-li:marker:text-blue-600 prose-li:marker:font-bold
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
            prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-600
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-lg prose-img:shadow-md">
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
