+++
title = "Introdução à Análise de Algoritmos"
date = 2019-10-01
tags = []
categories = []
+++

***

## Contextualização

A análise de eficiência é uma etapa fundamental na concepção de um algoritmo. Embora aspectos como legibilidade, simplicidade e modularidade de uma solução sejam importantes para a sua manutenabilidade, a eficiência de uma solução desempenha um papel muito relevante para a sua adoção.

Diante de um problema computacional, diversas soluções podem ser propostas. Por exemplo, para ordenar um sequência de números, o desenvolvedor pode utilizar algoritmos como o BubbleSort, MergeSort, QuickSort entre outros. Entender como esses algoritmos se comportam à medida que aumentamos o tamanho da entrada a ser ordenada é primordial para decidirmos qual solução adotar em um determinado contexto.

Analisar um algoritmo significa prever a quantidade de recursos que tal algoritmo consome ao ser executado. A análise pode apontar diversos candidatos e, tipicamente, exclui diversas soluções não eficientes. Diversas variáveis podem ser objetos de estudo da análise de um algoritmo, por exemplo, consumo de memória, largura de banda de comunicação entre outros. No entanto, com frequência, desejamos medir o tempo execução. E é essa variável que estamos interessados em discutir neste documento.

Uma abordagem direta para analisar o desempenho de um algoritmo é a abordagem empírica. Neste caso, configura-se um ambiente em que as variáveis são controladas e executa-se os algoritmos com o intuito de medir o tempo de computação e comparar as diferentes soluções. 
O tempo de execução (eixo y) é medido em função do tamanho da entrada (eixo x). Por exemplo, para analisar empiricamente um algoritmo de ordenação medimos o tempo de execução para diferentes tamanhos de arrays. Além disso, podemos querer variar a configuração do array sob ordenação, isto é, como o algoritmo se comporta com um array já ordenado? Como se comporta com arrays parcialmente ordenados? 

Tipicamente, executa-se um experimento com o tamanho da amostra suficiente para se ter validade estatística e permitir a construção de um modelo que represente a curva de cada algoritmo. A Figura abaixo, por exemplo, apresenta os tempos de computação de diferentes algoritmos à medida que aumenta-se o tamanho da entrada. Como podemos notar, o algoritmo SelectionSort apresenta tempo de execução consideravelmente maior em comparação com as outras três alternativas à medida que a quantidade de elementos a serem ordenados cresce.

![comp-ordenacao](comparacao-ordenacao.jpeg "Comparação de Algoritmos de Ordenação")

A abordagem empírica para análise de algoritmos é útil, pois, se conduzida de maneira metodologicamente apropriada, fornece valores precisos sobre o tempo de execução de um algoritmo. No entanto, essa abordagem apresenta algumas desvantagens. Primeiro, existe um alto custo relacionado à implementação de todos os algoritmos, além da configuração, execução e análise do experimento. Além disso, note que as conclusões são limitadas ao espaço de entrada do experimento. Por fim, os resultados são dependentes do hardware utilizado.

Diante do cenário exposto acima, surge a necessidade de uma análise que:

* seja independente de hardware
* permita analisar os algoritmos em um espectro maior de entradas
* seja simples

Note que, em diversas situações, o interesse está em comparar algoritmos, ao invés de determinar o seu tempo exato de execução. Em particular, **estamos interessados nas funções no comportamento dos algoritmos para grandes tamanhos de entrada -- análise assintótica.**


* * *

## Análise de Algoritmos

Antes de apresentar os conceitos de análise assintótica, sua notação e modus operandi, é preciso apresentar a hipótese em que a análise se baseia:

<p align="center">Hipótese: O custo de operações primitivas é constante.</p>

Essa hipótese estabelece que operações aritméticas, indexação de elementos em um vetor, retorno de métodos / funções, atribuição de valores às variáveis, comparação de elementos, entre outros, executam em tempo constante, referenciado como 


 $O(1)$ ou $O\(C\)$. É importante destacar que, na prática, esse custo varia de acordo com o hardware, linguagem de programação etc. No entanto, essa variação é insignificante do ponto de vista da análise assintótica. O quadro abaixo lista as operações primitivas detalhadamente.

<pre>
Operações Primitivas

