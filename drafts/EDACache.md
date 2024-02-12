# Estruturas de Dados Básicas e Cache

Este não é o material para você aprender cache. Há excelentes livros para isso.
Este material é usado na disciplina de estruturas de dados e serve para discutir como
usar as estruturas básicas (arrays, linkedlists e tabelas hash) para implementar algumas políticas de cache *eviction*. Portanto, o objetivo principal é mostrar a aplicação de EDAs no contexto de cache. Assim, vamos falar de alguns conceitos da área de maneira superficial.

O que é cache *eviction*? Bom, a tradução para *eviction* orbita entre remoção, expulsão, despejo e evicção. Trazendo para o nosso contexto, vamos dizer que é a remoção algo do cache.

E porque eu tenho que remover algo do cache? Bom, a essa altura já sabemos que cache é uma memória limitada. Por ser uma memória de rápido acesso, a capacidade de armazenamento do cache é limitada por questões de custo. Então, quando ela está cheia e você quer colocar um objeto lá, precisa remover outro antes.

E o que é política de cache *eviction*? Tão importante quanto remover um objeto do cache é saber qual objeto remover. A política de cache *eviction* determina qual será o elemento a ser removido.

Vamos discutir exemplos de políticas. Imagine que você é um leitor ávido e tem uma grande
coleção de livros em uma biblioteca particular em casa. O cômodo que abriga essa biblioteca é longe do seu quarto, onde você lê os livros. Por isso, você tem que escolher alguns para colocar no móvel ao lado da sua cama para poder acessar mais rápido quando você for ler. Isto é, no nosso cenário, a biblioteca pode representar o banco de dados ou o sistema de arquivos, ou seja, uma memória de alta capacidade de armazenamento, porém de acesso mais lento. Por outro lado, nossa cabeceira representa o cache. É muito mais fácil/rápido acessar o livro, mas ela tem uma capacidade reduzida.

Nesse cenário, sempre que eu precisar de um livro e ele estiver na cabeceira, ou seja, no cache, essa operação é considerada um **hit**. Isto é, eu procurei algo no cache e ele estava lá. 

Por outro lado, se eu procurar algo no cache e não encontrar, a operação é condiderada como "miss". Isto é, procurei algo no cache e não estava. No caso de um  *miss*, a operação deve continuar procurando o elemento na memória de acesso mais lento subsequente. Voltando para a nossa metáfora, eu procurei um livro na cabeceira e não encontrei (miss), então tive descer as escadas e ir na biblioteca pegar o livro.

Em termos bem simplistas, nosso objetivo é criar políticas/algoritmos que maximizem *hits* e minimizem *miss*.

> *Hit rate* e *Miss rate* são métricas para avaliar sistemas/políticas de cache. Ambas são taxas em relação ao total de operações.

Se só cabem 3 livros na nossa cabeceira e ela está cheia, quando eu trouxer um livro da biblioteca, qual livro eu vou remover da cabeceira? Em outros termos, qual a minha política de eviction?

Bom, chega de usar minha metáfora. Daqui em diante eu estou considerando que você já entende o que é cache, que ele é limitado, que precisamos decidir o que remover dele quando ele estiver cheio etc.

## Nosso Primeiro Cenário: FIFO (First In First Out)

Nosso cache é um array de tamanho 3, manipulado como uma fila. Ele está vazio, por enquanto.

`fila = [null, null, null]`

Agora, vamos analisar uma primeira operação de busca por um determinado objeto no nosso sistema:

`get("a")` -> miss!

Nesse caso, o primeiro passo é procurar o objeto com chave "a" no cache. Como ele não está lá, procuramos na outra memória. Se encontrarmos, colocarmos no cache. Digamos que esse seja o caso. Então, o estado do cache depois dessa primeira operação é:

`fila = ["a", null, null]`

Agora, outra duas operações com comportamento similar:

`get("b")` -> miss!
`get("c")` -> miss!

O estado do nosso cache atualmente é:

`fila = ["a", "b", "c"]`

Nosso cache está cheio. Vamos ver outras operações:

`get("a")` -> hit!
`get("b")` -> hit!
`get("c")` -> hit!

