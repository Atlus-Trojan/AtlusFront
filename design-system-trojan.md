# Design System — A.A.A.I. Trojan (Atlética)

Padrão de design extraído das telas anexadas (login, dashboard, sócios, produtos, eventos, loja, perfil).

---

## 1. Paleta de Cores

| Uso | Cor | Hex aprox. |
|---|---|---|
| Primária (sidebar, hero login, botões principais) | Azul marinho escuro | `#0F1E3C` / `#14284F` |
| Ação/Destaque (botões "Entrar", "Salvar", links ativos) | Azul royal | `#1D4ED8` / `#1E4FA3` |
| Fundo principal | Branco | `#FFFFFF` |
| Fundo secundário/hover | Cinza muito claro | `#F5F6F8` |
| Texto primário | Quase preto | `#111827` |
| Texto secundário | Cinza médio | `#6B7280` |
| Sucesso / Adimplente / Em estoque | Verde | `#16A34A` (texto), fundo `#DCFCE7` |
| Erro / Inadimplente / Esgotado | Vermelho | `#DC2626` (texto), fundo `#FEE2E2` |
| Info / Categoria (badges azuis) | Azul claro | `#2563EB` texto, fundo `#DBEAFE` |
| Borda / divisores | Cinza claro | `#E5E7EB` |

**Padrão de badges de status:** pill arredondada, fundo tonalizado claro + texto na cor forte correspondente (verde = positivo, vermelho = negativo, azul = neutro/categoria).

---

## 2. Tipografia

- **Títulos de página** ("DASHBOARD", "GESTÃO DE SÓCIOS", "ESTOQUE E PRODUTOS", "LOJA", "NOVO EVENTO", "MEU PERFIL"): fonte condensada, **bold, caixa alta**, tamanho grande (~28–32px). Dá identidade "esportiva/atlética" à marca.
- **Subtítulo de página** (ex: "Visão geral da atlética"): peso normal, cinza secundário, logo abaixo do título.
- **Rótulos de formulário** (NOME, E-MAIL, SENHA, PLANO...): caixa alta, pequenos (~11–12px), cinza, letter-spacing levemente aberto. Campo obrigatório marcado com `*` vermelho.
- **Corpo/tabelas/cards**: sans-serif regular, ~14–15px, texto primário quase preto.
- **Valores em destaque** (R$ 30.600,00, "3/5", preços de produto): bold, maior que o texto ao redor.

---

## 3. Layout Geral

- **Sidebar fixa à esquerda** (fundo azul marinho, ~250px):
  - Topo: logo circular + nome do sistema ("TROJAN") + subtítulo (instituição).
  - Menu vertical com ícone + label: Dashboard, Sócios, Produtos, Criar Evento, Loja, Eventos. Item ativo destacado com fundo azul mais claro/vibrante e borda arredondada.
  - Rodapé fixo: card do usuário logado (avatar + nome + papel/role) e botão "Sair" com ícone.
- **Área de conteúdo** à direita: fundo branco, padding generoso, título da página no topo + botão de ação primária alinhado à direita (ex: "+ Novo Sócio", "+ Novo Produto").
- **Tela de login**: layout split-screen — metade esquerda com fundo azul + brasão grande semi-transparente + branding institucional; metade direita branca com o formulário de autenticação (inclui seletor de perfil demo: Diretoria / Sócio / Estudante).

---

## 4. Componentes

### Cards de estatística (Dashboard)
Card branco, cantos arredondados, sombra sutil, borda fina. Ícone colorido em caixa arredondada no topo, valor grande em bold, label cinza abaixo.

### Gráficos
- Linha/área para séries temporais (Vendas Mensais).
- Barras para contagens (Novos Sócios/Mês).
Cores na paleta azul da marca, eixos discretos em cinza claro.

### Tabelas (Sócios, Sócios Recentes)
- Cabeçalho em caixa alta, cinza, sem fundo destacado.
- Linhas separadas por divisor fino, sem zebra.
- Coluna de status com badge colorida (adimplente/inadimplente).
- Coluna de ações com ícones (editar = lápis, excluir = lixeira em botão vermelho claro).

### Modais (Novo Sócio, Novo Produto)
- Overlay escurece o fundo (blur/dim).
- Card branco centralizado, cantos arredondados grandes, título + botão fechar (X) no topo.
- Campos empilhados verticalmente com labels acima.
- Rodapé com dois botões: "Cancelar" (secundário, cinza claro) e ação primária (azul, ex: "Salvar").
- Seletor tipo toggle para status (dois botões lado a lado, opção ativa com fundo/borda verde).

### Cards de produto (Produtos / Loja)
- Imagem no topo (proporção larga), com badges sobrepostos: estoque/quantidade (canto superior esquerdo) e categoria (canto superior direito).
- Estado "Esgotado" substitui o badge de estoque por uma tag vermelha central sobre a imagem.
- Nome do produto (bold) + preço (azul, bold) abaixo da imagem.
- Rodapé do card: ações "Editar"/"Excluir" (tela admin) ou botão "Adicionar ao carrinho" / "Indisponível" (tela loja pública).

### Filtros por categoria (Loja)
Pills horizontais ("Todos", "Vestuário", "Acessórios"...), a ativa em azul preenchido, as demais em cinza claro neutro.

