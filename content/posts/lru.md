+++
title = "Least Recently Used (LRU)"
date = 2026-07-16
github = "https://github.com/nettoluis/eda-implementacoes" 
tags = []
categories = []
+++
---

# Introdução
Continuando a nossa discussão sobre as políticas de *cache eviction*, vimos que a política FIFO nem sempre é a mais adequada (como tudo na vida), por isso surgiram outras políticas como a que vamos discutir hoje: **Least Recently Used (LRU)**.

## Contextualização
Lembre do período de vestibular em que você tinha que otimizar seu tempo de estudos. Imagine que sua mesa comporta apenas três livros por vez, mas é mais rápida de acessar, e você tem uma estante que comporta todos os seus livros, mas você tem preguiça de ir até ela buscar seus livros. Agora, analisemos a seguinte sequência de fatos:

A tabela a seguir está organizada do livro mais recentemente utilizado (à direita) para o menos recentemente utilizado (à esquerda).[^1]

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

[^1]: A escolha de mover o nó para o *tail* é totalmente arbitrária. Na literatura, é extremamente comum que o nó seja movido para o head, mas, por questões de didática, escolhemos mover para o *tail*

## LRU vs FIFO
Uma dúvida que pode surgir é: Professor, qual a diferença entre LRU e FIFO? E o pequeno detalhe é que na FIFO o elemento que sai é o mais antigo a ser **adicionado** enquanto no LRU é o mais antigo a ser **acessado**. Para fixar a diferença, basta relembrarmos dos exemplos dos livros na mesa, caso a política de cache fosse FIFO, o de Matemática deveria sair, já se fosse LRU, o de História deveria sair.

---
# Estruturas de dados necessárias
Saindo do mundo das ideias e partindo para a implementação, precisamos nos perguntar duas coisas importantes: Como atualizar rapidamente a ordem de acesso? Como localizar rapidamente um elemento?

1. A estrutura para manter a ordem de acesso dos dados, geralmente, é uma **Lista Duplamente Ligada** com o *tail* armazenando o nó **mais recentemente acessado** e o *head* o **menos recentemente acessado**.
2. A estrutura não só para verificarmos a existência desse dado em cache, como também para acessar uma referêcia para seu nó, geralmente, é um **HashMap** em que a chave é o valor do nó e o valor é o próprio nó.

E por que a implementação mais comum utiliza essas duas? Bem, uma das características fundamentais do cache é que ele seja uma memória de acesso rápido, de preferência constante, certo? 

>Com a **Lista Duplamente Ligada** nós podemos mover um nó em uma posição arbitrária para o *tail* em tempo constante através de trocas de referências e com o **HashMap** nós podemos tanto verificar se ele está em cache quanto acessá-lo diretamente, ambos em tempo constante.

# Métodos

Descendo mais uma camada de abstração, partiremos para o código de fato. Assim, vamos entender, na prática, o porquê precisamos de mais de uma estrutura de dados para mantermos as operações o mais eficiente possível.

Para facilitar nossa vida, vamos trabalhar com Strings, mas o cache poderia armazenar qualquer tipo de objeto, lembrem-se disso.

## Implementação mais simples (sem HashMap)
Nessa implementação, teremos apenas uma **Lista Duplamente Ligada** para realizar nossas operações.

### Atributos e construtor

```java
class LRU {
    private static final CAPACITY_DEFAULT = 10;
    private LinkedList cache;
    private int capacity;

    public LRU() {
        this.capacity = CAPACITY_DEFAULT;
        this.cache = new LinkedList();
    }

    public LRU(int capacity) {
        this.capacity = capacity;
        this.cache = new LinkedList();
    }
    ...
}
```

Como já dito em outros momentos, não há uma regra ou nada do tipo que defina rigorosamente qual deva ser a capacidade padrão de um cache, mas para facilitar nossa vida, escolheremos 10 como a convenção para nossa implementação.

