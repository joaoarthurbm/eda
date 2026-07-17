+++
title = "Política de Cache LFU"
date = 2026-07-14
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/tree/master/java/src/cache"
+++

***

A essa altura, já compreendemos que o cache é uma ***memória rápida, com capacidade limitada***. Por isso, devemos remover elementos sempre que a memória estiver cheia. E, também sabemos, que boas políticas de cache *eviction* ***minimizam a as taxas de erro e maximizam as taxas de acerto. Nesse contexto, iremos abordar a política de remoção de elementos LFU.

LFU é uma sigla para **Least Frequently Used**, que significa, em inglês, ***"utilizado com menor frequência"***. Isso diz respeito à maneira como os elementos são removidos, isto é, o elemento removido é aquele que foi utilizado ***menos frequentemente***. Fazemos esssa decisão, pois imaginamos que, ao adicionar um novo elemento, o elemento utilizado menos frequentemente do cache tem menores chances de ser utilizado novamente.

Vamos discutir melhor como funciona essa estratégia. Imagine que você é um gerente de uma empresa, e mantém uma lista de contatos para acesso rápido. O nosso desafio, é organizar essa lista de modo que seja possível ***acessar os contatos frequentementes utilizados de modo rápido***, e, quando precisarmos adicionar outro contato nessa lista, ***excluir o elemento menos frequente***.

***

## A política LFU

Nosso cache é um conjunto de nós que possuem um contador, que registra a quantidade de vezes que esse elemento foi acessado. Para isso, podemos utilizar uma lista encadeada, que começa vazia. Para simplicidade, neste exemplo, o cache terá como capacidade máxima três elementos.

`[null]`

Do mesmo modo que fizemos com as outras políticas de cache, vamos analisar a primeira operação de busca por um objeto no nosso sistema

`get("a")` -> miss!

Como esperado, buscamos um elemento **"a"** no cache. Como não o encontramos, faremos a busca no BD, e adicionamos este elemento ao cache após encontrá-lo. Se este foi o caso, o resultado final do cache após essa primeira operação seria.

`[("a", 1)]`

Note que tivemos que realizar uma alteração na estrutura do nó, pois precisamos manter o registro da frequência desse elemento, além do conteúdo que existe nesse nó.

Vamos agora analisar outras operações de busca com resultados semelhantes:

`get("b")` -> miss!  

`get("c")` -> miss!

Novamente, faremos a busca pelos elementos no cache, como **"b"** e **"c"** não estão lá, faremos a busca no BD. Se os elementos estiverem no sistema, após concluir a busca, realizamos a adição no cache.

`[("a", 1), ("b", 1), ("c", 1)]`

Agora, faremos a busca por elementos que existem no cache:

`get("a")` -> hit!  

`get("a")` -> hit!  

`get("c")` -> hit!

Isso é ótimo, pois não precisaremos consultar a lista de todos os contatos da empresa, pois encontramos os contatos desejados na lista de contatos frequentes. Note que, quando encontramos um elemento no cache, devemos aumentar a ***frequência*** desse elemento. Dessa forma, após essas operações, o cache terá a seguinte forma:

`[("a", 3), ("b", 1), ("c", 2)]`

Tentaremos agora procurar por um elemento distinto dos que já procuramos:

`get("d")` -> miss!

Estamos na mesma situação de anteriormente, porém, não podemos simplesmente adicionar outro elemento ao cache, pois atingimos a capacidade máxima. Portanto, devemos efetuar uma remoção conforme a nossa política de cache. Nesse sentido, o elemento removido é o que possui a ***menor frequência***, e, nesse caso, seria o nó com valor **"b"**. Em seu lugar, inserimos o novo elemento procurado.

`[("a", 3), ("d", 1), ("c", 2)]`

É importante lembrar, que o nó ainda existe no banco de dados, portanto, sempre que removemos um nó do cache, devemos mudar sua frequência para 0, afinal, o elemento não existe no cache após a remoção.

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
public void get(n) {
    //TODO
}
```

**hit:** A operação custa $O(n)$, pois temos que iterar pela lista até encontrar o elemento. Após incrementar a frequência do elemento, devemos ordenar a lista, em um processo análogo à inserção ordenada. Como a lista possui tamanho $n$, e fazemos uma busca linear, seguida de uma inserção ordenada, teremos custo total $O(n)$.

**miss:** A opeação custa $O(n)$. Em nossa abordagem, escolhemos implementar o cache LFU como uma lista encadeada. Essa escolha foi intecional, porque a complexidade da adição em uma linkedlist é $O(1)$ (tempo constante). Porém, como ainda realizamos uma busca linear para procurar pelo elemento, que não estará na lista, e a lista tem tamanho n, a complexidade da busca será $O(n)$. Como sabemos, $O(n) + O(1)$ é $O(n)$.

Além disso, em casos de ***miss***, a operação possui outro agravante, pois temos que ir ao banco de dados para realizar a busca pelo elemento, que é um ***processo lento***. Entretanto, este material não leva esses fatores em conta, pois estamos discutindo aspectos isolados da política LFU.

### Possíveis otimizações

Conforme discutido nos materiais sobre as outras políticas de cache, o nosso fator limitante no custo das operações é a busca, porque sua complexidade é sempre $O(n)$. Portanto, podemos utilizar a mesma estratégia realizada nas outras políticas de cache, ou seja, utilizar outra estrutura para realizar as operações de busca, nesse caso, tabelas hash.

Com essas otimizações, o cache funciona assim: A operação get fará a busca na tabela chave-nó. Caso exista nó com essa chave, removemos o nó da tabela frequência-nó, atualizamos a frequência desse nó, e reinserimos o nó na tabela, conforme a ilustração abaixo.

//inserir ilustração...

Isso é feito, pois, ao mudar a frequência do nó, o cálculo do hash a partir da nova frequência pode causar erros de colisão.

Se o nó não está no cache, verificamos a capacidade do cache. Se o cache estiver cheio, removemos o nó com a menor frequência, e então, fazemos a adição do novo nó. Tome como exemplo, a imagem abaixo.

//inserir imagem...

Com essas otimizações, eliminamos a necessidade de manter a lista ordenada, pois conseguimos acessar um nó a partir da sua frequência. Além disso, como a complexidade da busca é reduzida a $O(1)$, pois fazemos o acesso em uma tabela hash. Portanto, a complexidade das operações do cache são $O(1)$. Note que, com essas otimizações, há ***maior consumo de memória***, porque estamos utilizando outras estruturas além da lista encadeada.

Em termos de código, temos as seguintes alterações:

```java
//TODO
```

***
