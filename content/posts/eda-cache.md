# Estruturas de Dados Básicas e Cache

Este não é o material para você aprender cache. Há excelentes livros para isso.
Este material é usado na disciplina de estruturas de dados e serve para discutir como
usar as estruturas básicas (arrays, linkedlists e tabelas hash) para implementar algumas políticas de cache *eviction*. Portanto, o objetivo principal é mostrar a aplicação de EDAs no contexto de cache. Assim, vamos falar de alguns conceitos da área de maneira superficial.

O que é cache *eviction*? Bom, a tradução para *eviction* orbita entre remoção, expulsão, despejo e evicção. Trazendo para o nosso contexto, vamos dizer que é a remoção algo do cache.

E porque eu tenho que remover algo do cache? A essa altura já sabemos que cache é uma memória limitada. Por ser uma memória de rápido acesso, a capacidade de armazenamento do cache é limitada por questões de custo. Então, quando ela está cheia e você quer colocar um objeto lá, precisa remover outro antes.

E o que é política de cache *eviction*? Tão importante quanto remover um objeto do cache é saber qual objeto remover. A política de cache *eviction* determina qual será o elemento a ser removido.

Vamos discutir exemplos de políticas. Imagine que você é um leitor ávido e tem uma grande
coleção de livros em uma biblioteca particular em casa. O cômodo que abriga essa biblioteca é longe do seu quarto, onde você lê os livros. Por isso, você tem que escolher alguns para colocar no móvel ao lado da sua cama para poder acessar mais rápido quando você for ler. Isto é, no nosso cenário, a biblioteca pode representar o banco de dados ou o sistema de arquivos, ou seja, uma memória de alta capacidade de armazenamento, porém de acesso mais lento. Por outro lado, nossa cabeceira representa o cache. É muito mais fácil/rápido acessar o livro, mas ela tem uma capacidade reduzida.

Nesse cenário, sempre que eu precisar de um livro e ele estiver na cabeceira, ou seja, no cache, essa operação é considerada um **hit**. Isto é, eu procurei algo no cache e ele estava lá.

Por outro lado, se eu procurar algo no cache e não encontrar, a operação é condiderada como **miss**. Isto é, procurei algo no cache e não estava. No caso de um  **miss**, a operação deve continuar procurando o elemento na memória de acesso mais lento subsequente, por exemplo, o BD. Voltando para a nossa metáfora, eu procurei um livro na cabeceira e não encontrei (miss), então tive descer as escadas e ir na biblioteca pegar o livro. Ruim, né?

Em termos bem simplistas, nosso objetivo é criar políticas/algoritmos que maximizem *hits* e minimizem *miss*.

> *Hit rate* e *Miss rate* são métricas para avaliar sistemas/políticas de cache. Ambas são taxas em relação ao total de operações.

Se só cabem 3 livros na nossa cabeceira e ela está cheia, quando eu trouxer um livro da biblioteca, qual livro eu vou remover da cabeceira? Em outros termos, qual a minha política de *eviction*?

## Nosso Primeiro Cenário: FIFO (First In First Out)

Nosso cache é um array de tamanho 3, manipulado como uma fila. Ele está vazio, por enquanto.

`fila = [null, null, null]`

Agora, vamos analisar uma primeira operação de busca por um determinado objeto no nosso sistema:

`get("a")` -> miss!

Nesse caso, o primeiro passo é procurar o objeto com chave "a" no cache. Como ele não está lá, procuramos no BD. Se encontrarmos, colocarmos no cache. Digamos que esse seja o caso. Então, o estado do cache depois dessa primeira operação é:

`fila = ["a", null, null]`

Minha política é trazer o livro que comecei a ler para a cabeceira para que ele seja facilmente acessado nas próximas vezes que eu for ler.

Agora, outra duas operações com comportamento similar:

`get("b")` -> miss!

`get("c")` -> miss!

O estado do nosso cache atualmente é:

`fila = ["a", "b", "c"]`

Nosso cache está cheio. Vamos ver outras operações:

`get("a")` -> hit!

`get("b")` -> hit!

`get("c")` -> hit!

Essas últimas 3 operações foram excelentes porque procuramos elementos que estavam no cache, ou seja, hit. No nosso caso, procuramos livros que estão na cabeceira. Isso faz com que a operação não tenha que ir até a memória mais lenta para buscar o dado.

Veja que nosso cache continua cheio. Vamos agora ver, na prática, um caso de *eviction* baseado em FIFO.

`get("d")` -> miss! 

Procuramos pela chave "d" e não encontramos. Então tivemos que ir no BD e agora precisamos colocar "d" no cache. A pergunta é: quem sai?

Na política FIFO, o primeiro que entrou no cache é escolhido para sair. O raciocínio por trás é "este livro está a mais tempo na cabeceira, então ele deve sair para dar espaço para as minhas novas leituras". Ou seja, vamos remover "a" do cache. O estado fica:

`fila = ["b", "c", "d"]`

Vamos agora procurar por "a".

`get("a")` -> miss!

