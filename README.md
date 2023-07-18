# How to Get Started

1. Ensure you have [docker installed](https://docs.docker.com/get-docker/) and running
2. Clone the repo

```
git clone git@github.com:vueschool/forge-4-poc.git
```

3. Install the dependencies

```
yarn
```

4. Start the Supabase service

```
yarn supabase:start
```

5. The needed supabase environment variables will print after the service has started. Add them to your .env file (can use .env.example as a template). You can also retrieve these at any time by running the following:

```
npx supabase status
```

6. Migrate and seed your database with initial schema and values by running:

```
yarn db:reset
```

7. Start the dev server

```
yarn dev
```

8. That's it! 🎉 You're ready to go.
