+++
title = "Particionamento Hoare para o Quick Sort"
date = 2019-10-27T00:01:01
tags = []
categories = []
github = "https://github.com/joaoarthurbm/eda-implementacoes/blob/master/java/src/sorting/QuickSort.java"
+++

***

<a class="external" href="https://joaoarthurbm.github.io/eda/posts/quick-sort">No material sobre o QuickSort</a> nós vimos o particionamento de Lomuto -- um algoritmo simples para posicionar o pivot tal que todos os elementos à esquerda são menores ou iguais e todos os elementos à direita são maiores. Dá uma olhada lá para revisar o que é particionamento, porque nesse material nós vamos direto ao ponto: mostrar como funciona a estratégia de Hoare, que é mais eficiente na prática do que o de Lomuto.


# A estratégia de Hoare pra particionar

Vamos particionar o array $[3, 8, 7, 10, 0, 23, 2, 1, 77, 7]$. 

Vamos aqui também trabalhar com o pivot na primeira posição, isto é, `pivot = v[ini]`. A ideia do particionamento de Hoare é usar dois índices para percorrer o array. O primeiro índice, `i`, parte da posição à frente do pivot, isto é, `ini + 1` e percorre o array do início para o fim. O segundo índice,  `j`, parte da última posição e percorre o array do fim para o início. Sempre que encontrar um elemento v[i] maior do que o pivot, o `i` pára. De forma análoga, sempre que encontrar um elemento v[j] menor do que o pivot, o `j` pára. Depois dessa primeira iteração, se i < j, troca-se v[i] por v[j] e repete-se esse processo. Complicado? Assim escrito é um pouco, né? Vamos para o exemplo:

Para o array $values = [3, 1, 2, 3, 10, 23, 2, 1, 77, 7]$, temos que $pivot = 3$, $i = 1$ e $j = 9$, porque pivot é o valor de v[ini], i sempre inicia com ini + 1 e j sempre inicia no índice fim. 

**Passo 1.** Vamos iterar no array com i primeiro, identificando o primeiro valor maior do que o pivot. Enquanto for menor, apenas anda com i. No nosso caso então, i vai parar no índice 4, já que 10 é maior que o pivot 3.

**Passo 2.** Vamos iterar com j agora, identificando o primeiro valor menor do que o pivot. Enquanto for maior, apenas anda com j para trás. No nosso caso então, j vai parar no índice 7, já que 1 é menor que o pivot 3.

<p align="center">values = [<font color="blue">3</font>, 1, 2, 3, <font color="red">10</font>, 23, 2, <font color="red">1</font>, 77, 7]</p>

Agora perguntamos: i < j? Sim, pois 4 é menor do que 7. Então trocamos v[i] por v[j], ou seja, trocamos 10 por 1. Note que estamos mantendo os menores valores imediatamente a frente do pivot e os maiores na parte final do array, por isso trocamos.

<p align="center">values = [<font color="blue">3</font>, 1, 2, 3, <font color="red">1</font>, 23, 2, <font color="red">10</font>, 77, 7]</p>


Acabou? Não, pois i ainda é menor ou igual a j, isto é, não ultrapassou j. Nesse caso, continuamos iterando com os dois. Vamos lá. i pararia no índice 5, pois 23 é maior do que 3. Já o j pararia no índice 6, já que 2 é menor do que 3.

<p align="center">values = [<font color="blue">3</font>, 1, 2, 3, 1, <font color="red">23</font>, <font color="red">2</font>, 77, 7]</p>


Agora perguntamos: i < j? Sim, pois 5 é menor do que 6. Então trocamos v[i] por v[j], ou seja, trocamos 23 por 2.

<p align="center">values = [<font color="blue">3</font>, 1, 2, 3, 1, <font color="red">2</font>, <font color="red">23</font>, 77, 7]</p>

Acabou? Não, pois i ainda é menor ou igual a j, isto é, não ultrapassou j. Nesse caso, continuamos iterando com os dois. Vamos lá. i pararia no índice 6, pois encontrou o valor 23, que é maior que o pivot. Já o j pararia no índice 5, já que 2 é menor do que 3. 

Agora perguntamos: i < j? Não, pois 6 é maior do que 5. Nesse caso paramos a computação e apenas trocamos o pivot pelo elemento na posição j:


<p align="center">values = [<font color="blue">2</font>, 1, 2, 3, 1, <font color="blue">3</font>, 23, 77, 7]</p>

Particionou? Sim, né? Todos os valores à esquerda do pivot são menores ou iguais a ele e todos os valores à direita do pivot são maiores que ele.

Agora é só fazer como sempre, chamar o particionamento de forma recursiva para a esquerda e para a direita.

***

Acho que agora é um bom momento para você responder o quiz abaixo e verificar se você entendeu de fato a rotina de particionamento que acabamos de ver.

{{% quiz a%}}

{{< item question="Qual o estado final do array [7, 8, 1, 2, 90, 4, 65, 32] após o particionamento hoare escolhendo 7 como pivot?" answers="5" choices=" [4 - 2 - 1 - 7 - 90 - 8 - 65 - 32], [4 - 1 - 2 - 7 - 8 - 90 - 65 - 32] , [4 - 2 - 1 - 7 - 90 - 8 - 65 - 32], [2 - 1 - 4 - 7 - 90 - 8 - 65 - 32], [2 - 4 - 1 - 7 - 90 - 8 - 65 - 32]">}}


{{% /quiz %}}

***


# E o código?

De certa forma, simples. Veja:

```java 

public int particiona(int[] v, int ini, int fim) {

	int i = ini + 1;
	int j = fim;
	int pivot = v[ini];

	while (i <= j) {

		// andando com i para frente. pára quando encontrar um valor maior que o pivot
		while (i <= j && v[i] <= pivot)
			i++;

		// andando com j para trás. pára quando encontrar um valor menor ou igual ao pivot
		while(i <= j && v[j] > pivot)
                j = j - 1;
         
        // se i não encontrou j, troca
        if (i < j)
        	swap(v, i, j);

	}

	swap(v, ini, j);
	return j;
}

```
