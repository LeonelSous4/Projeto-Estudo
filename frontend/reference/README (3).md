# FOCO — Dashboard de Estudos
### Blueprint completo para reconstruir na mão (React + Vite + TS + Tailwind v3)
> Nome provisório: **Foco** · Público: concurso / vestibular / faculdade / programação
> Problema: usuário só vê tempo total, não sabe quanto foi Teoria / Questões / Revisão.
> Idioma: pt-BR · Sem lorem ipsum · Sem imagens externas · Sem hex nos componentes

---

## 1. COMO RODAR (projeto de referência)

```bash
npm install
npm run dev      # http://localhost:5173
npm run test     # vitest run
npm run build    # tsc -b && vite build
```

**Stack:** React 18 + Vite + TypeScript `strict` + Tailwind v3 + lucide-react + Recharts (SÓ para gráfico semanal). Fonte via Google Fonts no `index.html`.

---

## 2. `:root` — COPIE EXATAMENTE (tokens)

```css
:root {
  /* === CORES — fundo / superfície === */
  --page: #EEF0F6;
  --surface: #FFFFFF;
  --surface-alt: #F7F8FB;
  --line: #E6E8F0;

  /* === TEXTO === */
  --ink: #1F2A44;
  --muted: #8A94AD;

  /* === PRIMÁRIA === */
  --primary: #3B4F9A;
  --primary-mid: #6F82C6;
  --primary-soft: #A5B1DB;
  --primary-tint: #EEF1FB;

  /* === DESTAQUE === */
  --accent: #F27C8D;
  --accent-tint: #FFF1F3;

  /* === TIPOS DE ESTUDO — NUNCA use para outra coisa === */
  --teoria: #3B82F6;
  --teoria-tint: #EFF5FF;
  --questoes: #8B5CF6;
  --questoes-tint: #F5F0FF;
  --revisao: #0F9F90;
  --revisao-tint: #E6FAF7;

  /* === FEEDBACK === */
  --success: #22C55E;
  --warning: #F59E0B;

  /* === TIPOGRAFIA === */
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-display: "Plus Jakarta Sans", "Inter", sans-serif;

  /* === RADIUS === */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  /* === SOMBRAS === */
  --shadow-soft: 0 8px 30px rgba(31,42,68,0.06);
  --shadow-card: 0 4px 18px rgba(31,42,68,0.05);
  --shadow-pop: 0 12px 30px rgba(0,0,0,0.12);

  /* === TRANSIÇÃO === */
  --transition: 150ms ease;
  --transition-slow: 200ms ease;
}
```

### `tailwind.config.js` — mapeamento obrigatório
```js
colors: {
  page:'#EEF0F6', surface:'#FFFFFF', surfaceAlt:'#F7F8FB', line:'#E6E8F0',
  ink:'#1F2A44', muted:'#8A94AD',
  primary:'#3B4F9A', primaryMid:'#6F82C6', primarySoft:'#A5B1DB', primaryTint:'#EEF1FB',
  accent:'#F27C8D', accentTint:'#FFF1F3',
  teoria:'#3B82F6', teoriaTint:'#EFF5FF',
  questoes:'#8B5CF6', questoesTint:'#F5F0FF',
  revisao:'#0F9F90', revisaoTint:'#E6FAF7',
  success:'#22C55E', warning:'#F59E0B',
},
fontFamily: { sans:['Inter','system-ui','sans-serif'], display:['Plus Jakarta Sans','Inter','sans-serif'] },
boxShadow: { soft:'0 8px 30px rgba(31,42,68,0.06)', card:'0 4px 18px rgba(31,42,68,0.05)' }
```
> **REGRA DE OURO:** NUNCA escreva hex dentro de `.tsx`. Use `bg-primary`, `text-ink`, `bg-teoriaTint`, etc. Isso permite tema escuro futuro trocando só o config.

