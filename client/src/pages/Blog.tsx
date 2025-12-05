import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "../lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Search, Calendar, Eye, ArrowRight, Loader2 } from "lucide-react";

export default function Blog() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = trpc.blog.getAllPosts.useQuery({
    page,
    limit: 9,
    category,
    search,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === "all" ? undefined : value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container py-12">
          <h1 className="text-4xl font-bold mb-4">Blog ResumAI</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Dicas, guias e estratégias para turbinar sua carreira e conquistar a vaga dos sonhos
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <Input
              placeholder="Buscar artigos..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>

          <Select value={category || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="Dicas de Currículo">Dicas de Currículo</SelectItem>
              <SelectItem value="Carreira Internacional">Carreira Internacional</SelectItem>
              <SelectItem value="LinkedIn e Redes">LinkedIn e Redes</SelectItem>
              <SelectItem value="Desenvolvimento Profissional">Desenvolvimento Profissional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && data && (
          <>
            {data.posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {data.posts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      {post.featuredImage && (
                        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-t-lg" />
                      )}
                      <CardHeader>
                        {post.category && (
                          <div className="text-xs font-medium text-blue-600 mb-2">
                            {post.category}
                          </div>
                        )}
                        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {post.publishedAt
                                ? new Date(post.publishedAt).toLocaleDateString("pt-BR")
                                : "Rascunho"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {post.viewCount}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Paginação */}
            {data.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-2 px-4">
                  Página {page} de {data.totalPages}
                </div>
                <Button
                  variant="outline"
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
