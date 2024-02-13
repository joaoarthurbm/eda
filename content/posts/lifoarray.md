+++
title = "Pilhas (LIFO) baseadas em Arrays"
date = 2019-10-25
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/fifoarray/LIFO.java"
+++

***

Neste material nós vamos estudar uma forma de implementar uma Pilha utilizando arrays.

O que define uma pilha é a sua política de acesso. Toda adição (***push/addFirst***) é feita no topo da pilha e toda remoção é feita também no topo da pilha (***pop/removeFirst***).

> Last In First Out (LIFO): O último elemento a entrar na pilha é o primeiro a sair. Para implementar essa política usamos duas operações: ***push***, que sempre adiciona no topo da pilha e ***pop***, que sempre remove do topo.


**Aplicações.** Esse tipo de estutura de dados é muito utilizado em vários contextos ... Por exemplo, o divino ctrl + z é uma aplicação de pilha. Ele desfaz a última caga que você fez, depois a penúltima e assim por diante.

A mesma coisa acontece com o botão voltar do browser, ele vai voltando pelas páginas mais recentes que você visitou. 

Você já esteve programando e se deparou com o erro StackOverflow? Pois é, isso acontece muito, por exemplo, quando desenvolvemos algoritmos recursivos e não especificamos uma condição de parada. Java utiliza uma pilha para controlar a execução de algoritmos recursivos. Como não há condição de parada, essa pilha vai sendo preenchida indefinidamente. Quando atinge o limite que java estabeleceu, ou seja, quando a pilha está cheia e não cabe mais elementos, Java lança a exceção ***java.lang.StackOverflowError***.

## Organização interna: atributos e construtor

Para fins didáticos, neste material vamos construir uma pilha baseada em um array que armazena objetos do tipo String. Naturalmente, por ser de propósito geral, as implementações de Pilha de Java permitem o armazenamento e manipulação de qualquer objeto.

```java
public class Pilha {

    private int topo;
    private String[] pilha;

    public Pilha(int capacidade) {
        this.topo = -1;
        this.pilha = new String[capacidade];
    }
    ...
}
```

Em primeiro lugar, é importante destacar o uso do atributo `topo`. Ele vai delimitar quem está no topo da pilha. Nossa pilha está entre os índices 0 e topo. Nossa classe fila é uma abstração em cima do array. Quando criamos um array de String, por exemplo, todos os elementos são null. Ele não representa nossa pilha. Nossa pilha por enquanto é vazia porque o topo é -1, uma posição inexistente no array.

## Operações

Temos duas operaçõs principais em Pilha: `push(String ele)` e `pop()`. Essas operações também podem ser nomeadas de addFirst() e removeFirst(). Faz sentido, né? Nós já decidimos que em uma pilha as adições e remoções são sempre no topo.

Direto ao ponto. Vamos entender o funcionamento de uma pilha com 3 posições simulando várias operações de `push(String element)` e `pop()`. 
 
### push

Inicialmente temos a pilha vazia:

pilha = [<font color="red">null, null, null</font>]; `topo` = -1;

Adicionando "a" na pilha (push):

pilha = [<font color="blue">"a"</font>, <font color="red">null, null</font>]; `topo` = 0;

Neste momento, o topo da pilha está no índice 1. Então, nossa pilha está destacada em azul. Tem apenas o elemento "a".

Adicionando "b" na pilha (push):

pilha = [<font color="blue">"a", "b"</font>, <font color="red">null</font>]; `topo` = 1;

"b" foi adicionado no topo da pilha. Ou seja, ***topo*** assumiu o valor 1. Abaixo de b, está o elemento "a".

Adicionando "c" na pilha (push):

fila = [<font color="blue">"a", "b", "c"</font>]; `topo` = 2;

"c" foi adicionado no topo da pilha.

#### Implementação

```java
    ...
    public boolean isEmpty() {
        return this.topo == -1;
    }

    public boolean isFull() {
        return this.topo + 1 ==  this.pilha.length;
    }
    
    public void push(String element) {
        if (isFull()) throw new RuntimeException("Pilha cheia!");
        this.pilha[++this.topo] = element;
    }
```

Primeiro vamos falar um pouquinho dos métodos que vamos utilizar em ambos, ***push*** e ***pop***. Esses métodos são: ***isEmpty***, que verifica se a pilha está vazia e ***isFull***, que verifica se a pilha está cheia. 

Ambos são simples. ***isEmpty*** verifica se o topo ainda está em -1, que é o valor inicial de quando a pilha está vazia. Por outro lado, ***isFull*** verifica se o topo está no limite do array, ou seja, não cabe mais nenhum elemento. 

