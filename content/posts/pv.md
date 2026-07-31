+++
title = "Árvore Preto-Vermelha (PV)"
date = 2026-07-16T19:47:17-03:00
tags = []
categories = []
github = "LINK PARA IMPLEMENTACAO"
+++

Neste material vamos estudar sobre a **Árvore Preto-Vermelha**, apelidada de **árvore PV**.

A árvore também pode ser chamada de **Árvore Rubro-Negro**, mas recomendo não chama-lá assim, pois pode remeter ao flamengo e não queremos que vejam a árvore desta forma, já que ela é uma estrutura de dados muito boa, diferente de certos times brasileiros. (Após o professor ver isso, eu retiro essa parte)

**Disclaimer.** Este material utiliza diversos conceitos apresentados anteriormente no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/bst/">Árvore Binária de Pesquisa (BST)</a>, pois uma árvore PV é uma extensão de uma BST. Além disso, as operações de balanceamento possuem relação com o material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/avl/">Árvore Balanceada (AVL)</a>, devido ao uso de rotações. Por isso, recomenda-se a leitura desses materiais antes de iniciar este.

# Contextualização

No material de BST vimos o conceito de **altura**, definida pelo maior caminho entre a raiz e todas as folhas. A partir dela, observamos que operações, como inserção, busca e remoção possuem custo assintótico $O(h)$. Portanto, é desejado manter o valor de $h$ o menor possível, garantindo que essas operações sejam eficientes.

Entretanto, isso não é garantido em uma BST comum. Dependendo da sequência das operações realizadas, a árvore pode se tornar desbalanceada, aumentando sua altura e, consequentemente, piorando o desempenho dessas operações, que pode se tornar linear.

Uma forma de resolver esse problema é utilizar **árvores auto-balanceadas**, isto é, estruturas que realizam ajustes automaticamente após inserções e remoções para manter sua altura proporcional a $\log(n)$.

No material de AVL estudamos uma estrutura que mantém um balanceamento mais rígido por meio de rotações. Neste material veremos uma abordagem diferente: a **Árvore Preto-Vermelha**. Em vez de impor um balanceamento estrito, ela utiliza um conjunto de propriedades baseadas em cores que, por construção, garantem que a árvore permaneça **aproximadamente balanceada**, preservando a eficiência das operações de busca, inserção e remoção.

# Definições e Propriedades

De forma simplificada, uma árvore preto-vermelha é uma **BST** que utiliza cores para auxiliar no balanceamento da árvore.

Além das informações já presentes em uma BST, cada nó possui uma cor, que pode ser **preta** ou **vermelha**. A partir dessas cores, definimos um conjunto de propriedades que garantem o balanceamento da árvore.

Para representar a cor de cada nó, existem diferentes alternativas em Java. Uma delas é utilizar uma variável do tipo $String$, armazenando valores como **"RED"** e **"BLACK"**. Outra alternativa é utilizar um $boolean$, associando cada valor a uma das cores possíveis.

Neste material, utilizaremos um $enum$, um tipo especial da linguagem que representa um conjunto fixo de constantes. Nesse caso, a cor de um nó pode assumir apenas dois valores: **RED** ou **BLACK**.

```java
private enum Color {
    RED, BLACK
}
```

## NIL e Raiz

Outro conceito importante em uma árvore PV é o $NIL$. Diferente de uma BST comum, onde utilizamos $null$ para indicar que um filho não existe, em uma árvore preto-vermelha utilizamos um nó especial chamado $NIL$.

Esse nó também é conhecido como **nó sentinela**, pois funciona como uma folha da árvore, indicando o final de um caminho.

Com isso, todo nó passa a ter sempre dois filhos definidos: outros nós ou o próprio $NIL$. Essa escolha deixa a implementação mais simples e facilita a manutenção das propriedades da árvore PV.

O $NIL$ é criado junto com a árvore e é compartilhado por todos os nós que não possuem algum filho. Quando a árvore está vazia, sua raiz aponta para esse mesmo nó. Além disso, o nó $NIL$ é sempre **preto**, e uma das propriedades da árvore PV garante que a **raiz também seja sempre preta**.

A implementação abaixo mostra como a árvore é inicializada. Observe que os próprios ponteiros do $NIL$ apontam para ele mesmo. Essa é apenas uma escolha de implementação, mas outras abordagens também podem utilizar $null$ nesses ponteiros, desde que tratem corretamente o nó $NIL$.

```java
public class PV {

    private final Node NIL;
    private Node root;
    private int size;

    public PV() {
        this.NIL = new Node();
        this.NIL.color = Color.BLACK;
        this.NIL.left = NIL;
        this.NIL.right = NIL;
        this.NIL.parent = NIL;

        this.root = NIL;
        this.size = 0;
    }
...}
```

