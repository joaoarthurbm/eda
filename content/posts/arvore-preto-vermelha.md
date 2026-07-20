+++
title = "Árvore Preto-Vermelha (PV)"
date = 2026-07-16T19:47:17-03:00
draft = true
tags = []
categories = []
+++

Neste material nós vamos estudar sobre a **Árvore Preto-Vermelha**, apelidada de **árvore PV**.

**Disclaimer.** Este material tem muita interseção com o material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/bst/">Árvore Binária de Pesquisa</a>, por isso eu sugiro que sejam lidos antes.

# Contextualização

No material de BST vimos o conceito de **altura**, definida pelo maior caminho entre a raiz e todas as folhas. A partir dela, observamos que operações, como inserção, busca e remoção possuem custo assintótico $O(h)$. Portanto, é desejado manter o valro de $h$ o menor possível, garantindo que essas operações sejam eficientes.

Entretanto, isso não é garantido em uma BST comum. Dependendo da sequência das operações realizadas, a árvore pode se tornar desbalanceada, aumentando sua altura e, consequentemente, piorando o desempenho dessas operações, que pode se tornar linear.

Uma forma de resolver esse problema é utilizando **árvores auto-balanceadas**, isto é, estruturas que realizam ajustes automaticamente após inserções e remoções para manter sua altura proporcional a $log(n)$.

No material de AVL estudamos uma estrutura que mantém um balanceamento mais rígido por meio de rotações. Neste material veremos uma abordagem diferente: a **Árvore Preto-Vermelha**. Em vez de impor um balanceamento estrito, ela utiliza um conjunto de propriedades baseadas em cores que, por construção, garantem que a árvore permaneça **aproximadamente balanceada**, preservando a eficiência das operações de busca, inserção e remoção.

# Definições e Propriedades

De forma simplificada, uma árvore preto-vermelha é uma Árvore Binária de Pesquisa (BST) que utiliza um mecanismo de balenceamento baseado em cores. Além das informações armazenadas em cada nó, na árvore pv cada elemento possui um atributo adicional: uma cor, que pode ser **preta** ou **vermelha**. Por construção, essas cores obedecem a um conjunto de propriedades que mantêm a árvore aproximadamente balanceada, garantindo operações eficientes de busca, inserção e remoção.
