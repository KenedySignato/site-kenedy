# Site Kenedy Signato

Site de página única do Kenedy Signato (roteiro, edição de vídeo e tráfego pago).

- **No ar:** https://kenedysignato.github.io/site-kenedy/
- **Domínio próprio (ainda sem DNS):** https://kenedysignato.com.br, veja [Domínio próprio](#domínio-próprio)
- **Tecnologia:** HTML, CSS e JavaScript puros. Não tem build, framework nem dependências. Os arquivos que estão aqui são exatamente o que vai para o ar.

---

## Estrutura

```
index.html                  todo o conteúdo do site (textos, pessoas, marcas, links)
styles.css                  visual: cores, fontes, layout, animações, versão celular
script.js                   interações: menu, régua de rolagem, abas, carrossel, filtro, WhatsApp
favicon.svg                 ícone da aba do navegador
og.jpg                      imagem de prévia ao compartilhar o link (1200×630)
assets/
  fonts/                    fonte Archivo (licença OFL), hospedada no próprio site
  img/
    kenedy.webp             foto principal (hero e "Sobre"), 1000×1000
    trabalho/               fotos das abas "O que eu faço" e do contato, 900×1205
    timeline/               "Passaram na minha timeline", ~640 de largura
    pessoas/                "Pessoas que somei", 560 de largura
    marcas/                 logos das marcas, 240×240 (quadrado)
ID/                         paleta de cores oficial (referência, não aparece no site)
.github/scripts/check-links.mjs   confere se toda imagem/arquivo citado no HTML existe
```

## Seções da página (na ordem)

Cada seção está marcada no `index.html` com um comentário `<!-- ============ NOME ============ -->`. Para achar, basta buscar o nome.

| Seção | id | O que tem |
|---|---|---|
| Hero | `#inicio` | título, frase de apresentação, foto em "visor de câmera" |
| O que eu faço | `#trabalho` | 3 abas: Estratégia (V1), Conteúdo (V2), Tráfego pago (A1) |
| Timeline | `#timeline` | carrossel em "rolo de filme" com artistas e criadores |
| Clientes | `#pessoas` | cards de pessoas, com filtro Todos / EUA / Brasil |
| Marcas | `#marcas` | duas faixas de logos rolando sem parar |
| Sobre | `#sobre` | foto, história e 3 fatos (origem, base, atende) |
| Como funciona | `#metodo` | 4 etapas |
| Contato | `#contato` | escolha do serviço e botão que abre o WhatsApp |

Seções com `data-tick="..."` ganham uma marquinha azul na régua do topo, que acompanha a rolagem.

---

## Como editar

### Textos
Os textos estão direto no `index.html`. Ache a frase, troque e salve.
Não use `&` sozinho no texto. Escreva `&amp;` (exemplo: `Edson &amp; Hudson`).

### Número do WhatsApp
O número `5565993068512` aparece em **5 lugares**. Se mudar, troque em todos eles:

- `index.html`: botão do menu, botão do hero, botão do contato (`id="waPick"`) e botão flutuante (`id="waFloat"`)
- `script.js`: na parte "contato: mensagem do WhatsApp conforme a escolha"

O texto depois de `?text=` é a mensagem que já vem escrita no WhatsApp. Ele precisa estar codificado para URL: espaço vira `%20`, `é` vira `%C3%A9` e assim por diante. Para gerar, use qualquer "URL encoder" online.
As 3 opções da seção Contato ficam no atributo `value` de cada `<input type="radio">` e podem ser escritas normalmente, porque o `script.js` codifica sozinho.

### Adicionar ou remover uma pessoa em "Timeline"
Copie um bloco `<li class="frame">…</li>` dentro de `#filmTrack`:

```html
<li class="frame">
  <img src="assets/img/timeline/nome-da-pessoa.webp" width="640" height="640" alt="Nome da Pessoa" loading="lazy" draggable="false" />
  <div class="frame__cap"><strong>Nome da Pessoa</strong><span>Descrição curta</span></div>
</li>
```

Mantenha o último item (`frame--end`, "O próximo frame pode ser o seu.") sempre no fim.
As fotos aparecem em preto e branco e ganham cor ao passar o mouse. Isso é automático.

### Adicionar ou remover um cliente em "Pessoas que somei"
Copie um bloco `<li class="person">…</li>` dentro de `#people`:

```html
<li class="person" data-region="br">
  <img src="assets/img/pessoas/nome.webp" width="560" height="560" alt="Nome" loading="lazy" />
  <div>
    <span class="person__where">Cidade, Estado</span>
    <h3>Nome</h3>
    <p class="person__niche">Área de atuação</p>
    <p>O que foi feito para essa pessoa.</p>
  </div>
</li>
```

`data-region` define o filtro: `br` para Brasil e `usa` para EUA.

### Adicionar ou remover uma marca
Copie um `<li class="brand">…</li>` em uma das duas faixas (`data-dir="left"` ou `data-dir="right"`):

```html
<li class="brand"><img src="assets/img/marcas/nome.webp" width="120" height="120" alt="" loading="lazy" /><span><strong>Nome da Marca</strong>Segmento</span></li>
```

Não duplique as marcas para "fechar" o loop. O `script.js` já faz isso sozinho, e a velocidade se ajusta à quantidade.
Mantenha as duas faixas com quantidades parecidas.

