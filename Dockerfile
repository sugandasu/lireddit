FROM node:16.3.0
WORKDIR /usr/src/app

COPY package*.json ./

# RUN apt-get update && apt-get install bash
RUN npm install

COPY . .
EXPOSE 4000

CMD [ "npm", "run", "dev" ]