+++
title = "Árvores Balanceadas: B Tree"
date = 2026-07-29
tags = []
categories = []
+++

***

# Definições e Propriedades

Até aqui, vimos árvores em que cada nó armazena **uma única chave** e possui, no máximo, **dois filhos**, como as <a class="external" href="https://joaoarthurbm.github.io/eda/posts/bst/">Árvores Binárias de Pesquisa (BST)</a>. Essa restrição é simples e elegante, mas tem uma consequência prática importante: em cenários com grandes volumes de dados, principalmente quando a árvore não cabe inteira no Cache e parte dela precisa ser armazenada em disco, uma árvore binária de pesquisa pode crescer muito em altura. E, como já vimos, a altura é o que determina o custo das operações básicas de uma árvore. Quanto maior a altura, mais acessos a disco são necessários — e acesso a banco de dados são muito mais lentas do que acessos à cache, como visto nos materiais anteriores.

### A solução

Então como escapar dessas idas e voltas custosas ao banco da dados? A **Árvore B** (ou *B-Tree*) resolve esse problema generalizando a ideia de árvore de pesquisa: em vez de permitir apenas uma chave e dois filhos por nó, uma Árvore B permite que **cada nó armazene várias chaves e tenha vários filhos**. Isso faz com que a árvore cresça mais "para os lados" do que "para baixo", resultando em uma altura muito menor para a mesma quantidade de elementos. Na prática, isso significa menos acessos a disco e, consequentemente, operações mais rápidas.

Formalmente, uma Árvore B é definida por um parâmetro chamado ***ordem*** (representado aqui pela variável `order`), que determina quantos filhos um nó pode ter. Dada uma ordem $t$, uma Árvore B respeita as seguintes invariantes:

1. Cada nó possui, no máximo, $t - 1$ chaves;

1. Cada nó interno possui, no máximo, $t$ filhos;

1. Cada nó, exceto a raiz, possui, no mínimo, $\lceil t/2 \rceil - 1$ chaves;

1. Um nó interno com $k$ chaves possui exatamente $k + 1$ filhos;

1. As chaves de um nó estão sempre ordenadas, e as chaves de um filho entre duas chaves do pai possuem valores entre elas. Ou seja, dado um nó com chaves $[k_1, k_2, ..., k_n]$, o filho que fica entre $k_1$ e $k_2$ possui apenas chaves maiores do que $k_1$ e menores do que $k_2$;

1. Todas as folhas estão no mesmo nível.

Essa última propriedade é a mais importante de todas: **uma Árvore B é sempre perfeitamente balanceada**. Não existe o conceito de árvore "desbalanceada" ou "quasi-balanceada" em uma Árvore B, como acontece nas BSTs. Isso é garantido por construção dentro da árvore, que veremos em detalhes mais adiante.

> Diferente da BST, onde o balanceamento é uma preocupação externa (por isso existem variações como AVL e Rubro-Negra), a Árvore B é balanceada por construção. Todas as folhas estão sempre no mesmo nível.

## Ordem da árvore

A ordem determina o quão "larga" a árvore pode ser. Por exemplo, em uma Árvore B de ordem 4 (`order = 4`), cada nó pode ter, no máximo, 3 chaves e 4 filhos. Em uma Árvore B de ordem 5, cada nó pode ter, no máximo, 4 chaves e 5 filhos. Quanto maior a ordem, mais "larga" e mais "baixa" a árvore se torna.

Na implementação que vamos estudar, a ordem é definida no construtor da classe `BTree`:

```java
public BTree(int order) {
    this.root = null;
    this.order = order;
}

public BTree() {
    this.root = null;
    this.order = 4;
}
```

Se nenhuma ordem for especificada, a árvore assume ordem 4 por padrão.

## O nó (BNode)

Assim como fizemos para outras estruturas, vamos primeiro entender como um nó é representado:

```java
class BNode {

    BNode parent;
    ArrayList<Integer> keys;
    ArrayList<BNode> children;
    int size;
    int order;

    public BNode(int order) {
        this.keys = new ArrayList<>();
        this.children = new ArrayList<>();
        this.size = 0;
        this.order = order;
    }

    public boolean isLeaf() {
        return children.isEmpty();
    }

    public boolean isFull() {
        return size == order - 1;
    }
}
```

Diferente do nó de uma BST, aqui não temos apenas um valor e duas referências (`left` e `right`). Em vez disso, temos:

* ***keys***: uma lista ordenada com as chaves armazenadas no nó;
* ***children***: uma lista com os filhos do nó. Se o nó for folha, essa lista estará vazia;
* ***size***: quantas chaves o nó possui atualmente;
* ***parent***: referência para o nó pai, assim como na BST, útil para caminhar a árvore de baixo para cima, o que é bastante utilizado nos algoritmos de inserção e remoção que veremos a seguir;
* ***order***: a ordem da árvore à qual o nó pertence.