Agora vamos ver o método ***push***. Super simples, né? Ele apenas verifica se a pilha já não está cheia. Se estiver, lança uma exceção alertando. 

Importante destacar que essa é uma decisão de design nossa. Decidimos não aumentar o tamanho da pilha, nem sobrescrever ninguém. Se você lembrar bem, no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/arraylist/">ArrayList</a> nós decidimos que aumentariamos a capacidade e absorveríamos o novo elemento. Já no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/fifoarray/">Fila</a>, nós decidimos que iríamos sobrescrever o primeiro elemento sempre que um novo chegasse e a fila já estivesse cheia. Eu faço assim porque gosto de explorar diferentes decisões de design enquanto estamos aprendendo :)

**Desafio.** Que tal implementar a pilha das outras duas maneiras? Quando encher, faz o resize ao invés de lançar a exceção. A outra alternativa é sobrescrever o topo quando encher.

### pop

Já vimos como funciona a adição. Suponha que agora a gente queira remover alguém da pilha. Como já estabelecemos, a política é bem clara: vamos remover o último que entrou na pilha, ou seja, quem está no topo. 

Vamos relembrar novamente o estado da nossa pilha antes do pop.

fila = [<font color="blue">"a", "b", "c"</font>]; `topo` = 2;

Então, depois de pop, a pilha fica nesse estado: 

pilha = [<font color="blue">"a", "b"</font>, <font color="red">"c"</font>]; `topo` = 1;

Preste bem atenção! A pilha não é "a", "b" e "c". A pilha é "a" e "b", com "b" no topo. A posição que está em vermelho está fora dos limites da pilha, pois quem define os limites da pilha são ***0*** e ***topo*** e eles estão em 0 e 1 respectivamente. O último "c" ficou lá por motivos de simplicidade. Isso é muito importante de ser entendido. A pilha é uma coisa, o array que é usado para montar a pilha é outra. A pilha é uma abstração que criamos em cima do array. Poderíamos ter atribuído `null` para aquela posição. Mas, como não é preciso, apenas movi topo para a posição anterior.

Pense assim para fixar. Se eu tiver quem imprimir quem está na pilha, eu vou imprimir os elementos do array que estão entre ***0*** e ***topo***, incluindo os dois.

Vamos fazer mais uma remoção da pilha (pop). A pilha ficaria nesse estado:

pilha = [<font color="blue">"a"</font>, <font color="red">"b", "c"</font>]; `topo` = 0;

Preste bem atenção! Na nossa fila agora há apenas um elemento, o "a", pois topo está em 0. Os valores "b"  e "c" que estão no array estão fora dos limites de 0 e topo e, portanto, não fazem parte da pilha.

Se invocarmos o método pop mais uma vez, a pilha fica vazia, isto é, topo assume o valor -1;

fila = [<font color="red">"a", "b", "c"</font>]; `topo` = -1;

---
**Para fixar**. Considere uma pilha inicial vazia com capacidade 4. Ilustre o estado da pilha, incluindo o valor de topo a cada operação abaixo:

* push("a")
* pop()
* push("b")
* push("c")
* push("d")
* pop()
* pop()
* pop()
* push("e")
* push("f")


---
**Lidando com a pilha cheia.** Vamos analisar a pilha abaixo:

fila = [<font color="blue">"a", "b", "c"</font>]; `topo` = 2;

Como você pode ver, a pilha está cheia. Qual seria o resultado então de uma operação ***push("d")***? Nós já decidimos que não vamos aumentar o tamanho da pilha, nem sobrescrever o topo. É só analisar o código. Uma exceção será lançada alertando que a pilha está cheia.

---
#### Análise de eficência

1. push

Como vimos, push é simples. Basta aumentar ***topo*** (topo =+ 1) e adicionar o novo valor. Ou seja, O(1).

2. pop

Nossa estratégia de remoção foi simplesmente diminuir o tamanho do topo, ou seja, também é uma operação O(1).

***

## Onde encontro isso na biblioteca padrão?

> Não use a classe Stack de Java.

Em java, se você quiser usar uma implementação de Pilha que seja baseada em arrays, deve usar a class <a class="external" href="https://docs.oracle.com/javase/8/docs/api/java/util/ArrayDeque.html">ArrayDeque</a>. 

Tem dois detalhes a serem discutidos. O primeiro é que na implementação de Java a pilha é *resizable*, ou seja, não lança exceção quando atinge o limite inicial da pilha, mas aumenta sua capacidade. A outra é que essa classe pode ser usada tanto para servir como uma pilha, como fila. Se você analisar bem a api, vai ver que todos os métodos para isso estão lá: addFirst, addLast, removeFirst, removeLast etc. A depender de como você usar esses métodos, você tem uma pilha ou uma fila.






