# Estruturas de dados e Algoritmos 
<blockquote>Introdução à análise de algoritmos</blockquote>
<img class="center" style="width: 53%;" src="figures/capa.png"/>

<p>joao.arthur@computacao.ufcg.edu.br</p>
<a style="position: fixed; bottom: 2%; font-size:18px" href="http://joaoarthurbm.github.io/eda">joaoarthurbm.github.io/eda</a>

---

# Aula escrita

Conteúdo detalhado em <a style="font-size:20px" href="https://joaoarthurbm.github.io/eda/posts/introducao-a-analise/">joaoarthurbm.github.io/eda/posts/introducao-a-analise/</a>.

---

# Análise de algoritmos

O que é relevante investigar sobre um algoritmo?

<img class="center" style="width: 55%;" src="figures/analise.jpg"/>
--

- legibilidade, simplicidade, modularidade, facilidade de manutenção...

--

- corretude

--

- <b>eficiência/desempenho</b>

---

# Análise de eficiência: o que?

<blockquote>Determinar a quantidade de recursos computacionais que um algoritmo irá consumir.</blockquote>

<br>
Recursos computacionais: <b>processamento</b> e memória.

---

# Análise de eficiência: para que?

- Determinar o comportamento do algoritmo para diferentes tamanhos de entrada.

- Comparar diferentes soluções para o mesmo problema.

--

<br>
<img class="center" style="width: 80%; " src="figures/comparacao-ordenacao.jpeg"/>
---

# Análise de eficiência: por que?

Não basta comprar mais CPU e memória?

---

# Análise de eficiência: como?

#### Análise empírica

<img class="center" style="width: 80%; " src="figures/comparacao-ordenacao.jpeg"/>

É precisa, mas cara.

---

# Análise de eficiência: como?


Muitas vezes, não queremos esse nível de precisão. Nesses casos, precisamos de um método:

- Simples.

- Independente de plataforma.

- Permite generalização para um espectro maior de entrada.

- Análise sem execução.

<img style="width: 10%; position:fixed; bottom:5%; right:2%" src="figures/fx.png"/>

---

# Análise de eficiência: método analítico

```java
	public static int search(int[] v, int k) {

		for (int i = 0; i < v.length; i++)
			if (v[i] == k)
				return i;
		
		return -1;

	}
```

--

<img class="center" style="width:15%" src="figures/down.png" />

<center>
<p style="font-size:30px">f(n) = c<sub>1</sub> * n + c<sub>2</sub></p>
</center>

---

# Análise de eficiência: Operações primitivas


<blockquote>O custo de execução das operações primitivas é constante.
</blockquote>

--
<br>
* Avaliação de expressões booleanas (i >= 2; i == 2, etc);

* Operações matemáticas (*, -, +, %, etc);

* Retorno de métodos (return x;);

* Atribuição (i = 2);

* Acesso à variáveis e posições arbitrárias de um array (v[i]).

---

# Análise de eficiência: o processo

```java
int multiplicaRestoPorParteInteira(int i, int j) {
    int resto = i % j;
    int pInteira = i / j;
    int resultado = resto * pInteira;
    return resultado;
}```

--
1. Identificar as primitivas

2. Identificar quantas vezes cada uma das primitivas é executada.

3. Somar o custo total.

---

# Passo 1: Identificando primitivas


```java
int multiplicaRestoPorParteInteira(int i, int j) {
    int resto = i % j;
    int pInteira = i / j;
    int resultado = resto * pInteira;
    return resultado;
}```

--

c<sub>1</sub> -> atribuição (resto = )

--

c<sub>2</sub> -> operação aritmética (i % j)

--

c<sub>3</sub> -> atribuição (pInteira = )

--

c<sub>4</sub> -> operação aritmética (i / j)

--

c<sub>5</sub> -> atribuição (resultado = )

--

c<sub>6</sub> -> operação aritmética (resto * pInteira)

