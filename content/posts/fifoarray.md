+++
title = "Filas (FIFO) baseadas em Arrays"
date = 2019-10-25
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/fifoarray/FIFOArray.java"
+++

***

Neste material nós vamos estudar uma forma de implementar uma FILA utilizando arrays.

**Disclaimer.** Este material tem muita interseção com o material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/arraylist/">ArrayList</a>, que eu sugiro que seja lido antes. Não poderia ser diferente, pois estamos falando de aplicações de arrays para resolver problemas de armazenamento e acesso a dados. Todavia, há uma diferença importante entre os dois materiais. Lá no material sobre ArrayList, quando a capacidade do array é atingida, nós fazemos *resize* para poder acomodar novos elementos. Aqui não. Nossa estratégia vai ser manter sempre o tamanho original do array. Portanto, se um novo elemento tiver que ser adicionado e a fila estiver cheia, vamos sobrescrever o elemento mais antigo. 

Essa não é uma característica particular de Fila. Eu só tomei essa decisão para poder explorar as duas formas: aumentando o tamanho e mantendo o tamanho fixo. Você pode, naturalmente, desenvolver sua fila aumentando a capacidade dela quando precisar. Consulte como isso é feito no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/arraylist/">ArrayList</a>.

O que define a fila é sua política de acesso. Toda adição é feita no final da fila (***addLast***) e toda remoção é no início da fila (***removeFirst***). Essas são as duas operações que implementa a política First In First Out (FIFO).


> First In First Out (FIFO): O primeiro elemento a entrar na fila é o primeiro a sair. Para implementar essa política usamos duas operações: ***addLast***, que sempre adiciona no final (***tail***) da fila e ***removeFirst***, que sempre remove do início (***head***) da fila. 

## Organização interna: atributos e construtores

Para fins didáticos, neste material vamos construir uma fila baseada em um array que armazena objetos do tipo String. Naturalmente, por ser de propósito geral, as implementações de Fila de Java permitem o armazenamento e manipulação de qualquer objeto.

```java
public class FIFOArray {

    private String[] fila;
    private int head;
    private int tail;
    private int size;
    
    public FIFOArray(int capacidade) {
        this.lista = new String[capacidade];
        this.head = -1;
        this.tail = -1;
        this.size = 0;
    }
    ...
}
```

Em primeiro lugar, é importante destacar o uso de dois atributos: `head` e `tail`. Esses atributos representam os índices do array que delimitam os valores que estão na fila. Nossa classe fila é uma abstração em cima do array. Quando criamos um array de String, por exemplo, todos os elementos são null. Ele não representa nossa fila. Nossa fila, ao ser criada, está entre ***head*** e ***tail***, inclusos. Nesse caso, como eles estão em -1 na inicialização, nossa fila está vazia. 

## Operações

Temos duas operaçõs principais em Fila: `addLast(String ele)` e `removeFirst()`. Faz sentido, né? Nós já decidimos que em uma fila as adições são no final e as remoções são no início. E apenas isso. 

Direto ao ponto. Vamos entender o funcionamento de uma fila com 3 posições simulando várias operações de `addLast(String element)` e `removeFirst()`. 
 
Inicialmente temos a fila vazia:

fila = [<font color="red">null, null, null</font>]; `head` = -1, `tail` = -1;

Adicionando "a" no fim da fila (addLast):

fila = [<font color="blue">"a"</font>, <font color="red">null, null</font>]; `head` = 0, `tail` = 0;

Neste momento, o início (***head***) e o fim (***tail***) da fila estão apontando para o mesmo índice do array, isto é, 0. Então, nossa fila está destacada em azul. Tem apenas o elemento "a".

Adicionando "b" no fim da fila (addLast):

fila = [<font color="blue">"a", "b"</font>, <font color="red">null</font>]; `head` = 0, `tail` = 1;

"b" foi adicionado no fim da fila. Ou seja, ***head*** continua no índice 0, mas ***tail*** andou uma posição e agora está no índice 1. "a" está no início da fila e "b" está no fim da fila.

Adicionando "c" no fim da fila (addLast):

fila = [<font color="blue">"a", "b", "c"</font>]; `head` = 0, `tail` = 2;

"c" foi adicionado no fim da fila. Ou seja, ***head*** continua no índice 0, mas ***tail*** andou uma posição e agora está no índice 2. "a" está no início da fila e "c" está no fim da fila.

Já vimos como funciona a adição. Suponha que agora a gente queira remover alguém da fila. Como já estabelecemos, a política é bem clara: vamos remover o primeiro que entrou na fila, ou seja, o elemento "a". 

### Remoção com shift

Nossa primeira abordagem será fazer o **shiftLeft** de todo mundo e diminuir o índice de tail, pois a fila diminuiu e liberou um espaço no final. Então, depois de um removeFirst, a fila fica nesse estado: 

fila = [<font color="blue">"b", "c"</font>, <font color="red">"c"</font>]; `head` = 0, `tail` = 1;

