+++
title = "Ordenação por Comparação: Merge Sort"
date = 2019-10-27T00:01:01
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/sorting/MergeSort.java"

+++

***

<span style="color:blue">Draft. Este material ainda está em edição.</span>

***

Merge Sort é um algoritmo eficiente de ordenação por divisão e conquista. Se nossa missão é ordenar um array comparando seus elementos, do ponto de vista assintótico, $n * \log n$ é o nosso limite inferior. Ou seja, nenhum algoritmo de ordenação por comparação é mais veloz do que $n * \log n$. Formalmente, todos são $\Omega(n * \log n)$. 

No caso do Merge Sort, uma característica importante é que sua eficiência é $n * \log n$ para o melhor, pior e para o caso médio. Ou seja, ele não é somente $\Omega(n * \log n)$, mas é $\Theta(n * \log n)$. Isso nos dá uma garantia de que, independente da disposição dos dados em um array, a ordenação será eficiente.

O funcionamento do Merge Sort baseia-se em uma rotina fundamental cujo nome é ***merge***. Primeiro vamos entender como ele funciona e depois vamos ver como sucessivas execuções de merge ordena um array.

# Merge

Merge é a rotina que combina dois arrays ordenados em um outro também ordenado. Assim como o <a class="external" href="https://joaoarthurbm.github.io/eda/posts/quick-sort/">Quick Sort</a> aplica várias vezes o particionamento para ordenar um array, o Merge Sort também aplica o Merge várias para ordenar um array. 

A ideia é simples e é explicada visualmente no vídeo abaixo.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/7fb8H-MCQ7c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>

Na prática, não queremos ficar criando arrays separados para uni-los. O que fazemos é organizar os dados no array a ser ordenado de forma que uma porção dele esteja ordenada e outra também. Assim, no Merge Sort não fazemos o merge de dois arrays, mas fazemos o merge de duas partes ordenadas de um mesmo array. Veja o vídeo abaixo com essa explicação bem detalhada.

<center>
<iframe width="560" height="315" src="https://www.youtube.com/embed/sXddmV3sfjA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</center>


## Implementação do Merge

O código do método ***merge*** está descrito abaixo. Vamos analisar por partes cada detalhe da implementação.


```java
...
    public void merge(int[] v, int left, int middle, int right) {
        
        // transfere os elementos entre left e right para um array auxiliar.
        int[] helper = new int[v.length];
        for (int i = left; i <= right; i++) {
            helper[i] = v[i];
        }
        
        
        int i = left;
        int j = middle + 1;
        int k = left;
        
        while (i <= middle && j <= right) {
            
            if (helper[i] < helper[j]) {
                v[k] = helper[i];
                i++;
            } else {
                v[k] = helper[j];
                j++;
            }
            k++;    
            
        }
        
        // se a metade inicial não foi toda consumida, faz o append.
        while (i <= middle) {
            v[k] = helper[i];
            i++;
            k++;
        }
        
        // se a metade final não foi toda consumida, faz o append.
        while (j <= right) {
            v[k] = helper[j];
            j++;
            k++;
        }

    }
...
```

Em primeiro lugar, vamos entender a assinatura do método ***merge***. Naturalmente, ele recebe como parâmetro o array a ser processado. Recebe também três índices: `left` e `middle` e `right`, que determinam os limites em que o algoritmo deve agir. 

Se você prestou atenção no vídeo anterior, sabe que a parte do array que é delimitada por `left` e `middle` está ordenada e sabe que a parte do array delimitada por `middle + 1` e `right` também está ordenada. Nosso trabalho é fazer a junção (merge) dessas duas partes em uma sequência ordenada.

Para isso, como fazer manipulações em nosso array original, precisamos de um array auxiliar (`helper`) para guardar o estado. Isso é feito nas três primeiras linhas do método.

```java
...
    // transfere os elementos entre left e right para um array auxiliar.
    int[] helper = new int[v.length];
    for (int i = left; i <= right; i++) {
        helper[i] = v[i];
    }     
...
```

As próximas linhas definem os valores de `i`, `j` e `k` que, como vistos no vídeos, são os índices usados para controle da execução e comparação dos elementos. `i` marca o início da primeira porção do array, `j` marca o início da segunda porção do array e `k` marca a posição em que o menor elemento entre $helper[i]$ e $helper[j]$ deve ser adicionado.

 ```java
...
    int i = left;
    int j = middle + 1;
    int k = left;    
...
```

