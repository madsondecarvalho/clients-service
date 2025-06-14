# Clients Service API

## Visão Geral

Esta API gerencia clientes, utilizando arquitetura limpa, cache Redis, mensageria Kafka e MongoDB. O projeto é modularizado em camadas de entidades, casos de uso, repositórios, serviços e controllers, facilitando testes e manutenção.

---

## Estrutura de Pastas

```
src/
  controllers/         # Controllers HTTP (Express)
  consumers/           # Consumers Kafka
  entities/            # Entidades de domínio (ex: Client)
  logger/              # Logger customizado
  repositories/        # Interfaces e implementações de repositórios
  services/            # Serviços externos (Redis, Kafka, etc)
  usecases/            # Casos de uso (business logic)
  config/              # Configurações (ex: conexão MongoDB)
  index.ts             # Entrypoint da API
  consumer.ts          # Entrypoint do consumer Kafka
```

---

## Funcionamento

- **API REST**: exposta em `/api`, permite CRUD de clientes.
- **Cache**: consultas usam Redis para acelerar respostas.
- **Mensageria**: criação de cliente publica evento no Kafka.
- **Consumer**: processa eventos Kafka e grava no MongoDB.
- **MongoDB**: armazena dados dos clientes.
- **Docker Compose**: orquestra API, consumer, MongoDB, Redis, Kafka e Zookeeper.

---

## Variáveis de Ambiente (`.env`)

Exemplo de `.env`:

```
# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=dev@redis
CACHE_TTL=86400

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/clients-service

# Kafka
KAFKA_BROKERS=kafka:9092
KAFKA_GROUP_ID=create-client-group
KAFKA_TOPIC=CREATE_CLIENT
```

---

## Comandos de Desenvolvimento

- **Instalar dependências**
  ```sh
  npm install
  ```

- **Rodar API localmente (hot reload)**
  ```sh
  npm run dev:api
  ```

- **Rodar consumer localmente (hot reload)**
  ```sh
  npm run dev:consumer
  ```

- **Rodar testes unitários**
  ```sh
  npm test
  ```

---

## Comandos Docker

- **Subir todos os serviços**
  ```sh
  docker-compose up --build
  ```

- **Derrubar todos os serviços**
  ```sh
  docker-compose down -v
  ```

- **Ver logs em tempo real**
  ```sh
  docker-compose logs -f api
  docker-compose logs -f consumer
  ```

---

## Endpoints Principais

- `GET    /api/clients`         — Lista todos os clientes (usa cache)
- `GET    /api/clients/:id`     — Busca cliente por ID (usa cache)
- `POST   /api/clients`         — Cria cliente (publica evento no Kafka)
- `PUT    /api/clients/:id`     — Atualiza cliente
- `DELETE /api/clients/:id`     — Remove cliente

---

## Fluxo de Criação de Cliente

1. **POST /api/clients**: Valida e publica evento no Kafka.
2. **Consumer Kafka**: Recebe evento, grava no MongoDB, atualiza cache.
3. **Cache Redis**: Mantém clientes recentes para respostas rápidas.

---

## Testes

- Os testes unitários estão em `src/usecases/client/__tests__/`.
- Use Jest para rodar todos os testes.

---

## Observações

- Use os comandos `npm run dev:api` e `npm run dev:consumer` apenas em desenvolvimento.
- Em produção, rode `npm run build` e use os arquivos transpilados de `dist/`.
- O Docker Compose já faz o mapeamento de volumes e hot reload via Nodemon para desenvolvimento.

---

## Testes com Postman

Além dos exemplos com `curl`, você pode importar a collection pronta do Postman para testar todos os endpoints rapidamente.

O arquivo da collection está em:

```
client-service.postman_collection.json
```

Basta importar esse arquivo no Postman para ter acesso a todos os endpoints e exemplos de requisição já configurados.

### Criar cliente
```sh
curl --location 'http://localhost:3000/api/client' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "teste da silva",
    "email": "test.1233525@example.com",
    "phone": "(84) 12312-0000"
}'
```

### Listar todos os clientes
```sh
curl --location 'http://localhost:3000/api/client'
```

### Buscar cliente por ID
```sh
curl --location 'http://localhost:3000/api/client/684dc73d7e8c1cbb77eb9ca7'
```

### Atualizar cliente
```sh
curl --location --request PUT 'http://localhost:3000/api/client/684dc73d7e8c1cbb77eb9ca7' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "João Atualizado",
    "email": "joao.test1231233@example.com",
    "phone": "(84) 98888-1111"
}'
```

### Remover cliente
```sh
curl --location --request DELETE 'http://localhost:3000/api/client/684dcf3fda3e6f3cec6abe77'
```

## Dúvidas?

Abra uma issue ou consulte os comentários no código para mais detalhes!