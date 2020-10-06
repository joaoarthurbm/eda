+++
title = "Ordenação Linear: Counting sort"
date = 2019-10-27
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/sorting/CountingSort.java"
+++

***

Os algoritmos de ordenação que vimos até então utilizam comparação para estabelecer a ordem entre os elementos de uma sequência. Primeiro vimos três algoritmos $\Theta(n^2)$: Selection Sort, Insertion Sort e Bubble Sort. Depois vimos dois algoritmos $\Theta(n * \log n)$: Merge Sort e Quick Sort[^1].

[^1]: Importante lembrar que o Quick Sort no pior caso tem seu tempo de execução descrito por uma função quadrática.

Neste material vamos abordar algoritmos que não utilizam comparação, mas que são muito eficientes do ponto de vista de tempo de execução, embora demandem substancialmente mais memória do que o Selection Sort, Insertion Sort, Quick Sort etc.

# Ordenação por Contagem

Algo que chama a atenção em um primeiro momento é: 

<p align="center"><b>Como é possível ordenar elementos sem utilizar comparação?</b></p>

Em geral, a ideia é valer-se do fato de que estamos ordenando números inteiros e que os índices dos arrays também são inteiros. Dessa maneira, podemos mapear o valor presente em uma sequência para a posição de mesmo valor em um array auxiliar (`array[i] = i`). Essa é a estratégia geral dos algoritmos de ordenação linear que se baseiam na contagem dos elementos da sequência a ser ordenada.

Antes de analisarmos os algoritmos de contagem em detalhes, vamos abordar um exemplo bem simples para entender esse conceito. Para isso, vamos entrar em um mundo em que:

* todos os elementos do array que vamos ordenar são inteiros positivos (1, 2, 3…k);
* não há repetição de elementos no array que vamos ordenar;
* sabemos o maior valor desse array, o qual chamamos de k.

Desse modo, se quisermos ordenar o array $A = [7, 2, 1, 4]$[^2], basta criarmos um array auxiliar $C$ cujo tamanho é $k$, onde $k$ é o maior elemento do array original (7), e iterarmos sobre $A$ registrando a presença de seus elementos em $C$ através da seguinte instrução `C[A[i] - 1] = true`. O índice é subtraído de 1, pois as posições de um array em Java iniciam-se de 0.

[^2]: O ideal é nomear variável com letra minúscula em Java. Contudo, para fins didáticos, utilizaremos letras maiúsculas.

```java
...
boolean[] C = new boolean[k];

// registrando a presença de A[i] na sequência
for (int i = 0; i < A.length; i++) {
    C[A[i] - 1] = true;
}
...
```
Se $A = [7, 2, 1, 4]$, com $k = 7$, temos $C$ preenchido da seguinte maneira:

* C = [<span style="color:blue">true</span>, <span style="color:blue">true</span>, false, <span style="color:blue">true</span>, false, false, <span style="color:blue">true</span>]

Agora, se criarmos um array $B$ do tamanho de $A$ e iterarmos sobre o array $C$ preenchendo $B$ com o valor do índice $i + 1$ em que `C[i] == true`, temos que $B$ é a versão ordenada de $A$.

```java
...
int j = 0;
int[] B = new int[A.length];

for (int i = 0; i < C.length; i++) {
    if (C[i] == true) {
        B[j] = i + 1;
        j += 1;
    }
}
...
```

Assim, para $A = [7, 2, 1, 4]$, temos:

* C = [<span style="color:blue">true</span>, <span style="color:blue">true</span>, false, <span style="color:blue">true</span>, false, false, <span style="color:blue">true</span>]
* B = [1, 2, 4, 7], representando a sequência de valores de $A$, porém ordenada.

Viu como foi fácil? Note que $B$ foi preenchido com os valores de $i+1$ em que C[i] ==  true. Ou seja, $B[0] = 1$, pois C[0] ==  true. $B[1] = 2$, pois C[1] ==  true. $B[2] = 4$, pois C[3] ==  true. Por fim, $B[3] = 7$, pois C[6] ==  true.
 
Vamos unir os trechos de código mostrados acima em um método que recebe $A$ e $k$ e retorna um array $B$ que representa a ordenação dos elementos de $A$.

```java
public static int[] sort(int[] A, int k) {
    
    boolean[] C = new boolean[k];

    // registrando a presença de A[i] na sequência
    for (int i = 0; i < A.length; i++) {
        C[A[i] - 1] = true;
    }
   
    int j = 0;
    int[] B = new int[A.length];

    for (int i = 0; i < C.length; i++) {
        if (C[i] == true) {
            B[j] = i + 1;
            j += 1;
        }
    }

    return B;   
}
```

