/* Matérias e conteúdo. Para adicionar itens, copie um objeto e troque o id. */
/* ---------- Matérias ---------- */
const SUBJ = {
  hist:{name:"História", c:"--c-hist"},
  dir:{name:"Direito", c:"--c-dir"},
  banc:{name:"Conhecimentos bancários", c:"--c-banc"},
  atual:{name:"Mercado financeiro", c:"--c-atual"},
  port:{name:"Português", c:"--c-port"}
};
const LESSONS = []; // preenchido pelos arquivos lessons-*.js
const EST = "Questão de treino no estilo Cesgranrio";

/* ---------- Conteúdo de exemplo ---------- */
const ITEMS = [
/* História */
{id:"h1",s:"hist",t:"card",title:"1808: nasce o Banco do Brasil",body:["Com a chegada da família real ao Rio, <b>D. João VI</b> criou o Banco do Brasil em <b>12 de outubro de 1808</b>.","Foi o primeiro banco do país e um dos primeiros do mundo lusófono."],tip:"Ligação direta com o concurso: a história do BB costuma aparecer em textos de prova."},
{id:"h2",s:"hist",t:"card",title:"Independência em 1822",body:["Em <b>7 de setembro de 1822</b>, D. Pedro proclamou a Independência às margens do Ipiranga.","Portugal só reconheceu em <b>1825</b>, mediante indenização de 2 milhões de libras esterlinas, intermediada pela Inglaterra."]},
{id:"h3",s:"hist",t:"card",title:"O caminho até a Lei Áurea",body:["<b>1850</b> Lei Eusébio de Queirós: proíbe o tráfico negreiro.","<b>1871</b> Lei do Ventre Livre. <b>1885</b> Lei dos Sexagenários.","<b>13 de maio de 1888</b>: a Princesa Isabel assina a Lei Áurea. O Brasil foi o último país das Américas a abolir a escravidão."]},
{id:"h4",s:"hist",t:"card",title:"Era Vargas (1930–1945)",body:["Getúlio Vargas chega ao poder com a <b>Revolução de 1930</b>.","Em 1937 instala o <b>Estado Novo</b>, regime ditatorial.","Em <b>1943</b> é criada a <b>CLT</b>, que reúne as leis trabalhistas."]},
{id:"h5",s:"hist",t:"quiz",q:"Quem proclamou a República no Brasil, em 15 de novembro de 1889?",o:["Marechal Deodoro da Fonseca","Marechal Floriano Peixoto","D. Pedro II","Rui Barbosa","Getúlio Vargas"],a:0,e:"Deodoro liderou o movimento e se tornou o primeiro presidente. Floriano foi o vice e o segundo presidente."},
{id:"h6",s:"hist",t:"quiz",q:"Qual lei proibiu o tráfico de escravizados para o Brasil em 1850?",o:["Lei Áurea","Lei do Ventre Livre","Lei Eusébio de Queirós","Lei dos Sexagenários","Lei Feijó"],a:2,e:"A Lei Eusébio de Queirós (1850) proibiu o tráfico. A Lei Feijó (1831) tentou antes, mas ficou conhecida como lei 'para inglês ver'."},
{id:"h7",s:"hist",t:"quiz",q:"A Constituição de 1988 ficou conhecida como:",o:["Constituição Polaca","Constituição Cidadã","Constituição Outorgada","Constituição Imperial","Constituição Liberal"],a:1,e:"O apelido foi dado por Ulysses Guimarães, presidente da Assembleia Constituinte. 'Polaca' é o apelido da Constituição de 1937."},
{id:"h8",s:"hist",t:"quiz",q:"Quem fundou o Banco do Brasil?",o:["D. Pedro I","Barão de Mauá","D. João VI","Marquês de Pombal","José Bonifácio"],a:2,e:"D. João VI fundou o banco em 1808, logo após a chegada da corte portuguesa ao Brasil."},
{id:"h9",s:"hist",t:"quiz",q:"A Consolidação das Leis do Trabalho (CLT) foi criada em:",o:["1930","1937","1943","1946","1964"],a:2,e:"A CLT é de 1943, durante o Estado Novo de Vargas."},

/* Direito */
{id:"d1",s:"dir",t:"card",title:"LIMPE: os princípios do art. 37",body:["A administração pública obedece aos princípios de:","<b>L</b>egalidade, <b>I</b>mpessoalidade, <b>M</b>oralidade, <b>P</b>ublicidade e <b>E</b>ficiência."],tip:"A Eficiência entrou depois, com a Emenda Constitucional 19/1998."},
{id:"d2",s:"dir",t:"card",title:"Cláusulas pétreas",body:["O art. 60, §4º, da Constituição proíbe emenda que tente <b>abolir</b>:","a forma federativa de Estado; o voto direto, secreto, universal e periódico; a separação dos Poderes; os direitos e garantias individuais."],tip:"Macete: FO-VO-SE-DI."},
{id:"d3",s:"dir",t:"card",title:"Remédios constitucionais",body:["<b>Habeas corpus</b>: protege a liberdade de locomoção.","<b>Habeas data</b>: acesso ou correção de informações sobre a própria pessoa.","<b>Mandado de segurança</b>: protege direito líquido e certo não amparado pelos outros dois."]},
{id:"d4",s:"dir",t:"card",title:"Fundamentos da República",body:["Art. 1º da Constituição. Macete <b>SO-CI-DI-VA-PLU</b>:","<b>So</b>berania, <b>Ci</b>dadania, <b>Di</b>gnidade da pessoa humana, <b>Va</b>lores sociais do trabalho e da livre iniciativa, <b>Plu</b>ralismo político."]},
{id:"d5",s:"dir",t:"quiz",q:"NÃO é princípio expresso da administração pública no art. 37 da Constituição:",o:["Legalidade","Impessoalidade","Lucratividade","Publicidade","Eficiência"],a:2,e:"Os princípios expressos são LIMPE. Lucratividade não está na lista."},
{id:"d6",s:"dir",t:"quiz",q:"Para obter informações sobre si mesmo em um banco de dados do governo, o cidadão usa:",o:["Habeas corpus","Mandado de injunção","Ação popular","Habeas data","Mandado de segurança"],a:3,e:"O habeas data garante o acesso e a retificação de informações relativas à pessoa do impetrante."},
{id:"d7",s:"dir",t:"quiz",q:"NÃO é cláusula pétrea:",o:["A forma federativa de Estado","O voto direto, secreto, universal e periódico","A separação dos Poderes","O sistema presidencialista de governo","Os direitos e garantias individuais"],a:3,e:"O presidencialismo não está no art. 60, §4º. Tanto que houve plebiscito sobre ele em 1993."},
{id:"d8",s:"dir",t:"quiz",q:"É fundamento da República Federativa do Brasil (art. 1º):",o:["Erradicar a pobreza","Garantir o desenvolvimento nacional","A dignidade da pessoa humana","A não intervenção","A defesa da paz"],a:2,e:"Erradicar a pobreza e garantir o desenvolvimento são objetivos (art. 3º). Não intervenção e defesa da paz são princípios das relações internacionais (art. 4º)."},
{id:"d9",s:"dir",t:"quiz",q:"A idade mínima para ser eleito Presidente da República é:",o:["21 anos","25 anos","30 anos","35 anos","40 anos"],a:3,e:"Presidente, vice e senador: 35 anos. Governador: 30. Deputado: 21. Vereador: 18."},

/* Conhecimentos bancários */
{id:"b1",s:"banc",t:"card",title:"Quem manda no Sistema Financeiro",body:["O <b>Conselho Monetário Nacional (CMN)</b> é o órgão normativo máximo do SFN.","É formado pelo Ministro da Fazenda (presidente), pelo Ministro do Planejamento e Orçamento e pelo Presidente do Banco Central."],tip:"Normativo = CMN. Supervisor e executor = Banco Central e CVM."},
{id:"b2",s:"banc",t:"card",title:"Copom e a Selic",body:["O <b>Copom</b>, do Banco Central, define a meta da taxa <b>Selic</b>.","Reúne-se <b>8 vezes por ano</b>. Selic mais alta encarece o crédito e ajuda a segurar a inflação."]},
{id:"b3",s:"banc",t:"card",title:"FGC: a rede de proteção",body:["O Fundo Garantidor de Créditos cobre até <b>R$ 250 mil por CPF por instituição</b>, com teto global de R$ 1 milhão a cada 4 anos.","Cobre poupança, CDB, LCI, LCA e LC, entre outros. <b>Não</b> cobre fundos de investimento nem Tesouro Direto."]},
{id:"b4",s:"banc",t:"card",title:"As 3 fases da lavagem de dinheiro",body:["<b>1. Colocação</b>: o dinheiro sujo entra no sistema.","<b>2. Ocultação</b>: movimentações para apagar o rastro.","<b>3. Integração</b>: o dinheiro volta com aparência legal.","Lei 9.613/1998. O <b>COAF</b> recebe as comunicações de operações suspeitas."]},
{id:"b5",s:"banc",t:"quiz",q:"O órgão normativo máximo do Sistema Financeiro Nacional é:",o:["Banco Central do Brasil","Comissão de Valores Mobiliários","Conselho Monetário Nacional","Copom","Banco do Brasil"],a:2,e:"O CMN normatiza. Banco Central e CVM supervisionam e executam."},
{id:"b6",s:"banc",t:"quiz",q:"Qual aplicação NÃO tem cobertura do FGC?",o:["Caderneta de poupança","CDB","LCI","LCA","Cotas de fundos de investimento"],a:4,e:"Fundos de investimento não são cobertos pelo FGC. Poupança, CDB, LCI e LCA são."},
{id:"b7",s:"banc",t:"quiz",q:"A ordem correta das fases da lavagem de dinheiro é:",o:["Ocultação, colocação, integração","Colocação, ocultação, integração","Integração, ocultação, colocação","Colocação, integração, ocultação","Ocultação, integração, colocação"],a:1,e:"Primeiro o dinheiro entra (colocação), depois é escondido (ocultação) e por fim volta à economia formal (integração)."},
{id:"b8",s:"banc",t:"quiz",q:"Se o Banco Central aumenta o depósito compulsório, o efeito esperado é:",o:["Aumento da oferta de crédito","Redução da liquidez da economia","Queda da taxa Selic","Aumento da inflação","Desvalorização do real"],a:1,e:"Com mais dinheiro retido no BC, os bancos têm menos para emprestar. A liquidez cai."},
{id:"b9",s:"banc",t:"quiz",q:"Quem define a meta da taxa Selic?",o:["CMN","Copom","Tesouro Nacional","Ministério da Fazenda","Febraban"],a:1,e:"O Comitê de Política Monetária (Copom) do Banco Central define a meta da Selic."},

/* Atualidades do mercado financeiro */
{id:"a1",s:"atual",t:"card",title:"Pix: o pagamento que mudou o país",body:["Criado pelo <b>Banco Central</b>, entrou em operação em <b>novembro de 2020</b>.","Funciona 24 horas, todos os dias. Em 2025 ganhou o <b>Pix Automático</b>, para contas recorrentes."]},
{id:"a2",s:"atual",t:"card",title:"Open Finance",body:["Permite que o cliente <b>compartilhe seus dados</b> entre instituições financeiras, sempre com o seu <b>consentimento</b>.","Começou em 2021, ainda com o nome de Open Banking."],tip:"Ideia central: os dados pertencem ao cliente, não ao banco."},
{id:"a3",s:"atual",t:"card",title:"Meta de inflação contínua",body:["O <b>CMN</b> define a meta de inflação. O índice oficial é o <b>IPCA</b>, medido pelo IBGE.","Desde 2025 a meta é <b>contínua</b>: 3%, com tolerância de 1,5 ponto para cima ou para baixo."]},
{id:"a4",s:"atual",t:"card",title:"ESG nos bancos",body:["<b>E</b>nvironmental (ambiental), <b>S</b>ocial e <b>G</b>overnance (governança).","Bancos avaliam critérios ESG ao conceder crédito e ao montar fundos de investimento."]},
{id:"a5",s:"atual",t:"quiz",q:"O Pix entrou em operação em:",o:["2018","2019","2020","2021","2022"],a:2,e:"O Pix começou a funcionar para todos em novembro de 2020."},
{id:"a6",s:"atual",t:"quiz",q:"O índice oficial usado para medir a meta de inflação no Brasil é o:",o:["IGP-M","INPC","IPCA","IPC-Fipe","INCC"],a:2,e:"O IPCA, do IBGE, é o índice oficial do regime de metas."},
{id:"a7",s:"atual",t:"quiz",q:"No Open Finance, o compartilhamento de dados depende:",o:["Da autorização do Banco Central em cada caso","Do consentimento do cliente","Da decisão do banco de origem","De ordem judicial","Do pagamento de uma tarifa"],a:1,e:"O cliente decide o que compartilhar, com quem e por quanto tempo."},
{id:"a8",s:"atual",t:"quiz",q:"Na sigla ESG, a letra G se refere a:",o:["Ganho","Garantia","Governança","Gestão de risco","Globalização"],a:2,e:"G de Governance, governança corporativa."},

/* Português */
{id:"p1",s:"port",t:"card",title:"Crase sem medo",body:["Crase = preposição <b>a</b> + artigo <b>a</b>. Fui <b>à</b> reunião (vou a + a reunião).","<b>Não</b> há crase antes de verbo (começou a estudar) nem antes de palavra masculina (andou a cavalo)."],tip:"Teste: troque por uma palavra masculina. Se virar 'ao', tem crase. Fui ao cinema → fui à praia."},
{id:"p2",s:"port",t:"card",title:"Os quatro porquês",body:["<b>Por que</b>: pergunta. Por que você saiu?","<b>Porque</b>: resposta. Saí porque cansei.","<b>Por quê</b>: fim de frase. Você saiu por quê?","<b>Porquê</b>: substantivo. Não sei o porquê."]},
{id:"p3",s:"port",t:"card",title:"Haver no sentido de existir",body:["Fica sempre no <b>singular</b>: <b>Havia</b> muitas pessoas. <b>Houve</b> problemas.","O mesmo vale para <b>fazer</b> indicando tempo: <b>Faz</b> dois anos."],tip:"'Houveram problemas' é erro clássico de prova."},
{id:"p4",s:"port",t:"card",title:"Mal ou mau?",body:["<b>Mal</b> é o oposto de <b>bem</b>: ele se saiu mal.","<b>Mau</b> é o oposto de <b>bom</b>: ele é um mau aluno."]},
{id:"p5",s:"port",t:"quiz",q:"Assinale a frase em que a crase está correta:",o:["Começou à estudar cedo.","Fui à reunião do conselho.","Andou à cavalo pela fazenda.","Entregou o relatório à ele.","Ficou frente à frente com o gerente."],a:1,e:"'Ir a' + 'a reunião' = à reunião. Não há crase antes de verbo, de palavra masculina, de pronome pessoal nem em expressões com palavras repetidas."},
{id:"p6",s:"port",t:"quiz",q:"Está correta, quanto à concordância, a frase:",o:["Houveram muitos problemas no sistema.","Fazem dois anos que estudo para o concurso.","Haviam poucos candidatos na sala.","Houve muitos problemas no sistema.","Devem haver soluções para isso."],a:3,e:"Haver (existir) e fazer (tempo) são impessoais e ficam no singular. Inclusive o auxiliar: 'deve haver'."},
{id:"p7",s:"port",t:"quiz",q:"Assinale o uso correto:",o:["Não sei porque ele saiu.","Ele saiu por quê estava cansado.","Não sei por que ele saiu.","Por quê você saiu?","Explique o por quê da decisão."],a:2,e:"'Por que' separado e sem acento equivale a 'por qual motivo'. Funciona em perguntas diretas e indiretas."},
{id:"p8",s:"port",t:"quiz",q:"Complete: O cliente foi ___ atendido por um funcionário de ___ humor.",o:["mal / mau","mau / mal","mal / mal","mau / mau","bem / mal"],a:0,e:"Mal atendido (oposto de bem). Mau humor (oposto de bom)."}
];
ITEMS.forEach(it=>{ if(it.t==="quiz") it.src = EST; });
const BY_ID = Object.fromEntries(ITEMS.map(i=>[i.id,i]));
