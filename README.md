# How to Get Started

1. Ensure you have [docker installed](https://docs.docker.com/get-docker/) and running
2. Clone the repo or [![Run with VS Code](https://badgen.net/badge/Run%20with%20/VS%20Code/5B3ADF?icon=https://runme.dev/img/logo.svg)](https://runme.dev/api/runme?repository=https%3A%2F%2Fgithub.com%2Fvueschool%2Fforge-4-poc.git&fileToOpen=README.md)

```sh
git clone git@github.com:vueschool/vue-forge-episode-4.git
```

3. Start on the boilerplate branch

```
git checkout boilerplate
```

4. Install the dependencies

```sh
yarn
# or
npm install
```

5. Start the Supabase service

```sh
yarn supabase:start
# or
npm run supabase:start
```

6. The needed supabase environment variables will print after the service has started. Rename .env.example to .env and provide the following variables from the terminal print out.

```sh
# this can stay the same
SUPABASE_URL="http://localhost:3000"
# anon key the terminal print out
SUPABASE_KEY="<your anon key>"
# service role key from the terminal print out
SUPABASE_SERVICE_KEY="<your service_role key>"
```

You can also retrieve these at any time by running the following:

```sh
npx supabase status
```

7. Migrate and seed your database with initial schema and values by running:

```sh
yarn db:reset
# or
npm run db:reset
```

8. Start the dev server

```sh
yarn dev
# or
npm run dev
```

9. [Follow these directions in the Devnet Setup Guide](https://vueschool.notion.site/DevNet-Setup-2ee973bf5061497d998823dd5cf43e6b?pvs=4) to get a local development blockchain network running.

10. That's it! 🎉 You're ready to go.
