<p align="center">Sport Club API</p>

## Description
Sports complex would like to manage its sports classes through a new website. The sports complex has a variety of sports, including baseball, basketball, and football. For each sport, they have classes, which are usually held three times a week. The sports complex requires an admin dashboard where its employees would be able to view, edit, and manage classes for each of the sports, change dates and times for each week, and view users who applied for each course in a given period.

## Installation

```bash
$ cp .env.example .env

$ nvm use
$ yarn install

$ yarn docker:start
$ yarn migration:run
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Super admin credentials
email: super@example.com \
password: Admin2023

## Running tests

```bash
# watch mode
$ yarn test:watch

$ yarn test

$ yarn test:e2e
```

## Swagger

[http://localhost:3200/api/docs](http://localhost:3200/api/docs)

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Sonja Mujacic](mailto:sonja.mujacic@gmail.com)

## License

Nest is [MIT licensed](LICENSE).
