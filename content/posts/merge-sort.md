+++
title = "Ordenação por Comparação: Merge Sort"
date = 2019-10-27T00:01:01
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/sorting/MergeSort.java"

+++

***

Merge Sort é um algoritmo eficiente de ordenação por divisão e conquista. Se nossa missão é ordenar um array comparando seus elementos, do ponto de vista assintótico, $n * \log n$ é o nosso limite inferior. Ou seja, nenhum algoritmo de ordenação por comparação é mais veloz do que $n * \log n$. Formalmente, todos são $\Omega(n * \log n)$. 

No caso do Merge Sort, uma característica importante é que sua eficiência é $n * \log n$ para o melhor, pior e para o caso médio. Ou seja, ele não é somente $\Omega(n * \log n)$, mas é $\Theta(n * \log n)$. Isso nos dá uma garantia de que, independente da disposição dos dados em um array, a ordenação será eficiente.

O funcionamento do Merge Sort baseia-se em uma rotina fundamental cujo nome é ***merge***. Primeiro vamos entender como ele funciona e depois vamos ver como sucessivas execuções de merge ordena um array.

# Merge

Merge é a rotina que combina dois arrays ordenados em um outro também ordenado. Assim como o <a class="external" href="https://joaoarthurbm.github.io/eda/posts/quick-sort/">Quick Sort</a> aplica várias vezes o particionamento para ordenar um array, o Merge Sort também aplica o Merge várias vezes para ordenar um array. 

A ideia é simples e é explicada visualmente no vídeo abaixo.

{{< youtube 7fb8H-MCQ7c >}}

Na prática, não queremos ficar criando arrays separados para uni-los. Isso custa memória e processamento, pois a cada array criado temos que transferir os elementos do array original para ele. O que fazemos então é organizar os dados no array a ser ordenado de forma que uma parte dele esteja ordenada e outra também. Assim, no Merge Sort não fazemos o merge de dois arrays, mas fazemos o merge de duas partes ordenadas de um mesmo array. Veja o vídeo abaixo com essa explicação bem detalhada.

{{< youtube sXddmV3sfjA >}}

## Implementação do Merge

O código do método ***merge*** está descrito abaixo. Vamos analisar por partes cada detalhe da implementação.


```java
...
    public void merge(int[] v, int left, int right) {
        
        // transfere os elementos entre left e right para um array auxiliar.
        int rightHelper = right - left;
        int[] helper = new int[rightHelper + 1];
        for (int i = 0; i <= rightHelper; i++) {
            helper[i] = v[left + i];
        }
        
        int middleHelper = rightHelper / 2;
    
        int i = 0;
        int j = middleHelper + 1;
        int k = left;
        
        while (i <= middleHelper && j <= rightHelper) {
            
            if (helper[i] <= helper[j]) {
                v[k] = helper[i];
                i++;
            } else {
                v[k] = helper[j];
                j++;
            }
            
            k++;
        }
        
        // se a metade inicial não foi toda consumida, faz o append.
        while (i <= middleHelper) {
            v[k] = helper[i];
            i++;
            k++;
        }
       
        // Não precisamos nos preocupar se a metade final foi 
        // toda consumida, já que, se esse foi o caso, ela já está
        // no array final.

    }
...
```

Em primeiro lugar, vamos entender a assinatura do método ***merge***. Naturalmente, ele recebe como parâmetro o array a ser processado. Recebe também dois índices: `left` e `right`, que determinam os limites em que o algoritmo deve agir. 

Se você prestou atenção no vídeo anterior, sabe que a parte do array que é delimitada por `left` e `middle` — onde $middle = (right + left) / 2$ — está ordenada e sabe que a parte do array delimitada por `middle + 1` e `right` também está ordenada. Veja a figura abaixo que ilustra essa situação. Nosso trabalho é fazer a junção (merge) dessas duas partes em uma sequência ordenada.

![partes](partes.png)

Para isso, como vamos manipular nosso array original, precisamos de um array auxiliar (`helper`) para guardar o estado. Isso é feito nas quatro primeiras linhas do método.

**Nota:** Nem sempre é preciso criar um array auxiliar do mesmo tamanho que o array original. Por isso, calculamos o valor de `rightHelper` e definimos o tamanho do auxiliar como `rightHelper + 1`, para que ele tenha apenas o tamanho necessário para transferir os elementos entre `left` e `right`.

```java
...
    // transfere os elementos entre left e right para um array auxiliar.
    int rightHelper = right - left;
    int[] helper = new int[rightHelper + 1];
    for (int i = 0; i <= rightHelper; i++) {
        helper[i] = v[left + i];
    }    
...
```

Após criar o array auxiliar, calculamos o valor de `middleHelper`. Esse valor representa o ponto médio do array auxiliar e é usado para dividir virtualmente as duas partes ordenadas.

```java
...
    int middleHelper = rightHelper / 2;
...
```

As próximas linhas definem os valores de `i`, `j` e `k` que, como visto no vídeo, são os índices usados para controle da execução e comparação dos elementos. `i` marca o início da primeira parte do array, `j` marca o início da segunda parte do array e `k` marca a posição em que o menor elemento entre $helper[i]$ e $helper[j]$ deve ser adicionado.

 ```java
...
    int i = 0;
    int j = middleHelper + 1;
    int k = left;
...
```

Agora, o algoritmo passa a tratar da comparação entre $helper[i]$ e $helper[j]$ para adicionar o menor em $v[k]$. Lembre-se: se $helper[i]$ for menor ou igual, `v[k] = helper[i]` e `i` e `k` são incrementados. Caso contrário, `v[k] = helper[j]` e `j` e `k` são incrementados. Isso é feito até que uma das partes tenha sido completamente percorrida, isto é, se `i` atingir `middleHelper` ou `j` atingir `rightHelper`.

