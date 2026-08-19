+++
title = "Árvores Balanceadas: B Tree"
date = 2026-08-07
tags = []
categories = []
github = "https://github.com/antonynunesy/eda/tree/b-tree"
+++

Este material foi escrito por [Antony Nunes](https://github.com/antonynunesy) e [Victor Rafael](https://github.com/VictorRafael-26/), alunos da disciplina.

***

Até aqui, vimos árvores em que cada nó armazena **uma única chave** e possui, no máximo, **dois filhos**, como as <a class="external" href="https://joaoarthurbm.github.io/eda/posts/bst/">Árvores Binárias de Pesquisa (BST)</a>. Essa restrição é simples e elegante, mas tem uma consequência prática importante: em cenários com grandes volumes de dados, principalmente quando a árvore não cabe inteira no Cache e parte dela precisa ser armazenada em um banco de dados, uma árvore binária de pesquisa pode crescer muito em altura. E, como já vimos, a altura é o que determina o custo das operações básicas de uma árvore. Quanto maior a altura, mais acessos a disco são necessários, e acesso a banco de dados são muito mais custosos do que acessos à cache, como visto nos materiais anteriores.

### A solução

Então como escapar dessas idas e voltas ao banco da dados? A **Árvore B** (ou *B-Tree*) resolve esse problema alterando a ideia de árvore de pesquisa: em vez de permitir apenas uma chave e dois filhos por nó, uma Árvore B permite que **cada nó armazene várias chaves e tenha vários filhos**. Isso faz com que a árvore cresça mais "para os lados" do que "para baixo", resultando em uma altura muito menor para a mesma quantidade de elementos. Na prática, isso significa menos acessos a disco e, consequentemente, operações mais rápidas.

# Definições e Propriedades

Formalmente, uma Árvore B é definida por um parâmetro chamado ***ordem*** (representado aqui pela variável `order`), que determina quantos filhos um nó pode ter. Dada uma ordem $t$, uma Árvore B respeita as seguintes invariantes:

1. Cada nó possui, no máximo, $t - 1$ chaves;

1. Cada nó possui, no máximo, $t$ filhos;

1. Cada nó, exceto a raiz, possui, no mínimo, $(t-1)/2$ chaves;

1. Um nó com $k$ chaves possui exatamente $k + 1$ filhos;

1. As chaves de um nó estão sempre ordenadas. 

1. O filho no índice $i$ é o nó com chaves menores que a $k[i]$ 

1. Todas as folhas estão no mesmo nível.

Essa última propriedade é a mais importante de todas: **uma Árvore B é sempre perfeitamente balanceada**. Não existe o conceito de árvore "desbalanceada" ou "quasi-balanceada" em uma Árvore B. Isso é garantido por construção dentro da árvore, que veremos em detalhes mais adiante.

> Diferente da BST, onde o balanceamento é uma preocupação externa (por isso existem variações como AVL e Rubro-Negra), a Árvore B é balanceada por construção. Todas as folhas estão sempre no mesmo nível.

## Ordem da árvore

A ordem determina o quão larga a árvore pode ser. Como visto nas invariantes, em uma Árvore B de ordem t (`order = t`), cada nó pode ter, no máximo, t-1 chaves e t filhos. Em uma Árvore B de ordem 5, cada nó pode ter, no máximo, 4 chaves e 5 filhos. Quanto maior a ordem, mais larga e mais baixa a árvore se torna.

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

Esse método é responsável por inserir uma chave em um nó **mantendo a ordem crescente**. Ele percorre a lista de chaves procurando a primeira posição cujo valor é maior do que a chave a ser inserida, e a insere imediatamente antes dessa posição[^1]. O método também retorna o índice em que a chave foi inserida, informação que será usada bastante durante o processo de divisão de nós (***split***), que veremos já já.

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

A inserção em uma Árvore B é um pouco mais elaborada do que em uma BST, porque precisamos garantir, a todo momento, que nenhum nó ultrapasse o limite de chaves permitido pela ordem. A estratégia usada por esta implementação é conhecida como Top-Down: no processo de descida até o nó, se ele estiver cheio nós já o dividimos. Isso evita ter que propagar divisões de baixo para cima depois da inserção, simplificando bastante o algoritmo. Mais precisamente, isso garante que, sempre que um nó precisar ser dividido, seu pai já tenha espaço disponível para receber a chave promovida — afinal, se o pai também estivesse cheio, ele já teria sido dividido antes, no passo anterior da descida.

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

![Funcionamento do Split](split.gif)

1. Cria um nó ***left*** com a primeira metade das chaves: $[10, 20]$;
1. Cria um nó ***right*** com a segunda metade das chaves, ignorando a chave do meio: $[40, 50]$;
1. A chave do meio (30) **não fica em nenhum dos dois nós**. Ela sobe para o pai, funcionando como um "separador" entre ***left*** e ***right***;
1. Se o nó dividido não for folha, seus filhos também são divididos entre ***left*** e ***right***, seguindo exatamente o mesmo corte usado nas chaves. No nosso exemplo, um nó com 5 chaves teria 6 filhos: os 3 primeiros (índices 0, 1 e 2) acompanham as chaves $[10, 20]$ e vão para ***left***, e os 3 últimos (índices 3, 4 e 5) acompanham as chaves $[40, 50]$ e vão para ***right***.
1. Se o nó dividido for a raiz (não possui pai), uma nova raiz vazia é criada. É assim que a árvore cresce em altura: sempre pela raiz, nunca pelas folhas;
1. Por fim, a chave do meio é inserida no pai (`parent.addKey(...)`), e o nó original é substituído, na lista de filhos do pai, pelos dois novos nós ***left*** e ***right***.

> É importante destacar: diferente de uma BST, onde a árvore cresce inserindo folhas mais fundo, na Árvore B a árvore cresce "de baixo para cima, mas pela raiz". Quando a raiz é dividida, uma nova raiz é criada acima dela, aumentando a altura da árvore em exatamente um nível, e isso acontece **igualmente para todos os caminhos**, o que preserva a propriedade de que todas as folhas estão no mesmo nível.

Para fixar bem essa ideia, imagine uma Árvore B de ordem 4 (no máximo 3 chaves por nó) com a raiz $[10, 20, 30]$, já cheia. Ao inserirmos um novo valor, o `split` é chamado antes de prosseguirmos:

<p align="center">Antes do split: raiz = [10, 20, 30] (cheia)</p>

<p align="center">Depois do split: raiz = [20], filhos = [10] e [30]</p>

Note que 20 (a chave do meio) subiu, formando uma nova raiz, enquanto 10 e 30 se tornaram os dois filhos dessa nova raiz.

### Inserção

Com o `split` entendido, a inserção fica bem mais simples de entender:

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
        insert(root, value);
    }
}

