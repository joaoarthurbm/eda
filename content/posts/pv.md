+++
title = "Árvore Preto-Vermelha (PV)"
date = 2026-07-16T19:47:17-03:00
tags = []
categories = []
github = "LINK PARA IMPLEMENTACAO"
+++

Neste material vamos estudar sobre a **Árvore Preto-Vermelha**, apelidada de **árvore PV**.

**Disclaimer.** Este material utiliza diversos conceitos apresentados anteriormente no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/bst/">Árvore Binária de Pesquisa (BST)</a>, pois uma árvore PV é uma extensão de uma BST. Além disso, as operações de balanceamento possuem relação com o material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/avl/">Árvore Balanceada (AVL)</a>, devido ao uso de rotações. Por isso, recomenda-se a leitura desses materiais antes de iniciar este.

# Contextualização

No material de BST vimos o conceito de **altura**, definida pelo maior caminho entre a raiz e todas as folhas. A partir dela, observamos que operações, como inserção, busca e remoção possuem custo assintótico $O(h)$. Portanto, é desejado manter o valor de $h$ o menor possível, garantindo que essas operações sejam eficientes.

Entretanto, isso não é garantido em uma BST comum. Dependendo da sequência das operações realizadas, a árvore pode se tornar desbalanceada, aumentando sua altura e, consequentemente, piorando o desempenho dessas operações, que pode se tornar linear.

Uma forma de resolver esse problema é utilizar **árvores auto-balanceadas**, isto é, estruturas que realizam ajustes automaticamente após inserções e remoções para manter sua altura proporcional a $log(n)$.

No material de AVL estudamos uma estrutura que mantém um balanceamento mais rígido por meio de rotações. Neste material veremos uma abordagem diferente: a **Árvore Preto-Vermelha**. Em vez de impor um balanceamento estrito, ela utiliza um conjunto de propriedades baseadas em cores que, por construção, garantem que a árvore permaneça **aproximadamente balanceada**, preservando a eficiência das operações de busca, inserção e remoção.

# Definições e Propriedades

De forma simplificada, uma árvore preto-vermelha é uma **Árvore Binária de Pesquisa (BST)** que utiliza um mecanismo de **balanceamento** baseado em cores. Além das informações armazenadas em cada nó, na árvore PV cada elemento possui um atributo adicional: uma cor, que pode ser **preta** ou **vermelha**. Por construção, essas cores obedecem a um conjunto de propriedades que mantêm a árvore aproximadamente balanceada.

Para representar a cor de cada nó, existem diferentes alternativas em Java. Uma delas é utilizar uma variável do tipo $String$, armazenando valores como **"RED"** e **"BLACK"**. Outra alternativa é utilizar um $boolean$, associando cada valor a uma das cores possíveis, por exemplo, $true$ para vermelho e $false$ para preto. Neste material, utilizaremos um $enum$, um tipo especial da linguagem que representa um conjunto fixo de constantes. Nesse caso, a cor de um nó pode assumir apenas dois valores: **RED** ou **BLACK**.

```java
private enum Color {
    RED, BLACK
}
```

## NIL e Raiz

Outro conceito importante em uma árvore PV é o **nó sentinela NIL**. Em vez de utilizar $null$ para representar a ausência de filhos, todo filho inexistente é representado por um único nó $NIL$.

O uso desse nó padroniza a estrutura da árvore, fazendo com que todo nó possua sempre dois filhos (que podem ser nós comuns ou o próprio $NIL$). Isso simplifica a implementação dos métodos básicos da árvore e é essencial para a manutenção das propriedades da árvore preto-vermelha.

O $NIL$ é utilizado como um atributo privado e imutável da árvore, instanciado na criação da árvore. Inicialmente, a árvore está vazia, por isso, sua raiz aponta para o próprio $NIL$. Além disso, o nó $NIL$ é sempre **preto**, e uma das propriedades da árvore PV garante que a **raiz também seja sempre preta**.

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

## Filhos

A próxima propriedade diz que **todos os filhos de um nó vermelho são pretos**. Isso implica que não podem existir dois nós vermelhos consecutivos em um mesmo caminho da árvore. Assim, o número de nós vermelhos em qualquer caminho nunca pode superar o número de nós pretos, impedindo que a árvore fique excessivamente alta.

## Altura Preta

Em sequência, temos que todo caminho de um nó até uma folha ($NIL$) descendente contém a mesma quantidade de nós pretos. Essa quantidade é chamada de **altura preta** (black-height) do nó.

Note que, ao calcular a altura preta, apenas os nós pretos são contabilizados. Os nós vermelhos podem aparecer em alguns caminhos e não em outros, desde que o caminho do nó até um nó $NIL$ tenha a mesma quantidade de nós pretos.

A restrição sobre nós vermelhos, por si só, não é suficiente para garantir o balanceamento da árvore. Em conjunto com a restrição da altura preta, ela impede que existam caminhos muito maiores do que outros. Como consequência, o caminho mais longo da raiz até uma folha ($NIL$) nunca é maior que o dobro do menor caminho, mantendo a árvore aproximadamente balanceada.

A figura abaixo demonstra um exemplo de árvore PV. Observe que todas as propriedades foram respeitadas.

<figure style="width: 80%; margin: 0 auto;">
    <img src="pv-exemplo.png" style="width: 100%;">
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

A principal diferença em relação aos metódos de uma BST está nas operações de inserção e remoção. Após cada uma delas, pode ser necessário realizar ajustes, utilizando mudanças de cor e rotações, para restaurar o balanceamento da árvore e garantir que todas as propriedades continuem sendo satisfeitas.

Já os métodos de busca, mínimo, máximo, predecessor e sucessor permanecem essencialmente os mesmos de uma BST. A principal diferença é que as verificações envolvendo $null$ passam a utilizar o nó sentinela $NIL$. Da mesma forma, as rotações para esquerda e para a direita são idênticas às estudadas na AVL, exigindo apenas essa mesma adaptação para o uso do nó sentinela.

## Inserção
