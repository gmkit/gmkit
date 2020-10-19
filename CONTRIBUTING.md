# Contributing

## Development

**Install Dependencies**

```
yarn
```

**Run Application**

```
yarn dev
```

### PostgreSQL Setup

**postgresql@12** – I used the PostgreSQL EDB installer.
The following settings were used:

```
Installation Directory: /Library/PostgreSQL/12
Server Installation Directory: /Library/PostgreSQL/12
Data Directory: /Library/PostgreSQL/12/data
Database Port: 5432
Database Superuser: postgres
Operating System Account: postgres
Database Service: postgresql-12
Command Line Tools Installation Directory: /Library/PostgreSQL/12
pgAdmin4 Installation Directory: /Library/PostgreSQL/12/pgAdmin 4
Stack Builder Installation Directory: /Library/PostgreSQL/12
```

Create a database called `gmkit`.

### Prisma

**Environment Variables**

Setup `prisma/.env`.

**Updating the Database**

```bash
npx prisma migrate --experimental up
```

**Generating the Prisma Client**

```bash
npx prisma generate
```

### Auth

Create a GitHub OAuth app and set the credientails in `.env`.

## Production

- **Website Host:** Vercel under the gmkit org
- **DB Host:** Heroku under nolan@ncphi.com account