### Mais um exemplo: A = [9, 1, 3, 4, 6, 7]

Sempre lembrando que sabemos o valor de $k$ e que não há repetição dos elementos a serem ordenados.

Para $A = [9, 1, 3, 4, 6, 7]$, temos:

* C = [<span style="color:blue">true</span>, false, <span style="color:blue">true</span>, <span style="color:blue">true</span>, false, <span style="color:blue">true</span>,  <span style="color:blue">true</span>, false,  <span style="color:blue">true</span>]

* B = [1, 3, 4, 6, 7, 9], representando a sequência de valores de $A$, porém ordenada.


## Counting Sort: E se houver repetição no array?

Repetição de valores em um array a ser ordenado não é um cenário incomum, certo? O fato de não haver repetição nos permitiu criar um array C de booleanos e registrar a presença ou não de um elemento. 


<p align="center">O que faríamos se houvesse repetição?</p>

Daí surge ordenação por contagem (*Counting Sort*). A ideia geral é registrar a frequência dos elementos ao invés da simples presença. Isso faz com que o array $C$ passe a ser um array de inteiros, não de booleanos. O algoritmo do *Counting Sort* é baseado na ideia que vimos, mas possui algumas modificações substanciais para permitir elementos repetidos e para manter a estabilidade. Em linhas gerais, o *Counting Sort* possui os seguintes passos:

1. registrar a frequência dos elementos de $A$ no array $C$;

2. Calcular a soma cumulativa de $C$. Esse passo registra, para cada elemento $x$ da entrada, o número de elementos menores ou iguais a $x$;

3. iterar sobre $A$ do fim ao início registrando em $B$ o valor de $A$ com a seguinte instrução `B[C[A[i] - 1] -1] = A[i]`. Não se assuste. Essa sequência de decrementos em 1 é devido ao fato de começarmos os índices de um array a partir de zero em Java.

Antes de entrarmos nos detalhes de código do algoritmo, vamos simular a execução de um exemplo.

### Exemplo: A = [1, 9, 1, 3, 4, 7, 6, 7]

**Passo 1: Contagem de frequência em C.**

```java
...
        int[] C = new int[k];

        // frequência
        for (int i = 0; i < A.length; i++) {
            C[A[i] - 1] += 1;
        }
...
```
Para  $A = [1, 9, 1, 3, 4, 7, 6, 7]$ e $k = 9$, temos:

* C = [2, 0, 1, 1, 0, 1, 2, 0, 1], isto é, no array a ser ordenado há dois elementos de valor 1, nenhum elemento de valor 2, um elemento de valor 3 e assim por diante. 

**Passo 2: Soma cumulativa em C.**

```java
...
        // cumulativa
        for (int i = 1; i < C.length; i++) {
            C[i] += C[i-1];
        }
...
```

Para $C = [2, 0, 1, 1, 0, 1, 2, 0, 1]$, após a execução do cálculo da cumulativa, temos $C = [2, 2, 3, 4, 4, 5, 7, 7, 8]$, isto é, no array a ser ordenado há:

* 2 elementos menores ou igual a 1
* 2 elementos menores ou iguais a 2
* 3 elementos menores ou iguais a 3
* 4 elementos menores ou iguais a 4
* 4 elementos menores ou iguais a 5
* 5 elementos menores ou iguais a 6
* 7 elementos menores ou iguais a 7
* 7 elementos menores ou iguais a 8
* 8 elementos menores ou iguais a 9.

**Passo 3: Iterar do fim ao início de $A$ registrando em $B$ os elementos.**

```java
...
        int[] B = new int[A.length];

        for (int i = A.length - 1; i >= 0; i--) {
            B[C[A[i] - 1] -1] = A[i];
            C[A[i] - 1] -= 1;
        }
...
```

Essa parte pode ser confusa e acredito que para entendê-la precisamos de recursos visuais melhores do que o texto. Por isso, fiz o vídeo abaixo.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/3bm7NgKJpj4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

## Implementação do Counting Sort

```java
public static int[] countingSort(int[] A, int k) {
    
        int[] C = new int[k];

        // frequência
        for (int i = 0; i < A.length; i++) {
            C[A[i] - 1] += 1;
        }
        
        // cumulativa
        for (int i = 1; i < C.length; i++) {
            C[i] += C[i-1];
        }

        int[] B = new int[A.length];

        for (int i = A.length - 1; i >= 0; i--) {
            B[C[A[i] - 1] -1] = A[i];
            C[A[i] - 1] -= 1;
        }

        return B;
    
}
```

