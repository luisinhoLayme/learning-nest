<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


## Description

App Teslo Shop[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Build the database
```bash
docker-compose up -d
```

## Clone file ```.env.template```
1. Rename to ```.env```
2. Fill the defined enviroment variables in the ```.env```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Execute SEED
```
http://localhost:3000/api/seed
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.


## Stay in touch

- Author - [Luisinho Dev](https://twitter.com/luisinhodev)
- Website - [luisinho.dev](https://luisinho.dev/)
- Twitter - [@luisinhodev](https://twitter.com/luisinhodev)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
