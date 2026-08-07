+++
title = "Splay Trees"
date = 2019-10-14
tags = []
categories = []
+++

***

# Contextualização

Árvores binárias são estruturas de dados fundamentais no contexto de Ciência da Computação, especialmente quando aplicadas na solução de diversos problemas que demandam eficiência em operações básicas, como busca. Como visto no material de árvores AVL, o desempenho dessashu operações está diretamente relacionado à altura ($h$) da árvore, resultando em uma complexidade assintótica de $O(h)$. 

Para garantir que a altura permaneça $O(\log n)$, estruturas como AVL e Red-Black Trees impõem restrições rígidas de balanceamento de altura ou propriedades de coloração de nós. No entanto, existem situações reais onde o acesso aos dados não é uniforme, ou seja, alguns elementos são acessados com muito mais frequência do que outros.

Para esses cenários, a **Splay Tree** é uma alternativa dinâmica e eficiente. Em vez de manter a árvore estritamente balanceada por altura a cada inserção ou remoção, ela se auto-ajusta para trazer os elementos recentemente acessados para perto do topo (raiz), fazendo com que elementos muito acessados ou acessados recentemente sejam mais fáceis de serem encontrados.

# O Problema

Imagine um banco de dados onde **99%** das requisições de busca concentram-se em apenas **1%** dos elementos. Em uma árvore estritamente balanceada como a AVL, a busca por esses elementos frequentes sempre vai custar $O(\log n)$. 

Pior ainda: se a árvore for uma BST comum e esses elementos populares estiverem localizados nas folhas mais profundas, as buscas repetidas custarão um tempo próximo de $O(n)$, degradando o desempenho do sistema.

