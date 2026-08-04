+++
title = "Política de Cache LFU"
date = 2026-07-14
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/tree/master/java/src/cache"
+++

***

A essa altura, já compreendemos que o cache é uma ***memória rápida, com capacidade limitada***. Por isso, devemos remover elementos sempre que a memória estiver cheia. Além disso, sabemos que boas políticas de cache *eviction* **minimizam as taxas de erro** e **maximizam as taxas de acerto**. Nesse contexto, iremos abordar a política de remoção de elementos LFU.

LFU é uma sigla para **Least Frequently Used**, que significa, em inglês, ***"utilizado com menor frequência"***. Isso diz respeito à maneira como os elementos são removidos, isto é, o elemento removido é aquele que foi utilizado ***menos frequentemente***. Fazemos essa decisão, pois imaginamos que, ao adicionar um novo elemento, os elementos utilizados com menor frequência no cache, provavelmente, não serão utilizados novamente.

Vamos discutir melhor como funciona essa estratégia. Você certamente já usou um browser para acessar conteúdos na internet. Certamente, você acessa alguns sites várias vezes ao longo do dia, e seria desejável manter um conjunto de páginas ***frequentemente utilizadas***, por exemplo, alguns materiais dessa disciplina. Além disso, quando alguma página que não está nessa lista for acessada repetidamente, esta deve substituir o site ***menos frequentemente acessado*** da lista.
***

## A política LFU

Nosso cache é um conjunto de nós, que possuem um contador, responsável por registrar a quantidade de vezes que esse elemento foi acessado. Para isso, podemos utilizar uma lista encadeada, que começa vazia. Para simplicidade, neste exemplo, o cache possui, no máximo, três nós.

`[null]`

Do mesmo modo que fizemos com as outras políticas de cache, vamos analisar a primeira operação de busca por um objeto no nosso sistema.

`get("a")` -> miss!

Como esperado, buscamos um nó cujo valor é o elemento **"a"**, no cache, e não o encontramos, pois o cache está vazio. Como não encontramos um nó com este elemento, fazemos a busca no banco de dados (BD), e, após encontrá-lo, adicionamos um nó, que representa esse elemento, ao cache. Se este foi o caso, o cache, depois dessa operação, possui a seguinte forma.

`[("a", 1)]`

Note que tivemos que realizar uma alteração na estrutura do nó, comparado à política LRU, pois precisamos manter o registro da frequência desse elemento, além do conteúdo que existe nesse nó.

Agora, vamos analisar outras operações de busca com resultados semelhantes:

`get("b")` -> miss!  

`get("c")` -> miss!

Novamente, fazemos a busca pelos elementos no cache. Como não existem nós que contêm os elementos **"b"** e **"c"**, buscamos estes elementos no banco de dados. Se os elementos estiverem no BD, após concluir a busca, realizamos a adição no cache.

`[("a", 1), ("b", 1), ("c", 1)]`

Agora, buscamos elementos que existem no cache:

`get("a")` -> hit!  

`get("a")` -> hit!  

`get("c")` -> hit!

Isso é ótimo, pois não precisamos utilizar ferramentas de busca para encontrar o site desejado, porque podemos encontrá-lo na lista de acessos frequentes. Note que, quando encontramos um elemento em algum nó do cache, devemos aumentar a ***frequência*** do nó. Dessa forma, após essas operações, o cache terá a seguinte forma:

`[("a", 3), ("c", 2), ("b", 1)]`

Dessa vez, procuramos um elemento distinto daqueles utilizados nos casos anteriores:

`get("d")` -> miss!

Estamos na mesma situação de busca por um elemento cujo nó não existe no cache. Porém, não podemos simplesmente adicionar outro elemento ao cache, pois atingimos a capacidade máxima. Portanto, devemos efetuar uma remoção conforme a nossa política de cache. Nesse sentido, o nó removido é o que possui a ***menor frequência*** e, nesse caso, seria o nó com valor **"b"**. Em seu lugar, inserimos o novo elemento procurado.

`[("a", 3), ("c", 2), ("d", 1)]`

É importante lembrar que, ao remover o nó, apagamos apenas o objeto que representa o elemento no cache. Se esse elemento fosse adicionado ao cache novamente, um novo nó, que possui frequência igual a 1, será criado.

Tentar resolver o quiz abaixo pode auxiliar no seu entendimento sobre o assunto.

***

