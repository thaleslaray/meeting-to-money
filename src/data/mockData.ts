import { DiagnosticCardProps } from "@/components/diagnostics/DiagnosticCard";
import { AutomationSuggestion } from "@/components/diagnostics/AutomationSuggestionCard";

export const mockDiagnostics: DiagnosticCardProps[] = [
  {
    id: "1",
    title: "Análise Imobiliária Premium",
    sector: "Imobiliária",
    suggestionsCount: 5,
    createdAt: "05/11/2025",
    status: "completed",
  },
  {
    id: "2",
    title: "Diagnóstico Restaurante",
    sector: "Restaurante",
    suggestionsCount: 4,
    createdAt: "04/11/2025",
    status: "completed",
  },
  {
    id: "3",
    title: "Análise E-commerce",
    sector: "E-commerce",
    suggestionsCount: 6,
    createdAt: "03/11/2025",
    status: "in_progress",
  },
];

export const mockSuggestions: AutomationSuggestion[] = [
  {
    id: "s1",
    name: "Automação de Captura de Leads",
    description:
      "Sistema automatizado para capturar leads de múltiplos canais (site, redes sociais, WhatsApp) e centralizar em um único CRM. Inclui qualificação automática e distribuição para equipe.",
    impact: "high",
    complexity: "moderate",
    estimatedDays: 7,
    tools: "Make, Google Sheets, WhatsApp Business API",
    priorityScore: 1.5,
  },
  {
    id: "s2",
    name: "Resposta Automática WhatsApp",
    description:
      "Bot inteligente para responder perguntas frequentes no WhatsApp, agendar visitas e enviar materiais sobre imóveis. Funciona 24/7 e reduz tempo de resposta.",
    impact: "high",
    complexity: "easy",
    estimatedDays: 5,
    tools: "N8n, WhatsApp Business API, ChatGPT",
    priorityScore: 3.0,
  },
  {
    id: "s3",
    name: "Gestão de Follow-up Automático",
    description:
      "Sistema que acompanha leads automaticamente enviando mensagens personalizadas em intervalos estratégicos. Aumenta taxa de conversão através de nurturing consistente.",
    impact: "medium",
    complexity: "moderate",
    estimatedDays: 6,
    tools: "Make, Google Sheets, Email/WhatsApp",
    priorityScore: 1.0,
  },
  {
    id: "s4",
    name: "Relatórios Semanais Automáticos",
    description:
      "Dashboard que consolida dados de vendas, leads e performance da equipe. Gera relatórios automáticos e envia para gestores toda segunda-feira.",
    impact: "medium",
    complexity: "easy",
    estimatedDays: 4,
    tools: "Google Data Studio, Make, Google Sheets",
    priorityScore: 2.0,
  },
  {
    id: "s5",
    name: "Integração CRM com Marketing",
    description:
      "Conecta CRM com ferramentas de marketing digital para rastreamento completo da jornada do lead. Permite análise de ROI de campanhas e otimização de investimento.",
    impact: "low",
    complexity: "advanced",
    estimatedDays: 12,
    tools: "Zapier, Meta Ads API, Google Ads API, CRM",
    priorityScore: 0.33,
  },
];

export const mockInputText = `Reunião com imobiliária XYZ - 05/11/2025

Cliente: Imobiliária de médio porte com 15 corretores
Principais problemas identificados:
- Leads chegam de forma dispersa (WhatsApp pessoal, Instagram, site)
- Demoram muito para responder leads (às vezes 24h+)
- Perdem o controle de follow-ups
- Corretores gastam tempo repetindo informações básicas
- Dificuldade em medir resultados de campanhas

Expectativa: Automatizar processos repetitivos e melhorar tempo de resposta`;