### Abas de "O que eu faço"
Cada aba tem um botão (`class="track"`) e um painel (`class="panel"`), ligados pelo `id`.
Para editar, mexa só no conteúdo do painel (imagem, `<h3>`, `<p>` e a lista `chips`).

### Etapas de "Como funciona"
Cada `<li class="step" style="--w:62%">` tem uma barrinha azul. O `--w` controla o tamanho dela, só por estética.

---

## Imagens

- **Formato:** WebP. Para converter de JPG ou PNG, use https://squoosh.app (qualidade 75–80).
- **Tamanhos usados:**

  | Pasta | Tamanho |
  |---|---|
  | `timeline/` | 640 de largura, mais ou menos quadrada |
  | `pessoas/` | 560 de largura |
  | `marcas/` | 240×240, quadrado |
  | `trabalho/` | 900×1205, vertical |
  | `kenedy.webp` | 1000×1000 |

- **Nome do arquivo:** use minúsculas, sem acento e sem espaço, com hífen no lugar do espaço (ex.: `cesar-menotti.webp`).
  **Nunca comece o nome com `#`**, porque o GitHub Pages ignora esses arquivos.
- No `<img>`, os valores de `width` e `height` devem ter a proporção real da imagem. Isso evita que a página "pule" enquanto carrega.
- Sempre preencha o `alt` com o nome da pessoa ou uma descrição da foto. A exceção são os logos de marca, que ficam com `alt=""` porque o nome já aparece escrito ao lado.

---

## Visual

### Cores
Ficam no topo do `styles.css`, dentro de `:root`:

| Variável | Cor | Uso |
|---|---|---|
| `--ink` | `#05070d` | fundo base (quase preto) |
| `--navy` | `#0b1f3a` | azul-marinho (faixa da timeline, fade do fundo) |
| `--blue` | `#1457ff` | azul principal (botões, destaques) |
| `--blue-text` | `#7aa2ff` | azul claro para texto sobre fundo escuro |
| `--paper` | `#eef1f6` | texto principal |
| `--muted` | `#9aa4b8` | texto secundário |
| `--rec` | `#ff3b30` | vermelho do "REC" e da agulha da régua |
| `--wa` | `#25d366` | verde do WhatsApp |

A paleta oficial está em `ID/PALETA DE CORES - AZUL.png`.

### Fundo com degradê
- **Fundo geral:** `body::before` no `styles.css`. É um fade do preto para o azul-marinho com brilhos azuis, e fica fixo enquanto a página rola. Para deixar mais ou menos azul, mude os valores `rgba(20, 87, 255, 0.22)` (o último número é a intensidade, de 0 a 1).
- **Seção Contato:** regra `.cta` no `styles.css`, com degradê próprio no mesmo estilo.

### Fonte
Archivo, servida de `assets/fonts/`. Os títulos usam a versão estreita e pesada (`font-stretch: 68%`, `font-weight: 850`).

### Celular
As regras para telas menores estão no fim do `styles.css`, em "RESPONSIVO": `1024px` (tablet), `820px` (menu vira hambúrguer) e `560px` (celular).
Depois de qualquer mudança, teste também no celular ou no modo celular do navegador (F12 → ícone de celular).

### Animações
- Os títulos do topo, os títulos das seções (`cut-in`) e as barras das etapas entram com animação ao aparecer na tela.
- Quem ativou "reduzir movimento" no sistema vê tudo parado. Isso é automático, no fim do `styles.css`.
- Sem JavaScript, todo o conteúdo continua aparecendo.

---

## Testar e publicar

1. **Ver localmente:** abra a pasta no terminal e rode `python -m http.server`. Depois acesse http://localhost:8000.
   Também dá para abrir o `index.html` direto no navegador.
2. **Conferir as imagens:** rode `node .github/scripts/check-links.mjs`. Ele avisa se o HTML cita algum arquivo que não existe, como um nome errado ou uma imagem esquecida.
   Ele **não roda sozinho**, então rode antes de publicar.
3. **Publicar:** basta fazer commit e push na branch `main`. O GitHub Pages atualiza o site em 1–2 minutos.
   Se não aparecer a mudança, aperte Ctrl+F5 ou abra numa janela anônima.

---

## Domínio próprio

O domínio `kenedysignato.com.br` está registrado, mas **ainda não tem DNS configurado**.
**Não crie o arquivo `CNAME`** antes de configurar o DNS, porque isso derruba o site: o endereço do GitHub passa a redirecionar para um domínio que não abre.

Para ativar:

1. No painel do **Registro.br**, em DNS do domínio, crie:
   - 4 registros `A` para o domínio principal: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - 1 registro `CNAME` para `www` apontando para `kenedysignato.github.io`
2. Espere propagar (de minutos a algumas horas). Para testar, rode `nslookup kenedysignato.com.br`, que deve mostrar os IPs acima.
3. Só então crie o arquivo `CNAME` na raiz com o conteúdo `kenedysignato.com.br` e faça push.
4. Em **Settings → Pages** do repositório, marque **Enforce HTTPS**.

O `index.html` já usa `https://kenedysignato.com.br/` no link canônico, na imagem de prévia (`og:image`) e nos dados estruturados. Até o domínio funcionar, a prévia do link no WhatsApp ou Instagram aparece sem imagem.

---

## Créditos

© Kenedy Signato. Site por Kenedy Signato e Gabriel Stuginski.
