+++
title = "Uma aula só com perguntas: Endereçamento Aberto"
date = 2019-10-23
tags = []
categories = []
+++

***

Neste artigo vou descrever um experimento que fiz em sala de aula. Tentei lecionar Resolução de Colisões em Tabelas Hash utilizando apenas perguntas para a turma.

Eu estou no meu segundo ano como professor da UFCG e já me cansei de usar slides em sala de aula. Não que eu queira fazer uma cruzada contra os slides. Sei que eles funcionam para vários cenários. Contudo, eu acho que, no contexto das minhas disciplinas, eles mais atrapalham do que ajudam.

Corta para a RE-03.

Dito isso, na aulas de Estrutura de Dados e Algoritmos, tenho tentado outras alternativas para conduzir as discussões. Desde o semestre passado, por exemplo, utilizo uma variação de DOJO para a implementação dos algoritmos clássicos de ordenação. Em linhas gerais, funciona desta maneira: divido a turma em grupos pequenos e os faço pensar na solução para o problema proposto. Um a um, os grupos são chamados para implementar a solução no meu computador, cuja tela está projetada para a sala. Cada grupo possui apenas 2min para contribuir com a solução. Naturalmente, cada grupo deve continuar a implementação a partir do ponto em que o outro grupo parou. Assim, a solução é construída por N (n > 2) mãos. Para melhorar a discussão e entendimento do assunto, ao final dos 2 minutos, peço para cada grupo explicar o que fez e o que falta para terminar a solução.

Essa primeira experiência foi bem proveitosa para o aprendizado. Contudo, assim como a aula com slides, não é viável aplicá-la sempre. Por isso, e pelo cansaço com slides, procurei outras formas de conduzir minhas aulas. Há um tempo atrás, li um artigo de um professor que conduziu uma aula inteira de programação apenas fazendo perguntas (alguém, por favor, me ajuda a achar esse artigo). O ócio me fez pensar: por que não replicar em Estrutura de Dados? Pois bem, a partir de agora, relato o que aconteceu hoje na RE-03.

## Preparação

Inicialmente, avisei para os alunos que o meu objetivo era fazer apenas perguntas na sala de aula e perguntei se eles topariam o desafio. Como eu não deixei escolha, todos toparam. :)

Para ser sincero, não me preparei muito para a aula. Eu sabia o que queria passar, mas tinha receio que, se preparasse as questões de antemão, a aula sairia tão mecanizada quanto o passar de slides. Assim, eu fui para a sala de aula com tópicos a serem cobertos:

* resolução de colisões com endereçamento aberto
* probing linear e quadrático
* fator de carga
* rehash

**Assunto da aula:** *Resolução de colisões em tabelas hash utilizando endereçamento aberto.*

## A aula

A partir de agora, vai ser em forma de diálogo e observações, ok? Vamos lá.

***- O que vimos na aula passada?***

— Resolução de colisões usando chainning.

***— Como funciona?***

Os alunos explicaram o funcionamento.

***— Qual a complexidade da busca ?***

Muitos responderam $O(1)$. Aqui houve o primeiro desvio do que tinha em mente. O ideal seria que a resposta fosse $O(1+alpha)$, onde $alpha$ é o tamanho médio das listas. Caso a turma tivesse respondido assim, a aula continuaria como planejada. Contudo, tive que desenhar um exemplo de colisões na tabela que gerou uma lista razoavelmente grande e, para reforçar que as operações não são $O(1)$ e sim $O(1 + alpha)$, fiz a seguinte pergunta:

***— O(1) mesmo?***

Nesse momento eles refletiram e responderam corretamente. Com o mesmo exemplo, eu perguntei:

***— E se não pudéssemos utilizar listas? E se em cada slot só coubesse um par <key,value>?***

Silêncio. Aqui foi mais um momento em que tive que improvisar.

***— Vamos lá. Houve colisões. Há espaço para alocar esse novo objeto?**

— Sim.

***— Onde?***

— Pode ser na próxima posição livre.

***— Como? Se minha função de hash me joga para aquela posição.***

Nesse momento houve hesitação da turma. Meu objetivo aqui era que eles sacassem que adicionando +1 no resultado do hash seria uma forma. Assim, voltei para a função de hash e perguntei:

***— E se eu colocasse hash(x) = (x % n) + 1, funcionaria?***

— Sim.

***— E se eu adicionar um elemento que caiu nessa mesma posição?***

— Usa hash(x) = (x%n) + 2.

***— E se eu adicionar mais um elemento que caiu nessa mesma posição?***

— Usa hash(x) = (x%n) + 3.

***— Ótimo! Então como posso generalizar essa minha função?***

Mais hesitação. Nesse momento tive que transformar uma afirmação em pergunta:

***— E se eu colocasse um i ao invés dessas constantes? O i começaria de quanto?***
— 0.

***— E iria aumentando como?***

— De um em um.

***— Qual o nome bonito para isso?***

— Linearmente.