private void insert(BNode node, int value) {
    if (node.isLeaf()) {
        node.addKey(value);
        size++;
    } else {
        int idx = linearSearch(node, value);
        BNode child = node.children.get(idx);
        if (child.isFull()) {
            split(child);
            if (value > node.keys.get(idx)) {
                idx++;
            }
        }
        insert(node.children.get(idx), value);
    }
}
```

A lógica é a seguinte: se a árvore estiver vazia, criamos a raiz com a primeira chave. Caso contrário, verificamos se a raiz está cheia. Se estiver, dividimos ela logo de cara, garantindo que nunca desceremos para um nó cheio.

Depois, o método privado `insert(node, value)` faz o trabalho de percorrer a árvore. Se o nó atual for folha, é ali que a chave deve ser inserida. Caso contrário, precisamos decidir qual filho seguir. Essa decisão é feita pelo método `linearSearch`, que retorna o índice do filho que devemos descer na árvore.

Aqui está a sacada da abordagem Top-Down: antes de descer recursivamente para o filho escolhido, verificamos se ele está cheio. Se estiver, nós o dividimos **antes** de descer. Como o `split` cria uma chave para o nó atual (`node`), é possível que o índice do filho que devemos seguir mude — por isso o `if (value > node.keys.get(idx)) idx++`. Se o valor que estamos inserindo for maior do que a chave recém-criada, significa que devemos seguir para o novo filho da direita, e não mais para o da esquerda.


### Busca

A busca em uma Árvore B segue a mesma ideia de uma BST: descemos pela árvore até encontrar a chave desejada, mas agora cada nó pode conter várias chaves e, por isso, a decisão de qual filho seguir é feita comparando o valor com as chaves do nó atual.

O algoritmo funciona assim:

![Exemplo da busca do elemento 5](btree-search.gif)

1. Começamos na raiz.

1. No nó atual, procuramos em qual posição a chave deve estar, como as chaves sempres estão ordenadas, podemos achá-la facilmente.

1. Se a chave for encontrada no nó atual, devolvemos a posição `(nó, índice)`.

1. Caso contrário, seguimos para o filho cujo o índice seria o mesmo do valor caso ele estivesse entre as chaves.

1. Se chegarmos a uma folha e a chave não estiver ali, a busca termina sem encontrar o valor.

Sua implementação:

```java
public BNodePosition search(int value) {
    if (isEmpty()) {
        return new BNodePosition();
    }
    return search(root, value);
}

