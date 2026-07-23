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

Além das informações já presentes em uma BST, cada nó possui uma cor, que pode ser **preta** ou **vermelha**. Essas cores seguem algumas propriedades que, por construção, garantem que a árvore permaneça aproximadamente balanceada.

Para representar a cor de cada nó, existem diferentes alternativas em Java. Uma delas é utilizar uma variável do tipo $String$, armazenando valores como **"RED"** e **"BLACK"**. Outra alternativa é utilizar um $boolean$, associando cada valor a uma das cores possíveis.

Neste material, utilizaremos um $enum$, um tipo especial da linguagem que representa um conjunto fixo de constantes. Nesse caso, a cor de um nó pode assumir apenas dois valores: **RED** ou **BLACK**.

```java
private enum Color {
    RED, BLACK
}
```

## NIL e Raiz

Outro conceito importante em uma árvore PV é o **NIL**. Diferente de uma BST comum, onde utilizamos $null$ para indicar que um filho não existe, em uma árvore preto-vermelha utilizamos um nó especial chamado $NIL$.

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

A próxima propriedade diz que **todos os filhos de um nó vermelho são pretos**. Isso implica que não podem existir dois nós vermelhos consecutivos em um mesmo caminho da árvore. Assim, o número de nós vermelhos em qualquer caminho nunca pode superar o número de nós pretos, impedindo que a árvore fique excessivamente alta.

## Altura Preta

Em sequência, temos que todo caminho de um nó até uma folha ($NIL$) descendente contém a mesma quantidade de nós pretos. Essa quantidade é chamada de **altura preta** (black-height) do nó.

Note que, ao calcular a altura preta, apenas os nós pretos do caminho são contabilizados. O próprio nó não é incluído na contagem, enquanto o nó $NIL$ é contabilizado. Por convenção, a altura preta de uma árvore vazia é 0.

Os nós vermelhos podem aparecer em alguns caminhos e não em outros, desde que todos eles possuam a mesma quantidade de nós pretos até uma folha ($NIL$).

Em termos de código, como todos os caminhos possuem a mesma altura preta, basta percorrer apenas um deles. Na implementação a seguir, utilizaremos o caminho pela subárvore esquerda.

```java
public int blackHeight() {
    //A altura de uma árvore vazia é 0.
    if (root == NIL) return 0;
    return blackHeight(root);
}

private int blackHeight(Node node) {
    //O nó NIL encerra a recursão e é contabilizado.
    if (node == NIL) return 1;

    int bh = blackHeight(node.left);

    //O próprio nó não é contabilizado.
    return bh + (node.left.color == Color.BLACK ? 1 : 0);
}
```

Apenas a restrição sobre nós vermelhos não seria suficiente para manter a árvore balanceada. É a combinação dessa regra com a altura preta que impede que existam caminhos muito maiores que outros.

Como consequência, **o caminho mais longo da raiz até uma folha ($NIL$) nunca pode ser maior que o dobro do menor caminho**. Dessa forma, a árvore permanece aproximadamente balanceada.

A figura abaixo demonstra um exemplo de árvore PV e as alturas pretas de cada nó. Observe que a altura preta da raiz é 2. Como o próprio nó não é contabilizado, podemos analisar um dos caminhos a partir de seus filhos, por exemplo, $5 -> 2 -> NIL$.

Como o o nó 5 é vermelho, ele não contribui para a altura preta. Assim, apenas o nó 2 e o nó $NIL$ são contabilizados, resultando em altura preta igual a 2.

<figure style="width: 80%; margin: 0 auto;">
    <img src="pv-exemplo-altura-preta.png" style="width: 100%;">
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

A principal mudança em relação às implementações anteriores está na forma como representamos os filhos inexistentes. Enquanto em uma BST comum ou AVL utilizamos $null$, na árvore PV utilizamos o nó $NIL$.

## Inserção
