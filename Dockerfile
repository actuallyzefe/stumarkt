
FROM node:16-alpine3.14 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build


FROM node:16-alpine3.14 AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist

RUN npm install --only=production

CMD ["npm", "run", "start:prod"]