private BNodePosition search(BNode node, int value) {
    int idx = linearSearch(node, value);

    //Encontramos
    if (idx < node.size && value == node.keys.get(idx)) {
        return new BNodePosition(node, idx);
    }
    //Não encontramos
    if (!node.isLeaf()) {
        return search(node.children.get(idx), value);
    }
    //É uma folha
    return new BNodePosition();
}
```

A classe `BNodePosition` serve justamente para representar o resultado da busca: ela guarda em qual nó a chave pertence e em qual índice dentro do array `keys` ela foi encontrada, como uma tupla. Quando o valor não existe, a posição é vazia.

***

### Mínimo e Máximo

Por ser uma estrutura ordenada, assim como em uma BST, o menor valor de uma Árvore B está sempre no primeiro nó da esquerda, e o maior valor está sempre no último nó da direita. Porém, por conta da estrutura de vários filhos por nó, quando chegamos na folha, devemos indicar qual o índice da chave.

Por ser uma estrutura ordenada, o menor elemento é encontrado seguindo sempre o primeiro filho:

![Exemplo de busca do mínimo](btree-min.gif)

Implementação iterativa:
```java
public BNodePosition min() {
    if (isEmpty()) {
        return new BNodePosition();
    }

    BNode node = root;
    while (!node.isLeaf()) {
        node = node.children.get(0);
    }
    return new BNodePosition(node, 0);
}
```

Da mesma forma, o máximo é encontrado descendo sempre pelo último filho:

![Exemplo de busca do máximo](btree-max.gif)

Implementação recursiva:
```java
public BNodePosition max() {
    if(isEmpty()) {
        return new BNodePosition();
    }
    return max(root);
}