Preste bem atenção! A fila não é "b", "c", "c". A fila é "b" e "c". A posição que está em vermelho está fora dos limites da fila, pois quem define os limites da fila são ***head*** e ***tail*** e eles estão em 0 e 1 respectivamente. O último "c" ficou lá por motivos de simplicidade. Isso é muito importante de ser entendido. A fila é uma coisa, o array que é usado para montar a fila é outra. A fila é uma abstração que criamos em cima do array. Poderíamos ter atribuído `null` para aquela posição. Mas, como não é preciso, apenas movi tail para a posição anterior.

Pense assim para fixar. Se eu tiver quem imprimir quem está na fila, eu vou imprimir os elementos do array que estão entre ***head*** e ***tail***, incluindo os dois.

Importante aqui é você entender como shiftLeft é feito. Isso é visto em detalhes no material de [ArrayList](https://joaoarthurbm.github.io/eda/posts/arraylist/). Em linhas gerais, nós vamos afastando todo mundo para a esquerda. Dessa forma, removemos o início da fila, que é substiuido pelo valor à frente, que por sua vez é substituído pelo valor à frente e assim por diante. Vou deixar o código aqui para consulta:

```java
    // importante lembrar de diminuir tail depois da chamada deste
    // método. Este controle é feito no método removeFirst()
    private void shiftLeft(int index) {
        for (int i = index; i < this.tail - 1; i++) {
            this.fila[i] = this.fila[i+1];
        }
    }
```
No caso da fila, sempre invocamos o método shiftLeft passando o índice 0, pois sempre removemos do início da fila.

Vamos fazer mais uma remoção da fila (removeFirst). A fila ficaria nesse estado:

fila = [<font color="blue">"c"</font>, <font color="red">"c", "c"</font>]; `head` = 0, `tail` = 0;


Preste bem atenção! Na nossa fila agora há apenas um elemento, o "c", pois head e tail estão apontando para o índice 0. Os "c"s adicionais no array estão fora dos limites de head e tail e, portanto, não fazem parte da fila.

Se invocarmos o método removeFirst mais uma vez, a fila fica vazia, isto é, head e tail assumem valor -1;

fila = [<font color="red">"c", "c", "c"</font>]; `head` = -1, `tail` = -1;

---
**Para fixar**. Considere uma fila inicial vazia com capacidade 4. Ilustre o estado da fila, incluindo os valores de head e tail a cada operação abaixo:

* addLast("a")
* removeFirst()
* addLast("b")
* addLast("c")
* addLast("d")
* addLast("e")
* removeFirst()
* removeFirst()
* removeFirst()
* removeFirst()


---
**Lidando com a fila cheia.** Vamos analisar a fila abaixo:

fila = [<font color="blue">"a", "b", "c"</font>]; `head` = 0, `tail` = 2;

Como você pode ver, a fila está cheia. Qual seria o resultado então de uma operação ***addLast("d")***? Nós já decidimos que vamos sobrescrever o mais antigo da fila, ou seja, quem está no início (***head***) da fila.

Nós já sabemos fazer isso. Basta fazer o shiftLeft e adicionar o novo elemento no final da fila. Vamos acompanhar o estado da fila durante a operação. Primeiro, fazemos o shiftLeft e ela fica assim:

fila = [<font color="blue">"b", "c"</font>, <font color="red">"c"</font>]; `head` = 0, `tail` = 1;

Agora sim adicionamos o novo elemento:

fila = [<font color="blue">"b", "c", "d"</font>]; `head` = 0, `tail` = 2;

---
#### Análise de eficência

1. addLast

Como vimos, addLast é simples. Basta aumentar ***tail*** (tail =+ 1). Contudo, se a fila já estiver cheia, precisamos fazer o ***shiftLeft***, que é O(n). Então, no pior caso, essa operação é O(n).

2. removeFirst

Nossa estratégia de remoção foi fazer o shift de todo mundo para a esquerda. Esse algoritmo, naturalmente, é O(n), pois precisamos percorrer toda a fila atribuindo a v[i] o valor de v[i+1], com ir partindo de 0 até `tail - 1`.


### Remoção em O(1), mantendo uma fila circular

E seu eu disser que dá para adicionar no final e remover do início da fila sem necessariamente precisar fazer o shift? É um pouquinho mais complicado, mas a gente entende. 

Em linhas gerais, remover o início da fila deveria ser apenas fazer `head = head + 1`, certo? Ou seja, em O(1). Mas e porque é complicado? Porque fazendo isso, nós liberamos uma posição anterior a `head` que poderia ser usada para uma nova adição. Como fazer para `tail` assumir essa nova posição quando for adicionado um elemento? Utilizando a operação de resto da divisão pelo tamanho da fila (`%`). Vamos montar um exemplo para ficar claro.

Vamos novamente agora encher a fila, adicionando 3 elementos, "a", "b" e "c". Então, vamos ter o seguinte estado:

fila = [<font color="blue">"a", "b", "c"</font>]; `head` = 0, `tail` = 2;

Agora, suponha que eu queira remover o início da fila sem o ***shiftLeft***. Basta fazer `head = head + 1`. Temos uma fila com esse estado após a execução de removeFirst():

fila = [<font color="red">"a"</font>, <font color="blue">"b", "c"</font>]; `head` = 1, `tail` = 2;

Perceba que a fila vai do índice 1 até o índice 2, valores de `head` e `tail`. Ou seja, nossa fila é "b" e "c".

Agora vem o pulo do gato. Se eu quiser adicionar um novo elemento, eu tenho espaço liver (índice 0), certo? Só que eu não quero fazer o shift de todo mundo para a esquerda porque é O(n). Eu vou adicionar esse novo elemento na posição `(tail + 1) % fila.length`, isto é, (2 + 1) % 3 = 0.

Ou seja, na posição à frente de tail. Se essa posição for acima do limite do array, que é o nosso caso, ela passa a ser contada do início do array por causa da operação `%`.

É importante que você entenda isso: `(tail+1) % capacidade` sempre vai cair dentro dos limites do array por causa da operação de resto de divisão. No nosso caso, o novo elemento, "d", seria adicionado na posição (2 + 1) % 3, que é 0. A fila ficaria:

fila = [<font color="blue">"d", "b", "c"</font>]; `head` = 1, `tail` = 0;


Note que `head` está no índice 1 (elemento "b") e `tail` está no índice 0 (elemento "d"). Nossa fila é "b", "c" e "d", nessa ordem.

Vamos agora invocar o método removeFirst, nesse caso, `head` iria para `(head + 1)%fila.length`, ou seja, 2. A fila ficaria:

fila = [<font color="blue">"d"</font>, <font color="red">"b"</font> <font color="blue">"c"</font>]; `head` = 2, `tail` = 0;

Nossa fila seria "c" e "d".

Perceba que estamos tratando o array de forma circular. Dessa maneira, não precisamos fazer shift, apenas termos sempre cuidado de usar o `% fila.length` nas operações.

### Implementação

```java
    public void addLast(String element) {
        // toda adição deve aumentar o número de elementos, exceto
        // se já estiver cheio.
        if (!isFull())
            this.size += 1;
    
        // na primeira adição, ambos vão para o índice 0.
        if (isEmpty())
            this.head = 0;
        
        // se já tiver cheio, precisamos andar com head para liberar o espaço;
        // e não acrescentamos em size porque não houve aumento de elementos.
        if (isFull())
            this.head += 1 % this.tail;
        
        // incrementa tail e adiciona o novo elemento
        this.tail = (this.tail + 1) % this.fila.length;
        this.fila[tail] = element;
    }
```

```java
    public String removeFirst() {
        // se estiver vazia, não há elemento
        if (isEmpty()) throw new NoSuchElementException();
        
        // recupera o elemento no início da fila
        String value = this.fila[this.head];

        // se for o único elemento, atribui -1 para ambos
        if (this.head == this.tail) {
            this.head = -1;
            this.tail = -1;
        } else {
            this.head = (this.head + 1) % this.fila.length;
        }

        this.size -= 1;   
        return value; 
    }
```

#### Análise de eficência

1. addLast

Como vimos, addLast é simples. Há algumas verificações O(1) e o principal é  tail (tail = (tail + 1) % fila.length). Isto é, trata-se de uma operação constante $O(1)$.

2. removeFirst

Nossa estratégia de remoção também é O(1) porque envolve apenas algumas verificações O(1) e andar com head para frente, sem precisar fazer o shift: `head = (head + 1) % fila.length`.

## Algumas verificações importantes

Como sei se uma fila está cheia? Se depois de `tail` tem o `head`, certo? Então isFull fica:

```java
public boolean isFull() {
    return ((this.tail + 1) % this.length) == this.head;
}
```

Determinar se a fila está vazia é simples:

```java
public boolean isEmpty() {
    return this.head == -1 && this.tail == -1;
}
```

**Importante**. Lembre-se que quando você remover o último elemento da fila, ou seja, quando `head == tail`, após a remoção você deve atribuir ambos para -1, `head` e `tail`.

## Onde encontro isso na biblioteca padrão?

Em java, se você quiser usar uma implementação de Fila que seja baseada em arrays, deve usar a class <a class="external" href="https://docs.oracle.com/javase/8/docs/api/java/util/ArrayDeque.html">ArrayDeque</a>.

Tem dois detalhes a serem discutidos. O primeiro é que na implementação de Java a fila é *resizable*, ou seja, não lança exceção quando atinge o limite inicial da fila, mas aumenta sua capacidade. A outra é que essa classe pode ser usada tanto para servir como uma fila, como pilha. Se você analisar bem a api, vai ver que todos os métodos para isso estão lá: addFirst, addLast, removeFirst, removeLast etc. A depender de como você usar esses métodos, você tem uma fila ou uma pilha.

***

# Notas

Eu estou ciente que uso inglês e português misturados no código. Ainda vou resolver essa questão e revisar todo o material, mas há alguns termos que simplesmente não soam bem traduzidos e, muitas vezes, gosto de manter os jargões da área.
