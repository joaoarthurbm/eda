+++
title = "Contribua"
date = "2019-10-29"
menu = "main"
weight = "100"
meta = "false"
+++

***

## Melhoria no conteúdo do material

Por enquanto eu vou me dar o direito de não aceitar materiais feitos totalmente
por terceiros porque acredito que os materiais representam a minha narrativa sobre
o assunto abordado. No entanto, revisões e correções são muito bem-vindas. Portanto, se você encontrou um erro ou algum parágrafo difícil de entender, 
basta <a class="external" href="https://github.com/joaoarthurbm/eda/issues">abrir uma issue</a> ou fazer um *Pull Request* no markdown do material.

<aside><i class="fab fa-github fa-lg" aria-hidden="true"> </i> <a href="https://github.com/joaoarthurbm/eda/tree/master/content/posts"> <font color="#1980e6"> <b>Repositório dos materiais.</b></font></a></aside>

***

## Melhoria nas implementações

Contribuições esperadas:

* Cadastro de *issues* no repositório;
* *Bugfix* no código das estruturas;
* Melhoria no código das estruturas;
* Adição de testes;
* Documentação do código.

<aside><i class="fab fa-github fa-lg" aria-hidden="true"> </i> <a href="https://github.com/joaoarthurbm/eda-implementacoes/"> <font color="#1980e6"> <b>Repositório das estruturas implementadas.</b></font></a></aside>

***

### Cite este material

```
João Arthur Brunet, 2019. Estruturas de Dados e Algoritmos,
Computação @ UFCG, <http://joaoarthurbm.github.io/eda>.
```

```
@book{eda:joaobrunet:ufcg,
  title     = {Estruturas de Dados e Algoritmos},
  author    = {João Arthur Brunet},
  publisher = {Computação @ UFCG},
  year      = 2019,
  howpublished = "\url{http://joaoarthurbm.github.io/eda}",
}
```

***

## Guia de Contribuição

Este guia explica como produzir e submeter um novo material para o site da disciplina:
**https://joaoarthurbm.github.io/eda/**

O conteúdo do site vem do repositório **https://github.com/joaoarthurbm/eda** (branch `master`), especificamente da pasta [`content/posts/`](https://github.com/joaoarthurbm/eda/tree/master/content/posts). Tudo que você produzir deve ser enviado como **Pull Request (PR)** para lá.

---

### 1. Visão geral do que você vai produzir

Para cada material novo, você cria **dois itens** dentro de `content/posts/`:

1. Um arquivo **Markdown**, ex: `arvore-avl.md`
2. Se o material usar imagens, um **diretório com o mesmo nome do arquivo** (sem a extensão `.md`), ex: `arvore-avl/`, contendo as imagens usadas.

```
content/posts/
├── arvore-avl.md         <- o texto do material
└── arvore-avl/           <- só existe se você usar imagens
    ├── fig1.png
    └── fig2.png
```

Isso é tudo que o professor precisa: o `.md` e, se houver, o diretório de imagens.

---

### 2. Pré-requisitos