### Contraste (AA obrigatório)
| Fundo | Texto permitido |
|---|---|
| `primary`, `primaryMid`, `accent`, `teoria`, `questoes`, `revisao` | branco `#FFFFFF` |
| `primarySoft`, `primaryTint`, `teoriaTint`, `questoesTint`, `revisaoTint`, `accentTint`, `surfaceAlt` | `text-ink` |
| Badge de tipo | `bg-{tipo}Tint` + `text-{tipo}` — ex: `bg-teoriaTint text-teoria` |
| Texto secundário sempre | `text-muted` |

---

## 3. TIPOGRAFIA — ESCALA COMPLETA

| Elemento | Fonte | Peso | Tamanho | Line-height | Letter-spacing | Cor | Exemplo |
|---|---|---|---|---|---|---|---|
| **H1 Saudação** "Olá, Leonel! 👋" | Display | 700 Bold | 28px mobile / 32px desktop | 1.0 (leading-none) | -0.02em | `ink` | `text-[28px] lg:text-[32px] font-display font-bold` |
| **Data** "Sábado, 14 de novembro..." | Sans | 400 Regular | 14px | 1.4 | 0 | `muted` | `text-sm text-muted mt-2` |
| **Título seção** "Meus cadernos..." | Display | 600 Semibold | 16px | 1.3 | 0 | `ink` | `font-display font-semibold` |
| **Título card banner** "Sua meta de hoje" | Display | 600 Semibold | 18px | 1.3 | 0 | branco | `font-display font-semibold text-lg` |
| **Texto banner** | Sans | 400 | 14px | 1.4 | 0 | branco 80% | `text-sm text-white/80` |
| **Número grande card resumo** | Display | 700 Bold | 22px | 1.2 | -0.01em | `ink` | `text-[22px] font-display font-bold` |
| **Timer HH:MM:SS** | Display | 800 Extrabold | 60px mobile / 72px desktop (text-6xl → text-7xl) | 1.0 | -0.03em | `ink` | `font-display text-6xl lg:text-7xl font-extrabold tabular-nums` |
| **Label / rótulo** "TOTAL HOJE" | Sans | 600 Semibold | 12px | 1.3 | 0.04em (uppercase) | `muted` | `text-xs font-semibold uppercase tracking-wide` |
| **Corpo** | Sans | 400 | 14px | 1.5 | 0 | `ink` | `text-sm` |
| **Corpo pequeno** | Sans | 400 | 13px | 1.4 | 0 | `ink` / `muted` | `text-[13px]` |
| **Caption / meta** | Sans | 400/500 | 11px–12px | 1.3 | 0 | `muted` | `text-[11px] / text-xs` |
| **Botão primário** | Sans | 600 Semibold | 14px | 1.4 | 0 | branco | `text-sm font-semibold` |
| **Badge tipo** | Sans | 600 Semibold | 12px | 1.3 | 0 | cor do tipo | `text-xs font-semibold` |
| **Link "Ver todos"** | Sans | 600 | 12px | 1.3 | 0 | `primary` | `text-xs font-semibold text-primary` |

