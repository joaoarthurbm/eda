+++
title = "Least Recently Used (LRU)"
date = 2026-07-16
github = "https://github.com/nettoluis/eda-implementacoes" 
tags = []
categories = []
+++
# Introdução
Continuando a nossa discussão sobre as políticas de *cache eviction*, vimos que a política FIFO nem sempre é a mais adequada (como tudo na vida), por isso surgiram outras políticas como a que vamos discutir hoje: **Least Recently Used (LRU)**.

# Contextualização
Lembre do período de vestibular em que você tinha que otimizar seu tempo de estudos. Imagine que sua mesa comporta apenas três livros por vez, mas é mais rápida de acessar, e você tem uma estante que comporta todos os seus livros, mas você tem preguiça de ir até ela buscar seus livros. Agora, analisemos a seguinte sequência de fatos:

A tabela a seguir está organizada do livro mais recentemente utilizado (à direita) para o menos recentemente utilizado (à esquerda).

| Passo | Livro Utilizado | Livros na Mesa |
| :---: | :---: | :---: |
| 0 | Nenhum | [vazio, vazio, vazio] |
| 1 | Matemática | [vazio, vazio, M] |
| 2 | História | [vazio, M, H] |
| 3 | Matemática | [vazio, H, M] |
| 4 | Biologia | [H, M, B] |

Agora, se você fosse pegar, por exemplo, o livro de Filosofia, qual deveria sair da sua mesa para dar espaço para o precioso livro de Filosofia?

{{% quiz livro_mesa%}}
{{< item question="Qual livro deve sair da mesa?" answers="4" choices="História; acho chato, Matemática; tenho trauma, Biologia; muitos nomes, Depende; qual a política de cache eviction?">}}
{{% /quiz %}} 

Seguindo o algoritmo LRU, o livro que deveria deixar a mesa seria o de História, pois ele foi o **Menos Recentemente Acessado**, ou, para tornar a compreensão mais clara, o mais antigo a ser acessado e, a partir disso, surge a questão: Por que não o de Matemática? Porque, apesar de ser o mais antigo a ser colocado na mesa, ele é o segundo *mais recentemente acessado*.
# LRU vs FIFO
Uma dúvida que pode surgir é: Professor, qual a diferença entre LRU e a FIFO? E o pequeno detalhe é que na FIFO o elemento que sai é o mais antigo a ser **adicionado** enquanto no LRU é o mais antigo a ser **acessado**. Para fixar a diferença, basta relembrarmos dos exemplos dos livros na mesa, caso a política de cache fosse FIFO, o de Matemática deveria sair, já se fosse LRU, o de História deveria sair.
# Estruturas de dados necessárias
Saindo do mundo das ideias e partindo para a implementação, precisamos nos perguntar duas coisas importantes: Como atualizar rapidamente a ordem de acesso? Como localizar rapidamente um elemento?

1. A estrutura para manter a ordem de acesso dos dados, geralmente, é uma **Lista Duplamente Ligada** com o *tail* armazenando o nó **mais recentemente acessado** e o *head* o **menos recentemente acessado**.
2. A estrutura não só para verificarmos a existência desse dado em cache, como também para acessar uma referêcia para seu nó, geralmente, é um **HashMap** em que a chave é o valor do nó e o valor é o próprio nó.

E por que a implementação mais comum utiliza essas duas? Bem, uma das características fundamentais do cache é que ele seja uma memória de acesso rápido, de preferência constante, certo? 

>Com a **Lista Duplamente Ligada** nós podemos mover um nó em uma posição arbitrária para o *tail* em tempo constante através de trocas de referências e com o **HashMap** nós podemos tanto verificar se ele está em cache quanto acessá-lo diretamente, ambos em tempo constante.

# Métodos
# Curiosidade
Por fim, vale citar que o algoritmo que estudamos hoje é normalmente o critério de desempate implementado na próxima política de ***cache eviction*** que estudaremos: **Least Frequently Used (LFU)**.
# Contribuições
[Luis Netto](https://github.com/nettoluis/) e [Gustavo Paulino](https://github.com/gustavop-fausto/) contribuíram para esse material.



