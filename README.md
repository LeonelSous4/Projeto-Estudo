# 🍽️ API Restaurant - Documentação Completa & Guia de Arquitetura

Esta documentação foi elaborada para ser o seu **guia de estudo definitivo**, explicando tanto a **regra de negócio da vida real** quanto a **arquitetura técnica de código**, arquivo por arquivo, com diagramas visuais e exemplos dissecados.

---

## 📑 Sumário
1. [O Fluxo do Restaurante na Vida Real (Mapa de Ação)](#1-o-fluxo-do-restaurante-na-vida-real-mapa-de-ação)
2. [O Mapa Visual Técnico da Arquitetura](#2-o-mapa-visual-técnico-da-arquitetura)
3. [Entrada da Aplicação (`src/server.ts`)](#3-entrada-da-aplicação-srcserverts)
4. [Camada de Rotas (`src/routes/`)](#4-camada-de-rotas-srcroutes)
5. [Camada de Controladores (`src/controllers/`)](#5-camada-de-controladores-srccontrollers)
6. [Camada de Banco de Dados (`src/database/`)](#6-camada-de-banco-de-dados-srcdatabase)
7. [Camada de Segurança e Erros (`src/utils/` e `src/middlewares/`)](#7-camada-de-segurança-e-erros)
8. [Dicionário de Conceitos e Pegadinhas Comuns](#8-dicionário-de-conceitos-e-pegadinhas-comuns)

---

## 1. O Fluxo do Restaurante na Vida Real (Mapa de Ação)

Pense na API não apenas como código, mas como os acontecimentos do dia a dia em um restaurante:

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             JORNADA DO CLIENTE NO RESTAURANTE                   │
└──────────────────────────────────────────────────────────────────────────────────┘

   [ 1. PREPARAÇÃO DO RESTAURANTE ]
   • As mesas já estão numeradas no salão (Tabela 'tables' via Seeds: mesas 1 a 5).
   • O cardápio está cadastrado (Tabela 'products': Pizza, Suco, Macaxeira, etc.).
                    │
                    ▼
   [ 2. CHEGADA DO CLIENTE NA MESA ]
   • O cliente senta na Mesa 3.
   • O garçom abre o atendimento no sistema:
     POST /tables-sessions  ->  { "table_id": 3 }
   • O banco grava a sessão em 'tables_sessions' com 'opened_at' (hora de abertura).
                    │
                    ▼
   [ 3. FAZENDO OS PEDIDOS ]
   • O cliente escolhe 2 Sucos de Laranja (Produto ID 10):
     POST /orders  ->  { "table_session_id": 1, "product_id": 10, "quantity": 2 }
   • O banco verifica se a mesa 3 está aberta e se o produto existe.
   • O banco grava o pedido em 'orders', "congelando" o preço unitário do momento.
                    │
                    ▼
   [ 4. CONSULTA E CONTA DA MESA ]
   • O garçom quer ver o que a mesa 3 já pediu:
     GET /orders/table-session/1
     (A API usa JOIN com 'products' para mostrar: "2x Suco de Laranja = R$ 24,00")
   • O cliente pede a conta total:
     GET /orders/table-session/1/total
     (A API calcula a soma: SUM(price * quantity) = Total R$ 24,00)
                    │
                    ▼
   [ 5. PAGAMENTO E SAÍDA ]
   • O cliente paga a conta. O garçom encerra a mesa:
     PATCH /tables-sessions/1
   • O banco atualiza 'closed_at' com a data e hora do encerramento.
   • A Mesa 3 agora está livre para novos clientes!
```

---

## 2. O Mapa Visual Técnico da Arquitetura

Como uma requisição HTTP viaja pelos arquivos do seu código TypeScript:

```text
Insomnia / Cliente HTTP
        │
        ▼ (Requisição chega na porta 4000)
  [ src/server.ts ]
  ├── 1. app.use(express.json())        -> Converte JSON em Objeto JS
  ├── 2. app.use(routes)                -> Envia para a Central de Rotas
  │            │
  │            ▼
  │     [ src/routes/index.ts ]         -> Analisa o início da URL
  │     ├── /products        ──► [ products.routes.ts ]
  │     ├── /tables          ──► [ tables.routes.ts ]
  │     ├── /tables-sessions ──► [ tables-sessions.routes.ts ]
  │     └── /orders          ──► [ orders.routes.ts ]
  │                                    │
  │                                    ▼ (Chama o método específico)
  │                            [ Controllers ]
  │                            ├── 1. Valida entradas com Zod (body, params, query)
  │                            ├── 2. Consulta/Grava com Knex no SQLite
  │                            └── 3. Responde com status (200, 201) e JSON
  │                                    │
  │ (Se der qualquer erro)             ▼
  │ ◄─────────────────────────── next(error)
  │
  └── 3. app.use(errorHandling)        -> A Ambulância Central
               ▲
               ├── Se foi "instanceof AppError"  -> Devolve 400/404 com mensagem amigável
               ├── Se foi "instanceof ZodError"  -> Devolve 400 com campos que falharam
               └── Erro inesperado               -> Devolve 500 (Internal Server Error)
```

---

## 3. Entrada da Aplicação (`src/server.ts`)

Este é o ponto de partida de toda a API. Ele inicializa o servidor Express e registra os componentes globais na ordem correta.

```typescript
import express from "express";
import { routes } from "./routes";
import { errorHandling } from "./middlewares/error-handling";

const PORT = 4000;
const app = express();

// 1. Permite receber corpos de requisição em formato JSON
app.use(express.json());

// 2. Conecta todas as rotas da aplicação
app.use(routes);

// 3. REGRA DE OURO: O middleware de erros DEVE vir sempre DEPOIS das rotas!
app.use(errorHandling);

// 4. Liga o servidor para escutar na porta definida
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
```

### 🧠 Por que a ordem importa tanto aqui?
O Express funciona como uma **cascata (top-to-bottom)**. Se o `app.use(errorHandling)` ficasse antes de `app.use(routes)`, ele seria executado antes de qualquer rota existir e nunca conseguiria resgatar os erros delas.

---

## 4. Camada de Rotas (`src/routes/`)

As rotas são os endereços da API. Elas associam uma **URL + Método HTTP** a uma função de um **Controller**.

### A Central: `src/routes/index.ts`
Agrupa todas as rotas do sistema para que o `server.ts` precise importar apenas um arquivo:

```typescript
import { Router } from "express";
import { productsRoutes } from "./products.routes";
import { tablesRoutes } from "./tables.routes";
import { tablesSessionsRoutes } from "./tables-sessions.routes";
import { ordersroutes } from "./orders.routes";

const routes = Router();

// Define os prefixos de cada recurso:
routes.use("/products", productsRoutes);
routes.use("/tables", tablesRoutes);
routes.use("/tables-sessions", tablesSessionsRoutes);
routes.use("/orders", ordersroutes);

export { routes };
```

---

### Exemplo Dissecado: `src/routes/orders.routes.ts`

```typescript
import { Router } from "express";
import { OrdersController } from "@/controllers/orders-controller";

const ordersroutes = Router();
const ordersController = new OrdersController();

// POST http://localhost:4000/orders
// Cria um novo pedido na mesa
ordersroutes.post("/", ordersController.create);

// GET http://localhost:4000/orders/table-session/:table_session_id
// Lista todos os pedidos de uma sessão específica
ordersroutes.get("/table-session/:table_session_id", ordersController.index);

// GET http://localhost:4000/orders/table-session/:table_session_id/total
// Calcula o valor total e quantidade de itens daquela sessão
ordersroutes.get("/table-session/:table_session_id/total", ordersController.show);

export { ordersroutes };
```

> **Atenção aos dois pontos (`:`):**  
> Sempre que uma rota tem `:nome_do_parametro` (como `:table_session_id`), os dois pontos devem vir **obrigatoriamente antes**. Eles avisam ao Express que aquele trecho da URL é uma variável dinâmica enviada pelo cliente.

---

## 5. Camada de Controladores (`src/controllers/`)

O Controller é a **cozinha da aplicação**. Ele é o cérebro responsável por:
1. Extrair os dados da requisição (`params`, `query`, `body`).
2. Validar se os dados estão corretos usando o **Zod**.
3. Conversar com o banco de dados via **Knex**.
4. Devolver a resposta com `response.status().json()`.
5. Se algo falhar, capturar no `catch` e disparar `next(error)`.

### Exemplo Dissecado Linha por Linha: `OrdersController`

```typescript
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/appError";
import { knex } from "@/database/knex";
import { z } from "zod";

class OrdersController {
    // 1. CRIAR PEDIDO (POST /orders)
    async create(request: Request, response: Response, next: NextFunction) {
        try {
            // Regra de validação com Zod
            const bodySchema = z.object({
                table_session_id: z.number(),
                product_id: z.number(),
                quantity: z.number().gt(0)
            });

            // .parse() valida os dados recebidos no body
            const { table_session_id, product_id, quantity } = bodySchema.parse(request.body);

            // Verifica se a sessão da mesa existe
            const session = await knex<tableSessionsRepository>("tables_sessions")
                .where({ id: table_session_id })
                .first();

            if (!session) {
                throw new AppError("session table not found", 404);
            }

            // Verifica se a sessão já foi encerrada
            if (session.closed_at) {
                throw new AppError("this table session is already closed", 400);
            }

            // Busca o produto para capturar o preço atual
            const product = await knex<ProductRepository>("products")
                .where({ id: product_id })
                .first();

            if (!product) {
                throw new AppError("product not found", 404);
            }

            // Insere o pedido congelando o preço no momento da compra
            await knex<OrderRepository>("orders").insert({
                table_session_id,
                product_id,
                quantity,
                price: product.price // Preço congelado!
            });

            return response.status(201).json();
        } catch (error) {
            next(error); // Encaminha para o errorHandling
        }
    }

    // 2. LISTAR ITENS DO PEDIDO COM JOIN (GET /orders/table-session/:table_session_id)
    async index(request: Request, response: Response, next: NextFunction) {
        try {
            const { table_session_id } = request.params;

            const orders = await knex("orders")
                .select(
                    "orders.id",
                    "orders.table_session_id",
                    "orders.product_id",
                    "products.name",       // Vem da tabela products graças ao JOIN!
                    "orders.price",
                    "orders.quantity",
                    knex.raw("(orders.price * orders.quantity) AS total"), // Preço x Quantidade
                    "orders.created_at",
                    "orders.updated_at"
                )
                .join("products", "products.id", "orders.product_id") // Faz a união das tabelas
                .where({ table_session_id })
                .orderBy("orders.created_at", "desc");

            return response.json(orders);
        } catch (error) {
            next(error);
        }
    }

    // 3. CALCULAR O TOTAL DA CONTA (GET /orders/table-session/:table_session_id/total)
    async show(request: Request, response: Response, next: NextFunction) {
        try {
            const { table_session_id } = request.params;

            // COALESCE(SUM(...), 0) garante que se não houver pedidos, o total devolvido será 0 em vez de null
            const total = await knex("orders")
                .select(
                    knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
                    knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity")
                )
                .where({ table_session_id })
                .first();

            return response.json(total);
        } catch (error) {
            next(error);
        }
    }
}

export { OrdersController };
```

---

## 6. Camada de Banco de Dados (`src/database/`)

O projeto utiliza **SQLite** com **Knex.js** (Query Builder), proporcionando facilidade de configuração e versionamento completo do banco.

### Arquitetura de Conexão: `knexfile.ts` e `src/database/knex.ts`

* **`knexfile.ts`**: Contém o endereço do arquivo (`./src/database/db.sqlite`), o cliente (`sqlite3`) e as pastas de migrations e seeds.
* **`src/database/knex.ts`**:
  ```typescript
  import knexConfig from "knex";
  import config from "../../knexfile";

  // Inicializa e exporta a conexão que os controllers vão usar
  export const knex = knexConfig(config);
  ```
  *(Renomeamos a importação para `knexConfig` para não haver conflito de nomes com a constante `knex` que exportamos).*

---

### As Migrations (A Planta das Tabelas)
Migrations são o controle de versão do banco. Cada migration possui duas funções:
* **`up`**: O que deve ser criado ou alterado no banco.
* **`down`**: Como desfazer (rollback) caso algo dê errado.

#### As 4 Tabelas Criadas:
1. **`products`**: `id`, `name`, `price`, `created_at`, `updated_at`.
2. **`tables`**: `id`, `table_number`, `created_at`, `updated_at`.
3. **`tables_sessions`**: `id`, `table_id` (chave estrangeira referenciando `tables.id`), `opened_at`, `closed_at`.
4. **`orders`**: `id`, `table_session_id` (referencia `tables_sessions.id`), `product_id` (referencia `products.id`), `quantity`, `price`, `created_at`, `updated_at`.

---

### As Seeds (`src/database/seeds/`)
Scripts para popular o banco automaticamente com dados iniciais de teste:
* `insert-products.ts`: Cadastra itens como Refrigerante, Pizza, Sucos.
* `insert-tables.ts`: Cadastra as mesas de 1 a 5.

**Comandos essenciais do Knex no Terminal:**
```bash
# Executa as migrations pendentes
npm run knex -- migrate:latest

# Desfaz a última migration executada
npm run knex -- migrate:rollback

# Executa as seeds para popular dados de teste
npm run knex -- seed:run
```

---

## 7. Camada de Segurança e Erros

Em uma API profissional, erros nunca devem derrubar o servidor nem vazar informações confusas.

### A Classe de Erro Customizada: `src/utils/appError.ts`
É o "molde" para identificar erros previstos causados pelo cliente (dados inválidos, ID não encontrado, etc.):

```typescript
class AppError {
    message: string;
    statusCode: number;

    constructor(message: string, statusCode: number = 400) {
        this.message = message;
        this.statusCode = statusCode; // Se não informar, o padrão é 400 (Bad Request)
    }
}

export { AppError };
```

---

### A Ambulância Central: `src/middlewares/error-handling.ts`

```typescript
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError";
import { ZodError } from "zod";

export function errorHandling(
    error: any,
    request: Request,
    response: Response,
    _: NextFunction // O 4º parâmetro é OBRIGATÓRIO para o Express saber que é função de erro!
) {
    // 1. Erro previsto disparado com AppError (ex: "mesa não encontrada", 404)
    if (error instanceof AppError) {
        return response.status(error.statusCode).json({ message: error.message });
    }

    // 2. Erro de validação do Zod (ex: enviou texto onde era número, campo obrigatório ausente)
    if (error instanceof ZodError) {
        return response.status(400).json({
            message: "validation error",
            issues: error.format()
        });
    }

    // 3. Erro inesperado / Bug do servidor (Status 500)
    return response.status(500).json({ message: error.message });
}
```

---

## 8. Dicionário de Conceitos e Pegadinhas Comuns

### 1. `params` vs `query` vs `body`
* **`request.params`**: Na estrutura da URL (`/orders/table-session/:table_session_id`). Usado para identificar um recurso único (sempre chega como string!).
* **`request.query`**: Na URL após o `?` (`/products?name=pizza`). Usado para filtros e buscas opcionais.
* **`request.body`**: No corpo oculto da requisição em JSON (`{ "name": "Pizza", "price": 45 }`). Usado em `POST` e `PUT`.

### 2. O que o `.join()` faz de verdade?
Une duas tabelas relacionais baseando-se em uma igualdade:
```typescript
.join("products", "products.id", "orders.product_id")
```
Significa: *"Para cada linha de `orders`, encontre o produto em `products` cujo `id` seja idêntico ao `orders.product_id` e junte as duas linhas lado a lado"*.

### 3. Por que `.first()` precisa de parênteses?
`.first()` é um método que dispara a execução da busca no Knex e retorna apenas um objeto. Se você esquecer os parênteses (`.first`), você não executa a busca, e a variável recebe a função interna do Knex em vez do registro do banco!

### 4. O que o `?? ""` (Nullish Coalescing) faz na busca de produtos?
```typescript
.whereLike("name", `%${name ?? ""}%`)
```
* Se o cliente enviou `?name=suco` ➡️ busca `%suco%` (filtra por suco).
* Se o cliente não enviou nada (`undefined`) ➡️ substitui por `""`, virando `%%` (no SQL significa "qualquer coisa", retornando todos os produtos sem quebrar).

### 5. Foreign Key Constraint Failed (`SQLITE_CONSTRAINT`)
Acontece quando você tenta inserir um registro filho referenciando um pai inexistente (ex: criar um pedido para a mesa `10` quando no banco só existem as mesas `1` a `5`). Para resolver, cadastre o registro pai primeiro (via Seeds ou Create).