* Avaliação de expressões booleanas (i >= 2; i == 2, etc);

* Operações matemáticas (*, -, +, %, etc);

* Retorno de métodos (return x;);

* Atribuição (i = 2);

* Acesso à variáveis e posições arbitrárias de um array (v[i]).

</pre>

Nesse contexto, o tempo de execução de um algoritmo é a soma do custo das operações primitivas. Por exemplo, considere o algoritmo que multiplica o resto da divisão de dois inteiros pela parte inteira da mesma divisão:

```java
int multiplicaRestoPorParteInteira(int i, int j) {
    int resto = i % j;
    int pInteira = i / j;
    int resultado = resto * pInteira;
    return resultado;
}
```

**Passo 1: Identificar primitivas.** O primeiro passo para determinar de modo analítico o tempo de execução de qualquer algoritmo é identificar todas as operações primitivas. Cada uma, como discutido anteriormente, tem um custo constante. Para o algoritmo acima temos:

1. atribuição (resto = ) -> $c1$

2. operação aritmética (i % j) -> $c2$

3. atribuição (pInteira = ) -> $c3$

4. operação aritmética (i % j) -> $c4$

5. atribuição (resultado = ) -> $c5$

6. operação aritmética (resto * pInteira) -> $c6$

7. retorno de método (return resultado) -> $c7$

**Passo 2: Identificar a quantidade de vezes que cada uma das primitivas é executada.** Para o algoritmo acima, todas as primitivas são executadas apenas uma vez.

**Passo 3: Somar o custo total.** O tempo de execução do algoritmo é a soma das execuções das operações primitivas. Nesse caso temos que a função que descreve o tempo de execução é:

$f(n) = c1+c2+c3+c4+c5+c6+c7$

Lembrando estamos interessados em uma função que nos diga o tempo de execução em relação ao tamanho da entrada. Nesse caso, escolhemos $n$ para representar o tamanho da entrada. Como pode ser visto na função detalhada, o custo não depende de $n$ de maneira alguma. Independente os números passados como parâmetro, o custo será sempre o mesmo. Por isso dizemos que essa função, e portanto o algoritmo que é descrito por ela, tem **custo constante**, ou seja, independe do tamanho da entrada.

Outro fator de destaque é que podemos considerar que todas as constantes possuem o mesmo valor $c$. Assim, podemos simplificar a função para $f(n)= 7c$.

### E quando houver condicionais?

O uso de comandos condicionais é muito comum em nossos algoritmos e nos impõe uma dificuldade na análise do tempo de execução. Essa dificuldade está relacionada ao fato de que, dependendo do caso, apenas uma parte do código é executada. Como decidir como fazer a análise? Que caminho devemos computar? 

Nesse caso, escolhemos **o pior caso**. Neste curso estamos interessados em saber como os algoritmos se comportam no seu pior caso. A análise do pior caso é útil para eliminarmos soluções ruins. Além disso, o melhor caso raramente acontece, ao contrário dos outros casos que podem ser bem mais comuns. Por último, o caso médio, além de demandar análise estatística, muitas vezes é muito semelhante ao pior caso.

Por ora, vamos analisar um método que recebe as três notas de um aluno e calcula a nota que ele precisa obter na prova final, se esse for o caso. Se o aluno for aprovado ($media >= 7.0$) ou reprovado sem direito a final ($media < 4$), o método deve retornar $0$.

```java
double precisaNaFinal(double nota1, double nota2, double nota3) {

    double media = (nota1 + nota2 + nota3) / 3;
        
    if (media >= 7 || media < 4) {
        return 0;
        
    } else {
        double mediaFinal = 5;
        double pesoFinal = 0.4;
        double pesoMedia = 0.6;
        double precisa = (mediaFinal - pesoMedia * media) / pesoFinal;
            
        return precisa;
    }

}
```

**Passo 1. Identificar primitivas.**

1. atribuição (media = ) -> $c1$

2. operação aritmética (nota1 + nota2 + nota3) -> $c2$

3. operação aritmética (... / 3) -> $c3$

4. avaliação de expressão booleana (media >=7 || media < 4) -> $c4$

5. retorno de método (return 0) -> $c5$

6. atribuição (mediaFinal = ) -> $c6$

7. atribuição (pesoFinal = ) -> $c7$

