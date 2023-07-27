# How to Get Started

1. Ensure you have [docker installed](https://docs.docker.com/get-docker/) and running
2. Clone the repo or [![Run with VS Code](https://badgen.net/badge/Run%20with%20/VS%20Code/5B3ADF?icon=https://runme.dev/img/logo.svg)](https://runme.dev/api/runme?repository=https%3A%2F%2Fgithub.com%2Fvueschool%2Fforge-4-poc.git&fileToOpen=README.md)

```sh
git clone git@github.com:vueschool/vue-forge-episode-4.git
```

3. Install the dependencies

```sh
yarn
```

4. Start the Supabase service

```sh
yarn supabase:start
```

5. The needed supabase environment variables will print after the service has started. Add them to your .env file (can use .env.example as a template). You can also retrieve these at any time by running the following:

```sh
npx supabase status
```

6. Migrate and seed your database with initial schema and values by running:

```sh
yarn db:reset
```

7. Start the dev server

```sh
yarn dev
```

8. [Follow these directions in the Devnet Setup Guide](https://vueschool.notion.site/DevNet-Setup-c4a6ae8962fb40e49a5e13904570e863?pvs=4) to get a local development blockchain network running.

9. That's it! 🎉 You're ready to go.