A figura abaixo ilustra uma árvore preto-vermelha com raiz igual a 10. Observe que como ela não tem filhos, eles são representados por $NIL$, sempre de cor preta.

<figure style="width: 36%; margin: 0 auto;">
    <img src="pv-raiz.png" style="width: 100%;">
</figure>

## Filhos

A próxima propriedade diz que **todos os filhos de um nó vermelho são pretos**. Isso implica que não podem existir dois nós vermelhos consecutivos em um mesmo caminho da árvore. Assim, o número de nós vermelhos em qualquer caminho nunca pode superar o número de nós pretos.

## Altura Preta

Em sequência, temos que todo caminho de um nó até uma folha ($NIL$) descendente contém a mesma quantidade de nós pretos. Essa quantidade é chamada de **altura preta** (black-height) do nó.

Note que, ao calcular a altura preta, apenas os nós pretos do caminho são contabilizados. O próprio nó não é incluído na contagem, enquanto o nó $NIL$ é contabilizado. Por convenção, a altura preta de uma árvore vazia é 0.

Os nós vermelhos podem aparecer em alguns caminhos e não em outros, desde que todos eles possuam a mesma quantidade de nós pretos até uma folha ($NIL$).

Em termos de código, como todos os caminhos possuem a mesma altura preta, basta percorrer apenas um deles. Na implementação a seguir, utilizaremos o caminho pela subárvore esquerda.

```java
    public int blackHeight(Node node) {
        // Caso a árvore esteja vazia ou o nó passado seja NIL.
        if (node == NIL) return 0;

        // Começamos a partir do filho a esquerda, para não incluir o nó.
        return blackHeightIncluding(node.left);
    }

    // Metodo auxiliar que inclui o nó atual e conta o NIL.
    private int blackHeightIncluding(Node node) {
        if (node == NIL) return 1;

        return (node.color == Color.BLACK ? 1 : 0) +
            blackHeightIncluding(node.left);
    }
```

Apenas a restrição sobre nós vermelhos não seria suficiente para manter a árvore balanceada. É a combinação dessa regra com a altura preta que impede que existam caminhos muito maiores que outros.

Como consequência, **o caminho mais longo da raiz até uma folha ($NIL$) nunca pode ser maior que o dobro do menor caminho**. Dessa forma, a árvore permanece aproximadamente balanceada.

A figura abaixo demonstra um exemplo de árvore PV e as alturas pretas de cada nó. Observe que a altura preta da raiz é 2. Como o próprio nó não é contabilizado, podemos analisar um dos caminhos a partir de seus filhos, por exemplo, $5 -> 2 -> NIL$.

Como o o nó 5 é vermelho, ele não contribui para a altura preta. Assim, apenas o nó 2 e o nó $NIL$ são contabilizados, resultando em altura preta igual a 2.

<figure style="width: 80%; margin: 0 auto;">
    <img src="pv-altura-preta.png" style="width: 100%;">
</figure>

Antes de prosseguir para a implementação, vale a pena revisar as propriedades que caracterizam uma árvore preto-vermelha. Elas serão utilizadas constantemente durante as operações de inserção e remoção.

## Resumo das propriedades

Ao longo desta seção vimos que uma árvore preto-vermelha deve obedecer às seguintes propriedades:

- Todo nó é vermelho ou preto.
- A raiz é preta.
- Toda folha ($NIL$) é preta.
- Todo filho de um nó vermelho é preto.
- Todo caminho de um nó até uma folha ($NIL$) descendente possui o mesmo número de nós pretos (altura preta).

---

Vale a pena fazermos um quiz para ver se você de fato entendeu as propriedades de uma árvore preto-vermelha.

(Quiz, 3 perguntas, 1 - Quais árvores são PV, 2 - Qual a altura preta, 3 - Qual propriedades foi violada)

---

## Complexidade das operações

Com essas propriedades garantidas, é possível demonstrar que uma árvore preto-vermelha com $n$ nós possui altura de no máximo $h \leq 2\log(n + 1)$. Como consequência, todas as operações cujo custo depende da altura da árvore podem ser executadas em $O(\log n)$.

# Implementação

Com as propriedades já definidas, podemos estudar a implementação de uma árvore PV.

As operações de inserção e remoção são as principais diferenças em relação a uma BST comum. Após cada uma delas, pode ser necessário realizar ajustes utilizando mudanças de cor e rotações para restaurar as propriedades da árvore PV.

