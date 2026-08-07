+++
title = "TreeMap"
date = 2026-08-06
tags = []
categories = []
github = "https://github.com/jefferson-stanley/treemap" 
+++

# TreeMap

TreeMap é uma estrutura de dados de mapa ordenado que se utiliza de uma [Árvore Preto-vermelha](link) como motor de armazenamento. Por ser ordenada, ela garante que as operações de busca, inserção e remoção tenham uma complexidade $O(\log n)$, se mantendo sempre balanceada.

Já vimos diversas estruturas de dados de mapa, desde as mais simples até as mais complexas, então porque é interessante que estudemos mais uma dessas estruturas? Sendo direto ao ponto, isso se deve ao fato de que o TreeMap permite que os dados sejam organizados e classificados automaticamente com base nos valores de suas chaves (sejam elas alfabéticas, numéricas, etc.) independente de quando foram inseridos.

## Introdução

Primeiramente é importante falar que, por ser baseado em uma Árvore Preto-vermelha, o TreeMap necessariamente vai seguir as mesmas [propriedades](link) fundamentais de tal árvore. É imprescindível ter isso em mente. Agora, em questões de implementação, o que faz o TreeMap se diferenciar das outras estruturas de dados?


É isso que iremos ver a seguir.

## Por que e como manter a árvore ordenada?

### Por que ordenar? Cenários práticos

Primeiro que ao percorrer a árvore, os dados irão vir em ordem, seja ela crescente ou decrescente. Dessa forma, implica também que é muito mais fácil de encontrar os valores antecessores e sucessores, menores ou maiores que um determinado valor. Além disso, com a ordenação da árvore, é possível extrair fatias menores do mapa, sem que seja preciso percorrer todos os elementos. 

Imagine um cenário em que uma turma participe de um Amigo Secreto e para não haver valores muito discrepantes de presentes, vocês estipulem uma faixa de preços. Por exemplo: valor mínimo do presente - 75 reais, valor máximo do presente - 130 reais. Sendo assim, não faz sentido um integrante da turma procurar um presente que se encaixe nesse preço em um quiosque de rua ou fiteiro, muito menos em uma loja de grife, o ideal é buscar lojas específicas que atendam os requisitos. O trabalho do TreeMap é justamente esse, delimitar o espaço amostral, extrair fatias menores do mapa, ou seja, buscar lojas adequadas à faixa de preço de 70 a 130 reais.

Com esse exemplo é possível pensar em diversas outras situações em que seria ideal a utilização de um TreeMap para a resolução de um problema.

### Como manter a árvore ordenada? 

Para que seja possível manter a árvore ordenada, sem que se saiba com antecedência qual o tipo de dado que ele irá armazenar, a linguagem precisa de algum mecanismo que possibilitará comparar dois objetos e dizer qual vem antes do outro.

Em Java, tal ordenação é garantida por meio de duas estratégias:

Comparable: o objeto que serve como chave irá implementar a interface `Comparable` e definir uma regra própria de comparação no seu método "compareTo(Object o)".

Comparator: no momento da criação do TreeMap, é fornecido um objeto `Comparator` para definir como deve ser feita a comparação entre as chaves.

Basicamente, a diferença entre as duas estratégias está na forma em que se deseja que seja ordenada. Você pode ordenar por uma data, em ordem alfabética, por um dígito identificador, entre muitas outras possibilidades. No caso, a ordenação fica a critério do usuário.

## Regras de Organização do TreeMap

Por ser baseado em Árvore PV, é ela quem vai cuidar do balanceamento e das rotações por trás dos panos, o trabalho do TreeMap vai ser garantir que os pares (Chave, Valor) estejam organizados corretamente.

Temos três regras para garantir o funcionamento e a organização do TreeMap:

Ordenação Obrigatória por Chave: toda a ordenação é baseada nas chaves, em que obrigatoriamente a chave à esquerda é menor e a chave à direita é maior, de acordo com qual parâmetro está sendo utilizado para a ordenação (númerica, alfabética, etc).

