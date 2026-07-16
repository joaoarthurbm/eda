+++
title = "Least Recently Used(LRU)"
date = 2026-07-16
github = "https://github.com/nettoluis/eda-implementacoes" 
tags = []
categories = []
+++
# Introdução
Continuando a nossa discussão sobre as políticas de *cache eviction*, vimos que a política FIFO nem sempre é a mais adequada (como tudo na vida), por isso surgiram outras políticas como a que vamos discutir hoje: **Least Recently Used(LRU)**
# Contextualização
Peço que você se lembre do período de vestibular em que tinha que estudar várias matérias, mas você tinha que otimizar seu tempo de estudos. Imagine que sua mesa de comporta apenas três livros por vez, mas é mais rápida de acessar, e você tem uma estante que comporta todos os seus livros, mas você tem preguiça de ir até ela buscar seus livros. Primeiro, você pega o livro de Matemática e deixa-o na mesa, na próxima vez que você for estudar Matemática, você não precisa ir até à estante buscar o livro, agora imaginemos a seguinte sequência de fatos:
1. Vai até à estante buscar o livro de História;
2. Pega o livro de Matemática (Já na mesa);
3. Vai até à estante buscar o livro de Biologia;
4. Pega o livro de Biologia;

Agora, se eu fosse pegar, por exemplo, o livro de Filosofia, qual deveria sair da minha mesa para dar espaço para o precioso livro de Filosofia?

{{% quiz livro_mesa%}}
{{< item question="Qual livro deve sair da mesa?" answers="4" choices="História; acho chato, Matemática; tenho trauma, Biologia; muitos nomes, Depende; qual a política de cache eviction?">}}
{{% /quiz %}} 

Seguindo o algoritmo LRU, o livro que deveria deixar a mesa seria o de História, pois ele foi o **Menos Recentemente Acessado**, ou, para tornar a compreensão mais clara, o mais antigo a ser acessado.
# LRU vs Fila
Uma dúvida que pode surgir é: Professor, qual a diferença entre LRU e a Fila? E o pequeno detalhe é que na Fila o elemento que sai é o mais antigo a ser **adicionado** enquanto no LRU é o mais antigo a ser **acessado**.
# Estruturas necessárias
# Métodos
# Curiosidade
Por fim, vale citar que o algoritmo que estudamos hoje é normalmente o critério de desempate implementado na próxima política de ***cache eviction*** que estudaremos: **Least Frequently Used (LFU)**.