Já os métodos de busca, mínimo, máximo, predecessor e sucessor podem ser reaproveitados da implementação de uma BST, pois a forma de percorrer a árvore continua sendo a mesma. Da mesma forma, as rotações para esquerda e para direita utilizadas na AVL também podem ser reaproveitadas, já que seu funcionamento permanece igual e elas serão utilizadas durante os ajustes da árvore PV.

A principal mudança em relação às implementações anteriores está na forma como representamos os filhos inexistentes. Enquanto em uma BST comum ou AVL utilizamos $null$, na árvore PV utilizamos o nó $NIL$ como condição de parada.

## Inserção

A inserção em uma árvore PV acontece em duas etapas.

Primeiro, fazemos a mesma inserção de uma **BST**. Afinal, uma árvore PV continua sendo uma árvore binária de pesquisa, então a ordenação dos nós deve ser mantida.

Feito isso, é bem provável que alguma propriedade da árvore tenha sido violada. Nesse caso, precisamos realizar os ajustes necessários por meio de mudanças de cor e, quando necessário, rotações. Para isso, utilizamos o método $fixUpInsert$.

O código abaixo mostra como essa ideia é organizada.

```java
public void add(int element) {
    this.size++;

    Node newNode = new Node(element);

    //Se a árvore está vazia, não é necessário conserto.
    if (this.isEmpty()) {
        this.root = newNode;
        this.root.color = Color.BLACK;
    } else {
        Node aux = this.root;

        //Procura a posição do nó e adiciona na árvore.
        while (aux != NIL) {
            if (element < aux.value) {
                if (aux.left == NIL) {
                    newNode.parent = aux;
                    aux.left = newNode;

                    break;
                }

                aux = aux.left;
            } else {
                if (aux.right == NIL) {
                    newNode.parent = aux;
                    aux.right = newNode;

                    break;
                }

                aux = aux.right;
            }
        }

        //Realiza os ajustes das propriedades da árvore PV.
        fixUpInsert(newNode);
    }
}
```

É importante destacar um detalhe da inserção: todo novo nó é inserido inicialmente com a cor **vermelha**.

O motivo é simples. Caso o nó fosse inserido como **preto**, alguns caminhos da árvore teriam um nó preto a mais que outros, violando a propriedade da altura preta. Além disso, esse tipo de violação seria mais complexo de corrigir.

Ao inserir o nó como **vermelho**, a altura preta permanece inalterada. O único problema seria a existência de dois nós vermelhos consecutivos, que ocorre quando o pai do novo nó inserido também é vermelho. No entanto, essa situação é mais fácil de corrigir.

Por esse motivo, o novo nó já é criado com a cor $RED$ durante a inserção.

```java
class Node {

    int value;
    Node left;
    Node right;
    Node parent;
    Color color;

    Node () {}

    Node(int v) {
        this.value = v;
        this.color = Color.RED;
        this.left = NIL;
        this.right = NIL;
        this.parent = NIL;
    }
...}
```

### Caso base

Antes de analisar os casos de ajuste, vale observar um detalhe do algoritmo.

Como o método fixUpInsert pode ser chamado recursivamente, a raiz da árvore pode mudar durante esses ajustes. Por isso, o primeiro teste do método é um caso base: se o nó chegou à raiz, basta pintá-la de preto.

```java
private void fixUpInsert(Node node) {
    //Caso base.
    if (node == this.root) {
        node.color = Color.BLACK;
        return;
    }

    ...
}
```

### Primeiro caso - O pai é preto

Agora sim começamos os casos de ajuste.

Vamos considerar uma árvore cuja raiz é o nó **10** e inserir o valor **5**.

<figure style="width: 30%; margin: 0 auto;">
    <img src="pv-insercao-caso-1.png" style="width: 100%;">
</figure>

Observe que o pai do novo nó é **preto**. Como a única violação possível após uma inserção é existir um pai vermelho com um filho vermelho, nenhuma propriedade da árvore foi quebrada. Portanto, não precisamos fazer nenhum ajuste.

Em termos de código, podemos simplesmente encerrar a execução do método.

```java
private void fixUpInsert(Node node) {
    ...

    // Se o pai é preto, nenhuma propriedade foi violada.
    if (node.parent.color == Color.BLACK) return;

    ...
}
```

### Segundo caso - Tio vermelho

Se chegamos até aqui, então o pai do nó é **vermelho**. Isso significa que existe uma violação, pois um nó vermelho não pode ter um filho vermelho.

Vamos continuar o exemplo anterior. Primeiro inserimos o **15**. Como seu pai é preto, nada precisa ser feito. Agora inserimos o **20**.

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-2-1.png" style="width: 100%;">
</figure>

