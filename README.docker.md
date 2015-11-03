# Running in Docker

## Setup

Install docker and docker-compose

Then setup your environment variables:

    sed 's/export //' env.test > env.docker

## Running

    docker-compose build

    docker-compose up

### If on Linux host
visit http://localhost:5000

### If not Linux

Find your docker IP:

    docker-machine default ip

Visit your http://(docker host ip):5000
