FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install webpack
COPY . .
RUN npm run build
EXPOSE 8080
CMD ["node", "dist/main.js"]