Essas últimas 3 operações foram excelentes porque procuramos elementos que estavam no cache, ou seja, hit. Isso faz com que a operação não tenha que ir até a memória mais lenta para buscar o dado.

Veja que nosso cache continua cheio. Vamos agora ver, na prática, um caso de eviction baseado em FIFO.

`get("d")` -> miss! 

Procuramos pela chave "d" e não encontramos. Então tivemos que ir na memória mais lenta e agora precisamos colocar "d" no cache. A pergunta é: quem sai?

Na política FIFO, o primeiro que entrou no cache é escolhido para sair. Ou seja, vamos remover "a" do cache. O estado fica:

`fila = ["b", "c", "d"]`

Veja o código:

```
shiftLeft(0);
fila[fila.length - 1] = newElement;
```

Vamos agora procurar por "a".

`get("a")` -> miss!

"a" foi o primeiro a entrar no cache e, por isso, teve que sair para dar lugar para "d", por isso o *miss*. Mas agora, a operação vai na memória mais lenta, encontra "a" e precisa colocar no cache novamente. Quem sai? O mais antigo dos presentes (FIFO), ou seja, "b". O estado do cache fica:

`fila = ["c", "d", "a"]`

Entendeu? A partir de agora, se eu procurar por um objeto e ele não estiver no cache (miss), vamos inclui-lo. Para isso, precisamos remover alguém do cache. Nossa escolha é por ordem de chegada. O que está há mais tempo, ou seja, na cabeça da fila, sai (FIFO).

## Discutindo a eficiência das operações

Vamos analisar o código da operação get:

```
public Pair get(String chave) {
	TODO: implementar
}
```


**hit**. A busca por um elemento no cache é O(n), pois executamos busca linear em um array de tamanho `n`. Como encontramos, a operação total é O(n).

**miss**. A busca por um elemento no cache é $O(n)$, pois executamos busca linear em um array de tamanho `n`. Como não encontramos no cache, somente na outra memória, e precisamos ajustar o array para ele ser inserido, essa segunda operação também é $O(n)$, pois temos que fazer o shiftLeft. Nós já vimos o shiftLeft no material de ArrayList [link](https://joaoarthurbm.github.io/eda/posts/arraylist/). A soma das duas operações seria $2n$, o que sabemos que do ponto de vista assintótico continua $O(n)$. Mas é importante que você saiba que há o shift a ser feito.

Note que a operação miss tem uma agravante importante: ela inclui uma ida ao banco. Naturalmente, é mais lenta. Contudo, estamos analisando aqui os aspectos da nossa solução FIFO.

### Uma otimização

Na prática, conseguimos melhorar?! Sim! Se considerarmos a fila como circular e usarmos a operação `%`, conseguimos manipular head e tail em O(1) e dispensamos a necessidade de fazer o shift. A adição de um novo elemento no cache seria apenas:

```
cache.tail = (cache.tail + 1) % capacidade;
cache[tail] = newElement;
cache.head = (cache.head + 1) % cache.length;
```

Contudo, a operação toda (o get) continua sendo O(n). Só reduzimos uma passada no array, o que não é suficiente para reduzir a classe de complexidade O(2n) = O(n). Por isso eu disse que há melhora na prática, mas a classe de complexidade é a mesma. Nosso limitante aqui é a busca linear no cache.


E se eu maniver o array ordenado e executar busca binária? Como a busca linear é nosso limitante, você pode pensar que manter ordenado e executar busca binária (O(log(n))) pode ser uma otimização. Contudo, manter um array ordenado através de inserção ordenada também é O(n). Nesse caso, trocaríamos uma operação O(n) por uma O(n) + O(log(n)).

E se eu ordenar o array e efetuar busca binária? Ordenar um array por comparação é, no melhor caso, O(nlog(n)). Também não compensaria.

### Uma segunda otimização mais atraente

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

Nota. É importante você lembrar o funcionamento do removeFirst() e do addLast() da classe Fila. Ambos feitos em O(1) através da manipulação dos índices com o operador %, tratando a fila como circular.


## Outra política de cache: Least Recently Used (LRU)

Na seção passada exploramos 