Esse tipo de situação pode, a primeira vista, parecer raro, mas reflete o [Princípio da Localidade de Referência](https://en.wikipedia.org/wiki/Locality_of_reference) (em especial a localidade temporal), um padrão fundamental na computação que dita que dados acessados recentemente têm alta probabilidade de serem acessados novamente em um futuro próximo, sendo relativamente comum em aplicações reais.

# A Solução: Splay Trees e a Operação Splay

Uma **Splay Tree** é uma árvore binária de pesquisa auto-ajustável. A sua principal característica é que, **sempre** que um nó é acessado (seja por busca, inserção ou remoção), uma operação chamada **Splay** é realizada nesse nó.

A operação Splay consiste em mover o nó acessado até a raiz da árvore por meio de uma sequência de rotações calculadas. Isso garante com que os nós mais acessados frequentemente ficam muito próximos da raiz, reduzindo o custo de acessos subsequentes para quase $O(1)$.

## Exemplo:
Vamos analisar a árvore desbalanceada abaixo, com raiz em 0006:
<p align="center">
  <img src="/posts/splaytree/Splay1.png" alt="Árvore desbalanceada" style="width: 250px; max-width: 100%; height: auto;" />
</p>

Ao realizar uma busca, por exemplo, no nó 0001, o tempo de busca será $O(n)$, pois a árvore se comporta como uma lista encadeada, tornando o acesso extremamente ineficiente. Caso diversas buscas sejam feitas nesse mesmo nó, todas sofrerão com esse alto custo. Para mitigar esse problema, a Splay Tree move o nó acessado para a raiz, fazendo com que chamadas subsequentes por esse elemento tenham custo $O(1)$, além de promover um semi-balanceamento na estrutura por meio de rotações.

Após a operação de *splay* no nó 0001, a árvore se organiza da seguinte maneira:

<p align="center">
  <img src="/posts/splaytree/Splay2.png" alt="Árvore splay 1" style="width: 250px; max-width: 100%; height: auto;" />
</p>

Percebe-se que o acesso ao nó 0001 se tornou quase instantâneo e que a operação de *splay* ajudou a distribuir melhor os nós da árvore — reduzindo a sua altura total, ainda que não a balanceie de forma estrita.
Ao executar novamente a operação de *splay*, dessa vez no nó 0004, o ganho no reequilíbrio fica ainda mais visível:

<p align="center">
  <img src="/posts/splaytree/Splay3.png" alt="Árvore splay 4" style="width: 250px; max-width: 100%; height: auto;" />
</p>
O acesso ao elemento 0004 se torna quase instantâneo, o acesso ao nó anterior (0001) também continua muito rápido, e ocorre um semi-balanceamento da árvore, com sua altura diminuindo e elementos ficando mais fáceis de serem acessados.






## Como o Splay é feito?

A operação de Splay analisa o caminho do nó alvo ($X$) até a raiz. Para cada passo do nó em direção ao topo, nós avaliamos a posição de $X$, de seu pai $P$ e de seu avô $G$ (se houver). 

```java
 private void splay (Node node) {

        // Enquanto não é a raiz
        while (node.parent != null) { 

            Node father = node.parent;
            Node grandFather = father.parent;
``` 

Dependendo da orientação desses três nós, dividimos o processo de auto-ajuste em **3 Casos principais**:

---

### Caso 1. Rotação Simples (Zig ou Zag)
Ocorre quando o nó $X$ é filho direto da raiz (ou seja, ele não possui um avô $G$). É necessária apenas uma rotação simples para colocar o nó na raiz.

* **Zig:** O nó $X$ está à esquerda da raiz. Aplicamos uma rotação à direita no pai (raiz).
* **Zag:** O nó $X$ está à direita da raiz. Aplicamos uma rotação à esquerda no pai (raiz).


```java
if (grandFather == null) {
    if (node == father.left) {
        // Zig
        rotateRight(father); 
    } else {
        // Zag
        rotateLeft(father);  
    }
}
```

### Caso 2. Zig-Zig e Zag-Zag:
Ocorre quando o nó $X$, seu pai $P$ e seu avô $G$ estão alinhados na mesma direção, formando uma linha reta (ambos são filhos esquerdos ou ambos são filhos direitos). Rotacionamos o avô ($G$) e, em seguida, rotacionamos o pai ($P$), achatando a árvore.
* Zig-Zig: $X$ é filho esquerdo de $P$ e $P$ é filho esquerdo de $G$. Aplicamos duas rotações sucessivas à direita.
* Zag-Zag: $X$ é filho direito de $P$ e $P$ é filho direito de $G$. Aplicamos duas rotações sucessivas à esquerda.


```java
else if (node == father.left && father == grandFather.left) {
            rotateRight(grandFather);
            rotateRight(father);
        }
        else if (node == father.right && father == grandFather.right) {
            rotateLeft(grandFather);
            rotateLeft(father); 
        }
```
### Caso 3. Zig-Zag e Zag-Zig:
Ocorre quando o nó $X$, seu pai $P$ e seu avô $G$ formam uma estrutura alternada "joelho". Primeiro rotacionamos o pai ($P$) para alinhar os nós em linha, e em seguida rotacionamos o avô ($G$) para subir o nó acessado ao topo.
* Zig-Zag: $X$ é filho esquerdo de $P$ e $P$ é filho direito de $G$. Rotacionamos $P$ à direita e depois $G$ à esquerda.
* Zag-Zig: $X$ é filho direito de $P$ e $P$ é filho esquerdo de $G$. Rotacionamos $P$ à esquerda e depois $G$ à direita.
```java
else if (node == father.left && father == grandFather.right) {
            rotateRight(father);   
            rotateLeft(grandFather);  
        }

        else if (node == father.right && father == grandFather.left) {
            rotateLeft(father); 
            rotateRight(grandFather);
        }
```

## Lembrete: Rotações

**Rotação para a esquerda:** 

```java
private void rotateLeft (Node<T> node) {

        Node newParent = node.right;
        node.right = newParent.left;  
        if (newParent.left != null) {
            newParent.left.parent = node;
        } 
        newParent.parent = node.parent;
        if (node.parent == null) {
            this.root = newParent;
        }
        else if (node == node.parent.left) {
            node.parent.left = newParent;
        }
        else if (node == node.parent.right) {
            node.parent.right = newParent;
        }

        newParent.left = node; 
        node.parent = newParent; 
    }
```

**Rotação para a direita:** 
```java
    private void rotateRight (Node<T> node) {

        Node newParent = node.left;
        node.left = newParent.right;

        if (newParent.right != null) {
            newParent.right.parent = node;
        }

        newParent.parent = node.parent;

        if (node.parent == null) {
            this.root = newParent;
        }
        else if (node == node.parent.left) {
            node.parent.left = newParent;
        }
        else if (node == node.parent.right) {
            node.parent.right = newParent;
        }

        newParent.right = node;
        node.parent = newParent;
    }
```
## Inserção (add)
A inserção segue o algoritmo padrão de uma árvore binária de pesquisa (BST): caminhamos pela árvore comparando o valor com os nós existentes até encontrar uma posição vaga, onde inserimos fisicamente o novo nó.

No entanto, o diferencial da Splay Tree é que, logo após a inserção do nó, executamos a função splay() nele. Isso traz o nó recém-criado para a raiz, reestruturando a árvore de forma dinâmica.
````java
    public void add(int value) {
        if (isEmpty()) {
            this.root = new Node(value);
            size++;
        } else {
            Node aux = this.root;

            while (aux != null) {
                if (value < aux.value) {
                    if (aux.left == null) {
                        aux.left = new Node(value);
                        aux.left.parent = aux;
                        size++;
                        splay(aux.left); // Splay no nó inserido
                        return;
                    }
                    aux = aux.left;
                } else {
                    if (aux.right == null) {
                        aux.right = new Node(value);
                        aux.right.parent = aux;
                        size++;
                        splay(aux.right); // Splay no nó inserido
                        return;
                    }
                    aux = aux.right;
                }
            }
        }
    }
````
## Busca (search)
A busca localiza o elemento comparando os valores de forma recursiva ou iterativa a partir da raiz.

* Se o elemento for encontrado: A função executa splay(aux) nele, tornando-o a nova raiz.

* Se o elemento não for encontrado: O splay é executado no último nó válido visitado antes de atingir a referência null (variável last). Isso garante certo amortecimento de tempo, pois até mesmo uma busca falha ajuda no balanceamento e reestruturação da árvore.
```java
    public Node search(int value) {
        if (isEmpty()) {
            return null;
        }

        Node aux = this.root;
        Node last = null; // Armazena o último nó válido percorrido

        while (aux != null) {
            last = aux; // Registra o nó atual ANTES de descer na árvore

            if (value == aux.value) {
                splay(aux); // Sucesso: Traz o nó encontrado para a raiz
                return aux;
            }
            
            if (value < aux.value) {
                aux = aux.left;
            } else {
                aux = aux.right;
            }
        }

        // Se o elemento não existe, faz o splay no último nó folha visitado
        if (last != null) {
            splay(last);
        }
        return null;
    }
```
## Remoção
A lógica de remoção na Splay Tree é a seguinte:

* Primeiramente, executamos a função search(value) para localizar o elemento. Caso ele exista, a busca faz o nó subir até a raiz através do splay.

* Isolamos a raiz desconectando-a de suas subárvores esquerda e direita.

* Se não houver filho esquerdo, a subárvore direita passa a ser a raiz de forma direta.

* Caso haja filho esquerdo, selecionamos o seu maior elemento (maxSubLeft) e executamos splay(maxSubLeft) sobre ele. Como ele é o maior valor da subárvore esquerda, ele passa a ser o topo e sua ramificação direita vai estar vazia.

* Basta anexar a subárvore direita original diretamente a essa vaga, concluindo a remoção.

<br>

```java
    public Node remove(int value) {
        // O search traz a primeira ocorrência do nó alvo para a raiz
        Node nodeToRemove = search(value);
        
        if (nodeToRemove == null || nodeToRemove.value != value) {
            return null; // Elemento não encontrado
        }

        Node left = this.root.left;
        Node right = this.root.right;

        // Desconecta a raiz isolada do restante da árvore
        if (left != null) left.parent = null;
        if (right != null) right.parent = null;

        this.root.left = null;
        this.root.right = null;

        // Se não houver subárvore à esquerda, a direita se torna a nova raiz
        if (left == null) {
            this.root = right;
        } 
        // Se houver subárvore à esquerda, trazemos seu maior valor para a raiz
        else {
            this.root = left;
            Node maxSubLeft = maxSubTree(this.root);
            splay(maxSubLeft); // O maior elemento vira a raiz da subárvore esquerda

            // A subárvore direita do maior elemento estará vazia e receberá a subárvore direita original
            this.root.right = right;
            if (right != null) {
                right.parent = this.root;
            }
        }
        
        size--;
        return nodeToRemove;
    }
```
<br>


# Experimentos

Mas a Splay Tree realmente funciona, na prática? Para tanto, aqui está um resumo de um experimento feito para avaliar a eficácia da Splay Tree em comparação com uma estrutura balanceada:

O gráfico abaixo mostra a eficácia de uma **busca convencional** em duas estruturas: A SplayTree e a AVLTree (balanceada). Percebe-se que, para diferentes números de elementos pesquisados, a AVLTree sempre tem um desempenho melhor que a SplayTree, devido a seu autobalanceamento.

<p align="center">
  <img src="/posts/splaytree/buscanormal.jpeg" width="67%" alt="Gráfico busca normal">
</p>

Porém, ao **concentrar as buscas** para somente um número específico de elementos (nesse caso, 10 elementos), percebe-se que, após um certo número de elementos (nesse caso, próximo dos 100K), a SplayTree se torna **mais eficiente** que a AVLTree, devido a sua propriedade de mover os elementos mais acessados para perto da raiz.

<p align="center">
  <img src="/posts/splaytree/buscaconcentrada.jpeg" width="67%" alt="Gráfico busca concentrada">
</p>



Caso tenha interesse em se aprofundar mais na experimentação, **[aqui](https://github.com/roanmotta/splay-tree-analysis)** está disponível um repositório sobre splaytrees, que contém um [relatório](https://github.com/roanmotta/splay-tree-analysis/experimentreports/experimentreports.md) sobre a experimentação e comparação dessa estrutura com outras.

Caso tenha interesse em se aprofundar ainda mais no conteúdo (e goste de história), [aqui](https://www.cs.cmu.edu/~sleator/papers/self-adjusting.pdf) está o artigo original de 1985, escrito por Daniel Sleator e Robert Tarjan, que contém a criação da Splay Tree.

# Contribuições

[Roan Motta](https://github.com/roanmotta) contribuiu para a escrita deste post.