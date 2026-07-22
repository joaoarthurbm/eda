+++
title = "Política de Cache LFU"
date = 2026-07-14
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/tree/master/java/src/cache"
+++

***

A essa altura, já compreendemos que o cache é uma ***memória rápida, com capacidade limitada***. Por isso, devemos remover elementos sempre que a memória estiver cheia. E, sabemos que boas políticas de cache *eviction* **minimizam as taxas de erro** e **maximizam as taxas de acerto**. Nesse contexto, iremos abordar a política de remoção de elementos LFU.

LFU é uma sigla para **Least Frequently Used**, que significa, em inglês, ***"utilizado com menor frequência"***. Isso diz respeito à maneira como os elementos são removidos, isto é, o elemento removido é aquele que foi utilizado ***menos frequentemente***. Fazemos esssa decisão, pois imaginamos que, ao adicionar um novo elemento, os utilizados com menor frequência no cache provavelmente não será utilizado novamente.

Vamos discutir melhor como funciona essa estratégia. Você certamente já usou um browser para acessar conteúdos na internet. Provavelmente, você acessa alguns sites várias vezes ao longo do dia, e seria desejável manter um conjunto de páginas ***frequentemente utilizadas***, por exemplo, alguns materiais dessa disciplina. Além disso, quando alguma outra página que não estiver nessa lista for acessada repetidamente, esta deveria substituir o site ***menos frequentemente acessado*** na lista.
***

## A política LFU

Nosso cache é um conjunto de nós que possuem um contador, que registra a quantidade de vezes que esse elemento foi acessado. Para isso, podemos utilizar uma lista encadeada, que começa vazia. Para simplicidade, neste exemplo, o cache terá como capacidade máxima três elementos.

`[null]`

Do mesmo modo que fizemos com as outras políticas de cache, vamos analisar a primeira operação de busca por um objeto no nosso sistema

`get("a")` -> miss!

Como esperado, buscamos um nó cujo valor é o elemento **"a"** no cache. Como não o encontramos, faremos a busca no BD, e adicionamos um nó que representa esse elemento ao cache, após encontrá-lo. Se este foi o caso, o cache, depois dessa operação, possui a seguinte forma.

`[("a", 1)]`

Note que tivemos que realizar uma alteração na estrutura do nó, comparado à política LRU, pois precisamos manter o registro da frequência desse elemento, além do conteúdo que existe nesse nó.

Vamos agora analisar outras operações de busca com resultados semelhantes:

`get("b")` -> miss!  

`get("c")` -> miss!

Novamente, faremos a busca pelos elementos no cache, como não há nós que contém **"b"** e **"c"**, buscamos estes elementos no banco de dados. Se os elementos estiverem no BD, após concluir a busca, realizamos a adição no cache.

`[("a", 1), ("b", 1), ("c", 1)]`

Agora, faremos a busca por elementos que existem no cache:

`get("a")` -> hit!  

`get("a")` -> hit!  

`get("c")` -> hit!

Isso é ótimo, pois não precisaremos utilizar uma ferramenta de busca para encontrar o site desejado, pois o encontramos na lista de acessos frequentes. Note que, quando encontramos um elemento em algum nó do cache, devemos aumentar a ***frequência*** do nó. Dessa forma, após essas operações, o cache terá a seguinte forma:

`[("a", 3), ("c", 2), ("b", 1)]`

Tentaremos agora procurar por um elemento distinto dos que já procuramos:

`get("d")` -> miss!

Estamos na mesma situação de busca por um elemento, cujo nó não existe no cache. Porém, não podemos simplesmente adicionar outro elemento ao cache, pois atingimos a capacidade máxima. Portanto, devemos efetuar uma remoção conforme a nossa política de cache. Nesse sentido, o nó removido é o que possui a ***menor frequência***, e, nesse caso, seria o nó com valor **"b"**. Em seu lugar, inserimos o novo elemento procurado.

`[("a", 3), ("c", 2), ("d", 1)]`

É importante lembrar, que o elemento ainda existe no banco de dados, portanto, sempre que removemos um nó do cache, devemos mudar sua frequência para 0, afinal, o elemento não existe no cache após a remoção.

Agora é um bom momento para testar seu aprendizado até este momento.

***

{{%quiz operacoes_em_cache%}}
{{< item question="Qual é o estado final do cache após realizar as seguintes operações? (em ordem!)" answers="3" choices="[(a : 3) | (b : 2) | (c : 1)], [(a : 3) | (b : 2) | (d : 1)], [(a : 3) | (b : 2) | (e : 1)], [(b : 2) | (c : 1) | (d : 1)], [(c : 1) | (d : 1) | (e : 1)]">}}
```
get("a");
get("a");
get("a");
get("b");
get("c");
get("b");
get("d");
get("e");
```
{{% /quiz %}}

