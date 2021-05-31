FROM node:16-alpine3.11

RUN mkdir recruitment

COPY docker.env /recruitment/.env
COPY package.json /recruitment
COPY package-lock.json /recruitment
COPY tsconfig.json /recruitment
COPY src /recruitment/src
COPY prisma /recruitment/prisma

WORKDIR /recruitment

RUN npm i

EXPOSE 4000

# docker exec -it recruitment_api_1 sh
# npx prisma migrate dev --name init
# npx prisma db push