Agora, o algoritmo passa a tratar da comparação entre $helper[i]$ e $helper[j]$ para adicionar o menor em $v[k]$. Lembre-se: se $helper[i]$ for menor ou igual, `v[k] = helper[i]` e `i` e `k` são incrementados. Caso contrário, `v[k] = helper[j]` e `j` e `k` são incrementados. Isso é feito até que uma das porções tenha sido completamente percorrida, isto é, se `i` atingir `middle` ou `j` atingir `right`.

```java
...
    while (i <= middle && j <= right) {
            
        if (helper[i] < helper[j]) {
            v[k] = helper[i];
            i++;
        } else {
            v[k] = helper[j];
            j++;
        }
        k++;    
            
    }
...
```

Por fim, como vimos em detalhe no vídeo. Uma das duas partes do array será consumida em sua totalidade primeiro do que a outra. Basta então, fazemos o append de todos os elementos da parte que não foi completamento consumida. Isso é feito pelo código abaixo.

```java
    // se a metade inicial não foi toda consumida, faz o append.
    while (i <= middle) {
        v[k] = helper[i];
        i++;
        k++;
    }
        
    // se a metade final não foi toda consumida, faz o append.
    while (j <= right) {
        v[k] = helper[j];
        j++;
        k++;
    }
```

## O Merge Sort

Vamos primeiro entender o conceito, a teoria. Vejamos nesse vídeo como o Merge Sort se vale de repetidas "quebras" do array para ser capaz de executar a rotina Merge diversas vezes e completar a ordenação.

<center>
\<seção ainda em construção\>
</center>


## Análise do Tempo de Execução

Lembra dos passos para determinar o tempo de execução de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/analise-algoritmos-recursivos/">algoritmos recursivos?</a>. O primeiro passo é encontrar a relação de recorrência. O Merge Sort possui duas chamadas recursivas, cada uma reduzindo o problema (tamanho do array) na metade. Ou seja, $2 * T(n / 2)$. Além disso, há também uma chamada ao método Merge, que sabemos ser $O(n)$. Portanto, a relação de recorrência é:

<center>$T(n) = 2 * T(N / 2) + N$</center>

Então precisamos apenas resolver essa relação de recorrência. Aprendemos a fazer isso na aula sobre <a class="external" href="https://joaoarthurbm.github.io/eda/posts/analise-algoritmos-recursivos/">análise de algoritmos recursivos.</a> Há, inclusive, uma seção exclusiva para o Merge Sort neste material. Leia com atenção e volte aqui sabendo que a relação de recorrência <center>$T(n) = 2 * T(N / 2) + N$</center>, quando resolvida, nos fornece um custo total $n * \log n$.

Lembra que no início do material eu afirmei que, independente caso (melhor, pior ou médio), o Merge Sort nos garante eficiência $n * \log n$? Por que? Porque as "quebras" do array sempre ocorrem na metade. Ou seja, independente dos dados, estamos sempre dividindo o array na metade. Portanto, a relação de recorrência é única e, quando resolvida, sempre nos fornece um custo $n * \log n$.

> O Mege Sort nos garante eficiência $n * \log n$ para todos os casos.

## Análise do uso de memória

Como vimos, o Merge Sort usa um array auxiliar (***helper***) na ordenação. O tamanho de helper é o mesmo do array origina. Ou seja, do ponto de vista de uso de memória, o Merge Sort é $O(n)$. 

Isso é algo novo para a gente, certo? Este é o primeiro algoritmo de ordenação que estamos estudando que usa memória auxiliar proporcional ao tamanho do problema.

> O Merge Sort ***não*** é in-place.

Importante lembrar também que a ordenação é estável, pois mantém a ordem dos elementos iguais. Isso porque decidimos que, se o elemento mais à esquerda for menor ou IGUAL ao mais à direita, ele deve ser colocado primeiro no array ordenado.

> O Merge Sort é estável.

***

# Resumo

* Merge Sort é um algoritmo eficiente de ordenação.

* Independente do caso (melhor, pior ou médio) o Merge Sort sempre será $n * \log n$. Isso ocorre porque a divisão do problema sempre gera dois sub-problemas com a metade do tamanho do problema original ($2 * T (n /2)$).

* O algoritmo baseia a ordenação em sucessivas execuções de merge, uma rotina que une duas partes ordenadas de um array em uma outra também ordenada. 

* O algoritmo de Merge é $O(n)$.

* Apesar de estar na mesma classe de complexidade do Quick Sort, o Merge Sorte tende a ser, na prática, um pouco menos eficiente do que o Quick Sort, pois suas constantes são maiores. Contudo, a seu favor, o Merge Sort garante $n * \log n$ para qualquer caso, enquanto o Quick Sort pode ter ordenação $n^2$ no pior caso, embora raro.

* O Merge Sort não é in-place.

* O Merge Sort é estável.
