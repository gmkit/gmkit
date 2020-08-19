# gmkit

## Development

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

**Load the Database Schema**

```bash
psql -d gmkit -U postgres -f schema.sql
```

**Inspect the Database Schema with Prisma**
