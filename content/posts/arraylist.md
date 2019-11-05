+++
title = "Listas Baseadas em Arrays (ArrayList)"
date = 2019-10-26
tags = []
categories = []
+++
<aside><i class="fab fa-github fa-lg" aria-hidden="true"> </i> <a href="https://github.com/joaoarthurbm/eda-ufcg/tree/master/java/src/arraylist"> <font color="#1980e6"> <b>Código utilizado nesta aula</b></font></a></aside>
***

Array é a primeira estrutura de dados que abordamos na disciplina. Há razões para essa escolha. Em primeiro lugar, arrays estão presentes na biblioteca padrão de grande parte das linguagens de programação. Além disso, também são estruturas simples e eficientes. Por último, outras estruturas mais complexas baseiam sua implementação em arrays, como é o caso de ArrayList, assunto deste material. 

Antes de partirmos para os detalhes de ArrayList, vamos destacar algumas desvantagens na manipulação de arrays que nos motivam a construir ArrayList. Todas essas desvantagens compartilham um incômodo comum: o programador deve ser responsável por diversas verificações e operações adicionais para manter a consistência do array. Vejamos:

**O array possui tamanho fixo.** Caso seja preciso armazenar mais elementos, é preciso criar um outro e transferir os elementos do array original para esse novo array. Isso não é algo que o programador queira se preocupar sempre. Por isso é preciso que isso seja feito de forma transparente para quem deseja usar uma estrutura de dados que cresce "dinamicamente". O tamanho fixo também implica dizer que nem sempre a quantidade de elementos presentes no array é igual a sua capacidade. Por isso, o programador também tem que controlar quantas posições estão, de fato, sendo utilizadas.

**Não é possível remover uma posição do array.** O que fazemos, normalmente, é atribuir aquela posição para null. Contudo, isso cria um "buraco" no array. O programador deve decidir se afasta todos os outros objetos para a esquerda ou se convive com aquele "buraco". Conviver nesse contexto significa espalhar pelo código verificações como `if alunos[i] != null`. Novamente, idealmente o programador não precisaria se preocupar com isso. Isso deveria ser transparente para quem está usando uma estrutura de dados.

Então, em resumo, como já vimos no passado, array é uma estrutura eficiente da qual queremos tirar proveito, mas muitas das preocupações que estão incluídas no seu uso podem ser transparentes para o programador. Essa é a proposta da classe ArrayList: fornecer uma API com operações de uma lista, mas esconder detalhes como remanejamento de elementos na remoção, aumento da capacidade da estrutura na adição de elementos, entre outras tarefas.

***

# ArrayList

Para fins didáticos, neste material vamos construir uma lista baseada em arrays que armazena objetos do tipo Aluno. O objeto do tipo Aluno possui dois atributos: matrícula e nome. A partir de agora, instâncias desse tipo serão representadas pela notação (matrícula, nome), por exemplo, (123, "Cartola").

```java
public class Aluno {

    private Integer matricula;
    private String nome;
    
    public Integer getMatricula() {
        return this.matricula;
    }

    public String getNome() {
        return this.nome;
    }
...
}
```

## Organização interna: atributos, constantes e construtores

Vamos lá.  Em primeiro lugar, vamos dar uma olhada na definição da classe, seus atributos e construtores:

```java
public class ArrayList {

    private int[] lista;
    public static final int CAPACIDADE_DEFAULT = 20;
    private int tamanho;
    
    public ArrayList() {
        this(CAPACIDADE_DEFAULT);
    }
    
    public ArrayList(int capacidade) {
        this.lista = new int[capacidade];
        this.tamanho = 0;
    }

           ...

}
```

Um objeto do tipo ArrayList possui dois atributos: o array ***lista***, que armazena os objetos e o inteiro *tamanho*, que representa a quantidade de elementos presente na lista. A classe ArrayList possui também uma constante ***CAPACIDADE_DEFAULT*** que define em 20 a capacidade inicial da lista, caso o programador não queira redefini-la. Por fim, dois construtores são definidos: um padrão, caso o programador não queira redefinir o tamanho inicial da lista e um recebendo como parâmetro a capacidade desejada.

## Operações básicas: inserção, remoção e busca.

### Inserção

Há três formas de se inserir um elemento em uma ArrayList:

1. `boolean add(Aluno aluno)`
2. `void add(int index, Aluno aluno)`
3. `void set(int index, Aluno aluno)`

