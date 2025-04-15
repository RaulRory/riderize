# Riderize

## Descrição

Riderize é uma API desenvolvida em **JavaScript** com o objetivo de gerenciar agendamentos de pedaladas para ciclistas. O projeto utiliza **GraphQL** como ponto de entrada para as requisições e **PostgreSQL** como banco de dados principal. Além disso, implementa cache com **Redis** e segue princípios de **Clean Code** para facilitar a manutenção e escalabilidade.

## Requisitos Funcionais

- [x] Construído com **Node.js**.
- [x] API baseada em **GraphQL**.
- [x] Persistência de dados em **PostgreSQL**.
- [x] Autenticação via **JWT**.

## Requisitos Não Funcionais

- [x] Cache para consultas de listagem.
- [x] Suporte a **Docker**.
- [_] Hospedagem em serviços como Heroku, AWS ou GCP.
- [_] Pipeline de CI/CD.
- [x] Testes automatizados (unitários e E2E).

## Use case

- [x] Será preciso também listar os pedais que o usuário participou;
- [x] Listar também os pedais que o usuário criou;
- [x] Não permitir inscrição em pedais depois da última data de inscrição;
- [x] User_id vem de alguma tabela de usuário ao seu critério;

## Estrutura do Projeto

```plaintext
riderize/
├── prisma/
│   └── schema.prisma          # Arquivo de definição do banco de dados Prisma
├── src/
│   ├── application/
│   │   └── use-case/          # Casos de uso da aplicação
│   │       ├── registration-ride.js
│   │       ├── makeCreateCiclystUseCase.js
│   │       └── makeListCyclistUseCase.js
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── prisma/        # Configuração do Prisma
│   │   │   │   └── prisma-client.js
│   │   │   └── redis/         # Configuração do Redis
│   │   │       └── redis-repository.js
│   │   ├── http/
│   │   │   ├── rest/
│   │   │   │   ├── controller/
│   │   │   │   │   └── cyclist/
│   │   │   │   │       └── cyclist-controller.js
│   │   │   │   └── factories/
│   │   │   │       └── makeListCyclistUseCase.js
│   │   │   └── graphql/       # Configuração do GraphQL
│   │   │       └── schema.graphql
│   ├── libs/
│   │   └── joi.js             # Validação de dados com Joi
│   └── server.js              # Configuração do servidor Fastify
├── tests/                     # Testes unitários e E2E
├── docker-compose.yml         # Configuração do Docker
├── package.json               # Dependências do projeto
└── readme.md                  # Documentação do projeto
```

## Como rodar o projeto localmente

1. Certifique-se de ter o **Docker** instalado.
2. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/riderize.git
   cd riderize
   ```
3. Suba os serviços com Docker:
   ```bash
   docker-compose up ---build
   ```
4. Acesse a API no endereço: `http://localhost:3000`.

## Como rodar os testes

Para executar os testes automatizados, utilize o comando:

```bash
npm test
```

Os testes incluem tanto unitários quanto de ponta a ponta (E2E), garantindo a qualidade do código e o funcionamento correto da API.
```