Unicidade de Chaves: o mapa não permite chaves duplicadas. Caso tentarmos inserir uma chave já existente, o valor associado a ela é sobrescrito.

Imutabilidade do Critério de Comparação: o critério usado para comparação (seja por `Comparable` ou `Comparator`) deve ser o mesmo durante toda a vida útil do mapa.

### O que É e o que NÃO É um TreeMap válido?

Vamos analisar como a estrutura armazena os pares de dados em memória e o que violaria as regras de um `TreeMap`.

#### Exemplo válido

As chaves numéricas identificam o produto e definem a posição exata na árvore. Note que a busca por qualquer chave segue perfeitamente a propriedade de busca binária, independente dos valores (nomes dos produtos) armazenados:

<figure style="align: center; margin-left:5%; width: 90%">
    <img src="exemploValido.png">
    <figcaption align="center">
        Exemplo de TreeMap válido
    </figcaption>
</figure>

#### Exemplos inválidos

    Violação da Propriedade de Busca (Ordenação incorreta):

<figure style="align: center; margin-left:5%; width: 90%">
    <img src="exemploInvalido.png">
    <figcaption align="center">
        Exemplo de TreeMap inválido
    </figcaption>
</figure>

É inválido porque a chave `60` é maior que a chave `50`, mas está alocada na subárvore à esquerda, o que quebra o algoritmo de busca (`get`), que vai buscar `60` à direita e não o encontrará.

## Modelagem da Classe e Estrutura do Nó

Sabendo das regras de um mapa ordenado, é hora de vermos a implementação em Java.

Cada elemento/nó dentro da árvore não armazena apenas um valor simples, mas sim uma entrada contendo a chave, o valor e os ponteiros de navegação.

Vejamos uma versão simplificada de como a classe `TreeMap` e seu nó interno (`Entry`) são estruturados em Java:

```java
public class TreeMap<K, V> {

    private Entry<K, V> root;
    private Comparator<? super K> comparator;

    public TreeMap() {
        this.root = null;
        this.comparator = null;
    }

    public TreeMap(Comparator<? super K> comparator) {
        this();
        this.comparator = comparator;
    }

    public boolean isEmpty() {
        return this.root == null;
    }

    // Nó interno que representa cada par (Chave, Valor) no mapa
    static class Entry<K, V> {
        K key;
        V value;
        Entry<K, V> left;
        Entry<K, V> right;
        Entry<K, V> parent;
        boolean color;

        Entry(K key, V value, Entry<K, V> parent) {
            this.key = key;
            this.value = value;
            this.parent = parent;
            this.left = null;
            this.right = null;
            this.color = true; // Por padrão, entra como vermelho
        }
    }
}
```
## Implementação

Após já ter introduzido o conceito de uma árvore ordenada, vamos analisar como funciona a implementação de um TreeMap.

Lembrando: tenha sempre em mente as propriedades de uma Árvore Preto-Vermelha, já que nos baseamos nela para construção do nosso mapa.

Então, felizmente, em relação aos métodos fundamentais, você não precisará quebrar a cabeça com nenhum algoritmo novo que seja completamente diferente do que já vimos na disciplina. A única responsabilidade adicional do TreeMap sobre a BST é gerenciar o par (Chave, Valor) e garantir o balanceamento $O(\log n)$, que é realizado via Árvore Preto-Vermelha.

### Busca no TreeMap

A operação de busca no TreeMap vai reaproveitar a lógica clássica da Árvore Binária de Pesquisa (BST). A grande diferença é que a comparação será feita usando o mecanismo de comparação configurado (```Comparator``` ou ```Comparable```).

Seguindo essa lógica:

A busca começará pela raiz. Se a chave procurada for menor que a chave atual, caminhamos para a subárvore à esquerda. Se for maior, caminhamos para a direita. Se for igual, encontramos a chave e retornamos o seu valor correspondente. Se alcançarmos uma referência nula (null), a chave não está presente no mapa.

### Inserção no TreeMap (put)

A inserção de um novo par (Chave, Valor) vai ser dividido em duas etapas principais:

Inserção no padrão BST: faremos uma navegação pela árvore usando o Comparable ou Comparator até encontrar a posição que seja adequada para a chave. Se a chave já existir, apenas substituímos o valor atual. Se não existir, inserimos o novo nó Entry<K,V> como uma folha ```Vermelha```.

Rebalanceamento: nesse processo de inserir um novo nó vermelho, podemos violar as regras da Árvore Preto-Vermelha (como ter dois nós vermelhos em sequência). É nesse caso que entra o algoritmo de ajuste:

Ele analisa a cor do "tio" do nó inserido para executar as rotações ou trocas de cores necessárias para restaurar o balanceamento da árvore. Tudo isso já foi explicado no material de [Árvore Preto-vermelha](link).

### Remoção no TreeMap (remove)

Assim como na inserção, a remoção de um par (Chave, Valor) também é dividida em duas etapas:

A remoção também segue o padrão BST, localizamos o nó correspondente à chave, se o nó tiver nenhum ou apenas um filho, ele é simplesmente removido. Se tiver dois filhos, encontramos o seu sucessor (o menor nó da subárvore à direita), copiamos a chave/valor do sucessor para o nó atual e removemos o nó sucessor original (caindo no caso de 0 ou 1 filho).

Se o nó removido for Vermelho, nenhuma propriedade da Árvore Preto-Vermelha é violada (a altura preta se mantém igual e não criamos conflitos de nós vermelhos consecutivos).
Se o nó removido for Preto, a altura preta de uma das subárvores diminui, criando um problema que precisa ser resolvido. Aqui o algoritmo de rotações e alteração de cores entra em ação, de forma a reestabelecer as propriedades da árvore em $O(\log n)$. Lembrando, tudo isso já foi explicado no material de Árvore Preto-Vermelha.



### Fatiamento do mapa (subMap)

Uma das vantagens mais fáceis de ser observada em relação a mapas não-ordenados é a capacidade de realizar consultas/buscas por intervalos sem que seja necessário percorrer todos os elementos do mapa.

```java
TreeMap<Double, String> lojasPorPreco = new TreeMap<>();

lojasPorPreco.put(45.0, "Fiteiro da praça");
lojasPorPreco.put(80.0, "Loja de calçados");
lojasPorPreco.put(120.0, "Loja de roupas");
lojasPorPreco.put(250.0, "Loja de perfumes");

// Resgatando o exemplo do Amigo Secreto (Faixa de preço: R$ 75 a R$ 130)
NavigableMap<Double, String> lojasIdeais = lojasPorPreco.subMap(75.0, true, 130.0, true);

// Saída: {80.0=Loja de calçados, 120.0=Loja de roupas}
System.out.println(lojasIdeais);
```

### Outros métodos

Alguns outros métodos do TreeMap que são relevantes para serem mencionados:

***firstEntry()*** retorna o par (Chave, Valor) associado à menor chave no mapa.

***firstKey()*** retorna a menor Chave do mapa.

***lastEntry()*** retorna o par (Chave, Valor) associado à maior chave no mapa.

***lastKey()*** retorna a maior Chave do mapa.

***lowerKey(K key)*** retorna a maior Chave estritamente menor que a Chave passada como parâmetro.

***higherKey(K key)*** retorna a menor Chave estritamente maior que a Chave passada como parâmetro.


## Considerações finais

Devido às propriedades e às vantagens que o TreeMap apresenta, ele é a escolha ideal quando a aplicação exige acesso indexado por intervalos, busca por proximidade ou navegação constante por elementos em ordem estrita. Embora possua um overhead maior de memória por nó (devido aos ponteiros de pai e cor) e um custo de inserção/remoção ligeiramente maior do que o HashMap devido ao rebalanceamento, ele entrega buscas com performance previsível e garantida de $O(\log n)$ em qualquer cenário.

## Contribuições

[Jefferson Stanley](https://github.com/jefferson-stanley) contribuiu para a escrita deste post.\
[Pedro Barbosa](https://github.com/barbosapdr) contribuiu para a escrita deste post.