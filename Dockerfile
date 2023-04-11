FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install webpack
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node","dist/main"]