8. atribuição (pesoMedia = ) -> $c8$

9. atribuição (precisa = ) -> $c9$

10. operação aritmética (pesoMedia * media) -> $c10$

11. operação aritmética (mediaFinal -  ...) -> $c11$

12. operação aritmética (... / pesoFinal) -> $c12$

13. retorno de método (return precisa) -> $c13$

**Passo 2: Identificar a quantidade de vezes que cada uma das primitivas é executada.** Aqui vem a grande diferença. Como estamos interessados no pior caso, nós vamos descartar a constante c5 pois, no pior caso, o bloco do else será executado, pois é mais custosa que o bloco do if. As outras primitivas são executadas apenas uma vez.

**Passo 3: Somar o custo total.**

$f(n) = c1+c2+c3+c4+c6+c7+c8+c9+c10+c11+c12+c13$

### E quando houver iteração? 

Nos dois exemplos que vimos até aqui todas as primitivas são executadas apenas uma vez e, por isso, o tempo de execução do algoritmo é sempre constante. Vejamos o que acontece quando há iteração. O código abaixo procura por um elemento em um array.

```java
public static boolean contains(int[] v, int n) {
    for (int i = 0; i < v.length; i++)
        if (v[i] == n)
            return true;
    return false;
}
```

**Passo 1: Identificar primitivas.**

1. Atribuição (int i = 0) -> $c1$

2. Avaliação de expressão booleana (i < v.length) -> $c2$

3. Operação aritmética (i++) -> $c3$

4. Avaliação de expressão booleana (v[i] == n) -> $c4$

5. Retorno de método (return true) -> $c5$

6. Retorno de método (return false) -> $c6$

**Passo 2: Identificar a quantidade de vezes que cada uma das primitivas é executada.**

Aqui mora a grande diferença da análise deste exemplo em relação aos demais. Em primeiro lugar, nem todas as primitivas são executadas apenas uma vez. Depois, temos que voltar a lembrar que estamos tratando do pior caso. Esse cenário é representado por um array que não contém o número procurado, pois o algoritmo irá realizar todas as iterações e retornar false no final. Veja que se o número estiver dentro do array, a execução pode terminar bem antes do fim da iteração no array. Isso significa que, na nossa análise, vamos descartar a primitiva $c5$, pois no pior caso ela nunca é executada.

Dado que o tamanho do vetor (v.length) é $n$, temos:

* $c1$ é executada apenas uma vez.

* $c2$ é executada $(n+1)$ vezes. Exemplo: se $n = 5$, temos as seguintes verificações: 0 < 5, 1 < 5; 2 < 5, 3 < 5, 4 < 5 e 5 < 5, quando encerra-se o loop. Ou seja, 6 verificações.

* $c3$ é executada $n$ vezes. Exemplo: se $n = 5$, temos os seguintes incrementos em i: 1, 2, 3, 4 e 5, quando encerra-se o loop.

* $c4$ é executada $n$ vezes.

* No pior caso, $c5$ não é executada.

* $c6$ é executada apenas uma vez.

**Passo 3: Somar o custo total.**

O tempo de execução do algoritmo é a soma das execuções das operações primitivas. Nesse caso temos que a função que descreve o tempo de execução é:

$f(n) = c1+c2*(n+1)+c3*n+c4*n+c6$, considerando todas as primitivas com custo $c$ e simplificando a função, temos:

$f(n) = 3*c*n+3*c$

Veja que essa função é diretamente relacionada ao tamanho do array ($n$). A medida que cresce o tamanho de $n$, cresce também o tempo de execução do pior caso. Esse crescimento é linear, pois a função é linear. Faz sentido, certo? Iterar em um array com 100 posições é 10 vezes mais lento que iterar em um array de 10 posições.

Vamos ver mais um exemplo. 

```java
public boolean contemDuplicacao(int[] v) {
    for (int i = 0; i < v.length; i++)
        for (int j = i + 1; j < v.length; j++)
            if (v[i] == v[j])
                return true;
    return false;
}
```

**Passo 1: Identificar primitivas.**

1. Atribuição (int i = 0) -> c1

2. Avaliação de expressão booleana (i < v.length) -> c2

3. Operação aritmética (i++) -> c3

