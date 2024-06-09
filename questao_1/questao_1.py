# 1. Questão de Programação:

# ◦ Descrição: Implemente uma função em Python que recebe uma lista de inteiros e 
#   retorna uma nova lista contendo apenas os números pares.
# ◦ Exemplo de entrada: [1, 2, 3, 4, 5, 6]
# ◦ Exemplo de saída: [2, 4, 6]

# RESOLUÇÃO:

print('Digite valores inteiros e aperte enter para obter apenas os números pares:')

lista_de_inteiros = []

while True:
    inteiro = input()
    if inteiro == '':
        break
    else:
        numero_inteiro_int = int(inteiro)
        lista_de_inteiros.append(numero_inteiro_int)
    print(lista_de_inteiros)
    print('Caso tenha terminado de digitar, digite enter novamente: ')

lista_de_inteiros_pares = []

for inteiro in lista_de_inteiros:
    if inteiro % 2 == 0:
        lista_de_inteiros_pares.append(inteiro)

print('Lista dos números pares digitados:\n',lista_de_inteiros_pares)