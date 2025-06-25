# Docker Setup

## Local Development

1. Copy the template file:

```bash
cp docker-compose.template.yml docker-compose.yml
```

2. Make sure your `.env` file has all required variables:

```bash
# Check your .env file has:
DATABASE_URL=your_database_url
SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_key
POSTGRES_DB=recruitment_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

3. Start the services:

```bash
docker compose up --build
```

## Environment Variables

The following environment variables are required:

- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `ALGORITHM`: JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiry time
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `POSTGRES_DB`: Local database name
- `POSTGRES_USER`: Local database user
- `POSTGRES_PASSWORD`: Local database password

## Security Notes

- Never commit `.env` files to git
- Never commit `docker-compose.yml` with hardcoded secrets
- Use environment variables for all sensitive data
- The `docker-compose.template.yml` is safe to commit
