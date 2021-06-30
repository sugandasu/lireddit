FROM node
WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update
RUN npm install

COPY . .
EXPOSE 4000

CMD [ "npm", "run", "dev2" ]