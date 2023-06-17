+++
title = "Quick Sort: Particionamento Hoare"
date = 2023-06-17T00:18:31
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/sorting/QuickSort.java"
+++

***

Quick Sort é um algoritmo eficiente de ordenação por divisão e conquista. O funcionamento dele é baseado em uma rotina fundamental cujo nome é particionamento. Particionar significa escolher um número qualquer presente no array, chamado de pivot, e colocá-lo em uma posição tal que todos os elementos à esquerda são menores ou iguais e todos os elementos à direita são maiores. Hoje, veremos o particionamento de Hoare, que é uma forma de escolher o pivot.

# Particionamento Hoare:

O particionamento de Hoare foi desenvolvido por Tony Hoare em 1961. Ele é chamado de "hoare" em homenagem ao seu criador. A sua ideia principal é selecionar um elemento pivô no array e rearranjar os elementos de forma que todos os elementos menores que o pivô fiquem à sua esquerda e todos os elementos maiores fiquem à sua direita.
O algoritmo do particionamento de Hoare funciona da seguinte maneira:

1. Seleciona um elemento do array como pivô (geralmente o primeiro ou o último elemento);
2. Define dois índices, um no início do array (índice esquerdo) e outro no final do array (índice direito);
3. Repetidamente, move o índice esquerdo em direção à direita enquanto os elementos forem menores ou iguais ao pivô. O objetivo é encontrar um elemento maior que o pivô para ser trocado posteriormente;
4. Repetidamente, move o índice direito em direção à esquerda enquanto os elementos forem maiores ou iguais ao pivô. O objetivo é encontrar um elemento menor que o pivô para ser trocado posteriormente;
5. Se o índice esquerdo e o índice direito não se cruzarem, troca os elementos nas posições dos índices esquerdo e direito.Isso coloca elementos menores à esquerda e elementos maiores à direita;
6. Os passos 3 a 5 se repetem até que os índices se cruzem;
7. Quando os índices se cruzarem, troca o pivô com o elemento na posição do índice direito. Agora, o pivô está em sua posição final no array ordenado;
8. Retorna o índice direito como o novo pivô.

Após a execução do particionamento de Hoare, todos os elementos menores que o pivô estarão à sua esquerda, e todos os elementos maiores estarão à sua direita. O pivô estará em sua posição final no array ordenado. Esse processo é repetido recursivamente nos subarrays à esquerda e à direita do pivô até que todo o array esteja ordenado.

O particionamento de Hoare é um passo crucial no algoritmo de ordenação QuickSort, que utiliza a estratégia "dividir para conquistar". Ele é eficiente em termos de tempo de execução, geralmente com complexidade média O(n log n) no caso médio e O(n^2) no pior caso, quando o array já está ordenado ou quase ordenado.

## Implementação do Particionamento de Hoare

```java
    public static int partition(int[] values, int left, int right){

        int pivot = values[left];
        int i = left - 1;
        int j = right + 1;

        while (true)
        {
            do {
                i++;
            } while (values[i] < pivot);

            do {
                j--;
            } while (values[j] > pivot);

            if (i >= j) {
                return j;
            }

            swap(values, i, j);
        }
    }
```

Para fixar bem, vamos ver um outro exemplo com figuras demonstrando o passo a passo.

<p align="center">Inicio da iteração: i = left - 1 e j = right + 1</p>

![hoare1](hoare1.png)

<p align="center">Passo 3 e 4: Movendo i para direita até encontrar um valor maior ou igual ao pivo <br> Movendo j para esquerda até encontrar um valor menor ou igual ao pivo</p>

![hoare2](hoare2.png)

<p align="center">Passo 5: Troca values[i] por values[j]</p>

![hoare3](hoare3.png)

<p align="center">Passo 3 e 4: Movendo i para direita até encontrar um valor maior ou igual ao pivo <br> Movendo j para esquerda até encontrar um valor menor ou igual ao pivo</p>

![hoare4](hoare4.png)

<p align="center">Passo 5: Troca values[i] por values[j]</p>

![hoare5](hoare5.png)

<p align="center">Passo 3 e 4: Movendo i para direita até encontrar um valor maior ou igual ao pivo <br> Movendo j para esquerda até encontrar um valor menor ou igual ao pivo</p>

![hoare6](hoare6.png)

<p align="center">Passo 5: Troca values[i] por values[j]</p>

![hoare7](hoare7.png)

<p align="center">Indices avançam e se cruzam, retorna values[j] como novo pivot</p>

![hoare8](hoare8.png)
