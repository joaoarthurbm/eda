+++
title = "Filas (FIFO) baseadas em Arrays"
date = 2019-10-25
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/fifoarray/FIFOArray.java"
+++

***

Neste material nós vamos estudar uma forma de implementar uma FILA utilizando arrays.

**Disclaimer.** Este material tem muita interseção com o material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/arraylist/">ArrayList</a>, que eu sugiro que seja lido antes. Não poderia ser diferente, pois estamos falando de aplicações de arrays para resolver problemas de armazenamento e acesso a dados. Todavia, há uma diferença importante entre os dois materiais. Lá no material sobre ArrayList, quando a capacidade do array é atingida, nós fazemos *resize* para poder acomodar novos elementos. Aqui não. Nossa estratégia vai ser manter sempre o tamanho original do array e sobrescrever o elemento mais antigo (First In First Out) quando chegar um novo elemento. Essa não é uma característica particular de Fila. Eu só tomei essa decisão para poder explorar as duas formas: aumentando o tamanho e mantendo o tamanho fixo. Você pode, naturalmente, desenvolver sua fila aumentando a capacidade dela quando precisar. Consulte como isso é feito no material de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/arraylist/">ArrayList</a>.

Eu também tomei essa decisão de sobrescrever o mais antigo ao invés de aumentar a capacidade porque vou abordar o uso de filas em cache também. E lá o comportamento é esse. Manter o tamanho fixo e substituir os mais antigos à medida que novos objetos chegam.

Array é a primeira estrutura de dados que abordamos na disciplina. Há razões para essa escolha. Em primeiro lugar, arrays estão presentes na biblioteca padrão de grande parte das linguagens de programação. Além disso, também são estruturas simples e eficientes. Por último, outras estruturas mais complexas baseiam sua implementação em arrays, como Tabelas Hash, ArrayList, entre outras.

Mas se o tamanho original é mantido, como fazer quando novos elementos quiserem entrar na fila? Aí é que está! Há duas decisões a serem tomadas: só entra um novo elemento quando alguém sair da fila ou não entra mais (lança uma exceção, por exemplo). Nós vamos lidar com a primeira opção, isto é, precisamos ter uma política de remoção bem definida quando um novo elemento chegar. Essa política é bem clara em uma fila: o primeiro elemento a entrar é o primeiro a sair (FIFO -- First In First Out).

> First In First Out (FIFO): O primeiro elemento a entrar na fila é o primeiro a sair.

## Organização interna: atributos e construtores

