FROM node:18.12.1-slim
WORKDIR /usr/src/toystory
COPY package.json .
RUN npm install
COPY . .
CMD npm start