{{%quiz operacoes_em_cache%}}
{{< item question="Qual é o estado final do cache após realizar as operações expostas acima, respectivamente? Considere que a capacidade do cache é 3" answers="3" choices=" [(a : 3) | (b : 2) | (c : 1)], [(a : 3) | (b : 2) | (d : 1)], [(a : 3) | (b : 2) | (e : 1)], [(b : 2) | (c : 1) | (d : 1)], [(c : 1) | (d : 1) | (e : 1)]">}}
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

{{< item question="Considere o cache de capacidade máxima igual a 5: [(a : 80) | (b : 59) | (c : 10) | (d : 1)]. Qual é o próximo nó que será removido do cache?" answers="5" choices="(a : 80),(b : 59),(c : 10),(d : 1),Nenhum; pois o cache não está cheio">}}

{{% /quiz %}}

***

## Implementação dos métodos básicos

Como discutimos na seção anterior, a estrutura do nó sofrerá algumas alterações por conta do funcionamento da nossa política. Em particular, o nó armazena a frequência de acessos durante seu tempo de vida, no cache, além do valor que representa este elemento.

```java
class Node {
    private Node prev;
    private Node next;
    String value;
    int frequency;

    public Node(String value) {
        this.prev = null;
        this.next = null;
        this.value = value;
        this.frequency = 1;
    }
}
```

Quanto ao método básico `get("String value")`, o processo é simples. Fazemos uma busca linear na lista encadeada, procurando o nó que contém o elemento.

```java
public class LinkedList { 
    ...
    public Node getNode(String value) {
        Node aux = this.head;
        while (aux != null) {
            if (aux.value.equals(value))
                return aux;
            aux = aux.next;
        }
    }
}
```

Após essa busca, devemos verificar se o nó foi encontrado e, se é necessário remover o elemento menos frequente.

```java
public class LFUCache {
    private LinkedList cache;
    private int capacidade;

    public LFUCache(int capacidade) {
        this.cache = new LinkedList();
        this.capacidade = capacidade;
    }

    public String get(String value) {
        Node toSearch = cache.getNode(value);

        if (toSearch != null) {
            toSearch.frequency += 1;
            cache.sortByFrequency(toSearch);
            return toSearch.value;

        } else if (this.isFull()) {
            cache.removeLast();
        }

        cache.addLast(value);
        return null;
    }

    public boolean isFull() {
        return cache.size() == capacidade;
    }
}
```

Observe que, quando um elemento é adicionado, devemos ordenar a lista por frequência. Um modo eficiente de realizar esse processo, é utilizando uma inserção ordenada.

```java
public class LFUCache {
    public void sortByFrequency(Node node) {
        Node aux = node.next;

        while (aux != null && node.frequency > aux.frequency) {
            node.next = aux.next;
            aux.prev = node.prev;

            aux.next = node;
            node.prev = aux;

            if (node == this.head && aux == this.tail) {
                this.head = aux;
                this.tail = node;

            } else if (node == this.head) {
                node.next.prev = node;
                this.head = aux;

            } else if (aux == this.tail) {
                aux.prev.next = aux;
                this.tail = node;

            } else {
                node.next.prev = node;
                aux.prev.next = aux;
            }

            aux = aux.next;
        }
    }
}
```

Nas seções seguintes, discutiremos a eficiência do cache, conforme este modelo, e apresentaremos uma otimização possível para o cache.

***

## Sobre a eficiência das operações

Utilizando o método ```get(String value)``` apresentado anteriormente, analisaremos a política sob a perspectiva da complexidade de tempo, em casos.

**hit:** A operação custa $O(n)$, pois iteramos pela lista até encontrar o elemento. Após incrementar a frequência do nó, devemos ordenar a lista, em um processo análogo à inserção ordenada. Como a lista possui tamanho $n$ e realizamos uma busca linear, seguida de uma inserção ordenada, a operação possui custo total $O(n)$.

**miss:** A operação custa $O(n)$. Em nossa abordagem, escolhemos implementar o cache LFU como uma lista encadeada. Essa escolha foi intencional, porque a complexidade da adição em uma linkedlist é $O(1)$ (tempo constante). Porém, como ainda realizamos uma busca linear para procurar pelo elemento, que não estará na lista, e, a lista tem tamanho $n$, a complexidade da busca será $O(n)$. Como sabemos, $O(n) + O(1)$ é $O(n)$, logo, o custo total da operação é $O(n)$.

