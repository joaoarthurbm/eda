# Implementação do Particionamento de Hoare

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