Um nó é considerado ***folha*** quando não possui filhos (`children.isEmpty()`), e é considerado ***cheio*** quando atingiu o número máximo de chaves permitido, isto é, `size == order - 1`.

Note também o método `addKey`:

```java
public int addKey(int key) {
    int i = 0;
    while (i < size && key > keys.get(i)) {
        i++;
    }

    keys.add(i, key);
    size++;

    return i;
}
```

Esse método é responsável por inserir uma chave em um nó **mantendo a ordem crescente**. Ele percorre a lista de chaves procurando a primeira posição cujo valor é maior do que a chave a ser inserida, e insere a nova chave imediatamente antes dessa posição. Perceba que, se o nó tiver, por exemplo, as chaves $[10, 20, 30]$ e quisermos inserir 25, o método vai parar no índice 2 (posição do valor 30) e inserir 25 ali, resultando em $[10, 20, 25, 30]$. O método também retorna o índice em que a chave foi inserida, informação que será usada bastante durante o processo de divisão de nós (***split***), que veremos já já.

***

# Implementação

## A classe BTree

A classe `BTree` mantém apenas a referência para a raiz, a ordem e a quantidade de elementos na árvore:

```java
public class BTree {

    private BNode root;
    private int order;
    private int size;

    public boolean isEmpty() {
        return root == null;
    }

    public int size() {
        return this.size;
    }
    ...
}
```

## Inserção

A inserção em uma Árvore B é um pouco mais elaborada do que em uma BST, porque precisamos garantir, a todo momento, que nenhum nó ultrapasse o limite de chaves permitido pela ordem. A estratégia usada por esta implementação é conhecida como Top-Down: no processo de descida até o nó, se ele estiver cheio nós já o dividimos. Isso evita ter que propagar divisões de baixo para cima depois da inserção, simplificando bastante o algoritmo.

### Divisão de um nó (split)

O coração do algoritmo de inserção é o método `split`. Ele é chamado sempre que encontramos um nó cheio no caminho da inserção. A ideia parece ser complexa mas vamos com calma: dividimos o nó cheio em dois nós (um com a primeira metade das chaves, outro com a segunda metade), o mesmo acontece para os filhos desse nó. Então promovemos a chave do meio para o nó pai. 

```java
private void split(BNode node) {
    //Nó da esquerda
    BNode left = new BNode(this.order);
    //Primeira metade da keys no nó da esquerda
    for (int i = 0; i < (this.order - 1) / 2; i++) {
        left.addKey(node.keys.get(i));
    }
    //Primeira metade dos filhos no nó da esquerda
    if (!node.isLeaf()) {
        for (int i = 0; i < this.order / 2; i++) {
            left.children.add(node.children.get(i));
            node.children.get(i).parent = left;
        }
    }

    //Nó da direita
    BNode right = new BNode(this.order);
    //Segunda metade da keys no nó da direita
    for (int i = (this.order - 1) / 2 + 1; i < node.size; i++) {
        right.addKey(node.keys.get(i));
    }
    //Segunda metade dos filhos no nó da direita
    if (!node.isLeaf()) {
        for (int i = this.order / 2; i < node.children.size(); i++) {
            right.children.add(node.children.get(i));
            node.children.get(i).parent = right;
        }
    }

    //Se for raiz
    if (node.parent == null) {
        node.parent = new BNode(this.order);
        root = node.parent;
    }

    BNode parent = node.parent;

    //Atribui novos filhos
    left.parent = parent;
    right.parent = parent;

    int index = parent.addKey(node.keys.get((this.order - 1) / 2));

    parent.children.remove(node);
    parent.children.add(index, left);
    parent.children.add(index + 1, right);
}
```

Vamos por partes. Suponha um nó cheio com as chaves $[10, 20, 30, 40, 50]$ (ordem 6, ou seja, no máximo 5 chaves por nó). O `split` faz o seguinte:

1. Cria um nó ***left*** com a primeira metade das chaves: $[10, 20]$;
1. Cria um nó ***right*** com a segunda metade das chaves, ignorando a chave do meio: $[40, 50]$;
1. A chave do meio (30) **não fica em nenhum dos dois nós**. Ela sobe para o pai, funcionando como um "separador" entre ***left*** e ***right***;
1. Se o nó dividido não for folha, seus filhos também são repartidos entre ***left*** e ***right***, na mesma proporção das chaves;
1. Se o nó dividido for a raiz (não possui pai), uma nova raiz vazia é criada. É assim que a árvore cresce em altura: sempre pela raiz, nunca pelas folhas;
1. Por fim, a chave do meio é inserida no pai (`parent.addKey(...)`), e o nó original é substituído, na lista de filhos do pai, pelos dois novos nós ***left*** e ***right***.

> É importante destacar: diferente de uma BST, onde a árvore cresce inserindo folhas mais fundo, na Árvore B a árvore cresce "de baixo para cima, mas pela raiz". Quando a raiz é dividida, uma nova raiz é criada acima dela, aumentando a altura da árvore em exatamente um nível — e isso acontece **igualmente para todos os caminhos**, o que preserva a propriedade de que todas as folhas estão no mesmo nível.

