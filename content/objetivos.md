+++
title = "Objetivos"
date = "2019-10-29"
menu = "main"
weight = "20"
meta = "false"
+++

Ao término deste curso o aluno será capaz de compreender, implementar e utilizar as principais estuturas de dados e suas diferentes estratégias de organização de informação.

O aluno será capaz também de analisar a eficiência de algoritmos do ponto de vista assintótico. Em particular, essa análise tem como pano de fundo algoritmos de ordenação e operações básicas de diferentes estruturas de dados.

Abaixo estão detalhados os objetivos gerais e específicos de aprendizagem tendo como norte os seguintes tópicos: análise de algoritmos, ordenação e estruturas de dados.

## Análise de Algoritmos

*Compreender a importância do estudo de eficiência de algoritmos.*

* Explicar de forma clara, concisa e através de exemplos, a importância do estudo de eficiência de algoritmos.

*Identificar o custo de execução de um algoritmo; Comparar algoritmos de acordo com a ordem de crescimento; Compreender o tradeoff envolvido na escolha de algoritmos.*

* Descrever a função de custo detalhada de um algoritmo.
* Simplicar a função de custo detalhada de um algoritmo.
* Determinar a ordem de crescimento da função que descreve o custo de execução de um algoritmo.
* Demonstrar a que conjunto a função pertence: $O$, $Omega$ ou $Theta$.
* Mapear essa ordem de um função para funções clássicas ($n$, $n^2$, $n * log n$...).
* Comparar algoritmos de acordo com a ordem de crescimento de suas funções de custo.

---

## Ordenação

*Compreender a importância de ordenar dados.*

* Explicar de forma clara, concisa e através de exemplos, a importância
de ordenar dados.

*Compreender as principais estratégias de ordenação e suas aplicações e comparar algoritmos que implementam essas estratégias.

* Identificar aplicações das técnicas de ordenação em outros contextos. Por exemplo, identificação de quantis em um conjunto de dados.
* Implementar os principais algoritmos de ordenação por comparação e por contagem.
* Comparar do ponto de vista assintótico diferentes algoritmos de ordenação.
* Executar experimentos para comparar o tempo de execução de diferentes algoritmos de ordenação. 

---


## Estruturas de dados

*Compreender a importância de estruturas de dados e suas operações básicas.*

* Explicar de forma clara, concisa e através de exemplos, a importância do uso de estruturas de dados.
* Implementar o contrato genérico (interface) das principais operações de estuturas de dados.

### Estruturas de dados lineares

*Compreender as diferentes estratégias de implementações de estruturas de dados lineares.*

* Implementar as operações básicas de listas, filas e pilhas baseadas em arrays e baseadas em nós.
* Comparar, do ponto de vista assintótico, as diferentes estratégias de implementação das operações básicas.
* Estabelecer vantagens e desvantagens das diferentes estratégias de implementação das operações básicas.
* Implementar operações de manipulação em estruturas de dados lineares.


### Tabelas Hash

*Compreender a importância e aplicação de tabelas de acesso direto e tabelas hash.*

* Explicar de forma clara, concisa e através de exemplos, o porquê das tabelas de acesso direto serem tão eficientes em determinadas situações.
* Implementar as operações básicas de uma tabela de acesso direto.
* Explicar o porquê do uso do conceito de hash e funções de hash.
* Implementar diferentes estratégias de funções de hash.
* Descrever aplicações do conceito de hash.

*Compreender o conceito de colisão e as estratégias de resolução de colisões.*

* Avaliar o impacto das colisões hash no desempenho das operações básicas.
* Implementar as operações básicas de uma tabela hash resolvendo colisões com endereçamento aberto e com encadeamento.
* Estabelecer vantagens e desvantagens dessas diferentes estratégias de resolução de colisões.

### Árvores binárias de Pesquisa

*Compreender o conceito árvores binárias de pesquisa e sua importância.*

* Descrever as propriedades de uma árvore binária de pesquisa.
* Identificar elementos importantes na árvore: raiz, folhas e nós internos.
* Indentificar a altura de uma árvore binária e o seu impacto na eficiência das operações.
* Ilustrar a eficiência da busca binária completa e comparar com a busca linear.

*Compreender detalhes de implementação de árvores binárias.*

* Implementar operações básicas de árvores binárias de pesquisa.

### Árvores binárias balanceadas

*Compreender a importância do balanceamento de uma árvore.*

* Descrever o problema da altura de uma árvore ser próxima ao número de nós.
* Identificar a altura mínima de uma árvore com $n$ nós.
* Explicar a razão pela qual é desejável manter a altura de uma árvore próxima do mínimo possível.

*Compreender estratégias de balanceamento.*

* Descrever o problema que as rotações resolvem.
* Ilustrar em exemplos concretos a aplicação de rotações.
* Implementar rotações.
* Explicar com exemplos concretos o conceito de *balance* de um nó e como esse conceito é utilizado para a aplicação de rotações.
* Explicar com exemplos concretos o conceito de coloração de nós e como esse conceito é utilizado para aplicação de rotações.
* Explicar de forma clara e concisa o conceito de nós n-ários e que problema eles resolvem.
* Ilustrar a aplicação da estratégia de manter as folhas sempre no mesmo nível para manter o balanceamento de uma árvore.