"a" foi o primeiro a entrar no cache e, por isso, teve que sair para dar lugar para "d", por isso o *miss*. Mas agora, a operação vai na memória mais lenta, encontra "a" e precisa colocar no cache novamente. Quem sai? O mais antigo dos presentes (FIFO), ou seja, "b". O estado do cache fica:

`fila = ["c", "d", "a"]`

Entendeu? A partir de agora, se eu procurar por um objeto e ele não estiver no cache (miss), vamos inclui-lo. Para isso, precisamos remover alguém do cache. Nossa escolha é por ordem de chegada. O que está há mais tempo, ou seja, na cabeça da fila, sai (FIFO).

Note que isso é um pouco diferente da nossa outra implementação de FIFO, em que lançamos exceção quando a fila está cheia. No cache isso não acontece, nós sobrescrevemos o elemento que está no início da fila toda vez que ela estiver cheia e precisarmos fazer uma adição.

## Discutindo a eficiência das operações

Vamos analisar o código da operação get:

```
public Pair get(String chave) {
	TODO: implementar
}
```


**hit**. A busca por um elemento no cache é O(n), pois executamos busca linear em um array de tamanho `n`. Como encontramos, a operação total é O(n).

**miss**. A busca por um elemento no cache é $O(n)$, pois executamos busca linear em um array de tamanho `n`. Como não encontramos no cache, somente na outra memória, precisamos também adicionar esse novo elemento na fila. Essa operação, se tratarmos a fila de maneira circular (veja como <a class="external" href="https://joaoarthurbm.github.io/eda/posts/fifoarray/">neste material</a>), é O(1). Como sabemos, O(n) + O(1) é O(n). 

Note que a operação **miss** tem uma agravante importante: ela inclui uma ida ao banco. Naturalmente, é mais lenta. Contudo, estamos analisando aqui os aspectos isolados da nossa solução FIFO.

### Uma otimização

Se usarmos a técnica da fila circular, a adição fica em O(1) sem termos que fazer shift. Portanto, o nosso fator limitante aqui é a busca O(n). E se eu melhorasse a busca usando outra estutura de dados que otimiza essa operação? Funciona, né? Essa solução implica em criar outra estrutura auxiliar, nesse caso um HashMap, para otimizar a operação de busca. 

Nosso cache seria então composto de uma fila, que organiza a ordem de chegada e saída, e de uma tabela, que nos permite busca em O(1).

Funciona assim, quando um get é feito, nós não vamos mais iterar na fila para procurar o elemento, vamos direto na tabela hash, que nos dá busca em tempo constante. Se o elemento estiver na tabela, ótimo, retornamos. Caso não esteja, incluímos na tabela e na fila para futuras consultas. 

Note que essa solução introduz um problema: ocupamos mais memória, pois temos que manter os objetos na fila e na tabela. Além disso, remover algo do cache significa remover da fila e da tabela, mas esse não é um problema tão grande porque ambos são O(1). 

Mesmo com essa complexidade de código adicional, vale a pena em termos de tempo de execução, pois a operação toda é executada em tempo constante:

- procurar, adicionar e remover na tabela é tempo constante; e
- adicionar e remover da fila é tempo constante.

Como ficaria o código?

```
public Pair get(String key) {

	// O(1)
	Pair p = tabela.get(key);
	
	// não está no cache
	if (p == null) {
		// busca no banco
		// Pair p = bd.get("key")

		//adiciona na tabela
		tabela.put(p.key, p);
		
		// adicionando na fila.
		
		// se a fila está cheia, precimos tirar o mais antigo do cache. Isso
		// significa remover da fila o elemento que está em head e remover esse mesmo
		// elemento da tabela.
		if (fila.isFull()) {
			Pair pToRemove = fila.removeFirst();
			tabela.remove(pToRemove.key);
		}

		fila.addLast(p);
	}

	return p; 
 
}
```

Nota. É importante você lembrar o funcionamento do removeFirst() e do addLast() da classe Fila. Ambos feitos em O(1) através da manipulação dos índices com o operador %, tratando a fila como circular. Veja isso bem detalhado no <a class="external" href="https://joaoarthurbm.github.io/eda/posts/fifoarray/">material de fila</a> da disciplina.

## Discussão sobre FIFO como política de cache

FIFO sempre vai ser uma boa política? Não muito. Veja que o livro mais antigo na cabeceira não é necessariamente o que menos consulto. Imagine que eu seja um ser bem religioso e traga a bíblia para a minha cabeceira. Eu leio todos os dias um versículo, ou seja, a bíblia tem uma popularidade muito alta e recente para mim e, portanto, quero mante-la no cache. Contudo, se eu passar a ler mais 3 livros, ela vai sair do cache mesmo sendo muito popular e eu lendo ela diariamente, entende? 

FIFO pode não ser interessante em cenários que temos objetos muito populares (que são usados bastante) e muito quentes (usados recentemente). Por isso, há outras políticas de cache que tentam levar em consideração essas variáveis. Por exemplo, Least Frequently Used remove do cache o objeto de menor frequência de acesso, enquanto Least Recently Used remove o objeto que não é acessado há mais tempo. Em breve vamos tratar dessas políticas em uma evolução deste material.

---