private BNodePosition max(BNode node) {
    if(node.isLeaf()) {
        return new BNodePosition(node, node.size-1);
    }
    return max(node.children.get(node.children.size()-1));
}
```

Em ambos os casos, a ideia é a mesma: o menor valor está na folha mais à esquerda e o maior valor, na folha mais à direita.


***

### Remoção

Assim como na BST, remover um elemento é, de longe, a operação mais delicada de se implementar em uma Árvore B. E aqui o motivo é ainda mais evidente: toda vez que removemos uma chave, corremos o risco de quebrar uma das invariantes que vimos lá no início: **todo nó, exceto a raiz, precisa ter no mínimo $(t-1)/2$ chaves**.

Por causa disso, o algoritmo de remoção é dividido em duas fases:

1. **Encontrar e apagar a chave**, garantindo que a remoção sempre aconteça em uma folha, nunca em um nó interno;
2. **Corrigir a estrutura**, caso o nó de onde a chave foi removida (ou algum de seus ancestrais) tenha ficado com menos chaves do que o permitido.

#### Por que remover sempre em uma folha?

Se a chave a ser removida está em um nó interno, não podemos simplesmente tirá-la da lista de chaves: ela funciona como um separador entre dois filhos daquele nó, e removê-la quebraria a estrutura da árvore.

A solução, assim como na BST, é **substituir** a chave por outra que possa ocupar seu lugar sem quebrar a ordenação: o ***predecessor*** (a maior chave da subárvore imediatamente à esquerda) ou o ***sucessor*** (a menor chave da subárvore imediatamente à direita). Qualquer um dos dois serve, o predecessor é, por definição, menor do que tudo à direita dele e maior do que tudo à esquerda, e o sucessor cumpre a propriedade da mesma forma.

Nesta implementação, optamos por usar sempre o **predecessor**[^2]. Vejamos:

```java
public void remove(int value){
    //Arvore vazia: nao ha nada para remover
    if(isEmpty()) return;

    //Fase 1a: localizar a chave
    BNodePosition pos = search(value);
    if(pos.node == null) return; //Valor nao existe na arvore, return

    BNode node = pos.node;
    int index = pos.position;

    //Fase 1b: se a chave esta em um no interno, ela nao pode ser removida
    //diretamente: precisamos troca-la pelo predecessor
    if(!node.isLeaf()){
        //O predecessor esta sempre na folha mais a direita da subarvore
        //a direita da chave.
        BNodePosition pred = max(node.children.get(index));

        //Faz o swap do predecessor e a chave a ser removida
        node.keys.set(index, pred.getValue());
        node = pred.node;
        index = pred.position;
    }

    //Fase 1c: nesse ponto, node é SEMPRE uma folha - seja porque a chave 
    //ja estava numa folha desde o inicio ou porque acabamos de swapar.
    node.keys.remove(index);
    node.size--;
    size--;

    //Fase 2: verifica se a remocao deixou algum no abaixo do minimo de 
    //chaves, corrigindo (e propagando a correcao para cima, se preciso)
    fixUnderflow(node);
}
```

#### O número mínimo de chaves

Antes de entrarmos na fase de correção, vale relembrar a invariante 3: todo nó, exceto a raiz, precisa ter no mínimo $(t-1)/2$ chaves. Se algum nó não possuir esse número mínimo, dizemos então que ele está em **UnderFlow**. O valor mínimo de chaves é calculado pelo método auxiliar `minKeys`:

```java
private int minKeys(){
    return (this.order - 1) / 2;
}
```

Por exemplo, para `order = 5`, temos `minKeys() = (5 - 1) / 2 = 2`. Ou seja, nessa árvore, todo nó (com exceção da raiz) precisa ter pelo menos duas chaves em qualquer estado da árvore.

#### Corrigindo um nó abaixo do mínimo

Depois que a chave é removida de uma folha, é possível que esse nó tenha ficado abaixo do mínimo de chaves permitido. Quando isso acontece, existem duas ferramentas para corrigir a situação, sempre nessa ordem de prioridade:

1. **Redistribuição**: se algum irmão adjacente (esquerdo ou direito) tiver chaves acima do mínimo, uma chave é emprestada dele, passando pelo pai. Essa operação é mais barata, porque **não altera a altura da árvore**.

2. **Concatenação**: se nenhum irmão tiver sobra, o nó deficiente é fundido com um irmão, absorvendo também a chave do pai que os separava. Essa operação pode, em cascata, deixar o próprio pai com poucas chaves, por isso a correção é chamada recursivamente para cima. 

> A concatenação segue a política ***bottom-up*** (de baixo para cima), em contraste com a inserção, que resolve os seus problemas ***top-down*** (de cima para baixo).


```java
private void fixUnderflow(BNode node){
    //Caso especial: raiz nao tem numero minimo de chaves obrigatorio
    if(node == root){
        if(node.size == 0){
            if(node.isLeaf()){
                //Raiz sem filhos e sem chaves: a arvore ficou vazia
                root = null;
            } else {
                //Raiz perdeu a ultima chave (via concatenação), mas
                //ainda tem um filho unico sobrando. Ele vira a nova raiz,
                //e a arvore perde um nivel de altura.
                root = node.children.get(0);
                root.parent = null;
            }
        }
        return;
    }

    //Se o no ja tem chaves suficientes, nao ha nada a corrigir
    if(node.size >= minKeys()) return;

    BNode parent = node.parent;
    int index = parent.children.indexOf(node);

    //Pega o irmao esquerdo, se o node nao for o primeiro filho do pai
    BNode leftSibling = null;
    if(index > 0){
        leftSibling = parent.children.get(index - 1);
    }

    //Pega o irmao direito, se o node nao for o ultimo filho do pai
    BNode rightSibling = null;
    if(index < parent.children.size() - 1){
        rightSibling = parent.children.get(index + 1);
    }

    //Prioridade 1: redistribuir com o irmao esquerdo, se ele tiver sobra
    if(leftSibling != null && leftSibling.size > minKeys()){
        redistributeLeft(node, leftSibling, parent, index);
    //Prioridade 2: redistribuir com o irmao direito, se ele tiver sobra
    } else if(rightSibling != null && rightSibling.size > minKeys()){
        redistributeRight(node, rightSibling, parent, index);
    //Prioridade 3: nenhum irmao tem sobra, então concatena com um deles
    } else if(leftSibling != null){
        concatenate(leftSibling, node, parent, index - 1);
    } else {
        concatenate(node, rightSibling, parent, index);
    }
}
```

#### Redistribuição

A redistribuição funciona como uma espécie de rotação: uma chave é emprestada de um irmão as tem sobrando, mas ela nunca pula diretamente de um nó para o outro, ela sempre passa pelo pai no meio do caminho, porque é a chave do pai que funciona como separador entre os dois nós.

```java
private void redistributeLeft(BNode node, BNode leftSibling, BNode parent, int index){
    //A chave do pai que separa leftSibling de node desce 
    //e entra no INICIO do node
    node.keys.add(0, parent.keys.get(index - 1));
    node.size++;

    //Maior chave do irmao esquerdo sobe
    parent.keys.set(index - 1, leftSibling.keys.remove(leftSibling.size - 1));
    leftSibling.size--;

    //Se os nos nao forem folhas, o ultimo filho do irmao esquerdo 
    //tambem migra.
    if(!leftSibling.isLeaf()){
        BNode child = leftSibling.children.remove(leftSibling.children.size() - 1);
        child.parent = node;
        node.children.add(0, child);
    }
}
```
Imagine uma Árvore B de ordem 5 (`minKeys() = 2`), com a raiz $[20, 39]$ e filhos $[9, 11, 12]$ (com sobra: 3 chaves), $[25]$ (com apenas 1 chave, depois de uma remoção) e $[55, 90]$ (no limite mínimo).

![Redistribuição](redistribuicao.png)

Aplicando ao nosso exemplo: a chave `20` (do pai) desce para o início do nó deficiente, que vira $[20, 25]$. A maior chave do irmão esquerdo, `12`, sobe para o lugar do `20` no pai, que vira $[12, 39]$. O irmão esquerdo, por sua vez, perde o `12` e fica com $[9, 11]$. No final, todo mundo tem pelo menos duas chaves, e a altura da árvore nem foi alterada.

![Redistribuição](redistribuicao.gif)

`redistributeRight` é o espelho exato dessa lógica, só que emprestando do irmão da direita:

```java
private void redistributeRight(BNode node, BNode rightSibling, BNode parent, int index){
    //A chave do pai que separa node de rightSibling desce 
    //e entra no FINAL do node
    node.keys.add(parent.keys.get(index));
    node.size++;

    //Menor chave do irmao direito sobe
    parent.keys.set(index, rightSibling.keys.remove(0));
    rightSibling.size--;

    //Se os nos nao forem folhas, o primeiro filho do irmao direito
    //tambem migra
    if(!rightSibling.isLeaf()){
        BNode child = rightSibling.children.remove(0);
        child.parent = node;
        node.children.add(child);
    }
}
```
Note que a chave do pai desce, a chave do irmão sobe, e o nó que estava em UnderFlow ganha exatamente uma chave. Vamos fixar essa ideia:

{{% quiz remocao_redistribuicao %}}
{{< item question="Considere uma árvore de ordem 5, com raiz [33 - 70], e filhos [3 - 6 - 9 - 12], [35] e [80 - 88]. Qual o estado da árvore após a redistribuição?" answers="2" choices=" raiz [9 - 70]; filhos [3 - 6 - 12] | [33 - 35] | [80 - 88], raiz [12 - 70]; filhos [3 - 6 - 9] | [33 - 35] | [80 - 88], raiz [33 - 70]; filhos [3 - 6 - 9] | [12 - 35] | [80 - 88], raiz [12 - 70]; filhos [3 - 6 - 9] | [35 - 33] | [80 - 88]">}}
{{% /quiz %}}
***

#### Concatenação

Quando **nenhum irmão** tem chaves de sobra, isto é, os dois estão exatamente no mínimo de chaves, não é possível redistribuir sem deixar o doador também em UnderFlow. A solução é fundir os dois nós em um só, absorvendo também a chave do pai que os separava.

```java
private void concatenate(BNode left, BNode right, BNode parent, int parentKeyIndex){
    //A chave do pai que separava os dois nos desce e entra no 
    //final do left
    left.keys.add(parent.keys.remove(parentKeyIndex));
    left.size++;
    parent.size--;

    //Todas as chaves do right migram para o left
    left.keys.addAll(right.keys);
    left.size += right.size;

    //Se nao forem folhas, os filhos do right tambem migram para o left,
    //preservando a subarvore inteira
    if(!right.isLeaf()){
        for(BNode child : right.children){
            child.parent = left;
        }
        left.children.addAll(right.children);
    }

    //Right foi totalmente absorvido por left, então
    //remove-se da lista de filhos do pai
    parent.children.remove(right);

    //Propaga correção para cima
    fixUnderflow(parent);
}
```
>   Nota-se que é necessário propagar a correção para os ancestrais do nó, uma vez que o pai pode ter perdido uma chave e um filho, ficando ele mesmo deficiente (ou, se for a raiz, pode ter ficado vazia)

Voltando ao nosso exemplo, agora com um nó em UnderFlow:

![Concatenação](concatenacao.png)

Suponhamos que removemos o elemento 55. Agora devemos realizar a concatenação: a chave `39` desce do pai e se uni com seus dois filhos $[20, 25]$ e $[90]$, respectivamente, resultando em $[20, 25, 39, 90]$. O nó direito deixa de existir, e o pai, que perdeu uma chave e um filho, vira $[12]$. Como o pai é raiz, não há problema dele possuir apenas uma chave. Vamos a representação:

![Concatenação](concatenacao.gif)

> Assim como no algoritmo de inserção, onde o crescimento da árvore sempre acontece pela raiz (nunca pelas folhas), aqui o encolhimento da árvore também só acontece pela raiz: é somente quando a correção chega até a raiz e a deixa vazia que a altura da árvore diminui.

Esse último ponto é interessante e vale um quiz :)

{{% quiz remocao_concatenacao %}}
<p align="center">
  <img src="quiz.png" style="width:60%">
</p>
{{< item question="Dada a B-tree de ordem 5 com raiz [33], filho esquerdo [10 - 15] e filho direito [50]. Qual o estado final da árvore após a correção do UnderFlow?" answers="3" choices=" A árvore mantém 3 níveis: raiz [33]; filho esquerdo [10 - 15 - 50] e filho direito vazio é removido, A raiz vira [10 - 15 - 33 - 50] mas continua com dois filhos vazios abaixo dela, A árvore perde um nível e a raiz passa a ser um único nó [10- 15 - 33 - 50]; sem filhos, A raiz vira [33 - 50] e o filho esquerdo [10 - 15] permanece como único filho">}}
{{% /quiz %}}

***

### Caminhamento na B-tree

Assim como em outras estruturas de dados, percorrer uma Árvore B significa visitar todos os seus nós em uma ordem específica. Na implementação apresentada, existem duas formas principais de fazer isso: em profundidade (DFS) e em largura (BFS). Cada uma delas é útil em situações diferentes.

#### DFS: visita em profundidade

Na visita em profundidade, seguimos o caminho de um nó até chegar a uma folha e só depois voltamos para explorar o próximo ramo. A ideia é visitar a raiz, seguir por um filho, explorar todo esse caminho até o fim e, quando chegar ao final, retornar para tentar o próximo ramo. Em outras palavras, a busca vai em profundidade antes de voltar para explorar as opções laterais. 

Na implementação, o método `depthFS()` faz exatamente isso, seguindo a política de pre-ordem:

```java
public ArrayList<BNode> depthFS() {
    ArrayList<BNode> nodes = new ArrayList<>();
    depthFS(root, nodes);
    return nodes;
}