Além disso, em casos de ***miss***, a operação possui outro agravante, pois fazemos uma busca pelo elemento no banco de dados, que é um ***processo lento***. Entretanto, este material não leva esses fatores em conta, pois estamos discutindo aspectos isolados da política LFU.

## Otimização com EDAs auxiliares 

Conforme discutido nos materiais sobre as outras políticas de cache, o nosso fator limitante no custo das operações é a busca, porque sua complexidade é sempre $O(n)$. Portanto, podemos empregar a mesma estratégia realizada nas outras políticas de cache, ou seja, usar outras estruturas para realizar as operações de busca, nesse caso, as tabelas hash.

Com essas mudanças, nosso cache será composto por duas tabelas hash, uma responsável por vincular uma chave a um nó, permitindo a busca em tempo **$O(1)$**, e a outra mapeia as frequências de cada nó a um conjunto de nós existentes no cache.

Para os exemplos seguintes, assumimos o cache de tamanho 4, representado nesta imagem.

<figure style="align: center; width: 90%"> 
    <img src="cache-inicial.png">
</figure>

O funcionamento do cache ocorre da seguinte forma: Ao realizar uma operação get, a busca por um nó que contém o elemento desejado é feita na tabela chave-nó. A partir do resultado dessa busca, o algoritmo divide-se em casos, que dependem do tamanho atual do cache.

---

**Caso o elemento não possui nó existente no cache:** verificamos a capacidade do cache. **Se o cache possui espaço livre**, adicionamos um novo nó que contém este elemento na tabela chave-nó, e na lista de frequência 1 na tabela frequência-lista. Nesse caso, adicionamos o nó com valor **"d"**.

| Frequência | Lista |
| :---: | :---: |
| 3 | [("a")] |
| 2 | [("b")] |
| 1 | [("c"), ("d")] |

**Se a busca encontrou um nó que contém o elemento:** devemos remover o nó da lista em que está contido. Em seguida, atualizamos sua frequência, e faremos sua inserção na nova lista de frequências. Nesse caso, fizemos uma busca pelo elemento "c", e achamos um nó com esse valor. Como a frequência desse nó era igual a um, após o incremento, devemos ter um nó na lista vinculada à frequência com valor igual a 2.

| Frequência | Lista |
| :---: | :---: |
| 3 | [("a")] |
| 2 | [("b"), ("c")] |
| 1 | [("d")] |

**Caso o nó encontrado pela busca seja o mais frequente do cache:** criamos uma nova lista para armazenar os nós que possuem a frequência máxima, e repetimos o procedimento feito quando um nó é encontrado. Isto é, removemos o nó, atualizamos sua frequência e inserimos este nó na lista correspondente. No caso abaixo, o nó encontrado possui valor "a" e frequência 3, que era a maior registrada no cache.

| Frequência | Lista |
| :---: | :---: |
| 4 | [("a")] |
| 2 | [("b"), ("c")] |
| 1 | [("d")] |

**Se o nó não foi encontrado e o cache está cheio:** devemos remover, conforme a nossa implementação, o nó da lista de menor frequência. Após isso, adicionamos o novo nó às tabelas. Nesse caso, removemos o nó com elemento "d" e adicionamos o nó com elemento "e".

| Frequência | Lista |
| :---: | :---: |
| 4 | [("a")] |
| 2 | [("b"), ("c")] |
| 1 | [("e")] |

**Se existir mais de um nó na lista de menor frequência:** nesse caso, podemos utilizar outra política de remoção de cache como critério de desempate. No nosso material, a abordagem escolhida foi a LRU e, conforme discutido anteriormente na disciplina, o nó removido será sempre o primeiro da lista.

| Frequência | Lista |
| :---: | :---: |
| 4 | [("a")] |
| 3 | [("e")] |
| 2 | [("b"), ("c")] |

Nessa visualização do cache, temos os nós ("b") e ("c") empatados quanto à frequência. Como o nó ("b") foi utilizado menos recentemente que o nó ("c"), o nó removido será aquele que contém o valor "b". Se uma operação get("d") fosse realizada, por exemplo, temos o seguinte resultado.

| Frequência | Lista |
| :---: | :---: |
| 4 | [("a")] |
| 3 | [("e")] |
| 2 | [("c")] |
| 1 | [("d")] |

