# Dockerfile
FROM postgres:16

# (Optional) Set environment variables here,
# but docker-compose is usually preferred.
ENV POSTGRES_DB=mydb
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres

# Expose PostgreSQL port
EXPOSE 5432