private void depthFS(BNode node, ArrayList<BNode> nodes) {
    if (node == null) return;

    nodes.add(node);

    for (BNode child : node.children) {
        depthFS(child, nodes);
    }
}
```

Esse modelo é interessante quando queremos explorar uma subárvore inteira antes de passar para a próxima.

#### BFS: percurso em largura

Já no percurso em largura, visitamos todos os nós de um nível antes de descer para o próximo. A ideia é começar pela raiz, depois visitar os filhos dessa raiz, em seguida os filhos dos filhos, e assim sucessivamente. Em vez de seguir um caminho até o fim, como acontece no DFS, o BFS explora a árvore camada por camada, o que deixa bem clara a estrutura horizontal da árvore.

Na implementação, o método `breadthFS()` usa uma fila para garantir essa ordem:

```java
public ArrayList<BNode> breadthFS() {
    ArrayList<BNode> result = new ArrayList<>();

    if (isEmpty()) return result;

    Queue<BNode> queue = new LinkedList<>();
    queue.add(root);

    while (!queue.isEmpty()) {
        BNode current = queue.poll();
        result.add(current);

        if (!current.isLeaf()) {
            for (BNode child : current.children) {
                queue.add(child);
            }
        }
    }
    return result;
}
```

Esse tipo de caminhamento é útil quando queremos analisar a árvore por níveis, por exemplo, para entender melhor a estrutura da árvore ou a distribuição das chaves.

***

### Resumo

* Uma Árvore B é uma árvore de pesquisa balanceada em que cada nó pode armazenar várias chaves e ter vários filhos, ao invés de apenas uma chave e dois filhos, como em uma BST.

* A quantidade máxima de chaves e filhos de um nó é determinada pela ***ordem*** $t$ da árvore: no máximo $t - 1$ chaves e $t$ filhos por nó.

* A quantidade mínima de chaves de um nó é dada pela fórmula $(t - 1) / 2$. A raiz é o único nó que não possui mínimo de chaves obrigatório.

* Toda Árvore B é perfeitamente balanceada por construção: todas as folhas estão sempre no mesmo nível.

* A inserção ocorre sempre nas folhas e utiliza a abordagem Top-Down: nós cheios são divididos **antes** de descermos por eles, o que evita ter que propagar divisões de baixo para cima depois.

* Ao dividir um nó cheio, a chave do meio é promovida para o pai. Quando a raiz é dividida, uma nova raiz é criada, e é assim que a árvore cresce em altura.

* A remoção sempre acontece em uma folha. Se a chave estiver em um nó interno, ela é substituída pelo predecessor (ou sucessor) antes da remoção efetiva.

* A remoção usa a abordagem bottom-up: primeiro remove-se a chave, depois verifica-se se algum nó ficou com poucas chaves, corrigindo via redistribuição (quando um irmão tem sobra) ou concatenação (quando nenhum irmão tem sobra), propagando a correção para cima se necessário.

* Assim como o crescimento da árvore acontece pela raiz na inserção, o encolhimento também acontece pela raiz na remoção: a altura só diminui quando a correção bottom-up chega até a raiz e a esvazia.


# Notas de Rodapé

[^1]:Durante as aulas e em outros materiais será provável que os métodos que precisem percorrer as chaves utilizem busca lineares. No entanto, para cenários com grande números de chaves por nó, fica evidente que buscas binárias vão se provar melhores.

[^2]:Assim como na remoção de uma BST, a escolha entre substituir uma chave interna pelo predecessor ou pelo sucessor é livre, ambas mantêm a Árvore B válida. A única exigência é manter essa escolha consistente na implementação, já que ela afeta o formato final da árvore após sucessivas remoções.