### Get
Como faremos para buscar os elementos? Como não temos nenhuma outra estrutura auxiliar e a nossa lista estará ordenada pela ordem de acesso, a nossa melhor solução seria percorrer toda a lista buscando o elemento. Além disso, temos de lembrar de mover o elemento, caso ele exista, para o *tail* da lista. 

Assim, dentro da nossa classe **LinkedList** teremos dois métodos para nos auxiliar: o **search()** e o **moveToTail()**, os quais estão descritos abaixo.

```java
...
public Node search(String value) {
    if (isEmpty()) return null;

    Node aux = this.root;
    while (aux != null && !aux.value.equals(value))
        aux = aux.next;

    return aux;
}

public void moveToTail(Node node) {
    if (node == this.tail || node == null) return;

    if (node == this.head) {
        this.head = node.next;
        this.head.prev = null;
    } else {
        node.next.prev = node.prev;
        node.prev.next = node.next;
    }

    this.tail.next = node;
    node.prev = this.tail;
    this.tail = node;
    node.next = null;
}
...
```

Por outro lado, dentro da classe **LRU**, o método **get(String value)** será quem vai realizar essa tarefa de buscar o elemento na lista e movê-lo, caso exista, para o *tail*. Caso ele não encontre o valor procurado, será retornado null. 

```java
...
public String get(String value) {
    Node node = this.cache.search(value);

    if (node == null) return null;

    this.cache.moveToTail(node);
    return node.value;
}
...
```

Note que, por conta de termos apenas uma LinkedList, precisamos sempre percorrer a lista para poder tomar alguma decisão dentro do cache e isso, num cenário em que queremos velocidade, é extremamente ruim. Se toda vez que quisermos acessar algum elemento do cache o custo for $O(n)$, em muitos cenários, isso seria tão ruim quanto não ter cache nenhum.

### Put
Agora, como faremos para colocar um elemento no cache? Teremos que tomar cuidado com 3 cenários possíveis que poderão acontecer ao tentar fazer isso:

1. O elemento já existe dentro do cache. Para isso, teremos que fazer uma busca dentro da lista procurando esse valor. Caso seja encontrado, o nó será movido para o final da lista.

2. O cache está com capacidade máxima. Para garantir que mesmo sem espaço o novo elemento seja adicionado teremos que remover o elemento **menos recentemente utilizado**, ou seja, o *head* da nossa lista. Assim, basta adicionarmos ao final dela.

3. O elemento não existe dentro do cache. Esse é o caso mais simples, porque basta eu adicionar um novo elemento ao final da lista. Perceba que, ao fazer isso, ele já estará respeitando a política que estamos implementando.

```java
public void put(String value) {
    Node node = this.cache.search(value);

    if (node != null) {
        this.cache.moveToTail(node);

    } else if (isFull()) {
        this.cache.removeFirst();
        this.cache.addLast(value);

    } else {
        this.cache.addLast(value);
    }
}
```

Caímos novamente no impasse do custo. Tanto o método **get()** quanto o **put()** tem custo $O(n)$ quando chamados. Como estamos trabalhando apenas com um cache que armazena 10 elementos, isso não chega a ser um problema muito grande. Mas e se estivermos trabalhando com um cache que armazena centenas a milhares de elementos? Talvez até milhões. O que faríamos?

Vejamos como podemos subir o sarrafo e tornar o desempenho muito melhor no bloco a seguir.


## Implementação otimizada (com HashMap)

### Get

### Put


---
# Resumo

- A política de *cache eviction* do LRU é baseado na ordem de acesso.
- A implementação mais comum utiliza **Lista Duplamente Encadeada** juntamente com **HashMap** para manter as operações com desempenho $O(1)$.

# Curiosidade
Por fim, vale citar que o algoritmo que estudamos hoje é normalmente o critério de desempate implementado na próxima política de ***cache eviction*** que estudaremos: **Least Frequently Used (LFU)**.

# Contribuições
[Luis Netto](https://github.com/nettoluis/) e [Gustavo Paulino](https://github.com/gustavop-fausto/) contribuíram para esse material.


# Notas de Rodapé