***

## Sobre a eficiência das operações

Vamos analisar o código da operação "get" em casos:

```java
public String get(n) {
    Node node = cache.getNode(value);
                
    if (node != null) {
        node.frequency++;
        cache.sortByFrequency(node);
        return node.value;

    } else if (this.isFull()) {
        cache.removeFirst();

    }
    
    this.addFirst(value);
    return null;
}
```

**hit:** A operação custa $O(n)$, pois temos que iterar pela lista até encontrar o elemento. Após incrementar a frequência do elemento, devemos ordenar a lista, em um processo análogo à inserção ordenada. Como a lista possui tamanho $n$, e fazemos uma busca linear, seguida de uma inserção ordenada, teremos custo total $O(n)$.

**miss:** A opeação custa $O(n)$. Em nossa abordagem, escolhemos implementar o cache LFU como uma lista encadeada. Essa escolha foi intecional, porque a complexidade da adição em uma linkedlist é $O(1)$ (tempo constante). Porém, como ainda realizamos uma busca linear para procurar pelo elemento, que não estará na lista, e a lista tem tamanho n, a complexidade da busca será $O(n)$. Como sabemos, $O(n) + O(1)$ é $O(n)$.

Além disso, em casos de ***miss***, a operação possui outro agravante, pois temos que ir ao banco de dados para realizar a busca pelo elemento, que é um ***processo lento***. Entretanto, este material não leva esses fatores em conta, pois estamos discutindo aspectos isolados da política LFU.

### Possíveis otimizações

Conforme discutido nos materiais sobre as outras políticas de cache, o nosso fator limitante no custo das operações é a busca, porque sua complexidade é sempre $O(n)$. Portanto, podemos utilizar a mesma estratégia realizada nas outras políticas de cache, ou seja, utilizar outra estrutura para realizar as operações de busca, nesse caso, tabelas hash.

Com essas mudanças, nosso cache será composto por duas tabelas hash, uma responsável por vincular uma chave a um nó, permitindo a busca em tempo **$O(1)$**, e a outra mapeia as frequências de cada nó a um conjunto de nós existentes no cache.

Para os exemplos seguintes, assumimos o cache de tamanho 4, representado nesta imagem.

<figure style="align: center; margin-left:5%; width: 90%"> 
    <img src="cache-inicial.png">
</figure>

Em outras palavras, o cache funciona assim: Ao realizar a operação get, faremos a busca na tabela chave-nó. Caso o elemento exista no cache, devemos remover o nó da lista em que está contido. Em seguida, atualizamos sua frequência, e faremos sua inserção na nova lista de frequências. Abaixo, segue ilustração de como funciona o processo.

<figure style="align: center; margin-left:5%; width: 90%"> 
    <img src="elemento-existente.png">
    <figcaption align="center">
        A imagem mostra o resultado do cache após realizar get("d"). Note que removemos o nó da lista em que estava antes, e atualizamos sua frequência antes de adicionarmos o nó na tabela novamente.
    </figcaption>
</figure>

Note que o exemplo não cobre o caso em que aumentamos a frequência do elemento mais acessado no cache. Nesta situação, devemos verificar se a frequência existe como chave, antes de adicionar o nó à tabela.

Se o nó não está no cache, verificamos a capacidade do cache. Se o cache estiver cheio, devemos recuperar a lista que possui os nós com a menor frequência, para remover estes elementos do cache. Após isso, adicionamos o novo nó às tabelas. Tome como exemplo, a imagem abaixo.

<figure style="align: center; margin-left:5%; width: 90%"> 
    <img src="elemento-naoexistente.png">
    <figcaption align="center">
        A imagem mostra o resultado do cache após realizar get("e"). Note que removemos os nós com menor frequência do cache, antes de adicionar o elemento que procuramos.
    </figcaption>
</figure>

Observe também, que este modelo trata a situação em que existe mais de um nó com a menor frequência. Neste caso, os conteúdos da lista são completamente apagados.

Com essas otimizações, eliminamos a necessidade de manter a lista ordenada, pois conseguimos acessar um nó a partir da sua frequência. Além disso, como a complexidade da busca é reduzida a $O(1)$, pois fazemos o acesso em uma tabela hash. Portanto, a complexidade das operações do cache são $O(1)$. Note que, com essas otimizações, há ***maior consumo de memória***, porque estamos utilizando outras estruturas além da lista encadeada.

Em termos de código, nosso cache será representado dessa maneia:

```java
```

***
