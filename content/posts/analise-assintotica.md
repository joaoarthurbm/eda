+++
title = "Análise Assintótica"
date = 2019-09-29
tags = []
categories = []
+++

***

# Contextualização

Quando observamos tamanhos de entrada grande o suficiente para tornar relevante apenas a ordem de crescimento do tempo de execução, estamos estudando a eficiência assintótica. 

No [material introdutório](https://joaoarthurbm.github.io/eda/posts/introducao-a-analise/) sobre análise de algoritmos, aplicando as diretrizes de simplificação, aprendemos que funções complexas podem ser mapeadas para classes de funções sobre as quais conhecemos o crescimento ($n$, $\log n$, $n^2$ etc). Para ilustrar esse mapeamento utilizamos a notação $\Theta$. Chegou a hora de entendermos o que essa notação significa.

Primeiro, preciso deixar claro que cometi alguns abusos matemáticos para fins didáticos. Vamos relembrar esses abusos e explicá-los um a um.

<p align="center">$2*n + 1 = \Theta(n)$</p>

Theta ($\Theta$) é um conjunto de funções. Nesse caso, o conjunto das funções lineares. Por isso, é um abuso dizer que $2*n + 1$ é $\Theta(n)$. A maneira formal de dizer é: $2*n + 1$ **pertence** a $\Theta(n)$. 

Além disso, poderíamos ter escolhido qualquer função linear para dizer que $2 * n + 1$ tem a mesma ordem de crescimento. Nós escolhemos $n$ porque é a mais simples.

***

# A notação $\Theta$

Agora vamos definir formalmente o que significa essa notação. Para duas funções $f(n)$ e $g(n)$, dizemos que $f(n)$ é $\Theta(g(n))$ se 

<p align="center">$0<=c1*g(n)<= f(n)<= c2*g(n), \forall n>=n0$</p>

Vamos entender o que essa inequação complicada quer nos dizer. Em um resumo bem simplista ela está dizendo que se a gente "imprensar" $f(n)$ com $g(n)$ multiplicada por duas constantes diferentes, dizemos que $f(n)$ é $\Theta(g(n))$. 

Vamos ao exemplo. Lembra da função que descreve o tempo de execução da busca linear? Vamos tentar mostrar que essa função é $\Theta(n)$.

<p align="center">$f(n) = 3*c*n+3*c$</p>

O primeiro passo que vamos fazer é trocar as constantes por 1. Isso já foi dito antes. Usar $c$ ou 1 tem o mesmo efeito. Assim, temos:

<p align="center">$f(n) = 3n+3$</p> 

Agora vamos voltar a inequação. Como "desconfiamos" que $f(n) = 3n+3$ é $\Theta(n), escolhemos $g(n)=n$. Poderíamos escolher qualquer função linear para representar $g(n)$, escolhemos a função linear mais simples para facilitar nossa vida. Assim, a inequação fica:

<p align="center">$0<=c1*n<= 3n+3<= c2*n, \forall n>=n0$</p>  

Agora precisamos encontrar valores para $c1$ e $c2$ para que essa inequação seja verdadeira. Vamos tentar com c1=1 e c2=6. 

<p align="center">$0<=n<= 3n+3<= 6*n, \forall n>=n0$</p>  

Se verificarmos com $n=1$, vemos que a inequação é verdadeira:

<p align="center">$0<=1<= 6<= 6$</p>  

Não é difícil também notar que $\forall n > 1$ ela sempre será verdadeira. Conseguimos, então, demonstrar que $f(n) \in \Theta(n)$, pois $g(n)=n$ limita inferior e superiomente $f(n)$. 

Na verdade, todas as funções lineares são limitadas inferior e superiormente por $n$. No nosso linguajar, podemos dizer que todas as funções abaixo pertencem a $\Theta(n)$.

<p align="center">$7*n, 827643*n, 5n+21, 54n +1...$</p>  


Formalmente dizemos que $g(n)=n$ é um limite assintótico restrito para $f(n)$. A figura abaixo descreve essa relação entre uma função quadrática e as funções $3n$ e $n^2$.

<img src="theta.png" alt="theta" width="1px" height="320px"/>

Em português estamos dizendo que existe, para grandes valores de $n$ e a partir de um número inteiro positivo $n0$, $c1$ e $c2$ tais que $c1*g(n)<= f(n)<= c2*g(n)$.

<pre>
Em termos mais simplistas estamos dizendo que o crescimento de 
f(n) é igual ao de g(n).
</pre>

**Outro exemplo.** Suponha que a função $7 * n^4 + 5 * n^2 +10$ descreva o custo de execução de um algoritmo. Se aplicarmos as abstrações simplificadoras, desconfiamos que $f(n) \in \Theta(n4)$, certo? Vamos demonstrar formalmente.

<p align="center">$0 <= c1 * n^4 <= 7 * n^4 + 5 * n^2 + 10 <= c2*n4, \forall n >= n0$</p>  

Se escolhermos $c1=7$, $c2=22$ e $n0=1$, temos:

<p align="center"> $ 0 <=7 <= 22 <= 22 $</p>

Na verdade, todas as funções quadráticas são limitadas inferior e superiormente por $n^2$. No nosso linguajar, podemos dizer que todas as funções abaixo pertencem a $\Theta(n^2)$.

<p align="center"> $ 43 * n^2 + 7n + 1, 5 * n^2 + 21, 7 * n^2...$ </p>

Em resumo, para demonstrar formalmente precisamos dos seguintes passos:

1. Aplicar as abstrações simplificadores em $f(n)$ para termos uma proposta para $g(n)$.

2. Encontrar valores de $c1$, $c2$ e $n0$ para os quais a inequação $0<=c1*g(n)<= f(n)<= c2*g(n)$ é verdadeira. 

Há mais 4(!) notações para estabelecer a relação entre funções. Neste material vamos ver apenas mais duas porque considero que é suficiente. Independente disso, todas são nada mais do que alterações na inequação que estabelecemos para $\Theta$. Por exemplo, a próxima notação que veremos, provavelmente a mais popular de todas, nada mais é do que retirar o limite inferior da inequação e apenas estabelecer um limite superior.

* * *

# Notação O (Big O notation)

Enquanto a notação $\Theta$ define os limites inferior e superior de uma função, a notação $O$ define apenas o limite superior. Ou seja, define um teto para uma determinada função. 

Para duas funções $f(n)$ e $g(n)$, dizemos que $f(n)$ é $O(g(n))$ se: 

<p align="center"> $0<=f(n)<= c*g(n), \forall n>=n0$ </p>

Veja que a diferença entre essa inequação e a utilizada para a notação é o fato de que aqui o limite inferior é 0 e não $c1 * g(n)$. A figura abaixo ilustra essa relação.

![bigo](bigo.png)

O processo para demonstrar que $f(n)$ é $O(g(n))$ é muito semelhante, mas nesse caso precisamos achar apenas os valores de $c$ e $n0$.

**Exemplo.** Suponha que a função $n^2 + 1$ descreva o custo de execução de um algoritmo. Se aplicarmos as abstrações simplificadoras, desconfiamos que $f(n) \in O(n^2)$, certo? Vamos demonstrar formalmente.

<p align="center"> $0 <= n^2 + 1 <= c * n^2, \forall n>=n0$ </p>

Se escolhermos c1=1 e n0=1, temos:

<p align="center"> $1 <= 1$ </p>

Como você pode perceber, toda função que pertence a $\Theta(n^2)$ também pertence a $O(n^2)$, porque $\Theta$ limita também superiormente como $O$.Contudo, nem toda função que pertence a $O(n^2)$, por exemplo, também pertence a $\Theta(n)$, pois $O$ estabelece apenas o limite superior. Por exemplo, a função $f(n) = 7$ é limitada superiormente por $n^2$, portanto é $O(n^2)$. Contudo, não podemos dizer que ela é $\Theta(n^2)$ porque não há constante multiplicadora que para n suficientemente grande faça com que $c1 * n^2$ seja menor do que $7n$.


Simples, não é? A notação $O$ é bastante utilizada em Computação para discutir a eficiência de algoritmos. E há aqui uma curiosidade. Como discutido no parágrafo anterior, basta escolhermos uma função com $n$ elevado a um expoente maior do que o da função sob análise que conseguimos definir um limite superior para ele. Por exemplo, a função $f(n) = n^2$ é $O(n^2)$, $O(n^3)$, $O(n^4)$, e assim por diante.  Todavia, faz mais sentido escolhermos uma função com o mesmo expoente, porque a informação é mais precisa. Ou seja, se uma função é quadrática, dizemos que ela é $O(n^2)$.

Por fim, outra particularidade dessa notação é que usamos com muita frequência nas discussões do a dia a notação $O$ ao invés da notação $\Theta$. Talvez porque seja mais fácil de falar $O$ do que theta e, como somos preguiçosos, tendemos a economizar energia até na fala. Mas é relevante destacar que, tipicamente, a semântica que queremos empregar nas discussões com o uso da notação $O$ é a mesma de $\Theta$. 

<pre>
Em termos mais simplistas estamos dizendo que o crescimento de 
f(n) é menor ou igual ao crescimento de g(n).
</pre>

***

# Notação Omega ($\Omega$)

A notação $\Theta$ define o limite inferior e superior. $O$ define apenas o limite superior. E $\Omega$? Acertou. Apenas o limite inferior. Para duas funções $f(n)$ e $g(n)$, dizemos que $f(n)$ é $\Omega(g(n))$ se: 

<p align="center"> $ 0 <= c * g(n) <= f(n), \forall n>=n0$ </p>


A figura abaixo ilustra essa relação.

![omega](omega.png)

O processo para demonstrar que $f(n)$ é $\Omega(g(n))$ é muito semelhante, mas nesse caso precisamos achar apenas os valores de $c$ e $n0$.

**Exemplo.** Suponha que a função $n^2 + 1$ descreva o custo de execução de um algoritmo. Se aplicarmos as abstrações simplificadoras, desconfiamos que $f(n) \in \Omega(n^2)$, certo? Vamos demonstrar formalmente.

<p align="center"> $ 0 <= c * n^2 <= n^2 + 1, \forall n >= n0$ </p>

Se escolhermos $c1=1$ e $n0=1$, temos:

<p align="center"> $ 1 <= 2$ </p>

Não é difícil perceber que essa inequação é verdadeira para todo $n0$ maior do que 1.

Como você pode perceber, toda função que pertence a $\Theta(n^2)$ também pertence a 
$\Omega(n^2)$, porque $\Theta$ limita também inferiormente como $\Omega$. Contudo, nem toda função que pertence a $\Omega(n^2)$ também pertence $\Theta(n^2)$, pois $\Omega(n^2)$ estabelece apenas o limite superior. Por exemplo, a função $f(n) = 7 * n$ é limitada inferiormente por $n$, portanto é $\Omega(n)$. Contudo, não podemos dizer que ela é $\Theta(n^2)$ porque não há constante multiplicadora que para $n$ suficientemente grande faça com que $c1 * n$ seja maior do que $7 * n^2$.

É simples definir um limite inferior para qualquer função. Basta utilizar o expoente 0. Ou seja, todas as funções são $\Omega(1)$. Mais do que isso, podemos escolher expoentes menores. Por exemplo, a função $f(n) = n^2$ é $\Omega(n)$, $\Omega(log n)$ e $\Omega(1)$. Todavia, faz mais sentido escolhermos uma função com o mesmo expoente, porque a informação é mais precisa. Ou seja, se uma função é quadrática, dizemos que ela é $\Omega(n^2)$.

<pre>
Em termos mais simplistas estamos dizendo que o crescimento de 
f(n) é maior ou igual ao crescimento de g(n).
</pre>

As duas notações restantes são $o$ (o minúsculo) e $\omega$ (omega minúsculo). Como disse, eu considero essas duas notações menos importantes que as demais e não vou discuti-las de forma aprofundada. 

**o (o minúsculo).** Apenas deixo aqui registrado que $o$ (o minúsculo) é muito semelhante à $O$,removendo apenas o sinal de igualdade da inequação:

<p align="center"> $0<=f(n)< c*g(n)$, \foralln>=n0$ </p>

Ou seja, **não** podemos dizer, por exemplo, que $f(n) = n^2 + 3$ é $o(n^2)$. $f(n) = n^2 + 3$ é $o(n^3)$, $o(n^4)$, $o(n^5)$ etc.   

Por outro lado $\omega$ é muito semelhante à $\Omega$, removendo apenas o sinal de igualdade da inequação:

<p align="center"> $0 <= c*g(n) < f(n), n>=n0$ </p>

Ou seja, **não** podemos dizer, por exemplo, que $f(n) = n^3 + 2$ é $\omega(n^3)$. $f(n) = n^3 + 2$ é $\omega(n^2)$, $\omega(n)$, $\omega(log n)$ etc.   

***

# Notas

Este material foi inspirado nos Capítulos 3 e 4 do livro "Algoritmos: Teoria e Prática" de Cormen et. al.