## Análise do Counting Sort

O Counting Sort tem em sua implementação 3 laços principais. O primeiro percorre o array $A$ (tamanho $n$), o segundo percorre o array $C$ (tamanho $k$) e o terceiro percorre novamente o array $A$. Assim, temos:

$T(n) = 2n + k$. Aplicando as diretrizes para análise assintótica, temos:
$T(n) = (n + k)$.

O importante aqui é entender que o algoritmo tem seu tempo de execução linear em função do tamanho de $n$ e $k$, não somente do tamanho de $n$. Esse tempo de execução é substancialmente mais eficiente do que os outros algoritmos que vimos. Contudo, esse algoritmo também tem um custo associado ao uso de memória, pois precisa criar um array de contagem $C$ de tamanho igual a $k$ e o array $B$ a ser retornado de tamanho igual ao do array original. Ou seja, do ponto de vista de memória, também que o consumo é dado por $T(n) = (n + k)$.

**O que acontece se k for muito maior que n?** Vejamos um exemplo:

$A = [1, 3, 2, 1, 9874392]$

Veja que teríamos que criar o array de contagem $C$ de tamanho 9874392 mesmo tendo que ordenar apenas 5 elementos, o que seria muito ruim.

Por outro lado, o que acontece se $k$ for muito menor que $n$? Vejamos um exemplo:

A = [1, 3, 2, 1, 1, 5, 3, 2, 5, 4, 2, 1, 2, 1, 1, 2, 1, 4, 5, 2, 2, 3, 2]

Veja que teríamos que criar o array de contagem C de tamanho 5 para ordenar um array com 23 elementos.  Isso pode ser ainda mais vantajoso se imaginarmos um cenário em que teremos, por exemplo, que ordenar todas as pessoas do mundo de acordo com sua idade. Nesse caso, temos um conjunto muito grande de dados (~7.7 bilhões), mas com um $k$ bem menor, pois a pessoa mais velha do mundo não ultrapassaria, nos dias de hoje, 125 anos. Isto é, $k$ é muito menor do que $n$.

**E se eu quiser usar o Counting Sort para ordenar sequências contendo valores iguais a zero e valores negativos?**

O Counting Sort baseia-se na ideia de que um valor inteiro pode ser mapeado para o índice de mesmo valor em um array auxiliar. Essa estratégia nos impede, em um primeiro momento, de ordenar uma sequência com números negativos, pois o menor índice em um array é 0. Além disso, na nossa implementação inicial excluímos também elementos iguais a zero. Contudo, é possível fazer algumas mudanças simples no Counting Sort para que o mesmo passe a também ordenar sequências com esses valores. 

A ideia é simples: basta identificarmos o menor elemento do array (menor) e usar esse valor como um "salto" para adicionar os elementos. É uma ideia similar a fazer um shift para a direita em todos os elementos. O menor elemento array tem sua frequência registrada na posição zero. Vamos ver um exemplo:

$A = [1,-3, 2, 1, 7]$, com k = 7 e menor = -3.

Em primeiro lugar, o array de contagem $C$ já não varia de 0 a $k$, mas sim de 0 a $k - menor + 1$, porque temos que considerar que a frequência do elemento de valor -3 será registrada na posição 0, a do valor -2, na posição 1, a do valor -1 na posição 0 e assim por diante. Por isso, quando for preciso mapear os elementos de A em C e B, temos que usar o salto de |menor| (3, no nosso exemplo). O cálculo da frequência seria dado pelo seguinte código:

```java
...
    int[] C = new int[maior - menor + 1];

    // frequência
    for (int i = 0; i < A.length; i++) {
        C[A[i] - menor] += 1;
    }
...
```

Para A = [1,-3, 2, 1, 7], temos C = [1, 0, 0, 0, 2, 1, 0, 0, 0, 0, 1]. Note que o primeiro índice é reservado para a frequência do menor elemento (-3) e não mais para 1. Além disso, como estamos também contando com a presença de elementos de valor 0 no array, trocamos a instrução `C[A[i] - 1] += 1` por `C[A[i] - menor] += 1`.

A mesma mudança é considerada no restante da implementação, sempre aplicando `array[i]- menor` para considerar o salto.

***

# Notas

Este material não é tão completo quanto o livro texto da disciplina. Sugiro também a leitura do Capítulo 8 do livro "Algoritmos: Teoria e Prática" de Cormen et. al.

No curso de Estrutura de Dados da UFCG há ainda a discussão de outros algoritmos de ordenação linear, como o Radix Sort e o Bucket Sort.