Além disso, se uma lista estiver vazia após atualizar a frequência de algum nó, ou, após alguma expulsão do cache, a frequência (chave) que aponta para essa lista deve ser removida da tabela. Isto é, se uma lista estiver vazia, ela será apagada da tabela.

---

Com essas otimizações, eliminamos a necessidade de manter a lista ordenada, pois conseguimos acessar um nó a partir da sua frequência. Além disso, a complexidade de todas as operações de cache são $O(1)$, pois o tempo de complexidade da busca, que era o fator mais custoso do nosso cache, foi reduzido para $O(1)$. Note que, com essas otimizações, há ***maior consumo de memória***, porque utilizamos outras estruturas além da lista encadeada.


## Implementação otimizada do cache

Como nossos nós serão acessados por chaves, temos que realizar uma alteração na sua estrutura. Em específico, o nó possui um atributo **chave**, que será imutável após a inicialização do objeto.

```java
class Node {
    Node prev;
    Node next;
    String value;
    int frequency;
    int key;

    public Node(int key, String value) {
        this.prev = null;
        this.next = null;
        this.key = key;
        this.frequency = 1;
        this.value = value;
    }
}
```

Quanto aos atributos do cache, sabemos que ele não é representado apenas por uma lista encadeada. Em vez disso, temos duas tabelas hash, uma que realiza a ligação chave-nó, e a outra frequência-lista. Além disso, adicionamos um atributo que registra a menor frequência do cache, para evitar buscas lineares que fariam esse mesmo papel.
 
```java
public class LFUCache {
    private int capacity;
    private Map<Integer, Node> keyToNode;
    private Map<Integer, DoublyLinkedList> freqToList;
    private int minFreq;

    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.keyToNode = new HashMap<>();
        this.freqToList = new HashMap<>();
        this.minFreq = 0;
    }
}
```

Por conta das novas estruturas utilizadas para representar o cache, criamos os métodos públicos `put(int key, String value)` para inserir elementos no cache, e `get(int key)` para acessá-los.

```java
public void put(int key, String value) {
    Node node = keyToNode.get(key);

    if (node != null) {
        node.value = value;
        updateFreq(node);
        return;

    }

    if (keyToNode.size() >= this.capacity) {
        DoublyLinkedList list = freqToList.get(minFreq);
        Node evicted = list.removeLast();

        if (evicted != null) 
            keyToNode.remove(evicted.key);
    }

    node = new Node(key, value);

    keyToNode.put(key, node);
    getOrCreateList(1).add(node);
    minFreq = 1;
}

public String get(int key) {
    Node node = keyToNode.get(key);

    if (node == null) return null;

    updateFreq(node);

    return node.value;

}
```

Note que precisamos de alguns métodos privados para atualizar a frequência do nó, e, para facilitar a adição de novos elementos, caso não haja outros nós registrados com a sua nova frequência. Portanto, criamos os métodos `updateFreq(Node node)` e `getOrCreateList(int freq)`.

```java
    private DoublyLinkedList getOrCreateList(int freq) {
        DoublyLinkedList list = freqToList.get(freq);

        if (list == null) {
            list = new DoublyLinkedList();
            freqToList.put(freq, list);
        }

        return list;
    }

    private void updateFreq(Node node) {
        DoublyLinkedList oldList = freqToList.get(node.freq);
        oldList.remove(node);

        if (oldList.size == 0) {
            if (node.freq == minFreq) minFreq++;

            freqToList.remove(node.freq);
        }

        node.freq++;
        getOrCreateList(node.freq).add(node);
    }
```
***

## Considerações Finais

É raro encontrar o uso isolado da política de cache LFU, pois um objeto na memória pode ser utilizado repetidamente em um curto período de tempo, e permanecer inativo por um longo intervalo. Isso provoca a expulsão indesejada de novos itens do cache, pois foram acessados muito menos frequentemente que outros.

Existem muitas variações da política LFU, pois, conforme mencionado anteriormente, essa política não leva em conta o intervalo entre acessos a um item do cache. De uma maneira geral, essas variações buscam solucionar esse problema.

A implementação otimizada que usamos neste material é, mais precisamente, a polítca ***LFRU***, ou ***Least Frequently Recently Use***. Esta política é, na verdade, uma combinação dos algoritmos LRU e LFU, que soluciona o problema causado por acessos repetidos a um item, que é geralmente inativo, em curtos intervalos de tempo.
