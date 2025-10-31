# listeners/Dockerfile

# 1. Use uma imagem Node.js leve
FROM node:18-slim

# 2. Defina o diretório de trabalho
WORKDIR /usr/src/app

# 3. Copie o package.json do root para o diretório de trabalho
COPY package*.json ./

# 4. Instale SOMENTE dependências de produção
RUN npm ci --only=production

# 5. Copie apenas os arquivos necessários para o servidor
COPY listeners ./listeners
COPY lib ./lib

# 6. Comando para iniciar o servidor
CMD [ "node", "listeners/server.js" ]