Todas, naturalmente, recebem como parâmetro o elemento a ser adicionado. A primeira não requer um índice específico e, por isso, assume que a inserção do novo elemento deve ser feita no fim da lista, isto é, na próxima posição livre do array. As outras duas formas requerem o índice ***index*** em que a operação deve ser realizada. A diferença entre essas duas últimas é que uma inclui o novo elemento na posição ***index*** e desloca os elementos à frente uma posição para a direita, enquanto a outra altera o valor da posição ***index***.

Há uma preocupação interna para os métodos 1 e 2. Para ambos, é preciso checar se o array já não está completamente preenchido. Caso isso seja verdade, precisamos criar um novo array, adicionar todos os elementos do array original nesse novo array e aí sim inserir o novo elemento. Estamos chamando essa rotina de ***resize***. 

Para o método 2 precisamos também deslocar os elementos a frente da posição ***index*** para a direita (***shiftParaDireita()***) para então incluir o elemento na posição ***index***.

Por fim, as estratégias 2 e 3 precisam verificar se o índice a ser alterado é válido ou não, isto é, se está dentro dos limites da lista.

Vamos ao código.

```java
...

    public boolean add(Aluno aluno) {
        assegureCapacidade(this.tamanho + 1);
        this.lista[this.tamanho++] = aluno;
        return true;
    }
    

    public void add(int index, Aluno aluno) {
        if (index < 0 || index >= this.tamanho)
            throw new IndexOutOfBoundsException();
        
        assegureCapacidade(this.tamanho + 1);
        
        shiftParaDireita(index);
        
        this.lista[index] = aluno;
        this.tamanho += 1;
        
    }
    
    public void set(int index, Aluno aluno) {
        if (index < 0 || index >= this.tamanho)
            throw new IndexOutOfBoundsException();
        this.lista[index] = aluno;
    }

    private void shiftParaDireita(int index) {
        if (index == this.lista.length - 1) 
            throw new IndexOutOfBoundsException();
        
        for (int i = this.tamanho; i > index; i--) {
            this.lista[i] = this.lista[i-1];
        }
    }
...
```
Estamos tentando seguir o padrão da API de Java para a assinatura dos métodos. Por isso o primeiro método retorna um booleano para indicar se a adição foi feita ou não. Pode parecer estranho porque o retorno é sempre ***true***, mas isso faz sentido porque essa assinatura é herdada do contrato da interface ***List***.

É importante discutir a chamada ao método ***assegureCapacidade(int capacidadePretendida)***. Por ser baseada em array, uma ***ArrayList*** é limitada ao tamanho do array definido inicialmente. Caso queira crescer dinamicamente, é preciso checar se há a capacidade pretendida e, se não houver, realizar o resize. Isto é, criar um novo array e transferir os elementos do array inicial para o novo. Ambos os métodos são privados, pois a ideia é que essas preocupações sejam internas e transparentes ao usuário de uma ***ArrayList***. Vamos ver como isso é feito:

```java
...
    private void assegureCapacidade(int capacidadePretendida) {    
        if (capacidadePretendida > this.lista.length)
            resize(Math.max(this.lista.length * 2, capacidadePretendida));
    }
        
    private void resize(int novaCapacidade) {
        Aluno[] novaLista = new Aluno[novaCapacidade];
        for (int i = 0; i < this.lista.length; i++)
            novaLista[i] = this.lista[i];
        this.lista = novaLista;
    }
...
```

**assegureCapacidade.** Este método verifica se a nova capacidade pretendida é atendida pelo tamanho atual da lista. Caso não seja, o método invoca ***resize*** para criar uma nova lista cujo tamanho o máximo entre o dobro da lista original ou a capacidade nova pretendida. Esse cálculo do máximo entre os dois é feito porque queremos evitar realizar muitos ***resize*** e, por isso, fazemos um ***resize*** de no mínimo o dobro do tamanho original.

**resize.** Este método cria um novo array e transfere os elementos do array original para ele.

A **análise de desempenho** dessas operações precisa levar em consideração dois fatores: o ***resize*** e o ***shiftParaADireita()***. 

Não podemos afirmar que o método ***add(Aluno aluno)*** é executado em tempo constante, mesmo que grande parte das vezes isso seja verdade. Por exemplo, para uma lista de tamanho original 20, as 20 primeiras adições são executadas em tempo constante, mas a 21 primeira precisa executar o ***resize***, que é realizado em $O(n)$, pois envolve iterar por todo o array antigo e transferir os elementos para o novo array. Contudo, também não podemos dizer que o método ***add(Aluno aluno)*** é $O(n)$, pois o ***resize*** é executado apenas quando o limite é alcançado. Nesse caso, dizemos a operação é $O(1)$ amortizado, ou seja, o custo para adicionar $n$ elementos na lista é $O(n)$.