--

c<sub>7</sub> -> retorno de método (return resultado)

---

# Passo 2: Execuções das primitivas

```java
int multiplicaRestoPorParteInteira(int i, int j) {
    int resto = i % j;
    int pInteira = i / j;
    int resultado = resto * pInteira;
    return resultado;
}```

--

<b>1</b> * c<sub>1</sub> -> atribuição (resto = )

--

<b>1</b> * c<sub>2</sub> -> operação aritmética (i % j)

--

<b>1</b> * c<sub>3</sub> -> atribuição (pInteira = )

--

<b>1</b> * c<sub>4</sub> -> operação aritmética (i / j)

--

<b>1</b> * c<sub>5</sub> -> atribuição (resultado = )

--

<b>1</b> ** c<sub>6</sub> -> operação aritmética (resto * pInteira)

--

<b>1</b> * c<sub>7</sub> -> retorno de método (return resultado)

---

# Passo 3: Somar custo total

```java
int multiplicaRestoPorParteInteira(int i, int j) {
    int resto = i % j;
    int pInteira = i / j;
    int resultado = resto * pInteira;
    return resultado;
}```

<b>1</b> * c<sub>1</sub> -> atribuição (resto = )


<b>1</b> * c<sub>2</sub> -> operação aritmética (i % j)


<b>1</b> * c<sub>3</sub> -> atribuição (pInteira = )


<b>1</b> * c<sub>4</sub> -> operação aritmética (i / j)


<b>1</b> * c<sub>5</sub> -> atribuição (resultado = )


<b>1</b> ** c<sub>6</sub> -> operação aritmética (resto * pInteira)


<b>1</b> * c<sub>7</sub> -> retorno de método (return resultado)

--

<div style="font-size:24px; color:#bf2a19; position:fixed; bottom: 40%; right:10%">

f(n) = c<sub>1</sub> + c<sub>2</sub> + c<sub>3</sub> + c<sub>4</sub> + c<sub>5</sub> + c<sub>6</sub> + c<sub>7</sub>

</div>
---

# Análise de eficiência

```java
int multiplicaRestoPorParteInteira(int i, int j) {
    int resto = i % j;
    int pInteira = i / j;
    int resultado = resto * pInteira;
    return resultado;
}```

f(n) = c<sub>1</sub> + c<sub>2</sub> + c<sub>3</sub> + c<sub>4</sub> + c<sub>5</sub> + c<sub>6</sub> + c<sub>7</sub>

--

<br>
<br>
<blockquote>O tempo de execução é constante. Ou seja, independe do tamanho da entrada.</blockquote>

---


# Outro Exemplo: condicionais

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

**Lembrando dos passos:** 
- identificar as primitivas.
- identificar quantas vezes cada uma das primitivas é executada.
- somar o custo total.


---

# Análise de eficiência: Passo 1

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

c1...c13. Detalhes em: <a href="https://joaoarthurbm.github.io/eda/posts/introducao-a-analise/">joaoarthurbm.github.io/eda/posts/introducao-a-analise</a>

---

# Análise de eficiência: Passo 2

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

Estamos interessados no <b>pior caso</b>. Portanto, não consideramos a execução da primitiva c<sub>5</sub> (return 0).

---

# Análise de eficiência: Passo 3

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


f(n) = c<sub>1</sub> + c<sub>2</sub> + c<sub>3</sub> + c<sub>4</sub> + c<sub>6</sub> + c<sub>7</sub> + c<sub>8</sub> + c<sub>9</sub> + c<sub>10</sub> + c<sub>11</sub> + c<sub>12</sub> + c<sub>13</sub>

--
<blockquote>O tempo de execução é constante. Ou seja, independe do tamanho da entrada.</blockquote>

---

# Outro Exemplo: loop

```java
public static boolean contains(int[] v, int k) {
    for (int i = 0; i < v.length; i++)
        if (v[i] == k)
            return true;
    return false;
}```

