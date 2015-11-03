FROM node:0.12

RUN mkdir /src
WORKDIR /src

COPY . /src

# build the project only if it needs to
RUN if [ ! -d "node_modules" ]; then npm install; fi

CMD npm start
