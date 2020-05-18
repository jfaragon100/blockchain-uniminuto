FROM node:8.15.0

RUN mkdir /blockchain-um-app
ADD package.json /blockchain-um-app/
ADD models.js /blockchain-um-app/
ADD server-service.js /blockchain-um-app/
ADD socket-service.js /blockchain-um-app/
ADD main.js /blockchain-um-app/

RUN cd /blockchain-um-app && npm install

EXPOSE 8080
EXPOSE 6001

ENTRYPOINT cd /blockchain-um-app && npm install && NODES=$NODES npm start