**Google Fonts — `index.html`:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
```

### Formatação de data (ATENÇÃO — erro comum)
NÃO use classe `capitalize` (gera "De Novembro De").
```ts
const s = new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'})
return s.charAt(0).toUpperCase() + s.slice(1)
// → "Sábado, 14 de novembro de 2026"
```

---

## 4. SPACING / LAYOUT — MEDIDAS EXATAS

### Página
| Item | Valor |
|---|---|
| Fundo página | `bg-page` |
| Padding externo | `p-3` mobile (12px) / `p-6` desktop (24px) |
| Container principal | `mx-auto max-w-[1600px] rounded-[32px] shadow-soft` |
| Padding interno container | `p-3` mobile / `p-5` desktop (20px) |
| Gap entre colunas | `gap-5` = 20px |
| Gap vertical dentro do centro | `gap-5` = 20px (Header → Banner → Resumo → Gráfico → Timer → Coleções → Cadernos → Sessões) |
| Gutter mínimo mobile | 16px (nunca menos) |
| Sem scroll horizontal em nenhuma largura | `min-w-0` no main + `overflow-x-auto` SÓ na fileira de coleções |

### Breakpoints
| Faixa | Layout |
|---|---|
| `< 768px` Mobile | 1 coluna, sidebar = BottomNav fixa, RightPanel no fim, `pb-24` (96px) para não ficar atrás da barra |
| `768–1279px` Tablet | Sidebar 240px visível, RightPanel vai para baixo do conteúdo (flex-wrap / coluna) |
| `>= 1280px` Desktop | 3 colunas: Sidebar 240px \| Centro flex-1 \| RightPanel 320px |

### Cards genéricos
| Propriedade | Valor |
|---|---|
| Fundo | `bg-surface` |
| Radius | `rounded-3xl` = 24px (cards grandes) / `rounded-[20px]` (cards pequenos) / `rounded-[32px]` (container) / `rounded-full` (botões pílula, avatar) |
| Sombra | `shadow-soft` |
| Padding card padrão | `p-5` (20px) / `p-6` (24px) em cards grandes como Timer e Gráfico |
| Padding card resumo | `p-4` (16px) |
| Gap interno card | 12–16px |

### Botões
| Tipo | Padding | Radius | Fonte |
|---|---|---|---|
| `+ Novo` (coral) | `px-5 py-2.5` (20px / 10px) | `rounded-full` | 14px semibold branco |
| Pílula tipo | `px-4 py-1.5` | `rounded-full` | 12px semibold |
| Iniciar / Retomar | `px-6 py-3` | `rounded-full` | 14px semibold, `bg-ink text-white` |
| Pausar / Finalizar | `px-5 py-3` | `rounded-full` | 14px semibold |
| Salvar modal | `px-4 py-2` | `rounded-full` | 14px |
| Abrir caderno | `px-3 py-1.5` | `rounded-full` | 12px semibold, `bg-white/20` |
| Perfil | `px-3 py-1.5` | `rounded-full` | 12px semibold, `bg-surfaceAlt text-primary` |

---

## 5. MODELO DE DADOS (`src/types.ts`)

```ts
type TipoEstudo = 'teoria' | 'questoes' | 'revisao'
Colecao { id, nome }
Topico { id, nome, concluido: boolean, prazo?: string } // prazo = ISO date "2026-11-14"
Caderno { id, colecaoId, nome, topicos: Topico[] }
Sessao { id, cadernoId, tipo: TipoEstudo, inicioISO: string, duracaoSeg: number } // ÚNICA unidade: segundos
Configuracao { metaDiariaSeg: 14400 } // 4h
```

### Derivados — SEMPRE calcular em `src/utils/stats.ts`, nunca guardar fixo
- tempo por caderno = soma sessões
- tempo hoje por tipo + total
- progresso tópicos = feitos / total
- total + nº cadernos por coleção
- série 7 dias (por dia e por tipo) → gráfico
- dias com estudo → calendário
- streak = dias consecutivos com estudo até hoje; se hoje sem estudo, conta a partir de ontem sem zerar

### Formatadores (`src/utils/format.ts`)
```ts
formatDuracao(seg) → "2h 15m" | "45m" | "0h 00m"
formatRelogio(ms)  → "HH:MM:SS" // 01:05:09, sempre 2 dígitos
formatPrazo(iso)   → "Hoje" | "Amanhã" | "Qua, 18 nov"
```

---

## 6. CAMADA API (`src/services/studyApi.ts`)

```ts
interface StudyApi {
  listColecoes(): Promise<Colecao[]>
  listCadernos(): Promise<Caderno[]>
  createColecao(nome: string): Promise<Colecao>
  createCaderno(colecaoId: string, nome: string): Promise<Caderno>
  listSessoes(fromISO: string, toISO: string): Promise<Sessao[]>
  createSessao(sessao: Omit<Sessao,'id'>): Promise<Sessao>
  toggleTopico(cadernoId: string, topicoId: string): Promise<Caderno>
}
```
- Implementação `mockStudyApi` guarda em memória + `localStorage` key `foco-v2` com `try/catch` (app funciona mesmo se falhar).
- Componentes NUNCA usam `fetch` direto — usam `useStudyData()`.
- Erro de salvamento → toast discreto `role="status"`, nunca banner fixo.
- **Para back-end real:** trocar SÓ este arquivo. Mapeamento:
  `GET /collections`, `GET /notebooks`, `GET /study-sessions?from=&to=`, `POST /study-sessions`, `POST /collections`, `POST /notebooks`, `PATCH /notebooks/:id/topics/:topicId`

---

## 7. DADOS FICTÍCIOS (`src/data/mockData.ts`)

Coleções: **Programação, Concursos, Faculdade**

| Caderno | Coleção | Tópicos |
|---|---|---|
| JavaScript | Programação | 2/4 |
| TypeScript | Programação | 1/5 |
| Direito Constitucional | Concursos | 0/8 |
| Direito Administrativo | Concursos | 2/6 |
| Cálculo I | Faculdade | 3/3 |
| Banco de Dados | Faculdade | 1/4 |

**HOJE deve ser exatamente (use datas relativas a `new Date()`, não fixas):**
- Teoria 1h00 — JavaScript — 08:30
- Questões 0h45 — Direito Constitucional — 10:15
- Revisão 0h30 — Cálculo I — 14:00
- **Total: 2h15**

Outros 6 dias: totais variados 1h–5h, pelo menos 1 dia batendo meta (4h) e pelo menos 1 dia sem estudo.

**Tópicos pendentes com prazo:**
- "Closures e escopo léxico" — JavaScript — Hoje
- "Princípios da Administração Pública" — Dir. Administrativo — Amanhã
- "Limites laterais" — Cálculo I — daqui a 4 dias

---

## 8. COMPONENTES — ESPECIFICAÇÃO PIXEL A PIXEL

### 8.1 SIDEBAR (240px, `hidden md:flex`)
- Container: `w-[240px] shrink-0 bg-surface rounded-3xl p-5 shadow-soft h-fit sticky top-5`
- Logo: quadrado `w-9 h-9 rounded-xl bg-primary` com "F" branco Display bold + texto "Foco" `font-display font-bold text-xl text-ink`. Gap 8px, margin-bottom 24px.
- Menu: gap 4px (`space-y-1`). Cada item: `w-full flex gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition duration-150`
  - Ativo: `bg-primaryTint text-primary` + `aria-current="page"`
  - Inativo: `text-muted hover:bg-surfaceAlt hover:text-ink`
  - Itens: Dashboard (ativo), Cadernos, Histórico, Estatísticas, Configurações — sem rotas, só visual, mas com hover + focus-visible.
- Rodapé card Dica: `mt-8 bg-surfaceAlt rounded-3xl p-4` — título 14px semibold `text-primary` com ícone Lightbulb 16px + texto 13px `leading-relaxed text-ink`: "Estude em blocos curtos e revise no mesmo dia. Seu cérebro agradece."

### 8.2 BOTTOM NAV (mobile `<768px`)
- `fixed bottom-0 left-0 right-0 bg-surface border-t border-line flex justify-around py-2 px-2 z-40`
- Item: coluna, ícone 20px + rótulo 10px. Ativo `text-primary font-bold`, inativo `text-muted`.

### 8.3 HEADER
- Layout: `flex justify-between gap-4`
- Esquerda: H1 + data (ver §3)
- Direita: botão `+ Novo` coral. Dropdown: `absolute right-0 mt-2 w-48 bg-surface rounded-2xl shadow-soft p-2 border border-line z-20`, itens `w-full text-left px-3 py-2 rounded-xl hover:bg-surfaceAlt text-sm`
- Acessibilidade: `aria-haspopup="menu"`, `aria-expanded`, fecha ao clicar fora e com `Esc`.
- Modais: ver §8.4

### 8.4 MODAIS (Nova Coleção / Novo Caderno)
- Overlay: `fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40` — clique no fundo fecha.
- Caixa: `bg-surface rounded-3xl p-6 w-full max-w-sm shadow-soft`, `role="dialog" aria-modal="true"`
- Fecha com `Esc`, foco vai para primeiro campo.
- Campo: `w-full bg-surfaceAlt rounded-2xl px-4 py-3 text-sm outline-none mb-3`
- Botões: Cancelar `px-4 py-2 rounded-full text-sm` + Salvar `px-4 py-2 rounded-full bg-primary text-white text-sm disabled:opacity-40`
- Salvar desabilitado se nome vazio. Ao salvar, cria via API e aparece na lista + toast.

### 8.5 BANNER META DO DIA
- `relative overflow-hidden bg-gradient-to-br from-primary to-primaryMid rounded-3xl p-6 lg:p-7 text-white`
- Conteúdo `max-w-[75%]` + `relative z-10`
- Título 18px Display semibold, texto 14px `text-white/80`: "Você estudou {Xh YYm} de {meta}."
- Mensagem dinâmica:
  - 0% → "Vamos começar?"
  - <50% → "Bom começo!"
  - 50–99% → "Falta pouco!"
  - >=100% → "Meta batida! 🎉"
- Barra: `h-2` com fundo `bg-white/20` (ou via ProgressBar). Preenchimento: `bg-accent`, se >=100% `bg-success`. Selo: texto 12px `text-white/80` "{pct}% concluído" (máx 100%).
- Decoração direita: `absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block`, 3 formas: círculo 80px `bg-white/10 rounded-full`, retângulo 112px `bg-white/10 rounded-3xl`, círculo 40px `bg-accent/40 rounded-full`.

### 8.6 RESUMO DO DIA — 4 CARDS
- Grid: `grid grid-cols-2 lg:grid-cols-4 gap-4`
- Card: `bg-surface rounded-3xl p-4 shadow-soft`
- Linha 1: ícone quadrado `w-9 h-9 rounded-xl` com Tint + rótulo 12px uppercase `tracking-wide text-muted` — gap 12px.
- Valor: 22px Display bold `mt-3`
- Mini barra: `mt-3 h-1.5 bg-surfaceAlt rounded-full overflow-hidden`, preenchimento cor do tipo, width = % sobre total (0% se sem estudo).
- Cards: 1) Total hoje — Clock — `bg-primaryTint text-primary` / barra `bg-primary` · 2) Teoria — BookOpen — `bg-teoriaTint text-teoria` / `bg-teoria` · 3) Questões — Pencil — `bg-questoesTint text-questoes` / `bg-questoes` · 4) Revisão — RefreshCcw — `bg-revisaoTint text-revisao` / `bg-revisao`

### 8.7 GRÁFICO "Estudo da semana" (Recharts, obrigatório)
- Card: `p-5 lg:p-6`
- Cabeçalho: esquerda título 16px + subtítulo 12px `text-muted` "Total: Xh YYm • Média: Xh YYm/dia" (calculados). Direita legenda customizada (NÃO padrão Recharts): 3 itens `flex gap-1.5 text-xs` — bolinha 10px `bg-teoria / bg-questoes / bg-revisao` + nome.
- Gráfico: `ResponsiveContainer` altura 260px desktop / 220px mobile.
- Barras empilhadas: `stackId="a"`, cores `teoria / questoes / revisao`. `radius={[6,6,0,0]}` SÓ no último segmento (Revisão).
- Eixo X: dias abreviados pt-BR `seg ter qua qui sex sáb dom`, hoje em negrito. Eixo Y: horas `unit="h"`.
- `ReferenceLine y={4} stroke=accent strokeDasharray="6 4"` com rótulo "Meta 4h" 11px semibold coral.
- Tooltip customizado: fundo `bg-surface`, borda `border-line`, `rounded-2xl shadow-soft p-3 text-sm` — título dia por extenso, linha por tipo (bolinha + nome + tempo "1h 30m"), linha final Total com `border-t border-line`.
- Dias sem estudo: barra vazia com traço no eixo, sem quebrar gráfico.
- Acessibilidade: container `role="img" aria-label="Gráfico de barras com o tempo estudado nos últimos 7 dias"` + tabela `sr-only` com mesmos dados logo abaixo.
- `prefers-reduced-motion`: desativar animação do gráfico.

### 8.8 CRONÔMETRO (widget principal)
- Card: `bg-surface rounded-3xl p-6 lg:p-7 shadow-soft border border-line`
- Linha superior: `flex flex-col lg:flex-row gap-4 justify-between lg:items-center`
  - Select caderno: `bg-surfaceAlt px-4 py-2.5 rounded-full text-sm font-medium` com `optgroup` por coleção. **DESABILITADO** quando rodando/pausado (`disabled:opacity-50`).
  - Pílulas tipo: `px-4 py-1.5 rounded-full text-xs font-semibold`, `aria-pressed`. Ativo: `bg-{tipo} text-white`. Inativo: `bg-surfaceAlt text-muted hover:bg-primaryTint hover:text-primary`.
  - Switch Pomodoro: `role="switch" aria-checked`, `w-10 h-6 rounded-full p-1` — ligado `bg-primary`, desligado `bg-line`, bolinha `w-4 h-4 bg-white rounded-full` com `translate-x-4` quando ligado. Só permite trocar com cronômetro parado.
- Centro: `mt-8 flex flex-col items-center`
  - Label: 12px uppercase `tracking-widest text-muted` — "CRONÔMETRO • {Tipo}" ou "POMODORO 25:00 • {Tipo}", tipo com cor do tipo.
  - Display: `mt-3 font-display text-6xl lg:text-7xl font-extrabold tabular-nums` — `HH:MM:SS`.
  - Barra Pomodoro: SÓ no modo Pomodoro — `mt-4 w-full max-w-md h-2 bg-surfaceAlt rounded-full`, preenchimento `bg-accent` com progresso real.
  - Status: `mt-3 text-sm text-muted` — "Escolha um caderno e comece" / "Estudando {caderno} • {tipo}" / "Pausado".
  - Botões: `mt-6 flex gap-3`
    - Parado: só **Iniciar** (`bg-ink text-white px-6 py-3 rounded-full`)
    - Rodando: **Pausar** (`bg-surface border border-line px-5 py-3`) + **Finalizar** (`bg-accent text-white px-5 py-3`)
    - Pausado: **Retomar** (`bg-ink text-white px-6 py-3`) + **Finalizar**
- **Lógica (`src/hooks/useTimer.ts`) — NÃO simplifique:**
  - Tempo SEMPRE por timestamps: `Date.now() - startedAt + accumMs`, nunca `segundos++`.
  - Persiste em `localStorage` key `foco-timer-v2` (`status, cadernoId, tipo, startedAt, accumMs, pomodoro`) com `try/catch`. Recarregar continua correto.
  - Usa `setInterval(250ms)` + `Page Visibility` via timestamps — aba em segundo plano continua correta.
  - Trocar tipo rodando: finaliza atual (salva tipo antigo + caderno correto) e inicia nova imediatamente, sem `setTimeout`. Se <1s, descarta sem salvar.
  - Finalizar: salva `duracaoSeg, inicioISO` via API, atualiza resumo/gráfico/tabela/tempo caderno/calendário na hora.
  - Pomodoro: countdown 25:00. Ao zero, finaliza + salva automaticamente + toast "Pomodoro concluído! Faça uma pausa de 5 minutos." — NUNCA `alert()`.
  - No modo normal NÃO mostrar barra falsa.

### 8.9 MINHAS COLEÇÕES (fileira)
- Acima de "Meus cadernos". Container: `flex gap-3 overflow-x-auto pb-1 snap-x` (scroll só aqui no mobile).
- Card: `min-w-[170px] snap-start rounded-3xl p-4 text-left border`
  - "Todas": selecionado padrão. Mostra "Todas" 12px muted + "{n} cadernos" Display bold.
  - Por coleção: ícone pasta 14px + nome 12px muted, "{n} cadernos" bold, "{Xh YYm} estudadas" 12px muted.
  - Selecionado: `bg-primaryTint border-primary` + `aria-pressed="true"`. Não selecionado: `bg-surface border-line`.
  - Último: "+ Nova coleção" — `border-dashed border-2 border-line`, abre mesmo modal do header.
- Clique filtra cadernos. Teclado: focável, `Enter`/`Espaço` ativa. Mostrar "Mostrando X cadernos".

### 8.10 MEUS CADERNOS RECENTES
- Cabeçalho: título + "Mostrando X de Y" + link "Ver todos" (visual).
- Grade: `grid md:grid-cols-2 xl:grid-cols-3 gap-4`. Ordem: sessão mais recente primeiro. Respeita filtro. Mostra 6 primeiros + botão "Ver mais" se houver mais.
- Card: `rounded-3xl p-5 shadow-soft`
  - Cor por coleção (mesma coleção = mesma cor): Programação `bg-primary text-white`, Concursos `bg-primaryMid text-white`, Faculdade `bg-primarySoft text-ink`, nova coleção cai para `bg-primary`.
  - Etiqueta: ícone pasta 12px + nome coleção 11px semibold opacity 80%.
  - Nome: ícone caderno 18px + nome 18px Display bold.
  - Progresso: texto 12px opacity 90% "2 de 4 tópicos • 50%" + barra `mt-2 h-1.5 bg-black/15 rounded-full` preenchimento `bg-white`.
  - Rodapé: `mt-3 flex justify-between` — "{tempo} estudadas" 12px opacity 80% + botão "Abrir caderno" `text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-semibold` (visual).
- Vazio: "Esta coleção ainda não tem cadernos" + botão "Criar caderno".

### 8.11 SESSÕES DE HOJE (tabela)
- Cabeçalho desktop: `hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr] px-4 text-[11px] font-semibold text-muted uppercase tracking-wide` — Caderno | Tipo | Início | Duração.
- Linha: `bg-surface rounded-2xl lg:rounded-3xl px-4 py-3 grid grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-2 shadow-card` — mobile vira card empilhado.
- Tipo: `TypeBadge` — `bg-{tipo}Tint text-{tipo}`.
- Início: `toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})`. Duração: `formatDuracao`.
- Ordem: mais recente → mais antiga. Só hoje.
- Vazio: ícone Clock + "Nenhuma sessão hoje. Que tal começar agora?"

### 8.12 PAINEL DIREITO (320px)
- **ProfileCard:** `bg-surface rounded-3xl p-5 shadow-soft flex justify-between` — avatar `w-10 h-10 rounded-full bg-primary text-white font-display font-bold` "LN" + nome 14px bold `text-ink` + "Estudante" 12px `text-muted` + botão Perfil `text-xs px-3 py-1.5 rounded-full bg-surfaceAlt text-primary font-semibold` (visual).
- **MiniCalendar:** `bg-surface rounded-3xl p-5 shadow-soft`
  - Título: mês/ano pt-BR `capitalize` aqui é OK porque é nome de mês isolado — ex: "Novembro 2026", 16px Display semibold. Setas: `aria-label="Mês anterior" / "Próximo mês"`, `text-muted`.
  - Cabeçalho dias: `grid grid-cols-7 gap-1 text-[11px] text-center text-muted` — D S T Q Q S S com keys estáveis (`${letra}-${index}`), NUNCA `Math.random`.
  - Células: `h-8 flex items-center justify-center rounded-full text-xs` — hoje `bg-accent text-white font-bold`, com estudo `bg-primaryTint text-primary font-medium` + ponto `absolute bottom-0.5 w-1 h-1 rounded-full bg-teoria`, outro mês `text-muted/50`.
  - Geração: calcule primeiro dia da semana corretamente, sem array fixo de 30 dias. Navegação muda `cursor` (ano/mês).
- **PendingTopics:** `bg-surface rounded-3xl p-5 shadow-soft`
  - Cabeçalho: título + contador `text-xs bg-accentTint text-accent px-2 py-1 rounded-full font-semibold` "{N} pendentes".
  - Item: `flex gap-3 p-3 rounded-2xl bg-surfaceAlt/70 hover:bg-surfaceAlt` — checkbox `accent-[#3B4F9A]` (única exceção permitida para accent nativo) + nome 13px semibold `text-ink` + "Caderno • Prazo" 11px `text-muted`.
  - Ordenado por prazo. Ao marcar: chama `toggleTopico`, atualiza progresso na hora, item some após animação 220ms (`opacity-0 translate-x-2`).
  - Vazio: "Tudo em dia! 🎉".
- **StreakCard:** `bg-surface rounded-3xl p-5 shadow-soft flex gap-3` — ícone `w-10 h-10 rounded-xl bg-accentTint` 🔥 + "🔥 {n} dias seguidos" bold + "estudando sem falhar" 12px muted. Se 0: "Comece hoje sua sequência".

---

## 9. INTERAÇÕES / ACESSIBILIDADE / QUALIDADE

- Hover: `transition duration-150` (150–200ms) em todos cards/botões.
- Focus: `*:focus-visible { outline: 2px solid #3B4F9A; outline-offset: 2px; border-radius: 8px; }` em TODOS interativos.
- Botões só-ícone: `aria-label`.
- Toast: `role="status" aria-live="polite"`, `fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-[60]`, fundo `bg-ink text-white text-sm px-4 py-3 rounded-2xl shadow-soft`, fecha sozinho em 4s + botão ×.
- `prefers-reduced-motion`: desativar animações do gráfico e transições longas.
- Contraste AA em todos textos.
- Zero `console.error/warning`, zero `any` no TS.
- Funções puras em `stats.ts` / `format.ts` separadas dos componentes.

---

## 10. TESTES (`src/utils/stats.test.ts` — Vitest)

Testar: tempo por tipo no dia, série 7 dias, streak, dias com estudo.
```bash
npm run test
```

---

## 11. ESTRUTURA DE ARQUIVOS (nenhum > ~200 linhas)

```
package.json, index.html, vite.config.ts, tsconfig.json, tailwind.config.js, postcss.config.js
src/
  main.tsx, App.tsx, index.css, types.ts
  data/mockData.ts
  services/studyApi.ts
  hooks/useTimer.ts, useStudyData.ts, useToast.ts
  utils/stats.ts, utils/format.ts, utils/stats.test.ts
  components/
    layout/Layout.tsx, Sidebar.tsx, BottomNav.tsx, RightPanel.tsx
    dashboard/Header.tsx, GoalBanner.tsx, SummaryCards.tsx, WeeklyChart.tsx, TimerWidget.tsx, CollectionsRow.tsx, RecentNotebooks.tsx, TodaySessions.tsx
    right/ProfileCard.tsx, MiniCalendar.tsx, PendingTopics.tsx, StreakCard.tsx
    ui/Card.tsx, ProgressBar.tsx, TypeBadge.tsx, Modal.tsx, Toast.tsx, EmptyState.tsx
```

---

## 12. CHECKLIST FINAL ANTES DE ENTREGAR

- [ ] Nenhum hex em `.tsx` (só `tailwind.config.js` + `index.css`)
- [ ] Nenhum `|| 56` ou texto fixo "2h 15m" — tudo calculado
- [ ] Sem sessões → `0h 00m` e `0%`
- [ ] Timer usa `Date.now()`, persiste, continua após reload
- [ ] Pomodoro finaliza sozinho + toast, sem `alert()`
- [ ] Data sem `capitalize` CSS
- [ ] Calendário gera mês corretamente
- [ ] Gráfico empilhado + tooltip custom + tabela `sr-only`
- [ ] `npm run build` sem erro TS
- [ ] `npm run test` passando

---

## 13. O QUE É SÓ VISUAL vs O QUE É REAL

**Só visual:** Menu sidebar (Cadernos, Histórico, Estatísticas, Configurações), "Ver todos", "Abrir caderno", botão "Perfil".
**Real / funcional:** Timer, Pomodoro, criar coleção/caderno, toggle tópico, resumo, gráfico, calendário, streak, sessões, filtro por coleção, toast, modais, persistência localStorage.
**Para back-end real:** trocar SÓ `src/services/studyApi.ts` (ver §6).