- Conta no GitHub e um **fork** do repositório https://github.com/joaoarthurbm/eda
- `git` instalado
- [Hugo](https://gohugo.io/getting-started/installing/) instalado — de preferência a versão **v0.75.1** (é a que o site usa), para o preview local ficar fiel ao resultado final

---

### 3. Passo a passo

#### 3.1 Fork e clone

```bash
# faça o fork pelo GitHub, depois clone o SEU fork
git clone https://github.com/SEU-USUARIO/eda.git
cd eda
```

#### 3.2 Crie uma branch para o seu material

```bash
git checkout -b nome-do-seu-material
```

#### 3.3 Crie o arquivo Markdown

Você pode criar o arquivo manualmente em `content/posts/`, ou deixar o próprio Hugo gerar o cabeçalho (front matter) correto para você:

```bash
hugo new posts/arvore-avl.md
```

Isso cria `content/posts/arvore-avl.md` já com o front matter no formato que o tema do site espera. Se preferir criar à mão, use este modelo, baseado no que já é usado no site:

```toml
+++
title = "Árvores Balanceadas (AVL)"
date = 2024-05-10
tags = []
categories = []
+++
```

- `title`: título que vai aparecer na página e na listagem de posts.
- `date`: data de publicação (formato `AAAA-MM-DD`).
- `tags`/`categories`: pode deixar vazio.

Campos opcionais que aparecem em alguns posts, use se fizerem sentido para o seu material:

```toml
github = "https://github.com/usuario/repositorio"   # link para o código usado no material
youtube = "https://youtu.be/xxxxxxxxx"               # vídeo relacionado
ppt = "https://.../slides.html"                      # slides relacionados
```

#### 3.4 Escreva o conteúdo

Depois do bloco `+++ ... +++`, escreva o material em Markdown (veja a seção 4).

#### 3.5 Adicione imagens (se precisar)

Crie um diretório com o **mesmo nome do arquivo `.md`** (sem a extensão) dentro de `content/posts/` e coloque lá as imagens. Veja a seção 5.

---

### 4. Escrevendo em Markdown — convenções usadas no site

Se quiser ver exemplos reais, o jeito mais confiável é abrir o **código-fonte** de um post já publicado: entre em qualquer arquivo dentro de [`content/posts/`](https://github.com/joaoarthurbm/eda/tree/master/content/posts) no GitHub e clique em **Raw** para ver o `.md` puro. Materiais bons para se inspirar: `quick-sort.md`, `bst.md`, `analise-algoritmos-recursivos.md`.

Abaixo, um resumo com base no estilo que já é usado no material da disciplina:

#### Títulos e seções

```markdown
# Seção principal
## Subseção
### Sub-subseção
```

#### Negrito, itálico e termos-chave

O material costuma destacar termos importantes em **negrito + itálico** juntos:

```markdown
O ***pivot*** é o elemento escolhido para o particionamento.
```

Negrito simples: `**palavra**`. Itálico simples: `*palavra*`.

#### Código

Trecho de código no meio do texto, use crases simples:

```markdown
Note que `left = 0` e `right = values.length - 1`.
```

Bloco de código, com blocos de três crases e o nome da linguagem (isso ativa o highlight de sintaxe):

````markdown
```java
public static int partition(int[] values, int left, int right) {
    int pivot = values[left];
    int i = left;
    for (int j = left + 1; j <= right; j++) {
        if (values[j] <= pivot) {
            i += 1;
            swap(values, i, j);
        }
    }
    swap(values, left, i);
    return i;
}
```
````

#### Fórmulas matemáticas

O site renderiza LaTeX. Para fórmulas no meio do texto, use `$...$`:

```markdown
No pior caso, o algoritmo é $O(n^2)$, enquanto no melhor caso é $O(n \log n)$.
```

Para uma recorrência: `$T(n) = 2T(n/2) + \Theta(n)$`.

#### Destaques (blockquote)

Use `>` para destacar conclusões importantes — o material usa bastante isso ao final de cada análise:

```markdown
> No pior caso o Quick Sort é $O(n^2)$. Isso acontece quando o pivot sempre divide o array de forma muito desigual.
```

#### Notas de rodapé

```markdown
A mediana de um conjunto de dados é o valor central[^1].

[^1]: Se o número de elementos for par, a mediana é a média dos dois valores centrais.
```

#### Links

Link externo:

```markdown
Veja mais em [documentação do Hugo](https://gohugo.io).
```

Link para outro post do site (use o caminho absoluto do site):

```markdown
Isso já foi discutido em [Análise de Algoritmos Recursivos](https://joaoarthurbm.github.io/eda/posts/analise-algoritmos-recursivos/).
```

#### Separadores de seção

Uma linha só com três traços cria uma linha horizontal, útil para separar blocos grandes (por exemplo, antes/depois de um quiz):

```markdown
---
```

---

### 5. Como incluir figuras

1. Crie o diretório com o mesmo nome do `.md` (sem extensão) dentro de `content/posts/`, por exemplo `content/posts/arvore-avl/`.
2. Coloque as imagens lá dentro (`.png`, `.jpg` etc.).
3. No Markdown, referencie apenas o **nome do arquivo**, sem caminho — o Hugo resolve isso automaticamente porque o post e o diretório de imagens têm o mesmo nome:

```markdown
![rotação simples à esquerda](rotacao-esquerda.png)
```

Se quiser controlar o tamanho da imagem, você também pode usar HTML puro (o site permite HTML embutido no Markdown):

```html
<img src="rotacao-esquerda.png" style="width:60%">
```

---

### 6. Como fazer quizzes

O site usa um shortcode próprio do Hugo para quizzes: `quiz` (o bloco) e `item` (cada pergunta). É exatamente o que já é usado em [Introdução à Análise de Algoritmos](https://joaoarthurbm.github.io/eda/posts/introducao-a-analise/), [Quick Sort](https://joaoarthurbm.github.io/eda/posts/quick-sort/), [BST](https://joaoarthurbm.github.io/eda/posts/bst/) e [Análise de Algoritmos Recursivos](https://joaoarthurbm.github.io/eda/posts/analise-algoritmos-recursivos/).

Veja o markdown desses materiais no repositório para entender como fazer.
---

### 7. Testando localmente (preview com Hugo)

Antes de abrir o PR, **sempre** confira como o material fica renderizado:

1. Na raiz do repositório clonado, rode:

   ```bash
   hugo server
   ```

2. Abra o link que aparece no terminal — normalmente:

   ```
   http://localhost:1313/eda/
   ```

3. Navegue até o seu post e confira: formatação, imagens, código, fórmulas e o quiz (se houver).

O `hugo server` fica rodando e observando os arquivos: qualquer alteração que você salvar no `.md` atualiza a página automaticamente, sem precisar reiniciar nada.

---

### 8. Como submeter sua contribuição (Pull Request)

1. Adicione e commite os arquivos (o `.md` e o diretório de imagens, se houver):

   ```bash
   git add content/posts/arvore-avl.md content/posts/arvore-avl/
   git commit -m "Adiciona material sobre Árvores AVL"
   git push origin nome-do-seu-material
   ```

2. No GitHub, abra um **Pull Request** do seu fork/branch para `master` em https://github.com/joaoarthurbm/eda.

3. **Envie apenas um Pull Request por material**, contendo só o `.md` e o diretório de imagens correspondente.

4. O professor vai revisar o conteúdo e a formatação; quando aprovado e mesclado (merge), o material é publicado automaticamente em https://joaoarthurbm.github.io/eda/.

---

### Checklist antes de abrir o PR

- [ ] Arquivo `.md` dentro de `content/posts/`, com front matter (`title`, `date`)
- [ ] Diretório de imagens com o mesmo nome do `.md` (se aplicável)
- [ ] Rodei `hugo server` e conferi a página em `http://localhost:1313/eda/`
- [ ] Código, fórmulas e imagens aparecem corretamente
- [ ] Um único Pull Request, só com o conteúdo deste material
