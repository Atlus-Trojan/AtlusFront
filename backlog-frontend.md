### [Sprint 1] Inicializar projeto frontend com stack definida
<!-- sdd-bot:meta id="BL-001" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-173" dependsOn="" -->
**Tipo:** tech-debt
**Prioridade:** must

**Descrição:**
Criar o projeto frontend usando Vite com template React 18+ e TypeScript, e instalar/configurar as dependências: Tailwind CSS (com tailwind.config.js e postcss.config.js), Axios (instância base em src/services/api.ts), React Query (QueryClientProvider em src/main.tsx), Context API (estrutura de pastas src/contexts), React Hook Form, Zod (integração via @hookform/resolvers/zod) e Lucide React. Estruturar o projeto com pastas src/components, src/pages, src/services, src/contexts e src/hooks.

**Comportamento esperado:**
Ao rodar `npm run dev`, a aplicação inicia sem erros no console e uma página inicial renderiza um componente estilizado com classes Tailwind e um ícone do Lucide React.

**Critérios de aceite:**
- [ ] Quando executar `npm install && npm run dev`, então o servidor Vite inicia na porta 5173 sem mensagens de erro no terminal.
- [ ] Quando inspecionar package.json, então as dependências react@^18, vite, tailwindcss, axios, @tanstack/react-query, react-hook-form, zod e lucide-react constam em dependencies ou devDependencies.
- [ ] Quando uma classe utilitária Tailwind (ex.: `bg-blue-500`) for aplicada a um elemento de teste, então o estilo de fundo azul correspondente é renderizado no elemento na tela.
- [ ] Quando o arquivo tailwind.config.js estiver ausente ou mal configurado, então o build falha com erro `Cannot apply unknown utility class` no console.

**Especificidade técnica:**
- Campos: `src/services/api.ts`, `src/contexts`, `tailwind.config.js`, `postcss.config.js`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-173 (ver requirements.json)

---

### [Sprint 1] Configurar build e deploy do frontend na Vercel
<!-- sdd-bot:meta id="BL-002" epic="Deployment" layer="frontend" requirementIds="REQ-332" dependsOn="" -->
**Tipo:** tech-debt
**Prioridade:** must

**Descrição:**
Configurar o projeto Vercel apontando para o repositório do frontend, definindo o Build Command como `npm run build` (ou `vite build`), o Output Directory como `dist` e o Install Command como `npm install`. Adicionar/validar o arquivo vercel.json (se necessário) para rewrites de SPA (fallback para index.html em rotas client-side).

**Comportamento esperado:**
Ao realizar push na branch configurada para produção, a Vercel executa o build e publica a aplicação em uma URL pública acessível, exibindo a versão mais recente do frontend.

**Critérios de aceite:**
- [ ] Quando um push for feito na branch de produção, então a Vercel dispara um novo deploy e o painel exibe o status "Ready".
- [ ] Quando o build for executado, então o comando `npm run build` gera o diretório dist/ contendo index.html e os assets estáticos (js/css) sem erros de compilação.
- [ ] Quando o usuário acessar uma rota client-side diretamente pela URL (ex.: /dashboard), então a Vercel retorna o index.html via rewrite ao invés de HTTP 404.
- [ ] Quando o build falhar por erro de compilação TypeScript ou lint, então a Vercel marca o deploy com status "Error" e a URL de produção anterior permanece ativa (deploy não é promovido).

**Especificidade técnica:**
- Códigos HTTP: 404
- Campos: `Build Command`, `Output Directory`, `vercel.json`, `dist/`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-332 (ver requirements.json)

---

### [Sprint 1] Configurar variável VITE_API_URL para URL da API
<!-- sdd-bot:meta id="BL-003" epic="Deployment" layer="frontend" requirementIds="REQ-333" dependsOn="REQ-332" -->
**Tipo:** tech-debt
**Prioridade:** must
**Depende de:** REQ-332

**Descrição:**
Definir a variável de ambiente VITE_API_URL nos arquivos .env (desenvolvimento local) e nas configurações de Environment Variables do projeto na Vercel (produção), e consumi-la na instância Axios base (src/services/api.ts) via `import.meta.env.VITE_API_URL` como baseURL das requisições.

**Comportamento esperado:**
Ao trocar o valor de VITE_API_URL entre ambientes (local e produção) e rebuildar, as requisições HTTP do frontend são enviadas para o host da API correspondente sem alteração de código.

**Critérios de aceite:**
- [ ] Quando o arquivo .env local definir VITE_API_URL=http://localhost:3000, então as requisições Axios feitas pelo frontend têm baseURL igual a http://localhost:3000.
- [ ] Quando a variável VITE_API_URL estiver configurada no painel da Vercel para o ambiente de produção, então o build de produção usa esse valor como baseURL nas chamadas à API.
- [ ] Quando VITE_API_URL não estiver definida em nenhum ambiente, então a aplicação lança um erro explícito no console na inicialização (mensagem "VITE_API_URL não definida") em vez de fazer requisições para uma URL undefined.
- [ ] Quando o arquivo .env.example for consultado, então ele contém a chave VITE_API_URL com um valor de exemplo documentado.

**Especificidade técnica:**
- Campos: `VITE_API_URL`, `src/services/api.ts`, `.env`, `.env.example`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-333 (ver requirements.json)

---

### [Sprint 4] Deslogar usuário automaticamente ao expirar token JWT
<!-- sdd-bot:meta id="BL-004" epic="8.1 Autenticação" layer="frontend" requirementIds="REQ-239" dependsOn="REQ-238" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-238

**Descrição:**
Implementar no AuthContext (ou interceptor HTTP) uma verificação da expiração do token JWT armazenado. Ao detectar token expirado (via decodificação do campo `exp` do JWT ou resposta 401 do backend em qualquer requisição autenticada), disparar a rotina de logout: limpar `token` e `user` do localStorage, resetar o estado do AuthContext e redirecionar para a rota `/login`.

**Comportamento esperado:**
O usuário com token expirado é automaticamente removido da sessão ativa e visualiza a tela de login, sem precisar clicar em 'Sair'.

**Critérios de aceite:**
- [ ] Quando o token JWT armazenado tiver o campo `exp` menor que o timestamp atual, então o sistema deve limpar `token` e `user` do localStorage e redirecionar para `/login`.
- [ ] Quando uma requisição autenticada retornar status 401 por token expirado, então o AuthContext deve executar o logout e redirecionar o usuário para `/login`.
- [ ] Quando o logout automático ocorrer, então uma mensagem 'Sua sessão expirou. Faça login novamente.' deve ser exibida na tela de login.
- [ ] Quando o token ainda estiver válido (exp maior que o timestamp atual), então nenhuma ação de logout deve ser disparada e o usuário permanece na sessão ativa.
- [ ] Quando não houver token no localStorage no momento da verificação, então o sistema não deve tentar decodificar ou comparar `exp`, evitando erro de parsing.

**Especificidade técnica:**
- Códigos HTTP: 401
- Campos: `token`, `user`, `exp`, `localStorage`
- Precisa de esclarecimento: sim — Não foi definido o mecanismo de checagem: polling periódico do `exp` (e se sim, com qual intervalo) ou apenas reativo via 401 nas respostas do backend.

**Rastreabilidade:** REQ-239 (ver requirements.json)

---

### [Sprint 4] Salvar token e dados do usuário após login
<!-- sdd-bot:meta id="BL-005" epic="9.1 Fluxo de Login com Auto-Atletica" layer="frontend" requirementIds="REQ-263" dependsOn="REQ-262" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-262

**Descrição:**
Após resposta bem-sucedida do endpoint de login, persistir o `token` JWT e o objeto `user` retornado pelo backend nas chaves `token` e `user` do localStorage (serializando `user` via `JSON.stringify`), e atualizar o estado do AuthContext (`setToken`, `setUser`, `isAuthenticated`) para refletir a sessão ativa.

**Comportamento esperado:**
Após o login, o token e os dados do usuário ficam disponíveis tanto no localStorage quanto no AuthContext, mantendo a sessão mesmo após recarregar a página.

**Critérios de aceite:**
- [ ] Quando o login retornar status 200 com `token` e `user` no corpo da resposta, então ambos devem ser gravados no localStorage nas chaves `token` e `user`.
- [ ] Quando o login for concluído, então o AuthContext deve atualizar `isAuthenticated` para `true` e expor os dados de `user` para os componentes consumidores.
- [ ] Quando a página for recarregada após login, então o AuthContext deve reidratar o estado lendo `token` e `user` do localStorage, sem exigir novo login.
- [ ] Quando o login retornar status 401 (credenciais inválidas), então nenhum dado deve ser gravado no localStorage e o AuthContext deve permanecer com `isAuthenticated` igual a `false`.
- [ ] Quando o valor de `user` no localStorage estiver corrompido ou não for um JSON válido durante a reidratação, então o AuthContext deve limpar a sessão e tratar o usuário como não autenticado.

**Especificidade técnica:**
- Códigos HTTP: 200, 401
- Campos: `token`, `user`, `isAuthenticated`, `localStorage`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-263 (ver requirements.json)

---

### [Sprint 4] Redirecionar para dashboard após login com Auto-Atlética
<!-- sdd-bot:meta id="BL-006" epic="9.1 Fluxo de Login com Auto-Atletica" layer="frontend" requirementIds="REQ-264" dependsOn="REQ-263" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-263

**Descrição:**
Configurar a rota de login para, após a persistência de sessão (REQ-263) confirmar `isAuthenticated` igual a `true`, chamar a navegação programática (ex.: `useNavigate` do React Router) para a rota `/dashboard`, substituindo a entrada de histórico da página de login.

**Comportamento esperado:**
Imediatamente após o login válido, o usuário é levado à tela do dashboard sem precisar navegar manualmente.

**Critérios de aceite:**
- [ ] Quando o login retornar status 200 e o AuthContext atualizar `isAuthenticated` para `true`, então o sistema deve navegar automaticamente para a rota `/dashboard`.
- [ ] Quando o redirecionamento para `/dashboard` ocorrer, então a rota `/login` deve ser substituída no histórico do navegador (via `replace`), impedindo retorno à tela de login pelo botão 'voltar'.
- [ ] Quando o login retornar status 401 (credenciais inválidas), então nenhum redirecionamento deve ocorrer e o usuário permanece na tela `/login`.
- [ ] Quando um usuário já autenticado (com `isAuthenticated` igual a `true`) acessar diretamente a rota `/login`, então ele deve ser redirecionado para `/dashboard` sem exibir o formulário.

**Especificidade técnica:**
- Códigos HTTP: 200, 401
- Campos: `isAuthenticated`, `/dashboard`, `/login`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-264 (ver requirements.json)

---

### [Sprint 5] Adicionar seletor de atlética ativa no navbar
<!-- sdd-bot:meta id="BL-007" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-15" dependsOn="REQ-14" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-14

**Descrição:**
Implementar componente de seleção (dropdown/select) no navbar que lista as atléticas vinculadas ao usuário autenticado (obtidas via endpoint de vínculos, dependência REQ-14) e permite alternar a 'atlética ativa' persistida no contexto/sessão do frontend (ex.: localStorage ou estado global via Context/Redux), disparando atualização dos dados exibidos nas telas dependentes da atlética selecionada.

**Comportamento esperado:**
Ao abrir o navbar, o usuário vê a lista de atléticas às quais está vinculado e, ao selecionar uma diferente da atual, a aplicação passa a exibir dados referentes à nova atlética ativa sem recarregar a página inteira.

**Critérios de aceite:**
- [ ] Quando o usuário possui vínculo com 2 ou mais atléticas, então o seletor no navbar exibe todas elas com a atualmente ativa marcada/destacada.
- [ ] Quando o usuário seleciona uma atlética diferente no seletor, então o estado global de 'atlética ativa' é atualizado e persistido (ex.: localStorage) para sobreviver a reload da página.
- [ ] Quando o usuário possui vínculo com apenas 1 atlética, então o seletor é exibido em modo desabilitado ou oculto, sem opção de troca.
- [ ] Quando o usuário não possui nenhum vínculo ativo, então o seletor exibe estado vazio com mensagem 'Nenhuma atlética vinculada' e nenhuma seleção é permitida.
- [ ] Quando a requisição de listagem de vínculos (REQ-14) falha, então o navbar exibe indicador de erro no seletor sem quebrar o restante da navegação.

**Especificidade técnica:**
- Campos: `atleticaAtiva`, `vinculos`
- Precisa de esclarecimento: sim — Não foi especificado o endpoint exato de listagem de vínculos nem o mecanismo de persistência (localStorage vs cookie vs estado de sessão no backend) da atlética ativa.

**Rastreabilidade:** REQ-15 (ver requirements.json)

---

### [Sprint 5] Criar tela AprovacoesPage para revisão de cadastros
<!-- sdd-bot:meta id="BL-008" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-297" dependsOn="REQ-296" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-296

**Descrição:**
Desenvolver o componente de página AprovacoesPage no frontend que consome o endpoint de listagem de cadastros pendentes (dependência REQ-296) e renderiza tabela/lista com ações de aprovar cada cadastro, disparando chamada ao endpoint de aprovação correspondente e atualizando a lista local após resposta bem-sucedida.

**Comportamento esperado:**
O usuário da diretoria acessa a AprovacoesPage, visualiza os cadastros pendentes com seus dados relevantes e, ao clicar em aprovar, o item sai da lista de pendentes refletindo a mudança de status.

**Critérios de aceite:**
- [ ] Quando a diretoria acessa a AprovacoesPage e existem cadastros pendentes, então a lista exibe nome, e-mail e data de solicitação de cada cadastro retornado pelo endpoint (REQ-296).
- [ ] Quando a diretoria clica em 'Aprovar' em um item da lista, então o sistema envia a requisição de aprovação e, em caso de resposta 200, remove o item da lista sem exigir reload manual.
- [ ] Quando não há cadastros pendentes, então a tela exibe mensagem 'Nenhum cadastro pendente' em vez de lista vazia sem contexto.
- [ ] Quando a requisição de aprovação retorna erro (ex.: 409 por cadastro já processado ou 500), então a tela exibe mensagem de erro específica e mantém o item na lista.
- [ ] Quando o carregamento inicial da lista de pendentes falha (ex.: erro 500 ou timeout), então a página exibe estado de erro com opção de tentar novamente.

**Especificidade técnica:**
- Códigos HTTP: 200, 409, 500
- Campos: `nome`, `email`, `dataSolicitacao`, `status`
- Precisa de esclarecimento: sim — Falta definir o nome exato do endpoint de aprovação e se a ação de aprovar exige confirmação adicional (ex.: modal) antes de efetivar.

**Rastreabilidade:** REQ-297 (ver requirements.json)

---

### [Sprint 5] Restringir acesso à AprovacoesPage por permissão de diretoria
<!-- sdd-bot:meta id="BL-009" epic="Troubleshooting" layer="frontend" requirementIds="REQ-361" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar controle de acesso na rota/página AprovacoesPage baseado na role/permissão do usuário autenticado (ex.: verificação de claim ou flag 'diretoria' no token/contexto de autenticação), redirecionando ou bloqueando usuários sem a permissão adequada, e exibindo ações de visualizar e gerenciar (aprovar/rejeitar) apenas para quem possui essa permissão.

**Comportamento esperado:**
Usuários com permissão de diretoria acessam a AprovacoesPage e conseguem visualizar e gerenciar aprovações pendentes; usuários sem essa permissão são impedidos de acessar a rota.

**Critérios de aceite:**
- [ ] Quando um usuário com role/permissão de diretoria acessa a rota da AprovacoesPage, então a página é renderizada normalmente com as ações de gerenciamento disponíveis.
- [ ] Quando um usuário sem permissão de diretoria tenta acessar a rota da AprovacoesPage diretamente pela URL, então o sistema redireciona para uma página de acesso negado ou para a home, sem renderizar os dados de aprovações.
- [ ] Quando o usuário não está autenticado (sem token/sessão válida), então o acesso à rota é bloqueado e redirecionado para a tela de login.
- [ ] Quando a verificação de permissão do usuário falha por erro na API/contexto de autenticação, então a tela trata o erro exibindo estado de bloqueio em vez de expor o conteúdo da página por padrão.

**Especificidade técnica:**
- Códigos HTTP: 401, 403
- Campos: `role`, `permissao`
- Precisa de esclarecimento: sim — Não foi especificado o nome exato da claim/permissão (ex.: 'DIRETORIA_APROVACOES') nem a rota de destino em caso de acesso negado.

**Rastreabilidade:** REQ-361 (ver requirements.json)

---

### [Sprint 6] Exibir preço riscado e desconto em verde no checkout
<!-- sdd-bot:meta id="BL-010" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-6" dependsOn="REQ-5" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-5

