FROM node:12-alpine
ENV NPM_CONFIG_LOGLEVEL warn
WORKDIR /authentication-server

# COPY ./docker/entrypoint.sh /entrypoint/
# RUN ["chmod", "+x", "entrypoint/entrypoint.sh"]

COPY package*.json yarn.lock ./
RUN yarn install --pure-lockfile

COPY ./src ./src
COPY .babelrc ./

# Remove dev dependencies
# RUN yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')

EXPOSE 8081

# ENTRYPOINT ["/entrypoint/entrypoint.sh"]

# Lint and build app sources
RUN yarn run build

CMD [ "yarn", "run", "start" ]