### Formulário de página cheia (Criar Evento)
Sem modal — ocupa a área de conteúdo com link "← Voltar" no topo, campos grandes e espaçados, checkbox de opção adicional (ex: notificar estudantes) em card destacado, botões "Cancelar"/"Criar Evento" ao final.

### Página de perfil
Card único e simples: avatar placeholder, nome + badges de papel/status, lista de campos rotulados (Nome, E-mail, Perfil) e ação "Editar dados".

---

## 5. Padrões de Interação

- Botão primário: fundo azul sólido, texto branco, cantos arredondados (~8px), largura frequentemente 100% dentro de modais/forms.
- Botão secundário: fundo cinza claro, texto escuro.
- Ícones de ação destrutiva sempre em vermelho suave (fundo `#FEE2E2`, ícone `#DC2626`).
- Estados vazios/zerados no dashboard (ex: "0 Eventos Futuros") tratados como qualquer outro stat card, sem alarme visual.
- Consistência total de sidebar + header de página em todas as telas internas — só a tela de login foge do padrão (layout dedicado).

---

## 6. Responsividade (Mobile)

As telas anexadas são todas desktop (sidebar fixa lateral). Para adaptar o padrão a mobile, mantendo a identidade visual:

### Breakpoints sugeridos
```css
--bp-mobile: 480px;
--bp-tablet: 768px;
--bp-desktop: 1024px;
```

### Sidebar → Navegação inferior / drawer
- **< 768px**: a sidebar azul deixa de ficar fixa lateral e vira:
  - **Bottom navigation bar** fixa (fundo `--color-primary`), com os 4–5 itens mais usados (Dashboard, Sócios, Produtos, Loja, Eventos) representados só por ícone + label pequeno. "Criar Evento" pode virar um botão flutuante (FAB) ou entrar num menu "mais".
  - Ou **drawer lateral (hambúrguer)**: header superior fixo com logo + ícone de menu que abre a sidebar como overlay deslizante, igual ao visual desktop.
- Card do usuário + "Sair": move para dentro do drawer/menu, ou para um ícone de avatar no header superior que abre um menu suspenso.

### Header de página
- Título grande (bold/caixa alta) permanece, mas reduz tamanho (~20–22px).
- Botão de ação primária ("+ Novo Sócio", "+ Novo Produto") que hoje fica alinhado à direita do título passa a ocupar largura total abaixo do título, ou vira FAB circular no canto inferior direito.

### Cards de estatística (Dashboard)
- Grid de 4 colunas → **2 colunas** em tablet, **1 coluna (empilhado)** em mobile estreito, mantendo ícone + valor + label.

### Gráficos
- Ocupam 100% da largura, empilhados um abaixo do outro (hoje lado a lado).
- Reduzir densidade de labels no eixo X se necessário (ex: mostrar só meses alternados).

### Tabelas (Sócios, Sócios Recentes)
Tabelas tradicionais quebram em telas estreitas. Padrão recomendado:
- **< 640px**: cada linha vira um **card empilhado** — nome em destaque no topo, e-mail/plano/status/ingresso como pares label:valor abaixo, ações (editar/excluir) como ícones no canto do card.
- Busca ("Buscar por nome ou e-mail...") ocupa 100% da largura, fixa no topo da lista.

### Modais (Novo Sócio, Novo Produto)
- Em mobile, o modal passa a ocupar **tela cheia** (full-screen sheet) em vez de card centralizado, ou sobe como **bottom sheet** com cantos arredondados só no topo.
- Botões "Cancelar"/"Salvar" fixos no rodapé (sticky), sempre visíveis mesmo com scroll do formulário.

### Cards de produto (Produtos / Loja)
- Grid de 3 colunas → **2 colunas** em tablet, **1 coluna** em mobile pequeno (imagem maior, mais legível para leitura de badge/preço).
- Filtros por categoria (pills) tornam-se uma **linha com scroll horizontal** em vez de quebrar linha.

### Formulário de página cheia (Criar Evento)
- Campos empilhados já são mobile-friendly; ajustar apenas padding lateral (16px) e os dois campos de data (início/término) que hoje ficam lado a lado passam a empilhar verticalmente.
- Botões "Cancelar"/"Criar Evento" fixos no rodapé (sticky footer), ocupando 100% da largura.

### Perfil
- Card único já responde bem; apenas reduzir padding e permitir que o card ocupe 100% da largura da tela.

### Tipografia e toque
- Aumentar área de toque de botões e ícones de ação para mínimo 44x44px.
- Reduzir escala tipográfica: títulos de página de ~30px → ~22px; manter contraste e peso bold para preservar a identidade.

---

## 7. Tokens sugeridos (para reuso em código)

```css
:root {
  --color-primary: #14284F;
  --color-accent: #1D4ED8;
  --color-bg: #FFFFFF;
  --color-bg-muted: #F5F6F8;
  --color-text: #111827;
  --color-text-muted: #6B7280;
  --color-border: #E5E7EB;
  --color-success-text: #16A34A;
  --color-success-bg: #DCFCE7;
  --color-error-text: #DC2626;
  --color-error-bg: #FEE2E2;
  --color-info-text: #2563EB;
  --color-info-bg: #DBEAFE;

  --radius-card: 12px;
  --radius-button: 8px;
  --radius-badge: 9999px;

  --font-heading: "condensed", sans-serif; /* bold, uppercase */
  --font-body: "sans-serif";
}
```