**Descrição:**
Na tela de checkout, renderizar o preço original do item (obtido do endpoint de checkout/pedido, campo precoOriginal) com estilo text-decoration: line-through, e ao lado o precoFinal (após aplicação do desconto retornado pelo REQ-5) em cor verde, calculado como precoOriginal - (precoOriginal * percentualDesconto). Quando não houver desconto aplicável (percentualDesconto = 0), o preço original riscado não deve ser exibido, apenas o preço final em cor padrão.

**Comportamento esperado:**
O usuário visualiza no checkout o preço original riscado acima ou ao lado do preço final em verde quando há desconto ativo; quando não há desconto, apenas o preço final é exibido sem risco.

**Critérios de aceite:**
- [ ] Quando a diretoria ativa do usuário possui desconto > 0%, então o checkout exibe o preço original com line-through e o preço final em verde (#008000 ou equivalente definido no design system).
- [ ] Quando o desconto é 0% ou não configurado, então o checkout exibe apenas o preço final sem risco e sem cor verde.
- [ ] Quando o valor do desconto retornado pela API é inválido (negativo ou maior que 100%), então o frontend exibe o preço original sem aplicar desconto e loga um erro no console.
- [ ] Quando a API de checkout não retorna o campo precoOriginal, então o componente exibe apenas o precoFinal sem quebrar a renderização.

**Especificidade técnica:**
- Campos: `precoOriginal`, `precoFinal`, `percentualDesconto`
- Limites: percentualDesconto entre 0 e 100
- Precisa de esclarecimento: sim — Não foi especificado o código hexadecimal exato da cor verde nem o componente/endpoint exato do checkout que retorna precoOriginal e precoFinal; assume-se dependência do contrato definido em REQ-5.

**Rastreabilidade:** REQ-6 (ver requirements.json)

---

### [Sprint 6] Atualizar diretoriaAtiva no AuthContext após troca
<!-- sdd-bot:meta id="BL-011" epic="9.2 Fluxo de Trocar Atletica" layer="frontend" requirementIds="REQ-270" dependsOn="REQ-269" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-269

**Descrição:**
Após a chamada de sucesso ao endpoint de troca de atlética (definido em REQ-269), disparar uma action/dispatch no AuthContext do frontend para atualizar o campo diretoriaAtiva com o novo objeto de diretoria retornado pela API, persistindo a mudança em memória (e em storage local, se aplicável) para que todos os componentes consumidores do contexto reflitam o novo valor sem necessidade de reload da página.

**Comportamento esperado:**
Imediatamente após a troca de atlética ser confirmada pelo backend, todos os componentes que consomem o AuthContext (ex.: header, checkout, perfil) exibem a nova diretoriaAtiva sem recarregar a página.

**Critérios de aceite:**
- [ ] Quando o endpoint de troca de atlética retorna 200 com o objeto da nova diretoria, então o AuthContext.diretoriaAtiva é atualizado com esse objeto.
- [ ] Quando o AuthContext é atualizado, então componentes consumidores (ex.: header) re-renderizam exibindo o nome da nova diretoria sem reload manual da página.
- [ ] Quando o endpoint de troca retorna erro (4xx/5xx), então o AuthContext.diretoriaAtiva permanece com o valor anterior e nenhuma atualização é disparada.
- [ ] Quando o usuário atualiza a página (F5) após a troca, então diretoriaAtiva persiste com o novo valor, refletindo a fonte de verdade do backend.

**Especificidade técnica:**
- Códigos HTTP: 200
- Campos: `diretoriaAtiva`
- Precisa de esclarecimento: sim — Não foi especificado se o AuthContext usa storage persistente (localStorage/cookie) ou apenas estado em memória, nem o nome exato do endpoint de troca (dependência REQ-269).

**Rastreabilidade:** REQ-270 (ver requirements.json)

---

### [Sprint 6] Adicionar atlética ao perfil via código de curso
<!-- sdd-bot:meta id="BL-012" epic="Operações Comuns" layer="frontend" requirementIds="REQ-365" dependsOn="REQ-364" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-364

**Descrição:**
Implementar tela/formulário no frontend com campo de input para o código de curso, que ao ser submetido chama o endpoint de vínculo de atlética (dependente de REQ-364) enviando o código informado, associando a diretoria correspondente ao perfil do aluno logado.

**Comportamento esperado:**
O aluno insere um código de curso válido e, após confirmar, passa a ter a atlética correspondente vinculada ao seu perfil, visível na lista de diretorias associadas.

**Critérios de aceite:**
- [ ] Quando o aluno submete um código de curso válido e existente, então o endpoint retorna 200/201 e a atlética correspondente é adicionada à lista de diretorias do perfil do aluno.
- [ ] Quando o código informado não corresponde a nenhuma diretoria cadastrada, então a API retorna 404 e o frontend exibe a mensagem 'Código de curso inválido'.
- [ ] Quando o campo de código é submetido vazio, então o frontend bloqueia o envio e exibe a mensagem 'Informe o código do curso' sem chamar a API.
- [ ] Quando a atlética referente ao código já está associada ao perfil do aluno, então a API retorna 409 e o frontend exibe a mensagem 'Você já está vinculado a esta atlética'.

**Especificidade técnica:**
- Códigos HTTP: 200, 201, 404, 409
- Campos: `codigoCurso`
- Precisa de esclarecimento: sim — Não foi especificado o nome exato do endpoint, o formato/tamanho do código de curso, nem se há limite de diretorias que um aluno pode associar ao perfil.

**Rastreabilidade:** REQ-365 (ver requirements.json)

---

### [Sprint 6] Editar campo de desconto da diretoria na tela Diretorias
<!-- sdd-bot:meta id="BL-013" epic="Operações Comuns" layer="frontend" requirementIds="REQ-368" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Na tela de administração de Diretorias, adicionar campo editável de desconto (percentual) por diretoria, que ao ser salvo envia requisição PATCH/PUT ao endpoint de atualização de diretoria com o novo valor no campo desconto, restrito a usuários com perfil administrador.

**Comportamento esperado:**
O administrador edita o percentual de desconto de uma diretoria na tela de Diretorias e, ao salvar, o novo valor é persistido e refletido na listagem e no cálculo de desconto do checkout.

**Critérios de aceite:**
- [ ] Quando o administrador informa um valor de desconto entre 0 e 100 e salva, então a API retorna 200 e o valor atualizado é exibido na listagem de diretorias.
- [ ] Quando o administrador informa um valor de desconto negativo ou maior que 100, então o frontend bloqueia o envio e exibe a mensagem 'Desconto deve estar entre 0 e 100'.
- [ ] Quando um usuário sem perfil administrador tenta acessar a edição, então a API retorna 403 e a interface não exibe o campo editável.
- [ ] Quando a diretoria sendo editada não existe mais (foi excluída por outro admin), então a API retorna 404 e o frontend exibe a mensagem 'Diretoria não encontrada'.

**Especificidade técnica:**
- Códigos HTTP: 200, 403, 404
- Campos: `desconto`
- Limites: desconto entre 0 e 100 (percentual)
- Precisa de esclarecimento: sim — Não foi especificado o nome exato do endpoint de atualização de diretoria nem se o desconto é um valor inteiro ou decimal (ex.: casas decimais permitidas).

**Rastreabilidade:** REQ-368 (ver requirements.json)

---

### [Sprint 7] Listar sócios filtrados por atlética
<!-- sdd-bot:meta id="BL-014" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-22" dependsOn="REQ-21,REQ-1" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-21, REQ-1

**Descrição:**
Implementar na tela de gestão de sócios um componente de listagem que consome o endpoint de sócios (dependente de REQ-21/REQ-1) aplicando filtro pelo campo atleticaId da atlética atualmente selecionada/logada, exibindo os registros retornados em tabela ou lista no frontend.

**Comportamento esperado:**
O usuário visualiza apenas os sócios vinculados à atlética selecionada, sem ver sócios de outras atléticas na listagem.

**Critérios de aceite:**
- [ ] Quando a tela de sócios for carregada com uma atlética selecionada, então somente sócios com atleticaId igual ao da atlética atual são exibidos na lista.
- [ ] Quando a atlética não possuir nenhum sócio cadastrado, então a lista exibe estado vazio com mensagem 'Nenhum sócio encontrado' em vez de tabela em branco.
- [ ] Quando a requisição ao endpoint de sócios retornar erro (ex.: 500 ou timeout), então a tela exibe mensagem de falha ao carregar e não trava em estado de loading infinito.
- [ ] Quando o filtro por atlética for alterado, então a lista é recarregada exibindo apenas os sócios da nova atlética selecionada.

**Especificidade técnica:**
- Códigos HTTP: 200, 500
- Campos: `atleticaId`
- Precisa de esclarecimento: sim — Não especificado o endpoint exato (ex.: GET /socios?atleticaId=) nem se há paginação; assumir necessidade de definição antes da implementação.

**Rastreabilidade:** REQ-22 (ver requirements.json)

---

### [Sprint 7] Exibir grid de produtos para sócio e aluno
<!-- sdd-bot:meta id="BL-015" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-25" dependsOn="REQ-24" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-24

**Descrição:**
Criar componente de grid no frontend que renderiza os produtos retornados pelo endpoint/serviço de produtos (dependente de REQ-24), visível para usuários com role SOCIO ou ALUNO, reutilizando o componente de card de produto para cada item da coleção.

**Comportamento esperado:**
Usuários logados como SOCIO ou ALUNO acessam uma tela com produtos organizados em grid, cada um renderizado como card individual.

**Critérios de aceite:**
- [ ] Quando um usuário com role SOCIO acessar a tela de produtos, então a grid exibe todos os produtos disponíveis retornados pela API.
- [ ] Quando um usuário com role ALUNO acessar a mesma tela, então a grid exibe os mesmos produtos disponíveis, sem itens exclusivos de outra role.
- [ ] Quando não houver produtos disponíveis, então a grid exibe mensagem de estado vazio em vez de área em branco.
- [ ] Quando um usuário sem role SOCIO ou ALUNO tentar acessar a tela, então o acesso é negado ou redirecionado conforme regra de autorização existente.

**Especificidade técnica:**
- Códigos HTTP: 200, 403
- Campos: `role`
- Precisa de esclarecimento: sim — Não especificado se há paginação/infinite scroll na grid nem o layout responsivo (colunas por breakpoint).

**Rastreabilidade:** REQ-25 (ver requirements.json)

---

### [Sprint 7] Criar componente ProductCard com preço e desconto
<!-- sdd-bot:meta id="BL-016" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-198" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Desenvolver o componente ProductCard no frontend, recebendo via props os dados do produto (imagem, nome, preço original, percentual de desconto, preço final), renderizando condicionalmente o preço original com estilo riscado apenas quando houver desconto, além do botão de ação 'Comprar' que dispara evento/callback para adicionar o produto ao carrinho.

**Comportamento esperado:**
O card exibe visualmente imagem, nome, preço (riscado quando aplicável), percentual de desconto e preço final, com botão de compra funcional.

**Critérios de aceite:**
- [ ] Quando o produto possuir desconto maior que 0%, então o card exibe o preço original riscado, o percentual de desconto e o preço final calculado.
- [ ] Quando o produto não possuir desconto (0%), então o card exibe apenas o preço final, sem preço riscado nem percentual.
- [ ] Quando o campo imagem do produto estiver ausente ou inválido, então o card exibe uma imagem placeholder padrão em vez de quebrar o layout.
- [ ] Quando o botão 'Comprar' for clicado, então o callback/evento de adicionar ao carrinho é disparado com o id do produto correspondente.

**Especificidade técnica:**
- Campos: `imagem`, `nome`, `precoOriginal`, `percentualDesconto`, `precoFinal`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-198 (ver requirements.json)

---

### [Sprint 7] Aplicar desconto de sócio no preço exibido no ProductCard
<!-- sdd-bot:meta id="BL-017" epic="9.3 Fluxo de Compra com Desconto" layer="frontend" requirementIds="REQ-273" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Alterar o componente ProductCard para calcular e exibir o preço final considerando o percentual de desconto associado à role SOCIO do usuário logado, obtendo esse percentual do contexto/serviço de usuário e aplicando a fórmula de desconto sobre o preço original do produto antes de renderizar.

**Comportamento esperado:**
Usuários com role SOCIO visualizam no card o preço já reduzido pelo percentual de desconto correspondente ao seu perfil, distinto do preço exibido para outras roles.

**Critérios de aceite:**
- [ ] Quando o usuário logado tiver role SOCIO e percentual de desconto configurado, então o preço final exibido no card corresponde a precoOriginal menos o percentual aplicado.
- [ ] Quando o usuário logado não for SOCIO (ex.: ALUNO), então o card exibe o preço original sem aplicar o desconto de sócio.
- [ ] Quando o percentual de desconto do sócio for 0% ou não definido, então o card exibe o preço original sem preço riscado.
- [ ] Quando o serviço de desconto do usuário falhar ao carregar, então o card exibe o preço original como fallback em vez de quebrar a renderização.

**Especificidade técnica:**
- Campos: `percentualDesconto`, `role`, `precoFinal`
- Precisa de esclarecimento: sim — Não especificado de onde vem o percentual de desconto do sócio (endpoint/campo do usuário) nem a fórmula exata de arredondamento do preço final.

**Rastreabilidade:** REQ-273 (ver requirements.json)

---

### [Sprint 7] Exibir preço riscado, desconto e preço final na compra
<!-- sdd-bot:meta id="BL-018" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-274" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar no componente de tela de compra (product detail / grid item) a renderização de três elementos de preço a partir dos dados do produto retornados pela API (preço base, percentual/valor de desconto calculado pela role do sócio e preço final): (1) preço base com estilo text-decoration: line-through, (2) valor do desconto em destaque (ex.: badge ou texto secundário), (3) preço final em destaque visual (fonte maior/cor de ênfase). O cálculo do desconto por role já deve ser fornecido pelo backend; o frontend apenas exibe os três valores retornados.

**Comportamento esperado:**
Ao abrir a tela de compra de um produto com desconto aplicável à role do usuário, o usuário visualiza simultaneamente o preço base riscado, o valor do desconto e o preço final destacado, com o preço final claramente maior/mais evidente visualmente que os demais.

**Critérios de aceite:**
- [ ] Quando o produto possui desconto para a role do usuário logado, então a tela exibe o preço base com estilo riscado (line-through).
- [ ] Quando o produto possui desconto para a role do usuário logado, então a tela exibe o valor/percentual do desconto separadamente do preço base e do preço final.
- [ ] Quando o produto possui desconto para a role do usuário logado, então o preço final é exibido com destaque visual (ex.: maior tamanho de fonte ou cor diferenciada) em relação ao preço riscado.
- [ ] Quando o produto não possui desconto (desconto igual a zero) para a role do usuário, então apenas o preço final é exibido, sem o preço riscado nem o bloco de desconto.
- [ ] Quando a API não retorna o campo de preço final (ex.: erro ou dado ausente), então a tela exibe um estado de indisponibilidade de preço em vez de renderizar valores vazios ou 'NaN'.

**Especificidade técnica:**
- Campos: `basePrice`, `discountValue`, `finalPrice`
- Precisa de esclarecimento: sim — Não há definição de quais campos exatos da API retornam preço base, desconto e preço final, nem o formato numérico/moeda (ex.: centavos vs decimal, locale de exibição).

**Rastreabilidade:** REQ-274 (ver requirements.json)

---

### [Sprint 7] Exibir CheckoutModal ao clicar em Comprar
<!-- sdd-bot:meta id="BL-019" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-275" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente CheckoutModal, acionado pelo evento onClick do botão 'Comprar' na tela do produto/carrinho, que sobrepõe a interface atual exibindo um resumo da compra (itens, preço final calculado por role) e ações de confirmar ou cancelar. O estado de abertura/fechamento do modal deve ser controlado localmente (ex.: state isCheckoutOpen) e o modal deve bloquear interação com o restante da tela enquanto aberto (overlay).

**Comportamento esperado:**
Ao clicar no botão 'Comprar', o usuário visualiza um modal sobreposto à tela atual contendo o resumo da compra e as opções de confirmar ou cancelar, sem navegar para outra página.

**Critérios de aceite:**
- [ ] Quando o usuário clica em 'Comprar' com ao menos um item no carrinho, então o CheckoutModal é exibido sobre a tela atual com o resumo dos itens e o valor final.
- [ ] Quando o usuário clica na ação de cancelar ou fora da área do modal, então o CheckoutModal é fechado e nenhuma compra é registrada.
- [ ] Quando o usuário confirma a compra dentro do modal, então o modal é fechado e o fluxo de checkout é acionado (chamada ao endpoint de finalização de compra).
- [ ] Quando o carrinho está vazio, então o clique em 'Comprar' não abre o CheckoutModal e uma mensagem informando carrinho vazio é exibida.
- [ ] Quando o CheckoutModal está aberto, então elementos da tela por trás dele ficam inacessíveis a cliques (overlay bloqueando interação).

**Especificidade técnica:**
- Campos: `CheckoutModal`, `isCheckoutOpen`
- Precisa de esclarecimento: sim — Não há definição do endpoint/payload de finalização de compra a ser chamado na confirmação, nem do comportamento exato após sucesso ou falha da requisição (ex.: código HTTP de sucesso, mensagem de erro exibida).

**Rastreabilidade:** REQ-275 (ver requirements.json)

---

### [Sprint 8] Exibir lista de eventos para sócio e aluno
<!-- sdd-bot:meta id="BL-020" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-31" dependsOn="REQ-30" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-30

**Descrição:**
Implementar tela/rota de listagem de eventos (ex.: /eventos) que consome o endpoint GET /api/eventos e renderiza os eventos disponíveis, restringindo o acesso a usuários autenticados com role SOCIO ou ALUNO. A tela deve consumir os dados de eventos criados no REQ-30 (backend/CRUD de eventos) e aplicar filtro de visibilidade conforme role do usuário logado.

**Comportamento esperado:**
Usuários com role SOCIO ou ALUNO acessam a rota /eventos e visualizam a lista de eventos disponíveis com nome, data e status; usuários com outras roles não visualizam essa lista.

**Critérios de aceite:**
- [ ] Quando um usuário com role SOCIO acessa /eventos, então a lista de eventos retornados por GET /api/eventos é exibida com nome, data e local de cada evento.
- [ ] Quando um usuário com role ALUNO acessa /eventos, então a mesma lista de eventos é exibida com os mesmos campos.
- [ ] Quando um usuário com role diferente de SOCIO ou ALUNO tenta acessar /eventos, então o sistema retorna HTTP 403 e exibe mensagem 'Acesso não autorizado'.
- [ ] Quando a lista de eventos está vazia (nenhum evento cadastrado), então a tela exibe a mensagem 'Nenhum evento disponível no momento' em vez de uma lista vazia sem feedback.
- [ ] Quando a requisição GET /api/eventos falha (HTTP 500 ou timeout), então a tela exibe mensagem de erro 'Não foi possível carregar os eventos' sem quebrar a renderização da página.

**Especificidade técnica:**
- Códigos HTTP: 200, 403, 500
- Campos: `GET /api/eventos`, `nome`, `data`, `local`, `status`
- Precisa de esclarecimento: sim — Não há definição de paginação (tamanho de página) nem de quais campos exatos do evento devem ser exibidos na listagem; assumir contrato completo do REQ-30 até confirmação.

**Rastreabilidade:** REQ-31 (ver requirements.json)

---

### [Sprint 8] Exibir RGA ou CPF mascarado conforme tipo de usuário
<!-- sdd-bot:meta id="BL-021" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-36" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Na tela de perfil do usuário, implementar lógica condicional de renderização baseada no campo de tipo de usuário retornado por GET /api/usuarios/{id}: quando type === 'ESTUDANTE', exibir o campo 'rga'; quando type !== 'ESTUDANTE', exibir o campo 'cpf' aplicando máscara que oculta os 6 dígitos centrais (formato XXX.XXX.XXX-XX exibido como ***.***.XXX-XX, mantendo os 3 últimos dígitos e os 2 dígitos verificadores visíveis).

**Comportamento esperado:**
No perfil, usuários ESTUDANTE visualizam seu RGA completo e usuários NÃO-ESTUDANTE visualizam o CPF com os 6 dígitos centrais ocultados por asteriscos.

**Critérios de aceite:**
- [ ] Quando um usuário com type ESTUDANTE acessa seu perfil, então o campo 'rga' é exibido por extenso sem máscara.
- [ ] Quando um usuário com type NÃO-ESTUDANTE (ex.: SOCIO, ALUNO não-estudante) acessa seu perfil, então o campo 'cpf' é exibido no formato ***.***.XXX-XX.
- [ ] Quando o campo 'rga' está ausente ou nulo para um usuário ESTUDANTE, então a tela exibe 'RGA não informado' em vez de campo vazio ou erro de renderização.
- [ ] Quando o campo 'cpf' está ausente ou nulo para um usuário NÃO-ESTUDANTE, então a tela exibe 'CPF não informado' em vez de aplicar máscara sobre valor vazio.
- [ ] Quando a requisição GET /api/usuarios/{id} retorna HTTP 404, então a tela de perfil exibe mensagem 'Usuário não encontrado' e não renderiza os campos RGA/CPF.

**Especificidade técnica:**
- Códigos HTTP: 200, 404
- Campos: `type`, `rga`, `cpf`, `GET /api/usuarios/{id}`
- Limites: 6 dígitos centrais mascarados no CPF
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-36 (ver requirements.json)

---

### [Sprint 8] Criar dashboard pessoal para sócio e aluno
<!-- sdd-bot:meta id="BL-022" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-41" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar tela de dashboard (rota ex.: /dashboard) acessível a usuários com role SOCIO ou ALUNO, agregando dados pessoais do usuário autenticado consumidos de endpoints existentes (ex.: GET /api/usuarios/{id}, GET /api/eventos/inscricoes, GET /api/compras) para exibir um resumo consolidado (próximos eventos inscritos, histórico de participação e status de sócio/aluno).

**Comportamento esperado:**
Ao autenticar-se, usuários SOCIO ou ALUNO acessam /dashboard e visualizam um painel consolidado com seus dados pessoais, eventos inscritos e histórico de participação.

**Critérios de aceite:**
- [ ] Quando um usuário SOCIO acessa /dashboard, então o painel exibe seção 'Meus Eventos' com os eventos em que está inscrito, obtidos via GET /api/eventos/inscricoes.
- [ ] Quando um usuário ALUNO acessa /dashboard, então o painel exibe a mesma seção 'Meus Eventos' e a seção 'Histórico de Participação'.
- [ ] Quando um usuário sem role SOCIO ou ALUNO tenta acessar /dashboard, então o sistema retorna HTTP 403 e redireciona para a tela inicial.
- [ ] Quando o usuário não possui nenhuma inscrição em eventos, então a seção 'Meus Eventos' exibe a mensagem 'Você ainda não está inscrito em nenhum evento'.
- [ ] Quando a requisição a qualquer endpoint agregado no dashboard falha (HTTP 500), então a respectiva seção exibe 'Erro ao carregar dados' isoladamente, sem impedir a renderização das demais seções.

**Especificidade técnica:**
- Códigos HTTP: 200, 403, 500
- Campos: `GET /api/usuarios/{id}`, `GET /api/eventos/inscricoes`, `GET /api/compras`
- Precisa de esclarecimento: sim — O requisito não especifica quais widgets/seções compõem o dashboard além de eventos e histórico de participação; confirmar com o SDD se há métricas adicionais (ex.: compras, status financeiro).

**Rastreabilidade:** REQ-41 (ver requirements.json)

---

### [Sprint 8] Configurar frontend React 18+ com deploy em Vercel/Cloudflare
<!-- sdd-bot:meta id="BL-023" epic="Introdução (parte 2)" layer="frontend" requirementIds="REQ-54" dependsOn="" -->
**Tipo:** tech-debt
**Prioridade:** must

**Descrição:**
Estruturar o projeto frontend usando React versão 18.0.0 ou superior (registrado em package.json como dependência 'react': '^18.0.0'), configurando pipeline de build e deploy contínuo hospedado na plataforma Vercel com CDN Cloudflare para distribuição dos assets estáticos gerados.

**Comportamento esperado:**
O frontend em produção é servido a partir de uma versão React 18+ e o deploy é publicado automaticamente via Vercel com distribuição de assets pela CDN Cloudflare.

**Critérios de aceite:**
- [ ] Quando o arquivo package.json é inspecionado, então a dependência 'react' está fixada em versão igual ou superior a 18.0.0.
- [ ] Quando um push é feito na branch principal, então o pipeline de deploy da Vercel executa o build e publica a nova versão em produção sem intervenção manual.
- [ ] Quando os assets estáticos do build são requisitados pelo navegador, então a resposta contém cabeçalhos indicando entrega via CDN Cloudflare.
- [ ] Quando o build é executado com uma versão de React abaixo de 18.0.0 declarada no package.json, então o pipeline de CI falha antes do deploy, impedindo a publicação.
- [ ] Quando o deploy na Vercel falha por erro de build, então o ambiente de produção anterior permanece ativo (rollback automático) e nenhuma versão quebrada é publicada.

**Especificidade técnica:**
- Campos: `package.json`, `react`, `^18.0.0`
- Limites: React >= 18.0.0
- Precisa de esclarecimento: sim — Não há detalhamento de como a validação de versão do CI deve ser implementada (lint de package.json vs. checagem em runtime) nem da configuração exata de domínio/DNS na Cloudflare; decisão de infraestrutura pendente.

**Rastreabilidade:** REQ-54 (ver requirements.json)

---

### [Sprint 8] Criar página de login (LoginPage)
<!-- sdd-bot:meta id="BL-024" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-174" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota LoginPage no frontend, contendo formulário com campos de e-mail e senha, chamada ao endpoint de autenticação (ex.: POST /auth/login) e armazenamento do token de sessão retornado (ex.: JWT em localStorage/cookie). A página deve ser registrada no roteador da aplicação (ex.: rota /login) e redirecionar o usuário autenticado para a rota de dashboard.

**Comportamento esperado:**
Usuário acessa /login, informa e-mail e senha válidos, submete o formulário e é redirecionado para o dashboard com sessão autenticada ativa.

**Critérios de aceite:**
- [ ] Quando o usuário acessar a rota /login, então o formulário com campos 'email' e 'senha' deve ser exibido.
- [ ] Quando o usuário submeter e-mail e senha válidos, então o sistema deve chamar o endpoint de autenticação e, em caso de sucesso (200), redirecionar para /dashboard.
- [ ] Quando o usuário submeter credenciais inválidas, então a API deve retornar 401 e a página deve exibir mensagem de erro 'E-mail ou senha inválidos' sem redirecionar.
- [ ] Quando o usuário submeter o formulário com o campo 'email' ou 'senha' vazio, então a submissão deve ser bloqueada no client-side e a mensagem 'Campo obrigatório' deve ser exibida junto ao campo correspondente.
- [ ] Quando um usuário já autenticado acessar /login diretamente, então deve ser redirecionado automaticamente para /dashboard.

**Especificidade técnica:**
- Códigos HTTP: 200, 401
- Campos: `email`, `senha`
- Precisa de esclarecimento: sim — O SDD não especifica o endpoint exato de autenticação, o mecanismo de armazenamento do token (localStorage vs cookie httpOnly) nem regras de formato/tamanho mínimo de senha.

**Rastreabilidade:** REQ-174 (ver requirements.json)

---

### [Sprint 8] Criar página de registro de usuário (RegisterPage)
<!-- sdd-bot:meta id="BL-025" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-175" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota RegisterPage no frontend, com formulário de cadastro (nome, e-mail, senha e confirmação de senha), integração com o endpoint de criação de usuário (ex.: POST /auth/register) e registro da rota /register no roteador da aplicação. Após criação bem-sucedida, redirecionar para a página de login ou dashboard conforme fluxo de autenticação automática definido.

**Comportamento esperado:**
Usuário acessa /register, preenche os dados de cadastro, submete o formulário e recebe confirmação de conta criada, sendo direcionado ao próximo passo do fluxo (login ou dashboard).

**Critérios de aceite:**
- [ ] Quando o usuário acessar a rota /register, então o formulário com campos 'nome', 'email', 'senha' e 'confirmarSenha' deve ser exibido.
- [ ] Quando o usuário submeter dados válidos e únicos, então o sistema deve chamar o endpoint de registro e, em caso de sucesso (201), exibir confirmação e redirecionar conforme fluxo definido.
- [ ] Quando o e-mail informado já estiver cadastrado, então a API deve retornar 409 e a página deve exibir a mensagem 'E-mail já cadastrado'.
- [ ] Quando o campo 'senha' e 'confirmarSenha' não coincidirem, então a submissão deve ser bloqueada no client-side com a mensagem 'As senhas não coincidem'.
- [ ] Quando algum campo obrigatório estiver vazio, então a submissão deve ser bloqueada e a mensagem 'Campo obrigatório' deve ser exibida junto ao campo correspondente.

**Especificidade técnica:**
- Códigos HTTP: 201, 409
- Campos: `nome`, `email`, `senha`, `confirmarSenha`
- Precisa de esclarecimento: sim — O SDD não define o endpoint exato de registro, requisitos de complexidade mínima de senha, nem se o fluxo pós-cadastro é login automático ou redirecionamento para tela de login.

**Rastreabilidade:** REQ-175 (ver requirements.json)

---

### [Sprint 8] Criar página de aprovações (AprovacoesPage)
<!-- sdd-bot:meta id="BL-026" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-176" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota AprovacoesPage no frontend, listando itens pendentes de aprovação (ex.: solicitações de sócios, inscrições em eventos ou outros fluxos sujeitos a revisão) obtidos via endpoint de listagem (ex.: GET /aprovacoes), com ações de aprovar/rejeitar por item (ex.: PATCH /aprovacoes/{id}). Restringir o acesso à rota /aprovacoes com base na role do usuário autenticado, exibindo a página apenas para roles com permissão (ex.: admin).

**Comportamento esperado:**
Usuário com role autorizada acessa /aprovacoes, visualiza a lista de itens pendentes e consegue aprovar ou rejeitar cada item, com atualização imediata da lista.

**Critérios de aceite:**
- [ ] Quando um usuário com role autorizada acessar /aprovacoes, então a lista de itens pendentes deve ser carregada via GET /aprovacoes e exibida na tela.
- [ ] Quando o usuário clicar em 'Aprovar' para um item, então o sistema deve enviar PATCH /aprovacoes/{id} com status 'aprovado' e, em caso de sucesso (200), remover o item da lista de pendentes.
- [ ] Quando o usuário clicar em 'Rejeitar' para um item, então o sistema deve enviar PATCH /aprovacoes/{id} com status 'rejeitado' e, em caso de sucesso (200), remover o item da lista de pendentes.
- [ ] Quando um usuário sem role autorizada tentar acessar /aprovacoes, então o sistema deve retornar 403 e redirecionar para uma página de acesso negado.
- [ ] Quando a lista de itens pendentes estiver vazia, então a página deve exibir a mensagem 'Nenhuma aprovação pendente' em vez de uma lista vazia sem contexto.

**Especificidade técnica:**
- Códigos HTTP: 200, 403
- Campos: `status`, `id`
- Precisa de esclarecimento: sim — O SDD não especifica quais entidades passam por aprovação (sócios, eventos, produtos), o endpoint exato, nem quais roles têm permissão de acesso à página.

**Rastreabilidade:** REQ-176 (ver requirements.json)

---

### [Sprint 8] Criar página de dashboard (DashboardPage)
<!-- sdd-bot:meta id="BL-027" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-177" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota DashboardPage no frontend, exibindo um resumo de informações relevantes ao usuário autenticado (ex.: eventos próximos, histórico de participação, status de sócio) obtidas via chamadas aos endpoints correspondentes, com renderização condicional de blocos de conteúdo conforme a role do usuário. Registrar a rota /dashboard no roteador da aplicação como destino padrão pós-login.

**Comportamento esperado:**
Usuário autenticado acessa /dashboard e visualiza um painel com os dados e ações pertinentes à sua role, sem acesso a blocos restritos a outras roles.

**Critérios de aceite:**
- [ ] Quando um usuário autenticado acessar /dashboard, então os dados do painel devem ser carregados via chamada aos endpoints correspondentes e exibidos na tela.
- [ ] Quando o usuário tiver role 'admin', então blocos administrativos (ex.: pendências de aprovação) devem ser exibidos no dashboard.
- [ ] Quando o usuário tiver role padrão (não-admin), então blocos restritos a administradores não devem ser renderizados na página.
- [ ] Quando um usuário não autenticado tentar acessar /dashboard diretamente, então deve ser redirecionado para /login com status 401 na chamada de verificação de sessão.
- [ ] Quando a chamada aos endpoints de dados do painel falhar (ex.: 500), então a página deve exibir uma mensagem de erro de carregamento em vez de tela em branco.

**Especificidade técnica:**
- Códigos HTTP: 401, 500
- Campos: `role`
- Precisa de esclarecimento: sim — O SDD não detalha quais widgets/blocos compõem o dashboard, quais endpoints alimentam cada bloco, nem a lista completa de roles e suas permissões de visualização.

**Rastreabilidade:** REQ-177 (ver requirements.json)

---

### [Sprint 8] Criar ProfilePage com seções Personal, Atletica e Security
<!-- sdd-bot:meta id="BL-028" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-178" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar componente ProfilePage no frontend com navegação por abas/seções: 'Personal' (dados pessoais do usuário logado, ex: nome, e-mail, telefone), 'Atletica' (vínculo do usuário com a atlética/sócio) e 'Security' (troca de senha e configurações de segurança). Cada seção deve consumir os endpoints correspondentes de perfil já existentes (ex: GET /api/users/me) e renderizar formulários editáveis com submissão via PUT/PATCH.

**Comportamento esperado:**
Ao acessar /perfil, o usuário visualiza as três abas (Personal, Atletica, Security), pode alternar entre elas sem recarregar a página, e os dados exibidos correspondem ao usuário autenticado na sessão.

**Critérios de aceite:**
- [ ] Quando o usuário autenticado acessa /perfil, então a seção 'Personal' é exibida por padrão com nome, e-mail e telefone preenchidos a partir de GET /api/users/me.
- [ ] Quando o usuário clica na aba 'Atletica', então são exibidos os dados de vínculo com a atlética (status de sócio, plano) sem recarregar a página.
- [ ] Quando o usuário clica na aba 'Security' e envia uma nova senha com menos de 8 caracteres, então o formulário exibe a mensagem de erro 'Senha deve ter no mínimo 8 caracteres' e não envia a requisição.
- [ ] Quando o usuário submete alterações válidas na seção 'Personal', então a requisição PUT retorna 200 e a UI exibe confirmação 'Dados atualizados' sem redirecionamento.
- [ ] Quando um usuário não autenticado tenta acessar /perfil, então é redirecionado para /login com status HTTP 401 na chamada de dados do perfil.

**Especificidade técnica:**
- Códigos HTTP: 200, 401
- Campos: `ProfilePage`, `/api/users/me`, `Personal`, `Atletica`, `Security`
- Limites: senha mínima de 8 caracteres
- Precisa de esclarecimento: sim — Não há especificação de quais campos exatos compõem a seção 'Atletica' nem o endpoint de vínculo com a atlética; assumir estrutura mínima até definição do SDD detalhado.

**Rastreabilidade:** REQ-178 (ver requirements.json)

---

### [Sprint 8] Criar SociosPage para listagem de sócios
<!-- sdd-bot:meta id="BL-029" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-179" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar componente SociosPage no frontend que consome um endpoint de listagem de sócios (ex: GET /api/socios) e renderiza os registros em tabela ou lista, com exibição condicional de colunas/ações conforme a role do usuário logado (admin vs sócio comum).

**Comportamento esperado:**
Ao acessar /socios, o usuário visualiza a lista de sócios cadastrados, com dados e ações variando conforme sua role.

**Critérios de aceite:**
- [ ] Quando um usuário com role 'admin' acessa /socios, então a lista exibe todos os sócios com colunas de status e ações de edição.
- [ ] Quando um usuário com role 'socio' acessa /socios, então a lista exibe apenas os dados públicos dos sócios (sem ações de edição).
- [ ] Quando a lista de sócios está vazia, então a página exibe a mensagem 'Nenhum sócio encontrado' em vez de uma tabela vazia.
- [ ] Quando a chamada GET /api/socios retorna erro HTTP 500, então a página exibe a mensagem 'Erro ao carregar sócios' e um botão de tentar novamente.

**Especificidade técnica:**
- Códigos HTTP: 500
- Campos: `SociosPage`, `/api/socios`
- Precisa de esclarecimento: sim — Não há definição do endpoint exato, dos campos retornados por sócio nem das regras precisas de exibição condicional por role; necessário confirmar com o SDD ou API de sócios.

**Rastreabilidade:** REQ-179 (ver requirements.json)

---

### [Sprint 8] Criar ProdutosPage para listagem de produtos
<!-- sdd-bot:meta id="BL-030" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-180" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar componente ProdutosPage no frontend que consome um endpoint de listagem de produtos (ex: GET /api/produtos) e renderiza os itens em grid ou lista, com dados como nome, preço e imagem.

**Comportamento esperado:**
Ao acessar /produtos, o usuário visualiza a lista de produtos disponíveis com nome, preço e imagem carregados a partir da API.

**Critérios de aceite:**
- [ ] Quando o usuário acessa /produtos, então a página renderiza um card por produto retornado por GET /api/produtos, exibindo nome e preço formatado em R$.
- [ ] Quando a lista de produtos está vazia, então a página exibe a mensagem 'Nenhum produto disponível' em vez de um grid vazio.
- [ ] Quando a chamada GET /api/produtos retorna erro HTTP 500, então a página exibe a mensagem 'Erro ao carregar produtos' e um botão de tentar novamente.
- [ ] Quando um produto não possui imagem cadastrada, então o card exibe uma imagem placeholder padrão em vez de um espaço em branco.

**Especificidade técnica:**
- Códigos HTTP: 500
- Campos: `ProdutosPage`, `/api/produtos`
- Precisa de esclarecimento: sim — Não há definição do endpoint exato nem dos campos retornados por produto (ex: estoque, categoria); necessário confirmar contrato da API de produtos.

**Rastreabilidade:** REQ-180 (ver requirements.json)

---

### [Sprint 8] Criar LojaPage para exibição de itens da loja
<!-- sdd-bot:meta id="BL-031" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-181" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar componente LojaPage no frontend que consome um endpoint de itens disponíveis para compra (ex: GET /api/loja) e renderiza os itens com opção de adicionar ao carrinho, integrando com o fluxo de compras existente.

**Comportamento esperado:**
Ao acessar /loja, o usuário visualiza os itens disponíveis para compra e pode adicioná-los ao carrinho a partir da própria listagem.

**Critérios de aceite:**
- [ ] Quando o usuário acessa /loja, então a página renderiza um card por item retornado por GET /api/loja, com nome, preço e botão 'Adicionar ao carrinho'.
- [ ] Quando o usuário clica em 'Adicionar ao carrinho' para um item disponível, então o contador do carrinho é incrementado em 1 sem recarregar a página.
- [ ] Quando um item está com estoque igual a 0, então o botão 'Adicionar ao carrinho' fica desabilitado e exibe o rótulo 'Esgotado'.
- [ ] Quando a chamada GET /api/loja retorna erro HTTP 500, então a página exibe a mensagem 'Erro ao carregar loja' e um botão de tentar novamente.

**Especificidade técnica:**
- Códigos HTTP: 500
- Campos: `LojaPage`, `/api/loja`, `Adicionar ao carrinho`
- Limites: estoque igual a 0 desabilita a compra
- Precisa de esclarecimento: sim — Não há definição do endpoint exato, do modelo de dados de item da loja nem da integração com o fluxo de compras/carrinho; necessário confirmar contrato com o módulo de compras.

**Rastreabilidade:** REQ-181 (ver requirements.json)

---

### [Sprint 8] Criar página MinhasComprasPage com histórico de compras
<!-- sdd-bot:meta id="BL-032" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-182" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota MinhasComprasPage no frontend, que consome o endpoint de listagem de compras do usuário autenticado (ex.: GET /api/compras/minhas) e renderiza os itens em tabela/lista, incluindo estado de carregamento e estado vazio. A página deve ser protegida por rota autenticada, redirecionando usuários não logados para a tela de login.

**Comportamento esperado:**
Usuário autenticado acessa a rota /minhas-compras e visualiza a lista de suas próprias compras com data, itens e status; usuário não autenticado é redirecionado para login.

**Critérios de aceite:**
- [ ] Quando um usuário autenticado com compras registradas acessa /minhas-compras, então a página lista cada compra com data, valor total e status.
- [ ] Quando o usuário autenticado não possui nenhuma compra, então a página exibe uma mensagem de estado vazio (ex.: 'Nenhuma compra encontrada') sem erro no console.
- [ ] Quando um usuário não autenticado tenta acessar /minhas-compras, então é redirecionado para a rota de login.
- [ ] Quando a requisição ao endpoint de compras retorna erro (ex.: 500), então a página exibe mensagem de erro e não trava a interface.
- [ ] Quando a lista de compras está sendo carregada, então um indicador de loading é exibido até a resposta da API.

**Especificidade técnica:**
- Códigos HTTP: 200, 401, 500
- Campos: `/minhas-compras`, `GET /api/compras/minhas`
- Precisa de esclarecimento: sim — Endpoint exato de listagem de compras e formato de paginação (se houver) não foram especificados no requisito original.

**Rastreabilidade:** REQ-182 (ver requirements.json)

---

### [Sprint 8] Criar página EventosPage com listagem de eventos disponíveis
<!-- sdd-bot:meta id="BL-033" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-183" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota EventosPage no frontend, consumindo o endpoint de listagem de eventos (ex.: GET /api/eventos) e exibindo cada evento com nome, data, local e ação de inscrição. Deve aplicar exibição condicional de dados conforme a role do usuário logado (ex.: sócio vs não sócio), reutilizando o contexto de autenticação/role já existente na aplicação.

**Comportamento esperado:**
Qualquer usuário acessa a rota /eventos e visualiza a lista de eventos disponíveis, com informações e ações ajustadas conforme sua role.

**Critérios de aceite:**
- [ ] Quando existem eventos cadastrados, então a página EventosPage lista cada evento com nome, data e local.
- [ ] Quando não há eventos cadastrados, então a página exibe mensagem de estado vazio (ex.: 'Nenhum evento disponível').
- [ ] Quando o usuário logado possui role 'socio', então botões/ações exclusivas de sócio (ex.: inscrição com desconto) são exibidos; caso contrário são ocultados.
- [ ] Quando a requisição ao endpoint de eventos falha (ex.: 500), então a página exibe mensagem de erro sem quebrar a renderização.
- [ ] Quando o usuário não está autenticado, então a página exibe os eventos em modo somente leitura, sem opção de inscrição.

**Especificidade técnica:**
- Códigos HTTP: 200, 500
- Campos: `/eventos`, `GET /api/eventos`
- Precisa de esclarecimento: sim — Regras exatas de exibição condicional por role (quais campos/ações mudam entre sócio, não sócio e visitante) não foram detalhadas no requisito original.

**Rastreabilidade:** REQ-183 (ver requirements.json)

---

### [Sprint 8] Criar página MeusEventosPage com histórico de inscrições
<!-- sdd-bot:meta id="BL-034" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-184" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar o componente de rota MeusEventosPage no frontend, consumindo endpoint que retorna os eventos nos quais o usuário autenticado está inscrito (ex.: GET /api/eventos/minhas-inscricoes), exibindo status de participação (inscrito, confirmado, concluído). Rota protegida por autenticação.

**Comportamento esperado:**
Usuário autenticado acessa a rota /meus-eventos e visualiza a lista dos eventos em que está inscrito, com o status atual de cada participação.

**Critérios de aceite:**
- [ ] Quando um usuário autenticado possui inscrições em eventos, então a página lista cada evento com nome, data e status de participação.
- [ ] Quando o usuário autenticado não possui nenhuma inscrição, então a página exibe mensagem de estado vazio (ex.: 'Você ainda não se inscreveu em nenhum evento').
- [ ] Quando um usuário não autenticado tenta acessar /meus-eventos, então é redirecionado para a rota de login.
- [ ] Quando a requisição ao endpoint de inscrições retorna erro (ex.: 500), então a página exibe mensagem de erro e mantém a interface funcional.
- [ ] Quando os dados estão sendo carregados, então um indicador de loading é exibido até a resposta da API.

**Especificidade técnica:**
- Códigos HTTP: 200, 401, 500
- Campos: `/meus-eventos`, `GET /api/eventos/minhas-inscricoes`
- Precisa de esclarecimento: sim — Endpoint exato do histórico de participação e os valores possíveis do campo status não foram especificados no requisito original.

**Rastreabilidade:** REQ-184 (ver requirements.json)

---

### [Sprint 8] Adicionar seletor de vínculo estudantil no formulário de registro
<!-- sdd-bot:meta id="BL-035" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-186" dependsOn="REQ-175" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-175

**Descrição:**
Adicionar ao formulário da página de registro um campo de seleção (radio button ou toggle) com as opções 'Sou estudante' e 'Não sou estudante', persistindo o valor escolhido em um campo do estado do formulário (ex.: isEstudante: boolean) que será enviado junto ao payload de criação de conta, integrando com a estrutura de dados definida em REQ-175.

**Comportamento esperado:**
Ao preencher o formulário de registro, o usuário seleciona uma das duas opções de vínculo estudantil e essa escolha é enviada no cadastro.

**Critérios de aceite:**
- [ ] Quando o usuário seleciona 'Sou estudante', então o campo isEstudante é definido como true no payload enviado ao endpoint de registro.
- [ ] Quando o usuário seleciona 'Não sou estudante', então o campo isEstudante é definido como false no payload enviado ao endpoint de registro.
- [ ] Quando o usuário tenta submeter o formulário sem selecionar nenhuma das duas opções, então a submissão é bloqueada e uma mensagem de validação é exibida (ex.: 'Selecione uma opção de vínculo').
- [ ] Quando o formulário é reenviado após correção da seleção, então o registro prossegue normalmente para o endpoint de criação de conta.

**Especificidade técnica:**
- Campos: `isEstudante`
- Precisa de esclarecimento: sim — Nome exato do campo no payload de registro e endpoint de cadastro dependem da estrutura definida em REQ-175, que não foi detalhada neste requisito.

**Rastreabilidade:** REQ-186 (ver requirements.json)

---

### [Sprint 8] Exibir campos RGA e senha ao selecionar estudante
<!-- sdd-bot:meta id="BL-036" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-187" dependsOn="REQ-186" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-186

**Descrição:**
No formulário de registro do frontend, implementar renderização condicional dos campos 'RGA' (input texto) e 'Senha' quando o usuário selecionar a opção 'Estudante' no seletor de tipo de usuário (radio/select). O estado do formulário deve controlar a visibilidade desses campos via binding reativo ao valor selecionado, incluindo validação de obrigatoriedade apenas quando visíveis.

**Comportamento esperado:**
Ao marcar 'Estudante' no formulário de registro, os campos RGA e Senha aparecem imediatamente na tela; ao desmarcar ou selecionar outro tipo, eles desaparecem e seus valores são limpos.

**Critérios de aceite:**
- [ ] Quando o usuário seleciona 'Estudante', então os campos RGA e Senha são exibidos no formulário.
- [ ] Quando o usuário troca de 'Estudante' para outro tipo de usuário, então os campos RGA e Senha são ocultados e seus valores são resetados.
- [ ] Quando o campo RGA está visível e vazio, então a tentativa de submissão exibe mensagem de erro 'RGA é obrigatório' e bloqueia o envio.
- [ ] Quando o campo Senha está visível e vazio, então a tentativa de submissão exibe mensagem de erro 'Senha é obrigatória' e bloqueia o envio.
- [ ] Quando o tipo de usuário selecionado não é 'Estudante', então os campos RGA e Senha não são renderizados no DOM.

**Especificidade técnica:**
- Campos: `RGA`, `Senha`, `tipoUsuario`
- Precisa de esclarecimento: sim — Não há definição do formato/validação do RGA (tamanho, máscara, regex) nem se a 'senha' exibida condicionalmente é distinta da senha padrão do cadastro geral — necessário esclarecer com o time de negócio/SDD.

**Rastreabilidade:** REQ-187 (ver requirements.json)

---

### [Sprint 8] Criar componente de card de evento com preço e vagas
<!-- sdd-bot:meta id="BL-037" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-199" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Desenvolver componente reutilizável 'EventCard' no frontend que recebe via props os dados do evento (imagem/banner, data, hora, local, preço original, percentual de desconto, preço final, vagas disponíveis) e renderiza a estrutura visual correspondente, incluindo lógica condicional para exibir preço riscado e badge de desconto apenas quando houver desconto aplicado, além de botão de inscrição vinculado ao evento.

**Comportamento esperado:**
O card exibe imagem, data/hora, local, preço (com preço original riscado e percentual de desconto quando aplicável), preço final, vagas disponíveis e um botão de inscrição funcional para o evento correspondente.

**Critérios de aceite:**
- [ ] Quando o evento possui desconto, então o card exibe o preço original riscado, o percentual de desconto e o preço final calculado.
- [ ] Quando o evento não possui desconto, então o card exibe apenas o preço final, sem preço riscado nem badge de percentual.
- [ ] Quando as vagas disponíveis são maiores que zero, então o botão de inscrição é exibido habilitado.
- [ ] Quando as vagas disponíveis são iguais a zero, então o botão de inscrição é exibido desabilitado com o texto 'Esgotado'.
- [ ] Quando o campo imagem/banner do evento não é informado, então o card exibe uma imagem placeholder padrão no lugar.

**Especificidade técnica:**
- Campos: `imagem`, `data`, `hora`, `local`, `precoOriginal`, `percentualDesconto`, `precoFinal`, `vagasDisponiveis`
- Precisa de esclarecimento: sim — Não há definição da fonte dos dados (endpoint/serviço que fornece o objeto evento), formato de data/hora esperado, nem a ação exata disparada pelo botão de inscrição (redirecionamento, modal ou chamada direta a endpoint) — necessário esclarecer.

**Rastreabilidade:** REQ-199 (ver requirements.json)

---

### [Sprint 9] Exibir formulário de registro para não-estudante
<!-- sdd-bot:meta id="BL-038" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-188" dependsOn="REQ-186" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-186

**Descrição:**
Implementar renderização condicional no componente de formulário de registro (frontend) para alternar o conjunto de campos exibidos com base na opção de tipo de usuário selecionada (estudante/não-estudante), conforme definido no REQ-186. Quando 'não-estudante' for selecionado, o formulário deve montar dinamicamente os campos: CPF, código da atlética, nome, email e senha, cada um com seu respectivo input controlado e binding de estado local.

**Comportamento esperado:**
Ao selecionar 'não-estudante' na tela de registro, os campos CPF, código da atlética, nome, email e senha são exibidos na tela, substituindo o conjunto de campos do formulário de estudante.

**Critérios de aceite:**
- [ ] Quando o usuário seleciona 'não-estudante', então os campos CPF, código da atlética, nome, email e senha são renderizados no formulário.
- [ ] Quando o usuário alterna de 'não-estudante' para 'estudante', então os campos exclusivos de não-estudante (CPF, código da atlética) são removidos do DOM e seus valores são limpos do estado.
- [ ] Quando nenhum tipo de usuário é selecionado, então nenhum dos dois conjuntos de campos específicos é exibido, apenas a opção de seleção.
- [ ] Quando os campos nome, email e senha são preenchidos em ambos os formulários, então o mesmo componente de input reutilizável é usado sem duplicação de lógica.

**Especificidade técnica:**
- Campos: `cpf`, `codigoAtletica`, `nome`, `email`, `senha`
- Precisa de esclarecimento: sim — Não foi especificado o mecanismo de submissão (endpoint de API) nem se há campo de confirmação de senha; assumir apenas renderização condicional dos campos nesta issue.

**Rastreabilidade:** REQ-188 (ver requirements.json)

---

### [Sprint 9] Validar dígito verificador de CPF com máscara no registro
<!-- sdd-bot:meta id="BL-039" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-189" dependsOn="REQ-188" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-188

**Descrição:**
Implementar no campo CPF do formulário de registro (frontend) uma máscara de entrada no formato 000.000.000-00 aplicada em tempo real via onChange/onInput, e uma função de validação do dígito verificador do CPF (algoritmo módulo 11) executada antes da submissão do formulário, bloqueando o envio quando o CPF for inválido.

**Comportamento esperado:**
Ao digitar no campo CPF, o texto é formatado automaticamente como 000.000.000-00; ao submeter o formulário com CPF de dígito verificador inválido, uma mensagem de erro é exibida abaixo do campo e a submissão é impedida.

**Critérios de aceite:**
- [ ] Quando o usuário digita 11 números no campo CPF, então o valor exibido é formatado como 000.000.000-00.
- [ ] Quando o CPF possui dígito verificador válido segundo o algoritmo módulo 11, então o formulário permite a submissão sem erro no campo CPF.
- [ ] Quando o CPF possui dígito verificador inválido, então a mensagem 'CPF inválido' é exibida abaixo do campo e o botão de submissão é bloqueado.
- [ ] Quando o CPF possui todos os dígitos iguais (ex.: 111.111.111-11), então o campo é considerado inválido mesmo que o dígito verificador matematicamente confira.
- [ ] Quando o campo CPF está vazio no momento da submissão, então a mensagem de campo obrigatório é exibida e a submissão é impedida.

**Especificidade técnica:**
- Campos: `cpf`
- Limites: 11 dígitos numéricos
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-189 (ver requirements.json)

---

### [Sprint 9] Exibir dropdown de troca de atlética ativa na Navbar
<!-- sdd-bot:meta id="BL-040" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-191" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar no componente Navbar (frontend) um dropdown que consulta a lista de diretorias/atléticas vinculadas ao usuário autenticado (via estado de sessão/contexto de usuário) e, quando essa lista contiver mais de um item, renderiza o seletor com as opções; a seleção de uma opção deve atualizar o estado global de 'atlética ativa' usado pelas demais telas da aplicação.

**Comportamento esperado:**
Quando o usuário logado possui mais de uma atlética vinculada, a Navbar exibe um dropdown listando essas atléticas; ao selecionar uma opção diferente, o contexto da atlética ativa é atualizado e refletido nas telas dependentes.

**Critérios de aceite:**
- [ ] Quando o usuário possui mais de uma diretoria vinculada, então o dropdown de atlética é exibido na Navbar listando todas as opções vinculadas.
- [ ] Quando o usuário possui apenas uma diretoria vinculada, então o dropdown não é exibido na Navbar.
- [ ] Quando o usuário seleciona uma atlética diferente no dropdown, então o estado global de atlética ativa é atualizado e a atlética selecionada passa a ser exibida como atual na Navbar.
- [ ] Quando o usuário não possui nenhuma diretoria vinculada, então o dropdown não é renderizado e nenhum erro é lançado no console.

**Especificidade técnica:**
- Campos: `diretoriasVinculadas`, `atleticaAtiva`
- Precisa de esclarecimento: sim — Não foi especificado o endpoint/fonte de dados que fornece a lista de diretorias vinculadas ao usuário nem se a seleção deve persistir (ex.: localStorage) entre sessões.

**Rastreabilidade:** REQ-191 (ver requirements.json)

---

### [Sprint 9] Exibir dropdown de usuário com Profile, Settings e Logout
<!-- sdd-bot:meta id="BL-041" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-193" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar no componente Navbar (frontend) um dropdown acionado pelo avatar/nome do usuário autenticado, contendo três itens de menu: 'Profile' (navega para a rota de perfil), 'Settings' (navega para a rota de configurações) e 'Logout' (dispara a ação de encerramento de sessão, limpando o token de autenticação armazenado e redirecionando para a tela de login).

**Comportamento esperado:**
Ao clicar no ícone/nome do usuário na Navbar, um dropdown é aberto exibindo as opções Profile, Settings e Logout; ao clicar em Logout, a sessão é encerrada e o usuário é redirecionado para a tela de login.

**Critérios de aceite:**
- [ ] Quando o usuário clica no elemento de usuário na Navbar, então o dropdown é aberto exibindo as opções Profile, Settings e Logout.
- [ ] Quando o usuário clica em 'Profile', então a aplicação navega para a rota de perfil do usuário.
- [ ] Quando o usuário clica em 'Settings', então a aplicação navega para a rota de configurações.
- [ ] Quando o usuário clica em 'Logout', então o token de autenticação é removido do armazenamento local e o usuário é redirecionado para a tela de login.
- [ ] Quando o usuário clica fora do dropdown aberto, então o dropdown é fechado sem executar nenhuma das ações.

**Especificidade técnica:**
- Campos: `authToken`
- Precisa de esclarecimento: sim — Não foi especificado o path exato das rotas de Profile e Settings nem se o Logout deve chamar um endpoint de invalidação de sessão no backend.

**Rastreabilidade:** REQ-193 (ver requirements.json)

---

### [Sprint 9] Exibir atlética principal somente leitura no perfil
<!-- sdd-bot:meta id="BL-042" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-195" dependsOn="REQ-178" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-178

**Descrição:**
Implementar na seção 'Atletica' da tela de Perfil um bloco somente leitura que consome o campo de atlética principal do usuário retornado pelo endpoint de perfil (ex.: GET /api/users/me) e renderiza nome e/ou sigla da atlética sem controles de edição ou remoção nesse bloco específico.

**Comportamento esperado:**
Ao acessar a seção Atletica do perfil, o usuário visualiza os dados da sua atlética principal (nome/sigla) em texto estático, sem botões de edição, exclusão ou campos editáveis associados a esse bloco.

**Critérios de aceite:**
- [ ] Quando o usuário possuir atlética principal cadastrada, então a seção Atletica exibe nome e sigla da atlética em modo somente leitura, sem inputs editáveis.
- [ ] Quando o usuário não possuir atlética principal (campo nulo/vazio na resposta da API), então a seção exibe uma mensagem indicando ausência de atlética principal em vez de campo em branco.
- [ ] Quando a chamada ao endpoint de perfil falhar (erro 500 ou timeout), então a seção exibe estado de erro com mensagem apropriada em vez de quebrar a renderização da tela.
- [ ] Quando o bloco de atlética principal é renderizado, então nenhum botão de remover, editar ou adicionar aparece dentro desse bloco específico.

**Especificidade técnica:**
- Códigos HTTP: 500
- Campos: `atleticaPrincipal`
- Precisa de esclarecimento: sim — Falta definir o endpoint/nome exato do campo que retorna a atlética principal no payload do usuário (ex.: atleticaPrincipal vs atleticaId) e o formato de exibição (nome completo, sigla ou ambos).

**Rastreabilidade:** REQ-195 (ver requirements.json)

---

### [Sprint 9] Listar atléticas vinculadas com opção de remoção no perfil
<!-- sdd-bot:meta id="BL-043" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-196" dependsOn="REQ-178" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-178

**Descrição:**
Implementar na seção Atletica do perfil uma lista das atléticas vinculadas ao usuário (excluindo ou incluindo a principal, conforme regra de negócio), consumindo os dados via endpoint de listagem (ex.: GET /api/users/me/atleticas) e adicionar, para cada item, um botão/ícone de remoção que dispara chamada DELETE (ex.: DELETE /api/users/me/atleticas/{atleticaId}) com confirmação antes da execução.

**Comportamento esperado:**
O usuário visualiza todas as atléticas vinculadas em formato de lista e consegue remover individualmente qualquer uma delas, vendo a lista atualizada imediatamente após a remoção.

**Critérios de aceite:**
- [ ] Quando o usuário possuir múltiplas atléticas vinculadas, então todas são listadas com nome/sigla identificável de cada uma.
- [ ] Quando o usuário clicar em remover uma atlética, então um diálogo de confirmação é exibido antes de enviar a requisição de exclusão.
- [ ] Quando a remoção for confirmada e a API retornar 200/204, então o item desaparece da lista sem necessidade de recarregar a página.
- [ ] Quando a API retornar erro (ex.: 409 por regra de negócio ou 500), então uma mensagem de erro é exibida e o item permanece na lista.
- [ ] Quando o usuário possuir apenas uma atlética vinculada, então o sistema impede ou avisa sobre a remoção conforme regra de vínculo mínimo, evitando estado sem nenhuma atlética.

**Especificidade técnica:**
- Códigos HTTP: 200, 204, 409, 500
- Campos: `atleticaId`
- Precisa de esclarecimento: sim — Falta definir se existe regra de vínculo mínimo (usuário não pode ficar sem nenhuma atlética) e qual é o comportamento exato quando a atlética removida é a principal.

**Rastreabilidade:** REQ-196 (ver requirements.json)

---

### [Sprint 9] Adicionar atlética via código do curso no perfil
<!-- sdd-bot:meta id="BL-044" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-197" dependsOn="REQ-178" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-178

**Descrição:**
Adicionar na seção Atletica do perfil um campo de input para código do curso com texto de ajuda explicando o formato esperado, acompanhado de um botão 'Adicionar' que envia o código para um endpoint (ex.: POST /api/users/me/atleticas) responsável por validar o código e vincular a atlética correspondente ao usuário.

**Comportamento esperado:**
O usuário informa o código do curso, clica em Adicionar, e a nova atlética passa a constar na lista de atléticas vinculadas exibida na seção.

**Critérios de aceite:**
- [ ] Quando o usuário informar um código de curso válido e clicar em Adicionar, então a nova atlética é exibida na lista de atléticas vinculadas sem recarregar a página.
- [ ] Quando o campo de código for deixado vazio e o botão Adicionar for clicado, então o formulário exibe erro de validação e não dispara requisição à API.
- [ ] Quando o código informado não corresponder a nenhum curso existente, então a API retorna erro (ex.: 404) e a interface exibe mensagem indicando código inválido.
- [ ] Quando o código informado já corresponder a uma atlética já vinculada ao usuário, então a API retorna erro (ex.: 409) e a interface exibe mensagem de vínculo já existente.
- [ ] Quando o usuário passar o mouse ou focar no campo de código, então o texto de ajuda descrevendo o formato esperado do código é exibido.

**Especificidade técnica:**
- Códigos HTTP: 404, 409
- Campos: `codigoCurso`
- Precisa de esclarecimento: sim — Falta definir o formato exato do código do curso (tamanho, máscara, alfanumérico) e o endpoint definitivo de vinculação.

**Rastreabilidade:** REQ-197 (ver requirements.json)

---

### [Sprint 9] Incluir campo tipoVinculo no objeto de usuário do AuthContext
<!-- sdd-bot:meta id="BL-045" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-200" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Adicionar o campo tipoVinculo ao objeto de usuário armazenado e exposto pelo AuthContext (ex.: React Context de autenticação), populando-o a partir da resposta do endpoint de autenticação/perfil, para que componentes consumidores do contexto possam ler esse valor e decidir a renderização condicional entre RGA e CPF mascarado na tela de Perfil.

**Comportamento esperado:**
Componentes que consomem o AuthContext têm acesso ao campo tipoVinculo do usuário logado, e a tela de Perfil exibe RGA quando tipoVinculo indica estudante, ou CPF mascarado quando indica não-estudante.

**Critérios de aceite:**
- [ ] Quando o usuário autenticado for do tipo estudante, então o AuthContext expõe tipoVinculo com o valor correspondente e o Perfil renderiza o campo RGA.
- [ ] Quando o usuário autenticado for do tipo não-estudante, então o AuthContext expõe tipoVinculo com o valor correspondente e o Perfil renderiza o CPF mascarado.
- [ ] Quando a resposta de autenticação não incluir o campo tipoVinculo (ausente ou nulo), então o AuthContext trata o valor como indefinido e o Perfil não quebra, exibindo estado padrão sem RGA nem CPF.
- [ ] Quando o usuário faz logout, então o campo tipoVinculo é removido/resetado do AuthContext junto com os demais dados do usuário.

**Especificidade técnica:**
- Campos: `tipoVinculo`
- Precisa de esclarecimento: sim — Falta definir os valores possíveis exatos de tipoVinculo (ex.: 'ESTUDANTE'/'NAO_ESTUDANTE' ou enum numérico) e se o campo já é retornado pelo endpoint de login/perfil atual ou precisa ser adicionado no backend.

**Rastreabilidade:** REQ-200 (ver requirements.json)

---

### [Sprint 9] Modelar estado de usuário autenticado no contexto
<!-- sdd-bot:meta id="BL-046" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-201" dependsOn="REQ-200" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-200

**Descrição:**
Implementar a estrutura de estado do contexto de autenticação (ex.: AuthContext/store) para armazenar o objeto do usuário logado contendo os campos id, tipoVinculo, rga, cpfMascarado, nome, role, diretoriaAtiva e diretorias (lista). O objeto deve ser populado a partir da resposta de login/refresh (dependência REQ-200) e ficar acessível via hook/provider para os demais componentes da aplicação.

**Comportamento esperado:**
Após login bem-sucedido, o contexto expõe um objeto usuário com todos os campos preenchidos e diretoriaAtiva/diretorias consistentes com os dados retornados pela API.

**Critérios de aceite:**
- [ ] Quando o login retornar sucesso, então o contexto deve conter id, tipoVinculo, rga, cpfMascarado, nome, role, diretoriaAtiva e diretorias preenchidos com os valores da resposta.
- [ ] Quando o usuário pertencer a múltiplas diretorias, então a lista 'diretorias' deve conter todos os itens retornados e 'diretoriaAtiva' deve corresponder a um item presente nessa lista.
- [ ] Quando a API não retornar o campo rga (ex.: usuário não-estudante), então o contexto deve armazenar rga como null sem lançar erro.
- [ ] Quando o usuário fizer logout, então o contexto deve limpar todos os campos do objeto usuário, retornando ao estado inicial (undefined/null).
- [ ] Quando a resposta da API vier sem o campo diretoriaAtiva ou com valor inconsistente (não presente em diretorias), então o contexto deve tratar como estado inválido e não definir diretoriaAtiva automaticamente.

**Especificidade técnica:**
- Campos: `id`, `tipoVinculo`, `rga`, `cpfMascarado`, `nome`, `role`, `diretoriaAtiva`, `diretorias`
- Precisa de esclarecimento: sim — Não está definido qual tecnologia/padrão de estado usar (Context API, Redux, Zustand, etc.) nem o shape exato do objeto 'diretorias' (array de ids ou de objetos com nome/código).

**Rastreabilidade:** REQ-201 (ver requirements.json)

---

### [Sprint 9] Mascarar CPF exibido na tela de perfil
<!-- sdd-bot:meta id="BL-047" epic="8.4 Proteção de Dado Pessoal Sensível (CPF)" layer="frontend" requirementIds="REQ-247" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Implementar no componente de perfil do usuário a renderização do campo cpfMascarado (obtido do contexto de autenticação, REQ-201) aplicando/exibindo o formato mascarado padrão, ocultando os 3 primeiros e os 2 últimos dígitos do CPF (ex.: ***.456.789-**), sem exibir em nenhum momento o CPF completo no DOM ou em requisições subsequentes desse componente.

**Comportamento esperado:**
Na tela de perfil, o campo CPF é exibido no formato ***.456.789-** e o valor completo do CPF nunca aparece renderizado na página.

**Critérios de aceite:**
- [ ] Quando a tela de perfil for carregada com um cpfMascarado válido, então o valor exibido deve seguir o padrão ***.XXX.XXX-** (3 primeiros e 2 últimos dígitos ocultos).
- [ ] Quando o campo cpfMascarado vier vazio ou nulo do contexto, então a tela deve exibir um placeholder (ex.: 'CPF não informado') em vez de string vazia ou 'undefined'.
- [ ] Quando o usuário inspecionar o HTML renderizado da página de perfil, então nenhum atributo ou nó deve conter o CPF completo (sem máscara).
- [ ] Quando o formato recebido de cpfMascarado não corresponder ao padrão esperado (ex.: já vier sem máscara do backend), então o componente deve exibir o valor recebido sem tentar re-mascarar ou quebrar a renderização.

**Especificidade técnica:**
- Campos: `cpfMascarado`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-247 (ver requirements.json)

---

### [Sprint 9] Adicionar opção 'Não sou estudante' na tela de cadastro
<!-- sdd-bot:meta id="BL-048" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-284" dependsOn="" -->
**Tipo:** feature
**Prioridade:** must

**Descrição:**
Adicionar na tela de cadastro um controle de seleção (ex.: toggle, radio group ou tabs) com as opções 'Sou estudante' e 'Não sou estudante', controlando um estado local (ex.: tipoCadastro) que determina qual formulário condicional será renderizado (estudante vs. não-estudante).

**Comportamento esperado:**
Ao clicar em 'Não sou estudante', a tela alterna a exibição para o formulário correspondente a esse tipo de cadastro, sem recarregar a página.

**Critérios de aceite:**
- [ ] Quando o usuário acessar a tela de cadastro pela primeira vez, então a opção padrão selecionada deve ser 'Sou estudante' e o formulário de estudante deve estar visível.
- [ ] Quando o usuário clicar em 'Não sou estudante', então o estado tipoCadastro deve mudar para 'nao-estudante' e o formulário de não-estudante (REQ-285) deve ser renderizado no lugar do formulário de estudante.
- [ ] Quando o usuário alternar de 'Não sou estudante' de volta para 'Sou estudante', então os campos já preenchidos no formulário de não-estudante devem ser descartados/resetados.
- [ ] Quando a seleção for alterada, então nenhuma requisição HTTP deve ser disparada apenas pela troca de opção (troca é puramente de estado local/UI).

**Especificidade técnica:**
- Campos: `tipoCadastro`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-284 (ver requirements.json)

---

### [Sprint 9] Criar formulário de cadastro para usuário não-estudante
<!-- sdd-bot:meta id="BL-049" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-285" dependsOn="REQ-284" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-284

**Descrição:**
Implementar o formulário exibido quando tipoCadastro='nao-estudante' (REQ-284), contendo os campos CPF (com máscara e validação de formato/dígitos verificadores no cliente), código da atlética, nome, e-mail e senha, com validação de formato antes do submit para o endpoint de registro correspondente.

**Comportamento esperado:**
O usuário consegue preencher e submeter o formulário com CPF, código da atlética, nome, e-mail e senha, avançando no fluxo de cadastro somente quando todos os campos são válidos.

**Critérios de aceite:**
- [ ] Quando todos os campos (CPF, código da atlética, nome, e-mail, senha) forem preenchidos com valores válidos, então o botão de submit deve ficar habilitado e o formulário deve enviar os dados ao endpoint de registro.
- [ ] Quando o CPF informado tiver dígitos verificadores inválidos, então o campo deve exibir a mensagem 'CPF inválido' e o submit deve ficar bloqueado.
- [ ] Quando o campo e-mail não seguir o formato padrão (ex.: sem '@' ou domínio), então deve exibir a mensagem 'E-mail inválido' e bloquear o envio.
- [ ] Quando algum campo obrigatório (CPF, código da atlética, nome, e-mail, senha) estiver vazio no momento do submit, então o formulário deve exibir 'Campo obrigatório' no campo correspondente e não enviar a requisição.
- [ ] Quando o código da atlética informado não corresponder a nenhuma atlética existente, então a API deve retornar erro (ex.: 404) e o formulário deve exibir a mensagem de erro retornada sem limpar os demais campos preenchidos.

**Especificidade técnica:**
- Códigos HTTP: 404
- Campos: `cpf`, `codigoAtletica`, `nome`, `email`, `senha`
- Precisa de esclarecimento: sim — Não há definição do endpoint de registro não-estudante, dos requisitos mínimos de complexidade de senha, nem do código HTTP de sucesso e de erro de e-mail já cadastrado.

**Rastreabilidade:** REQ-285 (ver requirements.json)

---

### [Sprint 9] Validar dígito verificador do CPF no formulário de registro
<!-- sdd-bot:meta id="BL-050" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-286" dependsOn="REQ-285" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-285

**Descrição:**
Implementar função de validação de CPF no client-side (frontend) que calcula os dois dígitos verificadores conforme o algoritmo oficial (módulo 11) a partir dos 9 primeiros dígitos do CPF informado. A função deve ser acionada no campo "cpf" dos formulários de registro (estudante e não-estudante) no evento de blur e antes do submit, bloqueando o envio da requisição ao endpoint de registro enquanto o CPF for inválido. Deve rejeitar também sequências de dígitos repetidos (ex.: 111.111.111-11), que passam no cálculo do dígito verificador mas são inválidas na prática.

**Comportamento esperado:**
O usuário recebe feedback visual imediato (mensagem de erro abaixo do campo) quando o CPF digitado é inválido, e o botão de submit do formulário permanece desabilitado até que um CPF válido seja informado.

**Critérios de aceite:**
- [ ] Quando o usuário digita um CPF com dígitos verificadores corretos (ex.: 529.982.247-25), então o campo é marcado como válido e o botão de submit é habilitado.
- [ ] Quando o usuário digita um CPF com dígito verificador incorreto, então o campo exibe a mensagem 'CPF inválido' e o submit permanece bloqueado.
- [ ] Quando o usuário digita um CPF com todos os dígitos repetidos (ex.: 000.000.000-00 ou 111.111.111-11), então o campo é marcado inválido mesmo que o cálculo do módulo 11 resulte em dígitos coincidentes.
- [ ] Quando o campo CPF é deixado vazio e o usuário tenta submeter o formulário, então é exibida a mensagem 'CPF é obrigatório' e a requisição não é enviada.
- [ ] Quando o CPF contém menos de 11 dígitos numéricos (após remoção de máscara/caracteres não numéricos), então o campo é marcado inválido com a mensagem 'CPF inválido' sem disparar cálculo do dígito verificador.
- [ ] Quando o CPF é válido em ambos os formulários (estudante e não-estudante), então a validação ocorre de forma idêntica em ambos, reutilizando a mesma função de validação.

**Especificidade técnica:**
- Campos: `cpf`
- Limites: 11 dígitos numéricos
- Precisa de esclarecimento: sim — Não está definido se a validação deve usar biblioteca de terceiros (ex.: cpf-cnpj-validator) ou implementação própria, nem o nome exato do componente/hook a ser criado (ex.: useCpfValidation) e se a máscara de input (000.000.000-00) já existe ou precisa ser implementada junto.

**Rastreabilidade:** REQ-286 (ver requirements.json)

---

### [Sprint 10] Configurar fallback SPA para index.html no servidor web
<!-- sdd-bot:meta id="BL-051" epic="Deployment" layer="frontend" requirementIds="REQ-334" dependsOn="REQ-332" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-332

**Descrição:**
Configurar a camada de servidor (proxy reverso/servidor de arquivos estáticos usado em produção, ex.: Nginx/servidor Node de deploy) para interceptar requisições GET que não correspondam a um arquivo estático existente (js, css, imagens, fonts) nem ao prefixo de rota da API (ex.: /api/*) e retornar o conteúdo de index.html com status 200, delegando o roteamento de URL ao client-side router (ex.: React Router) da SPA. A configuração deve ser aplicada no arquivo de configuração do servidor (nginx.conf, vercel.json, static.json ou equivalente) usado no ambiente de produção descrito na dependência REQ-332.

**Comportamento esperado:**
Ao acessar diretamente uma URL de rota interna da SPA (ex.: /dashboard/relatorios) via digitação no navegador ou refresh (F5), a aplicação carrega normalmente exibindo a tela correspondente, sem retornar erro 404 do servidor.

**Critérios de aceite:**
- [ ] Quando o usuário acessar diretamente (GET) uma rota de aplicação como /dashboard, então o servidor deve responder com status 200 e o conteúdo de index.html.
- [ ] Quando o usuário der refresh (F5) em uma rota profunda como /dashboard/relatorios/2024, então o client-side router deve renderizar o componente correspondente sem erro 404.
- [ ] Quando a requisição for para um arquivo estático existente (ex.: /assets/logo.png), então o servidor deve retornar o arquivo original com status 200 e não o index.html.
- [ ] Quando a requisição for para um endpoint da API (ex.: /api/usuarios), então o servidor deve encaminhar a chamada ao backend e não retornar index.html.
- [ ] Quando a requisição for para uma rota inexistente tanto na SPA quanto na API (ex.: /rota-que-nao-existe-no-router), então o index.html é retornado com status 200 e a SPA deve exibir sua própria tela de erro 404 client-side.

**Especificidade técnica:**
- Códigos HTTP: 200, 404
- Campos: `/api/*`, `index.html`, `nginx.conf ou equivalente do ambiente de deploy`
- Precisa de esclarecimento: sim — Falta definir qual servidor/plataforma de deploy será usado em produção (Nginx próprio, Vercel, Netlify, servidor Node com Express) conforme REQ-332, pois a sintaxe exata da regra de fallback (try_files no Nginx vs rewrites no vercel.json) depende dessa escolha.

**Rastreabilidade:** REQ-334 (ver requirements.json)

---

### [Sprint 11] Criar dashboard analítico de vendas e vínculos para diretoria
<!-- sdd-bot:meta id="BL-052" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-40" dependsOn="REQ-29,REQ-35" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-29, REQ-35

**Descrição:**
Implementar tela de dashboard restrita ao papel DIRETORIA, consumindo endpoints agregados (ex.: GET /api/dashboard/analytics) que retornam métricas de vendas/inscrições em eventos e distribuição de usuários por tipo de vínculo (estudante, não-estudante, sócio). A tela deve renderizar gráficos (barras/pizza) e cards de indicadores numéricos, com filtro de período (data inicial/final) enviado como query params ao endpoint. Depende dos dados consolidados por REQ-29 (aprovação de vínculos) e REQ-35 (eventos/inscrições).

**Comportamento esperado:**
Usuário com papel DIRETORIA acessa a rota /dashboard e visualiza gráficos e cards atualizados com dados reais de vendas, inscrições e distribuição por tipo de vínculo, podendo filtrar por período.

**Critérios de aceite:**
- [ ] Quando um usuário com papel DIRETORIA acessa /dashboard, então o sistema exibe cards de totais (vendas, inscrições) e gráfico de distribuição por tipo de vínculo com dados retornados pelo endpoint GET /api/dashboard/analytics (200 OK).
- [ ] Quando o usuário aplica filtro de período (dataInicio, dataFim), então o dashboard reenvia a requisição com esses parâmetros e atualiza os gráficos apenas com dados dentro do intervalo selecionado.
- [ ] Quando um usuário sem papel DIRETORIA tenta acessar /dashboard, então o sistema retorna HTTP 403 e exibe mensagem 'Acesso não autorizado' sem renderizar os dados.
- [ ] Quando o endpoint de analytics não retorna dados para o período (lista vazia), então o dashboard exibe estado vazio com mensagem 'Nenhum dado disponível para o período selecionado' em vez de gráfico quebrado.
- [ ] Quando a requisição ao endpoint falha (HTTP 500 ou timeout), então o dashboard exibe mensagem de erro 'Não foi possível carregar os dados' e oferece botão de tentar novamente.

**Especificidade técnica:**
- Códigos HTTP: 200, 403, 500
- Campos: `GET /api/dashboard/analytics`, `dataInicio`, `dataFim`
- Precisa de esclarecimento: sim — Não há definição de quais métricas exatas compõem 'analytics completo' (ex.: total de receita, ticket médio, número de eventos, comparação entre períodos), nem o formato exato do payload de resposta do endpoint de analytics. Necessário alinhar com SDD ou stakeholder quais indicadores e granularidade (diário/mensal) devem ser exibidos.

**Rastreabilidade:** REQ-40 (ver requirements.json)

---

### [Sprint 11] Exibir tela de inserção de código OTP recebido por e-mail
<!-- sdd-bot:meta id="BL-053" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-293" dependsOn="REQ-291" -->
**Tipo:** feature
**Prioridade:** must
**Depende de:** REQ-291

**Descrição:**
Criar componente de tela/rota (ex.: /confirmar-otp) com formulário contendo campo de entrada para o código OTP enviado por e-mail (gerado conforme REQ-291), botão de confirmação que envia o código ao endpoint de validação (ex.: POST /api/otp/confirmar com body { email, codigo }), e link/ação para reenvio do código.

**Comportamento esperado:**
Usuário visualiza a tela de confirmação após o cadastro, insere o código recebido por e-mail e, ao submeter, recebe feedback imediato de sucesso ou falha na validação.

**Critérios de aceite:**
- [ ] Quando o usuário é redirecionado após o cadastro de não-estudante, então a tela de confirmação de OTP é exibida com campo de entrada do código e botão 'Confirmar'.
- [ ] Quando o usuário insere um código válido e correspondente ao e-mail cadastrado, então o sistema envia POST /api/otp/confirmar e, ao receber 200 OK, redireciona o usuário para a tela de status de aprovação pendente.
- [ ] Quando o usuário insere um código inválido ou expirado, então o sistema exibe mensagem 'Código inválido ou expirado' sem redirecionar, mantendo o formulário visível.
- [ ] Quando o campo de código é submetido vazio, então o sistema exibe validação de campo obrigatório 'Informe o código recebido por e-mail' e bloqueia o envio da requisição.
- [ ] Quando o usuário aciona 'Reenviar código', então o sistema dispara nova solicitação de OTP e exibe mensagem de confirmação 'Novo código enviado para seu e-mail'.

**Especificidade técnica:**
- Códigos HTTP: 200, 400
- Campos: `POST /api/otp/confirmar`, `email`, `codigo`, `Código inválido ou expirado`, `Informe o código recebido por e-mail`
- Precisa de esclarecimento: sim — Não há definição do tempo de expiração do OTP nem do número de tentativas permitidas antes de bloquear a solicitação; esses limites dependem da implementação do endpoint de geração de OTP em REQ-291.

**Rastreabilidade:** REQ-293 (ver requirements.json)

---

### [Sprint 12] Exibir fila de aprovação de usuários pendentes
<!-- sdd-bot:meta id="BL-054" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-13" dependsOn="REQ-12" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-12

**Descrição:**
Criar tela no painel da DIRETORIA que consome o endpoint de listagem de usuários não-estudante com status pendente (ex.: GET /api/users?role=non-student&status=pending) e renderiza a lista em componente de fila, com ações de aprovar/rejeitar por item que disparam chamadas ao endpoint de aprovação (REQ-12).

**Comportamento esperado:**
A DIRETORIA visualiza uma lista paginada de usuários não-estudante com status 'pending', ordenada por data de solicitação, podendo aprovar ou rejeitar cada um diretamente na tela.

**Critérios de aceite:**
- [ ] Quando a DIRETORIA acessa a tela de fila, então o sistema lista todos os usuários não-estudante com status 'pending' retornados por GET /api/users?role=non-student&status=pending com HTTP 200.
- [ ] Quando não há usuários pendentes, então a tela exibe mensagem 'Nenhuma solicitação pendente' e nenhuma linha de tabela.
- [ ] Quando a DIRETORIA clica em 'Aprovar' em um item, então o item é removido da fila e o status do usuário muda para 'approved' via chamada ao endpoint de aprovação (REQ-12).
- [ ] Quando um usuário sem papel DIRETORIA tenta acessar a rota da fila, então o sistema retorna HTTP 403 e exibe mensagem de acesso negado.
- [ ] Quando a requisição à API falha (ex.: HTTP 500 ou timeout), então a tela exibe mensagem de erro 'Não foi possível carregar a fila de aprovação' sem quebrar a interface.

**Especificidade técnica:**
- Códigos HTTP: 200, 403, 500
- Campos: `role`, `status`, `GET /api/users`
- Precisa de esclarecimento: sim — Não foi especificado o tamanho de página/paginação nem o endpoint exato de aprovação/rejeição definido em REQ-12; assumir contrato pendente de confirmação com o backend.

**Rastreabilidade:** REQ-13 (ver requirements.json)

---

### [Sprint 12] Adicionar ou remover atlética vinculada no perfil
<!-- sdd-bot:meta id="BL-055" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-16" dependsOn="REQ-14" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-14

**Descrição:**
Implementar controles na seção de perfil do usuário que permitem selecionar uma atlética existente para vincular (via endpoint POST /api/users/{id}/athletics) e desvincular uma atlética já associada (via DELETE /api/users/{id}/athletics/{athleticId}), atualizando a lista exibida sem recarregar a página.

**Comportamento esperado:**
O usuário consegue vincular uma nova atlética ao seu perfil e remover uma atlética já vinculada, vendo a lista atualizada imediatamente após a ação.

**Critérios de aceite:**
- [ ] Quando o usuário seleciona uma atlética na lista de disponíveis e confirma, então a atlética é adicionada via POST /api/users/{id}/athletics com resposta HTTP 201 e passa a aparecer na lista de vinculadas.
- [ ] Quando o usuário clica em 'Remover' em uma atlética já vinculada, então a chamada DELETE /api/users/{id}/athletics/{athleticId} retorna HTTP 204 e o item some da lista.
- [ ] Quando o usuário tenta vincular uma atlética já vinculada, então o sistema retorna HTTP 409 e exibe mensagem 'Atlética já vinculada'.
- [ ] Quando a remoção falha por erro de rede ou servidor (HTTP 500), então a atlética permanece na lista e uma mensagem de erro é exibida ao usuário.

**Especificidade técnica:**
- Códigos HTTP: 201, 204, 409, 500
- Campos: `POST /api/users/{id}/athletics`, `DELETE /api/users/{id}/athletics/{athleticId}`
- Precisa de esclarecimento: sim — Não há definição de limite máximo de atléticas vinculáveis por usuário nem do formato exato do payload de vínculo; confirmar contrato do endpoint com REQ-14.

**Rastreabilidade:** REQ-16 (ver requirements.json)

---

### [Sprint 12] Criar seção Atlética para múltiplos vínculos no perfil
<!-- sdd-bot:meta id="BL-056" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-37" dependsOn="REQ-14" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-14

**Descrição:**
Adicionar componente de seção 'Atlética' na tela de perfil, listando todas as atléticas vinculadas ao usuário via GET /api/users/{id}/athletics e integrando os controles de adicionar/remover (REQ-16) dentro dessa área dedicada da tela.

**Comportamento esperado:**
O usuário visualiza, dentro do perfil, uma seção específica que agrega todas as atléticas às quais está vinculado, com acesso direto aos controles de gerenciamento.

**Critérios de aceite:**
- [ ] Quando o perfil é carregado, então a seção Atlética exibe todas as atléticas retornadas por GET /api/users/{id}/athletics com HTTP 200.
- [ ] Quando o usuário não possui nenhuma atlética vinculada, então a seção exibe o texto 'Nenhuma atlética vinculada' em vez de lista vazia.
- [ ] Quando o usuário possui múltiplas atléticas vinculadas, então todas são listadas simultaneamente na seção, sem limite de exibição truncando itens.
- [ ] Quando a chamada ao endpoint de listagem falha (HTTP 500 ou timeout), então a seção exibe mensagem de erro 'Não foi possível carregar suas atléticas' no lugar da lista.

**Especificidade técnica:**
- Códigos HTTP: 200, 500
- Campos: `GET /api/users/{id}/athletics`
- Precisa de esclarecimento: sim — Requisito não especifica se há paginação ou limite de atléticas exibidas simultaneamente na seção; confirmar com REQ-14.

**Rastreabilidade:** REQ-37 (ver requirements.json)

---

### [Sprint 12] Exibir histórico de compras na tela de perfil
<!-- sdd-bot:meta id="BL-057" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-38" dependsOn="REQ-28" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-28

**Descrição:**
Adicionar componente na tela de perfil que consome o endpoint de histórico de compras do usuário (ex.: GET /api/users/{id}/purchases, dependente de REQ-28) e renderiza a lista em ordem cronológica decrescente, com dados de item, data e valor de cada compra.

**Comportamento esperado:**
O usuário visualiza, na tela de perfil, a lista de suas compras anteriores ordenadas da mais recente para a mais antiga, com data, descrição e valor de cada transação.

**Critérios de aceite:**
- [ ] Quando o perfil é carregado, então o componente exibe as compras retornadas por GET /api/users/{id}/purchases com HTTP 200, ordenadas por data decrescente.
- [ ] Quando o usuário não possui nenhuma compra registrada, então o componente exibe a mensagem 'Nenhuma compra realizada' em vez de lista vazia.
- [ ] Quando cada item de compra é exibido, então mostra data, descrição/nome do item e valor formatado em moeda (R$).
- [ ] Quando a chamada ao endpoint falha (HTTP 500 ou timeout), então o componente exibe mensagem de erro 'Não foi possível carregar o histórico de compras' sem interromper o carregamento do restante do perfil.

**Especificidade técnica:**
- Códigos HTTP: 200, 500
- Campos: `GET /api/users/{id}/purchases`
- Precisa de esclarecimento: sim — Não há definição de paginação/limite de itens exibidos nem do contrato exato de campos retornados por REQ-28; confirmar com o backend responsável pelo histórico de compras.

**Rastreabilidade:** REQ-38 (ver requirements.json)

---

### [Sprint 12] Exibir histórico de eventos na tela de perfil
<!-- sdd-bot:meta id="BL-058" epic="Introdução (parte 1)" layer="frontend" requirementIds="REQ-39" dependsOn="REQ-34" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-34

**Descrição:**
Adicionar seção 'Histórico de Eventos' ao componente ProfilePage, consumindo o endpoint GET /users/{id}/events (dependência REQ-34) e renderizando lista com nome do evento, data e status de participação. Requer estado de loading e tratamento de lista vazia.

**Comportamento esperado:**
Ao abrir a tela de perfil, a seção de histórico de eventos exibe até os 20 itens mais recentes retornados pela API, ordenados por data decrescente, com nome, data (dd/mm/aaaa) e status de cada evento.

**Critérios de aceite:**
- [ ] Quando o usuário acessa a página de perfil e a API GET /users/{id}/events retorna 200 com itens, então a lista exibe nome, data e status de cada evento em ordem decrescente de data.
- [ ] Quando a API retorna 200 com array vazio, então a seção exibe a mensagem 'Nenhum evento encontrado'.
- [ ] Quando a requisição está em andamento, então um skeleton/spinner é exibido no lugar da lista.
- [ ] Quando a API retorna 401 ou 500, então a seção exibe a mensagem 'Não foi possível carregar o histórico de eventos' sem quebrar o restante da página de perfil.

**Especificidade técnica:**
- Códigos HTTP: 200, 401, 500
- Campos: `GET /users/{id}/events`, `nome do evento`, `data`, `status`
- Limites: 20 itens mais recentes por página
- Precisa de esclarecimento: sim — Não foi definido se haverá paginação/infinite scroll para históricos com mais de 20 eventos nem o contrato exato de resposta do endpoint de REQ-34.

**Rastreabilidade:** REQ-39 (ver requirements.json)

---

### [Sprint 12] Criar página de erro para rotas inválidas
<!-- sdd-bot:meta id="BL-059" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-185" dependsOn="" -->
**Tipo:** feature
**Prioridade:** should

**Descrição:**
Implementar componente ErrorPage no frontend e configurar rota catch-all (wildcard '*') no roteador da aplicação para exibi-la, além de acioná-la como fallback em erros de renderização não tratados (Error Boundary).

**Comportamento esperado:**
Ao acessar uma URL inexistente ou ao ocorrer um erro de renderização não tratado, a aplicação exibe a ErrorPage com código de status (404 ou 500), mensagem correspondente e botão para retornar à página inicial.

**Critérios de aceite:**
- [ ] Quando o usuário navega para uma rota não cadastrada, então a ErrorPage é renderizada exibindo o código 404 e a mensagem 'Página não encontrada'.
- [ ] Quando um componente lança uma exceção não capturada durante a renderização, então o Error Boundary intercepta o erro e renderiza a ErrorPage com código 500 e mensagem 'Erro inesperado'.
- [ ] Quando a ErrorPage é exibida, então um botão 'Voltar para o início' redireciona o usuário para a rota raiz ('/').
- [ ] Quando o usuário acessa uma rota válida, então a ErrorPage nunca é renderizada.

**Especificidade técnica:**
- Códigos HTTP: 404, 500
- Campos: `ErrorPage`, `rota wildcard '*'`, `Error Boundary`, `botão 'Voltar para o início'`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-185 (ver requirements.json)

---

### [Sprint 12] Exibir aviso de confirmação pendente no registro não-estudante
<!-- sdd-bot:meta id="BL-060" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-190" dependsOn="REQ-188" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-188

**Descrição:**
Adicionar texto de ajuda (helper text) abaixo do formulário de registro não-estudante (dependência REQ-188), informando que o cadastro será confirmado por e-mail e pode depender de aprovação manual da atlética.

**Comportamento esperado:**
Após o formulário de registro não-estudante ser enviado e a API confirmar o cadastro com status 201, a tela exibe o texto fixo: 'Seu cadastro será confirmado por e-mail e pode requerer aprovação da atlética.'

**Critérios de aceite:**
- [ ] Quando o formulário de registro não-estudante é submetido e a API retorna 201, então o texto 'Seu cadastro será confirmado por e-mail e pode requerer aprovação da atlética.' é exibido na tela de confirmação.
- [ ] Quando a tela de confirmação é renderizada, então o texto de ajuda permanece visível até o usuário clicar em qualquer ação de navegação.
- [ ] Quando o formulário de registro é para estudante (fluxo distinto de REQ-188), então esse texto de ajuda não é exibido.
- [ ] Quando a API de registro retorna erro (400 ou 409), então a tela de confirmação com o texto de ajuda não é renderizada, e a mensagem de erro do formulário é exibida no lugar.

**Especificidade técnica:**
- Códigos HTTP: 201, 400, 409
- Campos: `texto de ajuda`, `tela de confirmação de registro não-estudante`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-190 (ver requirements.json)

---

### [Sprint 12] Destacar atlética ativa no dropdown de seleção
<!-- sdd-bot:meta id="BL-061" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-192" dependsOn="REQ-191" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-191

**Descrição:**
No componente de dropdown de seleção de atléticas (dependência REQ-191), aplicar um indicador visual (ícone de check e/ou estilo de item destacado) no item correspondente à atlética atualmente ativa na sessão do usuário.

**Comportamento esperado:**
Ao abrir o dropdown de seleção de atléticas, o item correspondente à atlética ativa é exibido com ícone de check à direita e fundo diferenciado em relação aos demais itens da lista.

**Critérios de aceite:**
- [ ] Quando o dropdown é aberto e o usuário possui uma atlética ativa na sessão, então o item correspondente exibe ícone de check e fundo destacado.
- [ ] Quando o usuário seleciona uma atlética diferente da atualmente ativa, então o indicador visual é movido para o novo item selecionado após a confirmação da troca.
- [ ] Quando o dropdown é aberto e nenhuma atlética está definida como ativa na sessão, então nenhum item exibe o indicador de ativo.
- [ ] Quando a lista de atléticas retornada pela API não contém a atlética marcada como ativa na sessão (ex.: removida), então nenhum item é destacado e nenhum erro é lançado na renderização.

**Especificidade técnica:**
- Campos: `dropdown de seleção de atléticas`, `ícone de check`, `atlética ativa`
- Precisa de esclarecimento: sim — Não foi especificado se a troca de atlética ativa exige confirmação via API (endpoint de update) antes de atualizar o indicador visual ou se é apenas estado local imediato.

**Rastreabilidade:** REQ-192 (ver requirements.json)

---

### [Sprint 12] Adicionar ThemeToggle na Navbar
<!-- sdd-bot:meta id="BL-062" epic="Introdução (parte 6)" layer="frontend" requirementIds="REQ-194" dependsOn="" -->
**Tipo:** feature
**Prioridade:** could

**Descrição:**
Implementar componente ThemeToggle (botão/ícone sol-lua) posicionado na Navbar, que alterna entre modo claro e escuro aplicando a classe/atributo de tema (ex.: data-theme ou classe 'dark') no elemento raiz (html/body) e persiste a escolha em localStorage sob a chave 'theme'. No carregamento da aplicação, ler o valor salvo em localStorage (ou preferência do sistema via prefers-color-scheme quando não houver valor salvo) e aplicar o tema correspondente antes da renderização visível.

**Comportamento esperado:**
O usuário visualiza um ícone de alternância de tema na Navbar; ao clicar, a interface muda imediatamente entre claro e escuro, e essa preferência permanece ao recarregar a página ou em nova sessão no mesmo navegador.

**Critérios de aceite:**
- [ ] Quando o usuário clica no ThemeToggle estando no tema claro, então a interface muda para tema escuro e localStorage['theme'] é atualizado para 'dark'.
- [ ] Quando o usuário clica no ThemeToggle estando no tema escuro, então a interface muda para tema claro e localStorage['theme'] é atualizado para 'light'.
- [ ] Quando a página é recarregada e existe valor salvo em localStorage['theme'], então o tema aplicado corresponde ao valor salvo, sem flash do tema oposto.
- [ ] Quando não há valor salvo em localStorage e o navegador reporta prefers-color-scheme: dark, então o tema escuro é aplicado por padrão.
- [ ] Quando o localStorage está indisponível ou lança erro (ex.: modo privado), então o sistema aplica o tema claro como fallback sem quebrar a renderização da Navbar.

**Especificidade técnica:**
- Campos: `localStorage['theme']`, `data-theme`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-194 (ver requirements.json)

---

### [Sprint 12] Exibir diretoria ativa do usuário na Navbar
<!-- sdd-bot:meta id="BL-063" epic="9.1 Fluxo de Login com Auto-Atletica" layer="frontend" requirementIds="REQ-265" dependsOn="REQ-263" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-263

**Descrição:**
Consumir no componente Navbar o dado de diretoria ativa retornado pelo endpoint/contexto de sessão do usuário (estabelecido em REQ-263) e renderizar o campo 'nomeDiretoriaAtiva' em um elemento de texto visível na Navbar, atualizado a partir do estado de autenticação/sessão carregado no login.

**Comportamento esperado:**
Após login, o usuário vê na Navbar o nome da diretoria/atlética à qual está atualmente vinculado como ativa.

**Critérios de aceite:**
- [ ] Quando o login é concluído e o usuário possui uma diretoria ativa, então a Navbar exibe o campo 'nomeDiretoriaAtiva' retornado pela sessão.
- [ ] Quando o usuário está autenticado mas não possui nenhuma diretoria ativa associada, então a Navbar exibe um texto padrão indicando ausência de diretoria (ex.: 'Nenhuma atlética selecionada') em vez de campo vazio ou undefined.
- [ ] Quando a chamada de sessão/diretoria falha ou retorna erro, então a Navbar não quebra a renderização e exibe um estado de fallback (ex.: placeholder ou omissão do nome) sem travar a aplicação.

**Especificidade técnica:**
- Campos: `nomeDiretoriaAtiva`
- Precisa de esclarecimento: sim — Falta definir o endpoint/estrutura exata retornada por REQ-263 (nome do campo real e se vem via contexto de autenticação, endpoint REST dedicado ou token JWT) para especificar a integração com precisão.

**Rastreabilidade:** REQ-265 (ver requirements.json)

---

### [Sprint 12] Adicionar dropdown de troca de atlética na Navbar
<!-- sdd-bot:meta id="BL-064" epic="9.2 Fluxo de Trocar Atletica" layer="frontend" requirementIds="REQ-266" dependsOn="REQ-265" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-265

**Descrição:**
Implementar componente dropdown na Navbar (acionado a partir do nome da diretoria ativa, REQ-265) que lista todas as diretorias/atléticas vinculadas ao usuário, obtidas de um endpoint ou dado de sessão contendo a lista de diretorias do usuário, marcando visualmente (ex.: ícone de check ou destaque) a diretoria correspondente à ativa atual.

**Comportamento esperado:**
Ao clicar no nome da diretoria na Navbar, o usuário vê um menu suspenso com todas as suas diretorias, com a atual claramente indicada.

**Critérios de aceite:**
- [ ] Quando o usuário clica no elemento de diretoria ativa na Navbar, então o dropdown abre exibindo a lista completa de diretorias vinculadas ao usuário.
- [ ] Quando o dropdown está aberto, então a diretoria correspondente à ativa é exibida com indicador visual distinto (ex.: check ou destaque) em relação às demais.
- [ ] Quando o usuário possui apenas uma diretoria vinculada, então o dropdown exibe essa única opção já marcada como ativa, sem lista vazia.
- [ ] Quando a lista de diretorias do usuário está vazia (nenhuma vinculação), então o dropdown exibe mensagem informativa de ausência de diretorias em vez de lista em branco.
- [ ] Quando o usuário clica fora do dropdown aberto, então o menu é fechado sem alterar a diretoria ativa.

**Especificidade técnica:**
- Campos: `nomeDiretoriaAtiva`, `listaDiretorias`
- Precisa de esclarecimento: sim — Falta especificar o endpoint/estrutura de dados que retorna a lista de diretorias do usuário (nome do campo, formato de resposta e se inclui id necessário para a troca no REQ-270).

**Rastreabilidade:** REQ-266 (ver requirements.json)

---

### [Sprint 12] Atualizar nome da diretoria na Navbar após troca
<!-- sdd-bot:meta id="BL-065" epic="9.2 Fluxo de Trocar Atletica" layer="frontend" requirementIds="REQ-272" dependsOn="REQ-270" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-270

**Descrição:**
Após a confirmação bem-sucedida da chamada de troca de diretoria (implementada em REQ-270), atualizar o estado local/contexto de sessão do frontend com o novo 'nomeDiretoriaAtiva' retornado pela resposta e forçar a re-renderização do componente Navbar sem necessidade de reload da página.

**Comportamento esperado:**
Imediatamente após o usuário confirmar a troca de atlética no dropdown, a Navbar passa a mostrar o nome da nova diretoria ativa.

**Critérios de aceite:**
- [ ] Quando a requisição de troca de diretoria (REQ-270) retorna sucesso, então o estado de sessão no frontend é atualizado com o novo 'nomeDiretoriaAtiva' e a Navbar reflete esse valor sem reload manual da página.
- [ ] Quando a atualização ocorre, então o dropdown de diretorias (REQ-266) passa a indicar a nova diretoria como ativa na próxima abertura.
- [ ] Quando a requisição de troca falha (ex.: erro de rede ou resposta de erro do backend), então a Navbar mantém exibido o nome da diretoria ativa anterior, sem atualização otimista revertida incorretamente.
- [ ] Quando a troca é concluída, então nenhum outro dado de sessão do usuário (ex.: nome, avatar) é alterado além do campo de diretoria ativa.

**Especificidade técnica:**
- Campos: `nomeDiretoriaAtiva`
- Precisa de esclarecimento: sim — Falta confirmar o código HTTP e formato exato de resposta do endpoint de troca (REQ-270) para especificar o tratamento de sucesso/erro com precisão.

**Rastreabilidade:** REQ-272 (ver requirements.json)

---

### [Sprint 12] Exibir toast de economia após compra na loja
<!-- sdd-bot:meta id="BL-066" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-282" dependsOn="REQ-281" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-281

**Descrição:**
Implementar componente de notificação toast disparado no frontend imediatamente após a confirmação da compra (fluxo dependente de REQ-281), calculando e exibindo o valor economizado (diferença entre preço original e preço pago) formatado como moeda (ex: R$ 12,50).

**Comportamento esperado:**
Ao finalizar a compra, um toast aparece no canto da tela exibindo o texto 'Você economizou R$ X,XX' com o valor calculado, e desaparece automaticamente após alguns segundos.

**Critérios de aceite:**
- [ ] Quando a compra é concluída e há valor de desconto maior que zero, então o toast exibe o texto 'Você economizou R$ X,XX' com o valor formatado em moeda brasileira.
- [ ] Quando o valor economizado é igual a zero (nenhum desconto aplicado), então o toast de economia não é exibido.
- [ ] Quando o toast é exibido, então ele desaparece automaticamente da tela após o tempo padrão configurado (ex: 5 segundos) sem exigir ação do usuário.
- [ ] Quando a resposta da compra não retorna o campo de valor economizado, então o toast não é renderizado e nenhum erro é lançado no console.

**Especificidade técnica:**
- Campos: `valorEconomizado`
- Precisa de esclarecimento: sim — Não há definição do tempo de exibição do toast (duração em segundos) nem do endpoint/campo exato da resposta de compra que fornece o valor economizado.

**Rastreabilidade:** REQ-282 (ver requirements.json)

---

### [Sprint 12] Atualizar histórico de compras após finalizar pedido
<!-- sdd-bot:meta id="BL-067" epic="Introdução (parte 9)" layer="frontend" requirementIds="REQ-283" dependsOn="REQ-281" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-281

**Descrição:**
Disparar refetch da query GET /loja/minhas-compras no frontend logo após a confirmação da compra (fluxo dependente de REQ-281), invalidando o cache local da lista de compras para forçar nova busca dos dados atualizados.

**Comportamento esperado:**
Após a compra ser confirmada, a tela de histórico de compras do usuário passa a exibir o novo item na lista sem necessidade de recarregar a página manualmente.

**Critérios de aceite:**
- [ ] Quando a compra é confirmada, então o frontend dispara uma nova requisição GET /loja/minhas-compras automaticamente, sem interação do usuário.
- [ ] Quando a nova requisição retorna HTTP 200 com a lista atualizada, então a compra recém-realizada aparece no topo do histórico exibido na tela.
- [ ] Quando a requisição de refetch falha com HTTP 500 ou erro de rede, então a tela exibe mensagem de erro 'Não foi possível atualizar o histórico' e mantém a lista anterior visível.
- [ ] Quando o usuário está na página de histórico durante a compra, então a atualização ocorre sem exigir navegação ou reload manual da página.

**Especificidade técnica:**
- Códigos HTTP: 200, 500
- Campos: `/loja/minhas-compras`
- Precisa de esclarecimento: não

**Rastreabilidade:** REQ-283 (ver requirements.json)

---

### [Sprint 12] Aplicar lazy loading nas rotas de página do frontend
<!-- sdd-bot:meta id="BL-068" epic="10. Performance e Escalabilidade" layer="frontend" requirementIds="REQ-308" dependsOn="" -->
**Tipo:** tech-debt
**Prioridade:** should

**Descrição:**
Substituir imports estáticos das páginas por React.lazy() combinado com Suspense no roteador principal do frontend, dividindo o bundle em chunks carregados sob demanda por rota, e configurar fallback de carregamento (spinner/skeleton) durante o download do chunk.

**Comportamento esperado:**
O bundle inicial (chunk principal) carregado no primeiro acesso é reduzido em tamanho, e cada página é baixada em um arquivo JS separado apenas quando o usuário navega até ela.

**Critérios de aceite:**
- [ ] Quando o build de produção é gerado, então o bundle inicial (main chunk) possui tamanho inferior ao bundle atual antes da divisão, verificável no relatório de build (ex: webpack-bundle-analyzer).
- [ ] Quando o usuário navega para uma rota não visitada anteriormente, então um novo arquivo JS correspondente àquela página é requisitado via rede (visível na aba Network do navegador).
- [ ] Quando o chunk de uma página está sendo baixado, então um componente de fallback (spinner) é exibido até o carregamento ser concluído.
- [ ] Quando o download do chunk de uma rota falha (ex: erro de rede), então um componente de erro é exibido ao usuário em vez de tela em branco.

**Especificidade técnica:**
- Campos: `React.lazy`, `Suspense`
- Precisa de esclarecimento: sim — Não há definição de meta numérica de redução do bundle inicial (ex: percentual ou KB alvo) nem lista exata de quais rotas devem ser divididas.

**Rastreabilidade:** REQ-308 (ver requirements.json)

---

### [Sprint 12] Otimizar imagens com srcSet e formato WebP
<!-- sdd-bot:meta id="BL-069" epic="10. Performance e Escalabilidade" layer="frontend" requirementIds="REQ-309" dependsOn="" -->
**Tipo:** feature
**Prioridade:** could

**Descrição:**
Configurar o pipeline de assets do frontend para servir imagens em formato WebP com atributo srcSet contendo múltiplas resoluções, permitindo que o navegador selecione a versão adequada conforme o tamanho de tela e densidade de pixels (fallback para formato original quando WebP não suportado).

**Comportamento esperado:**
As imagens carregadas nas páginas usam o formato WebP nos navegadores compatíveis e o navegador seleciona automaticamente a resolução mais adequada ao dispositivo, reduzindo o volume de dados transferido.

**Critérios de aceite:**
- [ ] Quando uma imagem é renderizada em navegador com suporte a WebP, então o recurso baixado possui extensão/formato .webp.
- [ ] Quando o elemento de imagem possui atributo srcSet com múltiplas resoluções (ex: 1x, 2x), então o navegador seleciona a variante correspondente à densidade de pixels da tela do dispositivo.
- [ ] Quando o navegador não suporta WebP, então a imagem é servida em formato de fallback (ex: JPEG/PNG) via elemento <picture> sem quebra visual.
- [ ] Quando uma imagem referenciada no código não possui versão WebP gerada, então o build falha ou emite aviso indicando o asset ausente, em vez de quebrar silenciosamente em produção.

**Especificidade técnica:**
- Campos: `srcSet`, `picture`, `source`
- Precisa de esclarecimento: sim — Não há definição das resoluções/breakpoints exatos a gerar no srcSet nem se a conversão para WebP ocorre em build time ou via serviço/CDN de otimização de imagens.

**Rastreabilidade:** REQ-309 (ver requirements.json)

---

### [Sprint 12] Aplicar tree shaking e minificação no build de produção
<!-- sdd-bot:meta id="BL-070" epic="10. Performance e Escalabilidade" layer="frontend" requirementIds="REQ-310" dependsOn="" -->
**Tipo:** tech-debt
**Prioridade:** should

**Descrição:**
Configurar o bundler (ex.: Vite/Webpack) do frontend para habilitar tree shaking (eliminação de código morto via análise de ES modules) e minificação (minify de JS/CSS com terser ou esbuild) no modo de build de produção, garantindo que imports não utilizados e código inalcançável sejam removidos do bundle final gerado em `dist/`.

**Comportamento esperado:**
O bundle de produção gerado apresenta tamanho reduzido em relação ao build atual, sem código morto e sem variáveis/funções não minificadas, mantendo a aplicação funcional após o build.

**Critérios de aceite:**
- [ ] Quando o comando de build de produção for executado, então o bundler deve rodar com flag/modo de produção que ativa tree shaking e minificação automaticamente.
- [ ] Quando um módulo ou função exportada não for importada em nenhum ponto do código, então ele não deve constar no bundle final gerado.
- [ ] Quando o bundle final for inspecionado, então os identificadores de variáveis e funções JS devem estar minificados (nomes curtos) e sem comentários/espaços supérfluos.
- [ ] Quando o build de produção for comparado ao build anterior sem otimização, então o tamanho total do bundle (em KB, gzip) deve ser menor.
- [ ] Quando o build falhar por erro de sintaxe ou configuração incompatível com tree shaking (ex.: módulo CommonJS sem interop), então o processo de build deve retornar código de saída diferente de 0 e logar o erro específico.

**Especificidade técnica:**
- Precisa de esclarecimento: sim — O requisito não especifica qual bundler está em uso (Webpack, Vite, Rollup) nem a meta numérica de redução de tamanho de bundle esperada; é necessário definir a ferramenta e um limiar alvo (ex.: % de redução ou tamanho máximo em KB).

**Rastreabilidade:** REQ-310 (ver requirements.json)

---

### [Sprint 12] Servir frontend estático via CDN
<!-- sdd-bot:meta id="BL-071" epic="10. Performance e Escalabilidade" layer="frontend" requirementIds="REQ-313" dependsOn="" -->
**Tipo:** feature
**Prioridade:** should

**Descrição:**
Configurar a distribuição dos artefatos estáticos do build de frontend (HTML, JS, CSS, assets) através de um serviço de CDN, incluindo definição de origem (bucket/storage ou servidor), invalidação de cache em novos deploys e headers de cache-control apropriados por tipo de asset.

**Comportamento esperado:**
As requisições de assets estáticos do frontend passam a ser respondidas por edge nodes da CDN em vez de diretamente pelo servidor de origem, reduzindo a latência de carregamento para usuários geograficamente distantes.

**Critérios de aceite:**
- [ ] Quando um usuário acessar a aplicação, então os arquivos estáticos (JS, CSS, imagens) devem ser servidos com domínio/URL apontando para a CDN configurada.
- [ ] Quando um novo deploy de frontend for publicado, então a CDN deve invalidar ou versionar os assets antigos para evitar servir arquivos desatualizados.
- [ ] Quando um asset for requisitado repetidamente pelo mesmo edge node, então a resposta subsequente deve vir do cache da CDN (cache hit, verificável via header ex.: `X-Cache: HIT`).
- [ ] Quando a CDN estiver indisponível ou retornar erro, então a aplicação deve ter uma origem de fallback configurada para evitar página em branco.
- [ ] Quando um asset não existir na origem, então a CDN deve repassar o status HTTP 404 retornado pela origem.

**Especificidade técnica:**
- Códigos HTTP: 404
- Precisa de esclarecimento: sim — O requisito não define qual provedor de CDN será utilizado (CloudFront, Cloudflare, Fastly, etc.), nem a política de cache-control (TTL) por tipo de arquivo, nem a estratégia de invalidação (purge total vs. versionamento por hash de arquivo).

**Rastreabilidade:** REQ-313 (ver requirements.json)

---

### [Sprint 12] Retornar 404 para rotas /api/* no servidor de frontend
<!-- sdd-bot:meta id="BL-072" epic="Deployment" layer="frontend" requirementIds="REQ-335" dependsOn="REQ-332" -->
**Tipo:** feature
**Prioridade:** should
**Depende de:** REQ-332

**Descrição:**
Adicionar regra de roteamento no servidor/proxy que serve o frontend para interceptar qualquer requisição cujo path inicie com '/api/' e responder imediatamente com status 404, sem repassar a requisição ao handler de SPA (fallback de index.html) nem tentar resolver como asset estático, evitando que o frontend responda no lugar do backend em caso de configuração de roteamento incorreta ou acesso direto indevido.

**Comportamento esperado:**
Requisições HTTP para qualquer caminho iniciado por '/api/' feitas diretamente ao servidor de frontend retornam status 404, em vez de renderizar a aplicação SPA ou servir um asset.

**Critérios de aceite:**
- [ ] Quando uma requisição GET for feita para '/api/qualquer-coisa' diretamente ao servidor de frontend, então a resposta deve ter status HTTP 404.
- [ ] Quando uma requisição for feita para uma rota de frontend válida (ex.: '/perfil'), então o servidor deve continuar aplicando o fallback normal de SPA (servir index.html), sem ser afetado pela nova regra.
- [ ] Quando uma requisição for feita para '/api' sem barra final, então o comportamento deve ser explicitamente definido (bloqueado com 404 ou tratado como rota de frontend), conforme configuração da regra.
- [ ] Quando a regra de bloqueio estiver ativa, então nenhum arquivo estático do frontend deve ser servido para paths sob '/api/*', mesmo que exista coincidência de nome de arquivo.
- [ ] Quando REQ-332 (dependência) não estiver implementado/configurado, então esta regra de bloqueio não deve ser aplicada de forma inconsistente que quebre o roteamento real da API no ambiente integrado.

**Especificidade técnica:**
- Códigos HTTP: 404
- Campos: `/api/*`
- Precisa de esclarecimento: sim — O requisito não especifica se a regra deve ser aplicada via configuração do servidor web (nginx, Vercel, etc.) ou via middleware da aplicação, nem o comportamento exato para o path exato '/api' sem barra final; também não detalha a relação funcional exigida pela dependência REQ-332.

**Rastreabilidade:** REQ-335 (ver requirements.json)

---