FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY yarn.lock ./

# Instalar dependências com Yarn
RUN yarn install 

COPY . .


RUN yarn build --no-lint

EXPOSE 3000

CMD ["yarn", "start"]