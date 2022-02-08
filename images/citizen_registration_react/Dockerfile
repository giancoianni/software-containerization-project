# references for help
# -------------------------
# - Dockerizing a React App
# - https://mherman.org/blog/dockerizing-a-react-app/
# pull base image
# build environment
# multi-state build for production environment

FROM node:17.4-buster-slim as build
WORKDIR /web

# add `/app/node_modules/.bin` to $PATH
ENV PATH /web/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts@5.0.0 -g --silent
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /web/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
