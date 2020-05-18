# Authentication Service

An authentication microservice using node.js, express and mongodb.

### Getting started

```sh
# Clone the project
git clone ...
cd ...

# Install dependencies with npm
npm install

# or if you're using Yarn
yarn
```

Get up the docker container which provides a Postgresql + PostGis container:

```sh
docker-compose up --build -d
```

Start the node.js service in development mode:
```sh
yarn run dev
```

This will launch a [nodemon](https://nodemon.io/) process with babel-register, loading dotenv/config and in watch mode.

The server listens by default at port 8081. You must see this message on console:
```
Listening on port 8081
```

### Testing

- Unit tests:
```
yarn run test
```

- In watch mode:
```
yarn run test:watch
```

### Linting

Linting is set up using [ESLint](http://eslint.org/). It uses ESLint's default [eslint:recommended](https://github.com/eslint/eslint/blob/master/conf/eslint.json) rules. Feel free to use your own rules and/or extend another popular linting config (e.g. [airbnb's](https://www.npmjs.com/package/eslint-config-airbnb) or [standard](https://github.com/feross/eslint-config-standard)).

Begin linting in watch mode with:  
```sh
# yarn
yarn run lint
```

To begin linting and start the server simultaneously:  
```sh
# yarn
yarn run devlint
```

### Environmental variables in development

The project uses [dotenv](https://www.npmjs.com/package/dotenv) for setting environmental variables during development. Simply copy `.env.example`, rename it to `.env` and add your env vars as you see fit. 

### Deployment

Deployment is specific to hosting platform/provider but generally:

```sh
# yarn
yarn run build

# npm
npm run build
```

will compile your `src` into `/build`, and 

```sh
# yarn
yarn start

# npm
npm start
```

will run `build` (via the `prestart` hook) and start the compiled application from the `/build` folder.

The last command is generally what most hosting providers use to start your application when deployed, so it should take care of everything.

You can find small guides for Heroku, App Engine and AWS in [the deployment](DEPLOYMENT.md) document.

`(PENDING TO DEPLOY ONLINE)`

## License

GPL-3.0
