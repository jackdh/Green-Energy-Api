FROM node:carbon

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

ENV MONGO_URL=mongo

CMD [ "yarn", "start" ]