```java
...
    while (i <= middleHelper && j <= rightHelper) {
            
        if (helper[i] <= helper[j]) {
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

Por fim, como vimos em detalhe no vídeo. Uma das duas partes do array será consumida em sua totalidade antes da outra. Se for a metade inicial, basta então, fazermos o *append* de todos os elementos faltantes até o meio. Isso é feito pelo código abaixo.

```java
...
    // se a metade inicial não foi toda consumida, faz o append.
    while (i <= middleHelper) {
        v[k] = helper[i];
        i++;
        k++;
    }
...
```

Não precisamos nos preocupar caso os elementos que sobrarem for da metade final, uma vez que eles já estão, e em ordem, no array original. Em versões antigas desse material, eu incluia o while dessa parte também, mas, de fato, não é preciso. Importante destacar que essa foi uma contribuição de uma aluna da turma de disciplina em 2023.2 que, em sala de aula, levantou o questionamento e gerou o debate.

## O Merge Sort

Vamos primeiro entender o conceito, a teoria. Vejamos nesse vídeo como o Merge Sort se vale de repetidas "quebras" do array para ser capaz de executar a rotina Merge diversas vezes e completar a ordenação.

{{< youtube ekxvb3Q5hE4 >}}

Como dito, o Merge Sort é um algoritmo de divisão-e-conquista. A parte da conquista nós já cobrimos bem detalhadamente, isto é, sabemos como combinar dois arrays ordenados em um array também ordenado. 

A parte da divisão, na verdade, é bem simples. Basta "dividir" o array recursivamente na metade até que sobre apenas um elemento. Note que usei aspas em dividir. Isso porque a gente não divide de fato. Não cria dois arrays e transfere todos os elementos. Seria muito custoso. O que a gente faz é usar os índices `left`, `middle` e `right` para controlar as partes do array que o algoritmo deve agir. Vamos ver o código:

```java
    public void mergeSort(int[] v, int left, int right) {   
        
        if (left >= right)
            return;
        
        else {
            
            int middle = (left + right) / 2;
            mergeSort(v, left, middle);
            mergeSort(v, middle + 1, right);
    
            merge(v, left, right);
        }
        
    }
```

Em primeiro lugar, vamos analisar a assinatura do método. Os parâmetros são o próprio array a ser ordenado, um índice `left` e um índice `right`, que delimita a porção do array que o algoritmo deve analisar. Na primeira chamada, naturalmente, temos que `left = 0` e `right = v.length - 1`.

Seguindo. Na primeira linha do método, temos a condição de parada do algoritmo (left >= right). Isto é, quando a porção do algoritmo a ser analisada possui apenas um elemento, não há mais a necessidade de "quebrá-lo".[^1]

Caso ainda seja necessário "quebrar" o array (`if left < right`), temos essas quatro linhas bem importantes:

```java
...
    int middle = (left + right) / 2;
    mergeSort(v, left, middle);
    mergeSort(v, middle + 1, right);

    merge(v, left, right);
...
```

A primeira define `middle` como sendo o valor central entre `left` e `right`. A segunda e a terceira são chamadas recursivas para a metade da esquerda (de ***left*** até ***middle***) e para a metade da direita (de ***middle + 1*** até ***right***).

Por fim, após cada quebra há uma chamada ao método merge, passando os limites a serem considerados (***left*** e ***right***).


[^1]: Certamente eu poderia ter feito `if (left < right)` e economizado algumas linhas de código descartando o else. Contudo, eu prefiro dessa maneira para fins didáticos.

## Análise do Tempo de Execução

Lembra dos passos para determinar o tempo de execução de <a class="external" href="https://joaoarthurbm.github.io/eda/posts/analise-algoritmos-recursivos/">algoritmos recursivos</a>? O primeiro passo é encontrar a relação de recorrência. O Merge Sort possui duas chamadas recursivas, cada uma reduzindo o problema (tamanho do array) na metade. Ou seja, $2 * T(n / 2)$. Além disso, há também uma chamada ao método Merge, que sabemos ser $O(n)$. Portanto, a relação de recorrência é:

<center>$T(n) = 2 * T(N / 2) + N$</center>

Se você ainda não entendeu como chegamos nessa relação de recorrência. Eu gravei um vídeo para ficar mais claro. Veja abaixo:

{{< youtube mCzer4M_uBE >}}

Então precisamos apenas resolver essa relação de recorrência. Aprendemos a fazer isso na aula sobre <a class="external" href="https://joaoarthurbm.github.io/eda/posts/analise-algoritmos-recursivos/">análise de algoritmos recursivos</a>. Há, inclusive, uma seção exclusiva para o Merge Sort neste material. Leia com atenção e volte aqui sabendo que a relação de recorrência $T(n) = 2 * T(N / 2) + N$, quando resolvida, nos fornece um custo total $n * \log n$.

Lembra que no início do material eu afirmei que, independente do caso (melhor, pior ou médio), o Merge Sort nos garante eficiência $n * \log n$? Por que? Porque as "quebras" do array sempre ocorrem na metade. Ou seja, independente dos dados, estamos sempre dividindo o array na metade. Portanto, a relação de recorrência é única e, quando resolvida, sempre nos fornece um custo $n * \log n$.

> O Merge Sort nos garante eficiência $n * \log n$ para todos os casos.

## Análise do uso de memória

Como vimos, o Merge Sort usa um array auxiliar (***helper***) na ordenação. A cada etapa da divisão, novos arrays são criados para armazenar as metades que serão ordenadas. Ou seja, do ponto de vista de uso de memória, o Merge Sort é $O(n)$. 

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