Agora surgiu um problema: **20** e seu pai (**15**) são vermelhos.

Nesse momento, precisamos descobrir qual é a cor do tio, ou seja, o irmão do pai. Como ele também é **vermelho**, esse caso pode ser resolvido apenas com mudanças de cor.

Mas por que olhar para o tio? É evidente que devemos pintar de preto um dos dois nós vermelhos consecutivos para eliminar a violação, então pintamos o pai de preto. Ao fazer isso, um dos lados da árvore passa a ter um nó preto a mais que o outro. Para manter a altura preta igual nos dois lados, também precisamos pintar o tio de preto.

Como agora as duas subárvores ganharam um nó preto, compensamos essa mudança pintando o avô de vermelho.

Quando o tio for vermelho, fazemos as seguintes mudanças de cores:

- o pai passa de **vermelho** a **preto**
- o tio passa de **vermelho** a **preto**
- o avô passa de **preto** a **vermelho**

Após essas alterações, temos:

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-2-2.png" style="width: 100%;">
</figure>

A violação entre o novo nó e seu pai foi eliminada. Entretanto, ao pintar o avô de vermelho, uma nova violação pode surgiu acima dele. No nosso caso, o avô é a **raiz** e acabou ficando **vermelho**.

Por isso chamamos $fixUpInsert$ para o avô, a fim de verificar se ainda existe alguma violação acima dele.

Após essa nova chamada, obtemos:

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-2-3.png" style="width: 100%;">
</figure>

Como o avô é a raiz, pintamos de preto e encerramos a execução.

Em código, esse caso corresponde ao trecho abaixo:

```java
private void fixUpInsert(Node node) {
    ...

    //Variáveis úteis.
    Node parent = node.parent;
    Node grandfather = parent.parent;
    Node uncle = parent.isLeftChild() ? grandfather.right : grandfather.left;

    //Tio é vermelho.
    if (uncle.color == Color.RED) {
        parent.color = Color.BLACK;
        uncle.color = Color.BLACK;
        grandfather.color = Color.RED;

        fixUpInsert(grandfather);
    }

    ...
}
```

### Terceiro caso - Zig-Zag

Se passamos do segundo caso, então sabemos que o **tio é preto**. Com isso, o terceiro caso ocorre quando a inserção forma um **zig-zag**, ou seja:

- o pai é **filho à esquerda** e o nó é **filho à direita** ou
- o pai é **filho à direita** e o nó é **filho à esquerda**

Nesse caso, não basta apenas trocar cores. Primeiro precisamos transformar essa organização em uma forma linear, que será tratada no quarto caso.

Vamos continuar nosso exemplo adicionando agora o elemento **18**. Observe que seu tio é $NIL$, que é preto.

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-3-1.png" style="width: 100%;">
</figure>

Nossa solução para isso é **rotacionar o pai**, fazendo com que o nó e o pai fiquem alinhados com o avô.

No nosso exemplo, o pai é filho à direita e o nó é filho à esquerda. Portanto, realizamos uma **rotação à direita** no pai.

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-3-2.png" style="width: 100%;">
</figure>

Caso a formação fosse a inversa (pai à esquerda e nó à direita), faríamos uma **rotação à esquerda** no pai.

Após a rotação, temos:

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-3-3.png" style="width: 100%;">
</figure>

Note que a violação ainda não foi resolvida. A única finalidade dessa rotação foi transformar uma configuração em **zig-zag** em uma formação **linear**, permitindo que o quarto caso seja aplicado.

Em código, esse caso corresponde ao trecho abaixo:

```java
private void fixUpInsert(Node node) {
    ...

    //Tio é preto.
    else {
        //Pai é filho a esquerda e nó filho a direita
        if (parent.isLeftChild() && node.isRightChild()) {
            rotateLeft(parent);
            node = parent;
            parent = node.parent;

        //Pai é filho a direito e nó filho a esquerda
        } else if (parent.isRightChild() && node.isLeftChild()) {
            rotateRight(parent);
            node = parent;
            parent = node.parent;
        }

        ...
        //Código do caso 4
    }
}
```

### Quarto caso - Linear

Agora temos que a adição é uma formação **linear**, ou seja:

- O pai e o nó são filhos à esquerda ou
- O pai e o nó são filhos à direita

No terceiro caso, transformamos a formação em zig-zag em uma formação linear, a fim de eliminar a violação. Entretanto, é importante destacar que após a inserção, o nó já pode estar em uma formação linear, sem passar pelo terceiro caso.

