import { useState } from "react";
import { Search, ChevronDown, ChevronUp, FileText, Gift, Calendar, CreditCard, Sparkles, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import GlobalNavigation from "@/components/GlobalNavigation";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Criação de Currículos
  {
    category: "Criação de Currículos",
    question: "Como criar meu primeiro currículo?",
    answer: "É muito simples! Clique em 'Criar Currículo' no menu, escolha entre fazer upload de um currículo existente, inserir URL do LinkedIn ou descrever sua experiência. Nossa IA irá processar as informações e gerar um currículo profissional em minutos. Você pode escolher entre 3 modelos (Reduzido, Misto, Completo) e 5 templates visuais (Clássico, Moderno, Minimalista, Executivo, Criativo).",
  },
  {
    category: "Criação de Currículos",
    question: "Quais formatos de arquivo posso fazer upload?",
    answer: "Aceitamos arquivos PDF e DOCX (Microsoft Word). Nosso sistema extrai automaticamente as informações do seu currículo atual e as processa com IA para criar uma versão otimizada.",
  },
  {
    category: "Criação de Currículos",
    question: "Posso importar meu perfil do LinkedIn?",
    answer: "Sim! Basta copiar a URL do seu perfil público do LinkedIn e colar no campo apropriado. Nossa IA irá extrair suas experiências, educação, habilidades e outras informações relevantes para criar seu currículo.",
  },
  {
    category: "Criação de Currículos",
    question: "Qual a diferença entre os modelos Reduzido, Misto e Completo?",
    answer: "Modelo Reduzido: Currículo de 1 página, focado em experiências mais recentes e relevantes. Ideal para profissionais com menos de 5 anos de experiência. Modelo Misto: Currículo de 1-2 páginas, balanceando detalhes e concisão. Ideal para a maioria dos profissionais. Modelo Completo: Currículo de 2+ páginas com todas as experiências, projetos e certificações. Ideal para profissionais sêniores ou acadêmicos.",
  },
  {
    category: "Criação de Currículos",
    question: "Posso editar o currículo depois de gerado?",
    answer: "Sim! Após a geração, você pode editar qualquer seção do currículo usando nosso editor interativo. Clique em 'Editar' em qualquer seção para fazer alterações. As mudanças são salvas automaticamente a cada 30 segundos.",
  },
  {
    category: "Criação de Currículos",
    question: "Em quais idiomas posso gerar meu currículo?",
    answer: "Oferecemos suporte para 3 idiomas: Português (PT-BR), Inglês (EN-US) e Espanhol (ES). A IA adapta não apenas o idioma, mas também as convenções culturais de cada região.",
  },
  {
    category: "Criação de Currículos",
    question: "Como funciona a otimização ATS?",
    answer: "ATS (Applicant Tracking System) são sistemas que empresas usam para filtrar currículos automaticamente. Nossa IA otimiza seu currículo para passar nesses sistemas, usando palavras-chave relevantes, formatação adequada e estrutura compatível. Você recebe uma pontuação de 0-100 e sugestões específicas de melhoria.",
  },
  {
    category: "Criação de Currículos",
    question: "Posso exportar meu currículo em diferentes formatos?",
    answer: "Sim! Você pode exportar seu currículo em 3 formatos: PDF (com cores do template escolhido), DOCX (editável no Microsoft Word) e LaTeX (para usuários avançados). Todos os formatos preservam a formatação profissional.",
  },

  // Sistema de Indicações
  {
    category: "Sistema de Indicações",
    question: "Como funciona o programa 'Indique e Ganhe'?",
    answer: "Compartilhe seu link único de indicação com amigos e colegas. Quando alguém se cadastrar usando seu link, você ganha recompensas! Existem 4 níveis progressivos: Bronze (1-4 indicações): +2 currículos grátis por indicação. Prata (5-9 indicações): Currículos ilimitados por 1 mês. Ouro (10-19 indicações): Currículos ilimitados por 3 meses. Platina (20+ indicações): Currículos ilimitados PARA SEMPRE!",
  },
  {
    category: "Sistema de Indicações",
    question: "Onde encontro meu link de indicação?",
    answer: "Seu link único está disponível na página 'Indique e Ganhe' no menu principal. Você também pode acessá-lo através do Dashboard. O link tem o formato: https://resumai.davidsodre.com/?ref=SEU_CODIGO",
  },
  {
    category: "Sistema de Indicações",
    question: "Como sei quantas pessoas se cadastraram com meu link?",
    answer: "Na página 'Indique e Ganhe', você pode ver em tempo real: número total de indicações, seu nível atual, progresso para o próximo nível, currículos bônus acumulados e data de validade do acesso ilimitado (se aplicável). Também mostramos um ranking dos top 10 indicadores da plataforma!",
  },
  {
    category: "Sistema de Indicações",
    question: "Quando recebo as recompensas?",
    answer: "As recompensas são concedidas automaticamente assim que sua indicação se cadastra e confirma o email. Você receberá uma notificação por email e um toast no dashboard informando sobre a recompensa. Se você subir de nível, receberá um email especial comemorativo!",
  },
  {
    category: "Sistema de Indicações",
    question: "Os currículos bônus expiram?",
    answer: "Currículos bônus do nível Bronze (+2 por indicação) não expiram e se acumulam. Acesso ilimitado dos níveis Prata e Ouro tem validade de 1 e 3 meses, respectivamente. Nível Platina oferece acesso ilimitado PARA SEMPRE, sem expiração!",
  },
  {
    category: "Sistema de Indicações",
    question: "Posso compartilhar meu link nas redes sociais?",
    answer: "Sim! Incentivamos o compartilhamento. Na página 'Indique e Ganhe', oferecemos botões de compartilhamento direto para WhatsApp, LinkedIn, Twitter e Facebook. Você também pode copiar o link e compartilhar onde quiser!",
  },

  // Limites Mensais
  {
    category: "Limites Mensais",
    question: "Quantos currículos posso criar gratuitamente?",
    answer: "Usuários gratuitos podem criar até 5 currículos por mês. O contador é resetado automaticamente no primeiro dia de cada mês. Apoiadores (doadores) têm acesso ilimitado!",
  },
  {
    category: "Limites Mensais",
    question: "Como funciona o reset mensal?",
    answer: "Seu limite de currículos é resetado automaticamente a cada 30 dias a partir da data do seu primeiro currículo do mês. Por exemplo, se você criou seu primeiro currículo em 15 de janeiro, seu limite será resetado em 15 de fevereiro.",
  },
  {
    category: "Limites Mensais",
    question: "O que acontece se eu atingir o limite de 5 currículos?",
    answer: "Quando você atingir o limite, aparecerá uma mensagem informando que você precisa aguardar o reset mensal ou se tornar um apoiador. Você ainda pode editar e exportar currículos já criados, mas não poderá gerar novos até o reset ou upgrade.",
  },
  {
    category: "Limites Mensais",
    question: "Como ter currículos ilimitados?",
    answer: "Existem 3 formas: 1) Apoiar o projeto com uma doação (a partir de R$ 5,00) e ganhar acesso ilimitado permanente. 2) Participar do programa 'Indique e Ganhe' e atingir nível Prata ou superior. 3) Acumular currículos bônus através de indicações (nível Bronze).",
  },
  {
    category: "Limites Mensais",
    question: "Currículos editados contam no limite?",
    answer: "Não! Apenas a criação de novos currículos conta no limite mensal. Você pode editar, exportar e comparar currículos existentes quantas vezes quiser, sem consumir seu limite.",
  },

  // Doações e Apoio
  {
    category: "Doações e Apoio",
    question: "Como posso apoiar o projeto?",
    answer: "Clique no botão 'Apoiar' no menu principal. Oferecemos 4 opções temáticas: Café (R$ 5), Chocolate (R$ 10), Sanduíche (R$ 15) ou valor personalizado. O pagamento é processado via Stripe de forma segura.",
  },
  {
    category: "Doações e Apoio",
    question: "Quais são os benefícios de ser apoiador?",
    answer: "Apoiadores recebem: Currículos ilimitados PARA SEMPRE (sem limite mensal), Badge especial 'Apoiador ⭐' no perfil, Prioridade no suporte, Acesso antecipado a novos recursos e Nosso eterno agradecimento! 💙",
  },
  {
    category: "Doações e Apoio",
    question: "O pagamento é seguro?",
    answer: "Sim! Usamos o Stripe, uma das plataformas de pagamento mais seguras do mundo, usada por empresas como Amazon, Google e Shopify. Não armazenamos dados de cartão de crédito em nossos servidores.",
  },
  {
    category: "Doações e Apoio",
    question: "Posso cancelar minha doação?",
    answer: "As doações são únicas (não são recorrentes/mensais). Uma vez feita, você mantém os benefícios de apoiador permanentemente. Não há cobrança mensal ou necessidade de cancelamento.",
  },
  {
    category: "Doações e Apoio",
    question: "Posso doar mais de uma vez?",
    answer: "Sim! Você pode fazer quantas doações quiser. O valor total doado é acumulado e exibido no seu perfil. Cada doação reforça seu status de apoiador e ajuda a manter a plataforma funcionando!",
  },

  // Recursos Avançados
  {
    category: "Recursos Avançados",
    question: "O que é análise de Soft Skills?",
    answer: "Nossa IA analisa seu currículo e identifica soft skills presentes (comunicação, liderança, trabalho em equipe, etc.). Também sugere soft skills relevantes para sua área que você pode adicionar, com exemplos contextualizados de como demonstrá-las.",
  },
  {
    category: "Recursos Avançados",
    question: "Como funciona a comparação de versões?",
    answer: "Você pode selecionar duas versões diferentes do seu currículo e visualizá-las lado a lado. O sistema destaca as diferenças em cores (verde para adições, vermelho para remoções), facilitando a análise de mudanças.",
  },
  {
    category: "Recursos Avançados",
    question: "O que é o Portfolio Web?",
    answer: "Transforme seu currículo em um site profissional em segundos! Escolha entre 3 templates responsivos (Moderno, Minimalista, Profissional), personalize cores e tema (claro/escuro), e publique automaticamente. Você recebe uma URL pública para compartilhar com recrutadores.",
  },
  {
    category: "Recursos Avançados",
    question: "Como funciona a geração de Cartas de Apresentação?",
    answer: "Acesse a página 'Carta de Apresentação', preencha os dados da vaga (empresa, cargo, descrição), escolha o idioma e clique em 'Gerar'. Nossa IA cria uma carta personalizada baseada no seu currículo e nos requisitos da vaga. Você pode editar e exportar em PDF ou DOCX.",
  },
  {
    category: "Recursos Avançados",
    question: "Posso salvar múltiplas versões do mesmo currículo?",
    answer: "Sim! O sistema salva automaticamente todas as versões que você cria. Acesse a página 'Histórico' para ver todos os seus currículos, filtrar por template, idioma ou modelo, e restaurar qualquer versão anterior.",
  },
];

