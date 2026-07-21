+++
title = "Árvore Preto-Vermelha (PV)"
date = 2026-07-16T19:47:17-03:00
draft = true
tags = []
categories = []
github = "LINK PARA IMPLEMENTACAO"
+++

Neste material nós vamos estudar sobre a **Árvore Preto-Vermelha**, apelidada de **árvore PV**.

**Disclaimer.** Este material utiliza diversos conceitos apresentados anteriormente no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/bst/">Árvore Binária de Pesquisa</a>, pois uma árvore PV é uma extensão de uma BST. Além disso, as operações de balanceamento possuem relação com o material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/avl/">Árvore Balanceada (AVL)</a>, devido ao uso de rotações. Por isso, recomenda-se a leitura desses materiais antes de iniciar este.

# Contextualização

No material de BST vimos o conceito de **altura**, definida pelo maior caminho entre a raiz e todas as folhas. A partir dela, observamos que operações, como inserção, busca e remoção possuem custo assintótico $O(h)$. Portanto, é desejado manter o valor de $h$ o menor possível, garantindo que essas operações sejam eficientes.

Entretanto, isso não é garantido em uma BST comum. Dependendo da sequência das operações realizadas, a árvore pode se tornar desbalanceada, aumentando sua altura e, consequentemente, piorando o desempenho dessas operações, que pode se tornar linear.

Uma forma de resolver esse problema é utilizando **árvores auto-balanceadas**, isto é, estruturas que realizam ajustes automaticamente após inserções e remoções para manter sua altura proporcional a $log(n)$.

No material de AVL estudamos uma estrutura que mantém um balanceamento mais rígido por meio de rotações. Neste material veremos uma abordagem diferente: a **Árvore Preto-Vermelha**. Em vez de impor um balanceamento estrito, ela utiliza um conjunto de propriedades baseadas em cores que, por construção, garantem que a árvore permaneça **aproximadamente balanceada**, preservando a eficiência das operações de busca, inserção e remoção.

# Definições e Propriedades

De forma simplificada, uma árvore preto-vermelha é uma **Árvore Binária de Pesquisa (BST)** que utiliza um mecanismo de **balanceamento** baseado em cores. Além das informações armazenadas em cada nó, na árvore PV cada elemento possui um atributo adicional: uma cor, que pode ser **preta** ou **vermelha**. Por construção, essas cores obedecem a um conjunto de propriedades que mantêm a árvore aproximadamente balanceada.

Para representar a cor de cada nó, existem diferentes alternativas em Java. Uma delas é utilizar uma variável do tipo $String$, armazenando valores como **"RED"** e **"BLACK"**. Outra alternativa é utilizar um $boolean$, associando cada valor a uma das cores possíveis, por exemplo, $true$ para vermelho e $false$ para preto. Neste material, utilizaremos um $enum$, um tipo especial da linguagem que representa um conjunto fixo de constantes. Nesse caso, a cor de um nó pode assumir apenas dois valores: **RED** ou **BLACK**.

```java
private enum Color {
    RED, BLACK
}
```

Outro conceito importante em uma árvore PV é o **nó sentinela NIL**. Em vez de utilizar $null$ para representar a ausência de filhos, todo filho inexistente é representado por um único nó $NIL$.

O uso desse nó padroniza a estrutura da árvore, fazendo com que todo nó possua sempre dois filhos (que podem ser nós comuns ou o próprio $NIL$). Isso simplifica a implementação dos métodos básicos da árvore e é essencial para a manutenção das propriedades da árvore preto-vermelha.

o $NIL$ é utilizado como um atributo privado e imutável da árvore, instanciado na criação da árvore. Inicialmente, a árvore está vazia, por isso, sua raiz aponta para o próprio $NIL$. Além disso, o nó $NIL$ é sempre **preto**, e uma das propriedades da árvore PV garante que a **raiz também seja sempre preta**.

A implementação abaixo mostra como a árvore PV é inicializada. Repare que os ponteiros $left$, $right$ e $parent$ do próprio $NIL$ apontam para ele mesmo. Essa é apenas uma escolha de implementação. Em outras implementações, esses ponteiros podem ser definidos como $null$, desde que os algoritmos tratem corretamente o nó sentinela.

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