Aqui tive que introduzir o nome do conceito (linear probing). Aí não teve jeito.

***— Ok, pessoal. Vocês acabaram de resolver colisões usando endereçamento aberto com probing linear.***

Contudo, quando se usa endereçamento aberto, os algoritmos de ***put*** e ***get*** devem ser modificados em relação à estratégia de chainning. Por isso, perguntei:

***— Como ficaria o algoritmo de busca em uma tabela com essa estratégia?***

A turma ficou calada novamente. Insisti:

***— Vamos lá. Se eu pesquisar pela chave X, qual o protocolo?***

— Calcula o hash dela.

***— Como sempre?***

— Não. Começa com zero no lugar de i.

***— Ok. E agora?***

— Compara a chave com a que está na tabela.

***— E se não for a que eu estou procurando?***

— Aumenta o i para 1.

***— E se ainda não for a que eu estou procurando?***

— Aumenta o i para 2.

***— Vou fazer isso até quando? Como fica o algoritmo? Que comando em programação utilizar?***

— while. Enquanto não for igual, aumento o probing.

***— Só isso? E quando o elemento realmente não estiver na tabela?***

Nesse momento a turma não soube responder. Acabei afirmando que as outras condições do while deveriam ser `!= null` e "não inspecionei toda a tabela".

Usei o mesmo raciocínio para os algoritmos de ***put*** e ***remove***.

Até aqui estava bem contente com o andamento da aula. Minha estratégia de apenas fazer perguntas estava funcionando e eu vinha vencendo os objetivos da aula um a um, tal como Rafaela Silva.


Mas aí, precisei explicar o conceito de Probing Quadrático. Para isso, fiz uma relação com com exponential *backoff*. Expliquei um pouco, fugindo da ideia original de utilizar só perguntas. No entanto, ainda sim, fiz perguntas como:

***— O que faço para acentuar a distância entre esses dois números?***

A resposta eu já havia dado antes. Elevar ao quadrado é uma das alternativas. Assim, mostrei que o probing quadrático é melhor que o linear porque evita, com maior eficácia, clusters na tabela.

Depois disso, meu objetivo era abordar rehash. Iniciei perguntando:

***— Estamos resolvendo colisões. Mas isso é suficiente sempre? Quando a coisa começa a degringolar?***

— Quando há muitos elementos na tabela.

***— Quem nos diz se há muitos elementos na tabela?***

— O alpha.

Massa. Voltei para o jogo de perguntas de novo. Desenhei uma tabela e a preenchi toda. Assim, o problema tornou-se físico. Não haveria mais espaço para o próximo elemento na tabela. Perguntei:

***— E agora?***

— Cria outra tabela.

***— De que tamanho?***

— O dobro do original.

Criei a tabela e perguntei:

***— Basta colocar os elementos em sua posição inicial?***

A turma ficou calada.

***— O que vou ter que mudar?***

— A função de hash. Precisa dividir pelo novo tamanho da tabela.

***— Se eu não fizesse isso. O que aconteceria?***

— Os elementos da tabela anterior cairiam na mesma posição.

***— Certo. Então eu vou precisar recalcular o hash de todo mundo, certo?***

— Sim.

Nesse momento, calculei para 2 elementos e um deles não caiu na posição em que estava na tabela anterior. Para fixar bem esse cenário, perguntei:

***— O que aconteceu com essa chave?***

— Caiu em uma outra posição.

Nesse momento usei a afirmação: precisamos fazer isso para cada elemento da tabela.
Só faltava deixar claro quando realizar o rehash. Assim, perguntei:

***— Pessoal, quando eu devo fazer rehash?***

— Quando a tabela estiver cheia.

***— De novo. Quem me diz isso?***

— O alpha.

***— Certo. Preciso esperar ele chegar até 1?***

— Não.

***— Até quanto então?***

— 75%.
***— Por que?***

— Não está nem muito cheio, nem muito vazio.

Nesse momento discuti um pouco sobre o 75%. O mais importante foram as perguntas:

***— O que acontece se eu fizer rehash com um alpha pequeno?***

— Vai fazer vários. Isso custa caro.

***— O que acontece se eu fizer rehash com um alpha alto?***

— Tende a ter muitas colisões e o desempenho fica ruim.

A partir daqui fiquei satisfeito com o que discutimos. Discuti apenas alguns detalhes de implementação mostrando que diferentes formas de resolver colisões podem ser vistas como estratégias e que, por isso, podemos utilizar o padrão Strategy para implementá-las.

## Conclusão

A aula foi muito dinâmica. Não senti falta dos slides. Farei de novo. Acho que me obriga a pensar como o aluno, ao invés de preparar um discurso e descarregá-lo.

## Importante!

Esse relato é enviesado pela minha percepção da aula. As perguntas e respostas certamente não foram exatamente como descritas aqui, pois, como não gravei, não me lembro exatamente de cada momento. No mais, esse relato é público e meus alunos podem ajudá-los a me desmascarar caso eu tenha mentido :)