const categories = [
  { name: "Todos", icon: FileText },
  { name: "Criação de Currículos", icon: FileText },
  { name: "Sistema de Indicações", icon: Gift },
  { name: "Limites Mensais", icon: Calendar },
  { name: "Doações e Apoio", icon: CreditCard },
  { name: "Recursos Avançados", icon: Sparkles },
];

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todos" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <GlobalNavigation />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Central de Ajuda
          </h1>
          <p className="text-lg text-slate-600">
            Encontre respostas para as perguntas mais frequentes sobre o ResumAI
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar perguntas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = selectedCategory === category.name;
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </button>
            );
          })}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-slate-500 text-lg">
                Nenhuma pergunta encontrada. Tente buscar por outros termos.
              </p>
            </Card>
          ) : (
            filteredFAQs.map((item, index) => {
              const isExpanded = expandedItems.includes(index);
              return (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {item.question}
                      </h3>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-6 pb-4 pt-2 border-t bg-slate-50">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Ainda tem dúvidas?</h2>
          <p className="text-blue-50 mb-6">
            Nossa equipe está pronta para ajudar! Entre em contato conosco.
          </p>
          <a
            href="mailto:news@resumai.davidsodre.com"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Enviar Email
          </a>
        </Card>
      </div>
    </div>
  );
}