export const mockPlanDocument = `# PLANO DE TRABALHO - IMOBILIÁRIA XYZ

## 1. RESUMO DO PROBLEMA
A imobiliária enfrenta desafios na gestão de leads que chegam de múltiplos canais, resultando em:
- Tempo de resposta lento (24h+)
- Perda de oportunidades por falta de follow-up
- Trabalho manual repetitivo da equipe
- Dificuldade em medir eficiência das ações de marketing

## 2. SOLUÇÃO PROPOSTA
Implementação de 3 automações prioritárias:
1. **Captura Centralizada de Leads** - Unificar todos os canais em um hub central
2. **Resposta Automática WhatsApp** - Bot para responder instantaneamente 24/7
3. **Gestão de Follow-up** - Sistema automatizado de nutrição de leads

## 3. ETAPAS DE IMPLEMENTAÇÃO

### Fase 1: Configuração de Infraestrutura (Dias 1-3)
- Configurar WhatsApp Business API
- Criar conta Make/N8n
- Estruturar planilha central de leads
- Mapear fluxo de dados entre canais

### Fase 2: Captura e Centralização (Dias 4-7)
- Integrar formulário do site com planilha
- Conectar Instagram DMs
- Configurar recebimento WhatsApp
- Criar regras de qualificação automática

### Fase 3: Resposta Automática (Dias 8-12)
- Desenvolver fluxo de conversa do bot
- Treinar respostas para FAQs
- Configurar envio de materiais
- Testar e ajustar linguagem

### Fase 4: Follow-up Automatizado (Dias 13-18)
- Criar sequências de mensagens
- Definir gatilhos e intervalos
- Configurar personalização
- Implementar rastreamento de engajamento

## 4. BENEFÍCIOS ESPERADOS
**Tangíveis:**
- Redução de 90% no tempo de primeira resposta (de 24h para minutos)
- Aumento estimado de 40% na conversão de leads
- Economia de 15h/semana da equipe em tarefas repetitivas

**Qualitativos:**
- Melhor experiência do lead
- Profissionalização da comunicação
- Dados centralizados para decisões estratégicas
- Escalabilidade do atendimento

## 5. PRAZO ESTIMADO
**18 dias úteis** (aproximadamente 4 semanas)

*Nota: Este prazo assume dedicação parcial e inclui tempo para testes e ajustes*`;

export const mockPricingAdvice = `# ORIENTAÇÃO DE PRECIFICAÇÃO

## ANÁLISE DO ESCOPO
Com base nas 3 automações selecionadas, temos:
- **Tempo estimado total:** 18 dias úteis
- **Complexidade predominante:** Moderada (2 automações) + Fácil (1 automação)
- **Impacto no negócio:** Alto (2 automações) + Médio (1 automação)

## ABORDAGENS DE PRECIFICAÇÃO

### 1. Time-Based (Baseado em Tempo)
**Cálculo:**
- 18 dias × 8 horas = 144 horas
- Faixa de mercado: R$ 50-150/hora para automações no-code
- **Range sugerido:** R$ 7.200 - R$ 21.600

**Quando usar:** Projetos com escopo bem definido e cliente que valoriza transparência de horas trabalhadas.

### 2. Complexity-Based (Baseado em Complexidade)
**Referência de mercado por tipo:**
- Automação Fácil: R$ 2.000 - R$ 4.000
- Automação Moderada: R$ 4.000 - R$ 8.000
- Automação Avançada: R$ 8.000 - R$ 15.000+

**Para este projeto (2 moderadas + 1 fácil):**
- **Range sugerido:** R$ 10.000 - R$ 20.000

**Quando usar:** Cliente foca no resultado final, não no processo.

### 3. Value-Based (Baseado em Valor)
**Análise de impacto:**
- Lead médio da imobiliária: ~R$ 500 (comissão por venda)
- Aumento estimado: 40% na conversão
- Se processam 50 leads/mês: +20 conversões = +R$ 10.000/mês
- **Valor anual gerado:** ~R$ 120.000

**Precificação sugerida (10-20% do valor primeiro ano):**
- **Range sugerido:** R$ 12.000 - R$ 24.000

**Quando usar:** Cliente entende claramente o ROI e valoriza resultados mensuráveis.

## 💡 RECOMENDAÇÃO ESTRATÉGICA

**Para este projeto, sugiro:**
- **Valor base:** R$ 15.000
- **Estrutura:** 50% início + 50% entrega
- **Garantia:** 30 dias de ajustes inclusos
- **Suporte:** 2 meses de suporte básico incluso

**Justificativa:**
1. Está dentro da faixa de mercado em todas as metodologias
2. Reflete complexidade técnica + impacto no negócio
3. Permite margem para negociação se necessário
4. ROI do cliente é recuperado em 1-2 meses

## ⚠️ REFLEXÃO IMPORTANTE

**Você está considerando cobrar menos?**
Lembre-se:
- Seu trabalho vai gerar R$ 10k/mês para o cliente
- São 18 dias de trabalho técnico especializado
- Inclui suporte e ajustes pós-entrega
- Mercado pratica esses valores para este tipo de projeto

**Cobrar abaixo de R$ 10.000 pode:**
- Desvalorizar seu trabalho
- Criar expectativas de preços baixos futuros
- Atrair clientes que não valorizam o serviço
- Comprometer sua sustentabilidade

**Pense:** Se investir R$ 15.000 para ganhar R$ 120.000/ano, o cliente tem ROI de 700%. É um excelente negócio para ele!`;
