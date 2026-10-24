# Rolê de Estudos

App para estudar no lugar de ficar rolando reels: cards rápidos e questões de múltipla escolha de
História, Direito, Conhecimentos bancários, Mercado financeiro, Português e Matemática financeira,
pensando no concurso do Banco do Brasil.

- Sessões de 15 itens (cerca de 10 minutos), misturando cards e questões
- Pontos (XP), meta do dia, dias seguidos e níveis
- Revisão de erros: a questão errada volta em 1, 3, 7 e 15 dias
- Login com Google (Firebase) para salvar o progresso entre celular e computador
- Funciona sem conta, salvando só no aparelho

O site é feito só com HTML, CSS e JavaScript, sem etapa de build.

## Estrutura

| Arquivo | O que tem |
| --- | --- |
| `index.html` | Página principal |
| `css/style.css` | Visual |
| `js/content.js` | Matérias, cards e questões. É aqui que se adiciona conteúdo |
| `js/app.js` | Telas, pontos, níveis e revisão |
| `js/sync.js` | Login com Google e salvamento no Firestore |
| `js/config.js` | Configuração do Firebase (preencher) |
| `firebase/firestore.rules` | Regras de segurança do banco |

## 1. Publicar o site (GitHub Pages)

1. No repositório, abra **Settings > Pages**.
2. Em *Source*, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)** e clique em **Save**.
3. Em alguns minutos o site fica em `https://mathack07.github.io/Revis-o-de-estudos/`.

## 2. Ligar o login com Google (Firebase)

1. Entre em <https://console.firebase.google.com> com sua conta Google e clique em **Criar projeto**.
   Pode desativar o Google Analytics.
2. **Authentication > Começar > Método de login > Google > Ativar**. Escolha seu e-mail de suporte e salve.
3. **Authentication > Configurações > Domínios autorizados > Adicionar domínio**: `mathack07.github.io`.
4. **Firestore Database > Criar banco de dados**. Escolha a região `southamerica-east1 (São Paulo)` e o
   modo de produção.
5. Ainda no Firestore, abra a aba **Regras**, apague o que estiver lá, cole o conteúdo de
   `firebase/firestore.rules` e clique em **Publicar**.
6. Na engrenagem **Configurações do projeto > Seus apps**, clique no ícone **</>** (Web), dê um nome e
   registre. Copie os valores `apiKey`, `authDomain`, `projectId` e `appId` para `js/config.js`.

A `apiKey` do Firebase pode ficar no código público: quem protege os dados são as regras do passo 5.

## Testar no computador

Qualquer servidor estático serve, por exemplo:

```
python3 -m http.server 8000
```

e abra <http://localhost:8000>. O login com Google funciona em `localhost`, que já vem autorizado no Firebase.

## Adicionar conteúdo

Em `js/content.js`, copie um item e troque o `id` (precisa ser único):

```js
{id:"h10", s:"hist", t:"card", title:"Título", body:["Parágrafo 1", "Parágrafo 2"], tip:"Dica opcional"},
{id:"h11", s:"hist", t:"quiz", q:"Pergunta?", o:["A","B","C","D","E"], a:0, e:"Explicação da resposta"},
```

`a` é a posição da resposta certa, começando em 0. As alternativas são embaralhadas na tela.