---

# Análise de eficiência: Passo 1

```java
public static boolean contains(int[] v, int k) {
    for (int i = 0; i < v.length; i++)
        if (v[i] == k)
            return true;
    return false;
}```

--

c<sub>1</sub> -> atribuição (int i = 0)

--

c<sub>2</sub> -> avaliação de expressão booleana (i < v.length) 

--

c<sub>3</sub> -> operação aritmética (i++)

--

c<sub>4</sub> -> avaliação de expressão booleana (v[i] == k)

--

c<sub>5</sub> -> retorno de método (return true)

--

c<sub>6</sub> -> retorno de método (return false)

---

# Análise de eficiência: Passo 2

```java
public static boolean contains(int[] v, int k) {
    for (int i = 0; i < v.length; i++)
        if (v[i] == k)
            return true;
    return false;
}```


c1 é executada apenas uma vez.

--

c2 é executada (n+1) vezes. Exemplo: se n=5, temos as seguintes verificações: 0 < 5, 1 < 5; 2 < 5, 3 < 5, 4 < 5 e 5 < 5, quando encerra-se o loop. Ou seja, 6 verificações.

--

c3 é executada n vezes. Exemplo: se n=5, temos os seguintes incrementos em i: 1, 2, 3, 4 e 5, quando encerra-se o loop.

--

c4 é executada n vezes.

--

No pior caso, c5 não é executada.

--

c6 é executada apenas uma vez.

---

# Análise de eficiência: Passo 3

```java
public static boolean contains(int[] v, int k) {
    for (int i = 0; i < v.length; i++)
        if (v[i] == k)
            return true;
    return false;
}```

f(n) = c<sub>1</sub> + c<sub>2</sub> ∗ (n+1) + c<sub>3</sub> ∗ n + c<sub>4</sub> ∗ n + c<sub>6</sub>


Considerando todas as primitivas com custo c e simplificando a função, temos:

`f(n) = 3 * c * n + 3 * c`

--
<br>
<br>
<blockquote>O tempo de execução é linear. O valor de f(n) cresce linearmente em função do tamanho da entrada (n).</blockquote>

---

# Desafio

```java
public boolean contemDuplicacao(int[] v) {
    for (int i = 0; i < v.length; i++)
        for (int j = i + 1; j < v.length; j++)
            if (v[i] == v[j])
                return true;
    return false;
}
```

<a style="position: fixed; bottom: 5%; font-size:18px" href="https://joaoarthurbm.github.io/eda/posts/introducao-a-analise/">gabarito: joaoarthurbm.github.io/eda/posts/introducao-a-analise/</a>

---

# Resumo

- Estamos interessados na análise de eficiência. Em particular, tempo de processamento.

- Mais recursos computacionais nem sempre resolvem o problema.

- Método empírico é preciso, porém caro para o que queremos.

- Método analítico. Extrair a função que determina do custo de execução de um algoritmo:

	- identificar as primitivas.
	- identificar quantas vezes cada uma das primitivas é executada.
	- somar o custo total.

- Estamos interessados na análise de pior caso.


---
# Próximo encontro: Análise Assintótica

<a href=https://joaoarthurbm.github.io/eda/posts/analise-assintotica/>joaoarthurbm.github.io/eda/posts/analise-assintotica/</a>
<blockquote>Apenas a ordem de crescimento é relevante.</blockquote>

<blockquote>As constantes não importam.</blockquote>

---

# Estruturas de dados e Algoritmos 

<img class="center" style="width: 55%;" src="figures/capa.png"/>

<p style="position: fixed; bottom: 5%;">joao.arthur@computacao.ufcg.edu.br</p>
<a style="position: fixed; bottom: 4%; font-size:18px" href="http://joaoarthurbm.github.io/eda">joaoarthurbm.github.io/eda</a>