Para a análise do método ***add(int index, Aluno aluno)*** temos que levar em consideração que o ***shiftParaADireita*** no pior caso é $O(n)$. Esse pior caso se manifesta quando queremos adicionar um elemento no índice 0 da lista. Assim, teríamos que iterar sobre todo o array deslocando os elementos para frente.

### Remoção

Há duas formas de se remover um elemento em uma ***ArrayList***: pelo índice e pelo valor.

1. remove(int index)
2. remove(Aluno aluno)

Ambos precisam rearranjar os elementos para não deixar "buracos" na lista. Chamamos essa rotina de ***shiftParaEsquerda***. A diferença é que o método 2 precisa procurar o elemento antes de realizar o *shift*. Veja o exemplo abaixo para entender o porquê de termos que afastar para a esquerda todos os elementos à frente do removido.

$lista = [9, 2, 1, 8, 24, 3, -7]$, com tamanho = 7.

Se quisermos remover o elemento no índice 2, precisamos afastar para a esquerda os elementos à frente e atualizar, naturalmente, a variável ***tamanho***. Após a execução do método ***remove(2)***, temos a lista nas seguintes condições:

$lista = [9, 2, 8, 24, 3, -7, -7]$, com $tamanho = 6$, isto é, a última posição (6) passa a estar livre para uma nova adição, caso seja preciso. Perceba que os índices 0 e 1 ficaram inalterados e, a partir disso, o índice $i$ passou a receber o valor em $i+1$. Note também que o último índice fica com o valor anterior, mas ele não faz parte da lista, pois os limites são 0 e $tamanho - 1$. Vamos ao código.

```java
...           
    public Aluno remove(int index) {
        if (index < 0 || index >= this.tamanho)
            return null;
        
        Aluno aluno = this.get(index);
        
        shiftParaEsquerda(index);
        this.tamanho -= 1;
        return aluno;
    }
    
    public boolean remove(Aluno aluno) {
        if (aluno == null) return false;
        
        for (int i = 0; i < this.tamanho; i++) {
            if (this.lista[i].equals(aluno)) {
                this.remove(i);
                return true;
            }
        }
        
        return false;
    }

    private void shiftParaEsquerda(int index) {
        for (int i = index; i < this.tamanho - 1; i++) {
            this.lista[i] = this.lista[i+1];
        }
    }
...
```
Novamente, a preocupação em rearranjar os elementos é exclusiva de quem desenvolveu a lista, não de quem está usando-a.

Como a remoção envolve realocar todos os elementos à frente do removido para a esquerda, a operação, no pior caso, é $O(n)$. Esse pior caso se manifesta quando queremos remover o primeiro elemento da lista.

### Busca

De um modo geral, podemos dizer que há 3 cenários de busca: i) quando queremos acessar o elemento em um determinado índice; ii) quando queremos encontrar o índice em que um elemento está e iii) quando queremos verificar a presença de um elemento na lista. Essas aspirações podem ser satisfeitas pelos seguintes métodos:

Aluno get(int index)
int indexOf(Aluno aluno)
boolean contains(Aluno aluno)

O método 1 é executado em tempo constante O(1), pois o índice é fornecido como parâmetro. A única preocupação é verificar se o índice é válido ou não.

```java
...
    public Aluno get(int index) {
        if (index < 0 || index >= this.tamanho)
            throw new IndexOutOfBoundsException();
        return this.lista[index];
    }
...
```

Os outros dois métodos são instâncias de busca linear $(O(n))$, pois devem iterar sobre a lista procurando pelo objeto passado como parâmetro.

```java
...            
    public int indexOf(Aluno aluno) {
        for (int i = 0; i < tamanho; i++)
            if (this.lista[i].equals(aluno))
                return i;
        return -1;
    }
    
    public boolean contains(Aluno aluno) {
        return this.indexOf(aluno) != -1;
    }
...
```

O método ***indexOf*** itera sobre a lista procurando um elemento igual ao passado como parâmetro. Se encontrar, retorna o índice desse elemento. Ou seja, se houver mais de uma ocorrência do valor procurado, o índice da primeira ocorrência é retornado. Caso contrário, retorna -1. 

O método ***contains*** utiliza a rotina efetuada pelo método ***indexOf***. Caso o índice retornado seja igual a -1, retorna *false*. Caso contrário, retorna *true*.

***

# Notas

Por motivos de simplificação, a classe ***ArrayList*** que implementamos neste material implementa uma lista baseada em arrays para manipular objetos do tipo ***Aluno***. Naturalmente, por ser de propósito geral, a implementação de Java de ***ArrayList*** permite o armazenamento e manipulação de qualquer objeto.