Para fixar bem essa ideia, imagine uma Árvore B de ordem 4 (no máximo 3 chaves por nó) com a raiz $[10, 20, 30]$, já cheia. Ao inserirmos um novo valor, o `split` é chamado antes de prosseguirmos:

<p align="center">Antes do split: raiz = [10, 20, 30] (cheia)</p>

<p align="center">Depois do split: raiz = [20], filhos = [10] e [30]</p>

Note que 20 (a chave do meio) subiu, formando uma nova raiz, enquanto 10 e 30 se tornaram os dois filhos dessa nova raiz.

### Inserção recursiva

Com o `split` entendido, a inserção recursiva fica bem mais simples:

```java
public void recursiveInsert(int value) {
    if (isEmpty()) {
        root = new BNode(this.order);
        root.addKey(value);
        size++;
    } else {
        if (root.isFull()) {
            split(root);
        }
        recursiveInsert(root, value);
    }
}

private void recursiveInsert(BNode node, int value) {
    if (node.isLeaf()) {
        node.addKey(value);
        size++;
    } else {
        int idx = buscaBinaria(node, value);
        BNode child = node.children.get(idx);
        if (child.isFull()) {
            split(child);
            if (value > node.keys.get(idx)) {
                idx++;
            }
        }
        recursiveInsert(node.children.get(idx), value);
    }
}
```

A lógica é a seguinte: se a árvore estiver vazia, criamos a raiz com a primeira chave. Caso contrário, verificamos, **antes de qualquer coisa**, se a raiz está cheia. Se estiver, dividimos ela logo de cara, garantindo que nunca desceremos por um nó cheio.

Depois, o método privado `recursiveInsert(node, value)` faz o trabalho de percorrer a árvore. Se o nó atual for folha, é ali que a chave deve ser inserida. Caso contrário, precisamos decidir qual filho seguir. Essa decisão é feita pelo método `buscaBinaria`, que retorna o índice do filho que devemos "descer" na árvore.

Aqui está a sacada da abordagem Top-Down: antes de descer recursivamente para o filho escolhido, verificamos se ele está cheio. Se estiver, nós o dividimos **antes** de descer. Como o `split` cria uma chave para o nó atual (`node`), é possível que o índice do filho que devemos seguir mude — por isso o `if (value > node.keys.get(idx)) idx++`. Se o valor que estamos inserindo for maior do que a chave recém-criada, significa que devemos seguir para o novo filho da direita, e não mais para o da esquerda.

### Inserção iterativa

A versão iterativa segue exatamente a mesma lógica, mas usando um laço `while` em vez de recursão, e busca linear em vez de busca binária para decidir qual filho seguir:

```java
public void insert(int value) {
    if (isEmpty()) {
        root = new BNode(this.order);
        root.addKey(value);
        size++;
    } else {
        if (root.isFull()) {
            split(root);
        }

        BNode node = root;
        while (!node.isLeaf()) {
            int idx = buscaLinear(node, value);
            BNode child = node.children.get(idx);

            if (child.isFull()) {
                split(child);
                if (value > node.keys.get(idx)) {
                    idx++;
                }
            }
            node = node.children.get(idx);
        }

        size++;
        node.addKey(value);
    }
}
```

Note que a estrutura é idêntica à versão recursiva: garantimos que a raiz não está cheia, descemos pela árvore dividindo qualquer filho cheio que encontrarmos pelo caminho, até chegar a uma folha, onde finalmente inserimos a chave.

***

### Busca

***

### Mínimo e Máximo

***

### Remoção

***

### Caminhamento na B-tree

***

### Comparações entre Árvores Balanceadas

***

### Resumo

* Uma Árvore B é uma árvore de pesquisa balanceada em que cada nó pode armazenar várias chaves e ter vários filhos, ao invés de apenas uma chave e dois filhos, como em uma BST.

* A quantidade máxima de chaves e filhos de um nó é determinada pela ***ordem*** $t$ da árvore: no máximo $t - 1$ chaves e $t$ filhos por nó.

* Toda Árvore B é perfeitamente balanceada por construção: todas as folhas estão sempre no mesmo nível.

* A inserção usa a abordagem Top-Down: nós cheios são divididos **antes** de descermos por eles, o que evita ter que propagar divisões de baixo para cima depois.

* Ao dividir um nó cheio, a chave do meio é promovida para o pai. Quando a raiz é dividida, uma nova raiz é criada, e é assim que a árvore cresce em altura.

***

### Notas de Rodapé

* Por questões de simplicidade, foram utilizadas ordens ímpares nas árvores. Entretanto, o mesmo é possível para ordens pares.

* Durante as aulas e em outros materiais será provável que os métodos que precisem percorres as chaves utilizem busca lineares. No entanto, para cenários com grande números de chaves por nó, fica evidente que buscas binárias vão se evidenciar melhores.
***