Para fins didáticos, neste material vamos construir uma fila baseada em arrays que armazena objetos do tipo String. Naturalmente, por ser de propósito geral, as implementações de Fila de Java permitem o armazenamento e manipulação de qualquer objeto.

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
    }
    ...
}
```

Em primeiro lugar, é importante destacar o uso de dois atributos: `head` e `tail`. Esses atributos representam os índices do array que delimitam os valores que estão na fila. Nossa classe fila é uma abstração em cima do array. Quando criamos um array de String, por exemplo, todos os elementos são null. Ele não representa nossa fila. Nossa fila, ao ser criada, está entre head e tail, inclusos. Nesse caso, como eles estão em -1 na inicialização, nossa fila está vazia. 

## Operações

Temos duas operaçõs principais em Fila: `addLast(String ele)` e `removeFirst()`. Faz sentido, né? Nós já decidimos que em uma fila as adições são no final e as remoções são no início. E apenas isso. 

Direto ao ponto. Vamos entender o funcionamento de uma fila com 3 posições simulando várias operações de `addLast(String element)` e `removeFirst()`. 
 
Inicialmente temos a fila vazia:

$fila = [null, null, null]$; head = -1, tail = -1;

Adicionando "a" no fim da fila (addLast):

$fila = ["a", null, null]$; head = 0, tail = 0;

Neste momento, o início (head) e o fim (tail) da fila estão apontando para o mesmo índice do array, isto é, 0.

Adicionando "b" no fim da fila (addLast):

$fila = ["a", "b", null]$; head = 0, tail = 1;

"b" foi adicionado no fim da fila. Ou seja, head continua no índice 0, mas tail andou uma posição e agora está no índice 1. "a" está no início da fila e "b" está no fim da fila.

Adicionando "c" no fim da fila (addLast):

$fila = ["a", "b", "c"]$; head = 0, tail = 2;

"c" foi adicionado no fim da fila. Ou seja, head continua no índice 0, mas tail andou uma posição e agora está no índice 2. "a" está no início da fila e "c" está no fim da fila.

Suponha que agora a gente queira remover alguém da lista. Como já estabelecemos, a política é bem clara: vamos remover o primeiro que entrou na fila, ou seja, o elemento "a". 

### Remoção com shift

Nossa primeira abordagem será fazer o **shiftLeft** de todo mundo e diminuir o índice de tail, pois a fila diminuiu e liberou um espaço. Então, depois de um removeFirst, a fila fica nesse estado: 

$fila = ["b", "c", "c"]$; head = 0, tail = 1;

Preste bem atenção! A fila não é "b", "c", "c". A fila é "b" e "c", pois quem define os limites da fila são head e tail e eles estão em 0 e 1 respectivamente. O último "c" ficou lá por motivos de simplicidade. Isso é muito importante de ser entendido. A fila é uma coisa, o array que é usado para montar a fila é outra. A fila é uma abstração que criamos em cima do array. Poderíamos ter atribuído `null` para aquela posição. Mas, como não é preciso, apenas movi tail para a posição anterior.

Importante aqui é você entender como shiftLeft é feito. Isso é visto em detalhes no material de [ArrayList](https://joaoarthurbm.github.io/eda/posts/arraylist/). Mas vou deixar o código aqui para consulta:

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

$fila = ["c", "c", "c"]$, head = 0, tail = 0;

Preste bem atenção! Na nossa fila agora há apenas um elemento, o "c", pois head e tail estão apontando para o índice 0. Os "c"s adicionais no array estão fora dos limites de head e tail e, portanto, não fazem parte da fila.

Se invocarmos o método removeFirst mais uma vez, a fila fica vazia, isto é, head e tail assumem valor -1;

$fila = ["c", "c", "c"]$, head = -1, tail = -1;

#### Análise de eficência

1. addLast

Como vimos, addLast é simples. Basta aumentar tail (tail =+ 1). Isto é, trata-se de uma operação constante $O(1)$.

2. removeFirst

Nossa estratégia de remoção foi fazer o shift de todo mundo para a esquerda. Esse algoritmo, naturalmente, é O(n), pois precisamos percorrer toda a fila atribuindo a v[i] o valor de v[i+1], com ir partindo de 0 até `tail - 1`.


### Remoção em O(1), mantendo uma fila circular

E seu eu disser que dá para remover o início da fila sem necessariamente precisar fazer o shift? É um pouquinho mais complicado, mas a gente entende. 

Em linhas gerais, remover o início da fila é apenas fazer `head = head + 1`, certo? Ou seja, em O(1). Mas e porque é complicado? Porque fazendo isso, nós liberamos uma posição anterior a `head` que pode ser usada para uma nova adição, mas `tail` está no final do array. Como fazer para `tail` assumir essa nova posição quando for adicionado um elemento? Utilizando a operação de resto da divisão pelo tamanho da fila (`%`). Vamos montar um exemplo para ficar claro.

Vamos novamente agora encher a fila, adicionando 3 elementos, "a", "b" e "c". Então, vamos ter o seguinte estado:

$fila = ["a", "b", "c"]$, head = 0, tail = 2;

Agora, suponha que eu queira remover o início da fila. Basta fazer `head = head + 1`. Temos uma fila com esse estado após a execução de removeFirst():

$fila = ["a", "b", "c"]$, head = 1, tail = 2;

Perceba que a fila vai do índice 1 até o índice 2, valores de `head` e `tail`. Ou seja, nossa fila é "b" e "c".

Agora vem o pulo do gato. Se eu quiser adicionar um novo elemento, eu tenho espaço liver (índice 0), certo? Só que eu não quero fazer o shift de todo mundo para a esquerda porque é O(n). Eu vou adicionar esse novo elemento na posição `(tail + 1) % fila.length`

Ou seja, na posição à frente de tail. Se essa posição for acima do limite do array, que é o nosso caso, ela passa a ser contada do início do array por causa da operação `%`.

É importante que você entenda isso: `(tail+1) % capacidade` sempre vai cair dentro dos limites do array por causa da operação de resto de divisão. No nosso caso, o novo elemento, "d", seria adicionado na posição (2 + 1) % 3, que é 0. A fila ficaria:

$fila = ["d", "b", "c"]$, head = 1, tail = 0;

Note que `head` está no índice 1 (elemento "a") e `tail` está no índice 0 (elemento "d"). Nossa fila é "b", "c" e "d", nessa ordem.

Vamos agora invocar o método removeFirst, nesse caso, `head` iria para `(head + 1)%fila.length`, ou seja, 2. A fila ficaria:

$fila = ["d", "b", "c"]$, head = 2, tail = 0;

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

***

# Notas

Eu estou ciente que uso inglês e português misturados no código. Ainda vou resolver essa questão e revisar todo o material, mas há alguns termos que simplesmente não soam bem traduzidos e, muitas vezes, gosto de manter os jargões da área.