Continuando o exemplo anterior, temos a seguinte árvore após a rotação realizada no terceiro caso:

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-3-3.png" style="width: 100%;">
</figure>

Para eliminarmos a violação, devemos fazer as seguintes trocas de cores:

- o pai passa de **vermelho** para **preto**
- o avô passa de **preto** para **vermelho**

Após essas alterações, obtemos:

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-4-1.png" style="width: 100%;">
</figure>

Note que agora nenhum nó vermelho possui um filho vermelho. Entretanto, outra violação foi gerada. Observe que, no caminho em destaque, a altura preta difere da dos demais caminhos da árvore. Para restaurar esse equilíbrio, realizamos uma rotação no avô.

O objetivo dessa rotação é fazer com que o pai, que agora é um nó **preto**, ocupe a raiz da subárvore. No nosso exemplo, a formação linear está inclinada para a esquerda, então realizamos uma **rotação à direita** no avô.

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-4-2.png" style="width: 100%;">
</figure>

Caso a formação estivesse inclinada para o lado direito, faríamos uma **rotação à esquerda** no avô.

Após a rotação, temos:

<figure style="width: 70%; margin: 0 auto;">
    <img src="pv-insercao-caso-4-3.png" style="width: 100%;">
</figure>

A troca de cores foi feita justamente para que, após a rotação do avô, o pai, que se tornaria a raiz da subárvore, ficasse preto, enquanto seus filhos ficassem vermelhos.

Com isso, todas as violações foram eliminadas e nenhuma nova foi gerada.

Em termos de código, esse caso é representado abaixo:

```java
private void fixUpInsert(Node node) {
    ...

    //Tio é preto.
    else {
        //Código do caso 3
        ...

        parent.color = Color.BLACK;
        grandfather.color = Color.RED;

        //Nó é filho a esquerda
        if (node.isLeftChild()) rotateRight(grandfather);

        //Nó é filho a direita
        else rotateLeft(grandfather);
    }
}
```

## Remoção

Assim como na inserção, a remoção é dividida em duas etapas: primeiro fazemos a remoção normal de uma BST e, em seguida, chamamos o método auxiliar $fixUpDelete$ para restaurar as propriedades da árvore.

Além disso, o conserto só é necessário quando o nó removido é **preto**, pois sua remoção reduz a altura preta de um dos caminhos da árvore. Em alguns casos, a remoção também pode gerar dois nós vermelhos consecutivos ou fazer com que a raiz fique vermelha, propriedades que precisam ser restauradas durante a correção.

O código de remoção segue abaixo:

```java
public void remove(int value) {
    Node toRemove = search(value);
    if (toRemove != NIL) {
        remove(toRemove);
        this.size -= 1;
    }
}

private void remove(Node toRemove) {
    //Se tiver dois filhos, trocamos o valor com o sucessor
    if (toRemove.left != NIL && toRemove.right != NIL) {
        Node sucessor = min(toRemove.right);
        toRemove.value = sucessor.value;
        toRemove = sucessor;
    }

    //O filho que substituirá o nó removido
    Node child = (toRemove.left != NIL) ? toRemove.left : toRemove.right;
    Node parent = toRemove.parent;
    Color originalColor = toRemove.color;

    if (toRemove == this.root) {
        this.root = child;
    } else if (toRemove.isLeftChild()) {
        parent.left = child;
    } else {
        parent.right = child;
    }

    //Atualiza o pai do filho
    if (child != NIL) {
        child.parent = parent;
    }

    //Caso a cor original do nó seja preta
    if (originalColor == Color.BLACK) {
        fixUpDelete(child, parent);
    }
}
```

Observe que passamos $child$ e $parent$ para $fixUpDelete$. Isso é necessário porque $child$ pode ser o nó $NIL$, que por sua vez não mantém referência para seu pai (o pai do nó $NIL$ é o próprio $NIL$). Como alguns casos de ajustes dependem do pai e do irmão de $child$, precisamos passar essa informação para o método.

A seguir, explicaremos o método $fixUpDelete$.

### Caso Base

Como o método pode ser chamado de forma recursiva, existem duas situações em que não é necessário continuar a correção:

- o nó é **vermelho**
- o nó é a **raiz**

Se o nó for vermelho, basta pintá-lo de **preto**, restaurando a altura preta do caminho. Já se ele for a raiz, apenas garantimos que sua cor seja preta e encerramos a execução.

Em código, isso é representado pelo trecho abaixo:

```java
private void fixUpDelete(Node node, Node parent) {
    if (node.color == Color.RED || node == this.root) {
        node.color = Color.BLACK;
        return;
    }
}
```

### Primeiro caso - Irmão vermelho
