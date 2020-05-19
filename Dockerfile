# Build image
# docker build -t authentication-server .
# Run container
# docker run --init --rm --publish 8080:8080 authentication-server

# builder stage
FROM node:lts-alpine AS builder
WORKDIR /source
# Install dependencies && build
COPY . .
RUN yarn install --frozen-lockfile && yarn run build
# Remove dev dependencies and sources
RUN if [ "$NODE_ENV" = "prod" ] ; then rm -rf ./src && rm -f .babelrc ; fi

# runtime stage
FROM node:lts-alpine

USER node

RUN mkdir /home/node/authentication-server
WORKDIR /home/node/authentication-server

COPY --from=builder --chown=node:node /source/package.json /home/node/authentication-server/
COPY --from=builder --chown=node:node /source/build /home/node/authentication-server/build
COPY --from=builder --chown=node:node /source/node_modules /home/node/authentication-server/node_modules

EXPOSE 8081

# ENTRYPOINT ["/entrypoint/entrypoint.sh"]

CMD [ "node", "build/index.js" ]