4. Atribuição (int j = i + 1) -> c4

5. Avaliação de expressão booleana (j < v.length) -> c5

6. Operação aritmética (j++) -> c6

7. Avaliação de expressão booleana (v[i] == v[j]) -> c7

8. Retorno de método (return true) -> c8

9. Retorno de método (return false) -> c9


**Passo 2: Identificar a quantidade de vezes que cada uma das primitivas é executada.**

O pior caso de execução desse algoritmo é quando não há repetição de valores no array. Ou seja, os loops são executados até o final. Então, como estamos falando do pior caso, descartamos $c8$, porque no pior caso essa primitiva nunca será executada.

Dado que o tamanho do vetor (v.length) é $n$, temos:

* $c1$ é executada apenas uma vez.

* $c2$ é executada $(n+1)$ vezes. Exemplo: se $n = 5$, temos as seguintes verificações: 0 < 5, 1 < 5; 2 < 5, 3 < 5, 4 < 5 e 5 < 5, quando encerra-se o loop. Ou seja, 6 verificações.

* $c3$ é executada $n$ vezes. Exemplo: se $n = 5$, temos os seguintes incrementos em i: 1, 2, 3, 4 e 5, quando encerra-se o loop.

Agora, atenção, porque vamos tratar das primitivas do laço mais interno.

* A quantidade de vezes que $c4$ é executada depende do laço mais externo, pois $j$ varia de acordo com $i$ ($j = i+1$). Como o laço externo executa $n$ vezes, a quantidade de vezes que $j$ varia é dada por: $(n - 1) + (n - 2) + (n - 3) + (n-4) + ...1$. Essa série representa uma Progressão Aritmética finita decrescente com razão 1. A soma de uma PA com essas características é dada por $S = n/2 * (a1+an)$, onde $a1$ e $an$ são o primeiro e o último elemento da sequência, respectivamente. Assim, para $a1=1$ e $an = n-1$, temos que $c4$ é executada ${n^2}/{2}$ vezes.

* Como $c5$ é executada uma vez a mais que $c4$ por causa do último teste para sair do laço, então temos que o primeiro termo da PA é $a1 = 1$ e $an = n$. Assim, temos que $c5$ é executada $({n^2 + n})/{2}$.

* $c6$ e $c7$ são executadas a mesma quantidade de vezes que $c4$.

* $c8$ não é executada nenhuma vez porque estamos falando do pior caso

* $c9$ é executada apenas uma vez.

**Passo 3: Somar o custo total.**

O tempo de execução do algoritmo é a soma das execuções das operações primitivas. Nesse caso temos que a função que descreve o tempo de execução é:

$f(n) = c1 + c2*(n+1) + c3*n + c4 * {n^2}/2 + c5 * (n^2 + n)/2 + c6 * {n^2}/2 + c7 * {n^2}/2 + c9$,


considerando todas as primitivas com custo c e simplificando a função, temos:


$f(n) = 3 * c + 2 * c * n + 3 * {n^2}/2 + c * (n^2 + n)/2$


Veja que essa função é diretamente relacionada ao tamanho do array (n). A medida que cresce o tamanho de $n$, cresce também o tempo de execução do pior caso. O tempo de execução do algoritmo cresce de forma quadrática em relação ao tamanho da entrada, pois a função é quadrática. Faz sentido, certo? Comparar cada elemento de um array com todos os outros é da ordem de $n^2$.

É importante que você entenda que esse algoritmo é bem mais lento do que o anterior, pois uma função quadrática cresce mais rapidamente que uma função linear.

No material sobre [Análise Assintótica](http://joaoarthurbm.github.io/eda/posts/analise-assintotica) vamos aprender que essa função complicada pode ser simplificada para $n^2$ quando tratamos de grandes entradas, pois as constantes e os expoentes de menor magnitude não impactam muito nesse cenário. 

## Resumo

* Calcular o tempo de execução de um algoritmo é muito importante.

* Uma forma de calcular o tempo de execução é seguir os passos:
    
    * Identificar primitivas

    * Identificar o número de vezes que cada uma das primitivas é executada
    
    * Somar o custo total

* É preciso estar atento para o fato de que estamos falando de análise do pior caso e, por isso, descartamos os fluxos alternativos de menor custo.