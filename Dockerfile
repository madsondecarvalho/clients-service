FROM node:22-alpine

# Diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala dependências de produção
RUN npm ci --omit=dev

# Copia o restante do código
COPY . .

# Compila o TypeScript
RUN npm run build

# Expõe a porta da API (ajuste se necessário)
EXPOSE 3000

# Comando padrão (pode ser sobrescrito pelo docker-compose)
CMD ["npm", "run", "start:api"]
CMD ["npm", "run", "start:consumer"]