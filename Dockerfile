FROM node:8-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app

COPY express-app/package.json express-app/yarn.lock ./

RUN yarn install --no-progress --pure-lockfile --prod && yarn cache clean
COPY express-app/build ./build

ARG BUILD_VERSION
ENV BUILD_VERSION=${BUILD_VERSION}

EXPOSE 3001
CMD ["yarn", "start"]