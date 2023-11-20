# FROM node:18.18

# WORKDIR /app
# COPY ./package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build
# EXPOSE 3000
# CMD ["npm","start"]

FROM node:18.8 AS build

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
# CMD ["npm","run","start"]
RUN npm run build


FROM nginx

WORKDIR /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]