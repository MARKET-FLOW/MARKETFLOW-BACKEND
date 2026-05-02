# Variables
DC = docker compose
EXEC = $(DC) exec api
FORMAT=npx prisma-import -s \"prisma/schema.base.prisma\" -s \"prisma/enums/**/*.prisma\" -s \"prisma/models/**/*.prisma\" -o \"prisma/schema.prisma\"

#.PHONY indique à make que ce ne sont pas des fichiers physiques
.PHONY: up down build migrate generate apply logs shell

# --- DOCKER ---
up:
	$(DC) up -d --remove-orphans

down:
	$(DC) down

build:
	$(DC) build --no-cache

# --- PRISMA (Migrations) ---
# Utilise cette commande pour synchroniser ta DB depuis ton terminal/faire une migration
migrate:
	$(FORMAT) 
	npx prisma migrate dev

# Génère le client Prisma
generate:
	npx prisma generate

# Appliquer une migration d'un autre dev
apply:
	$(FORMAT)
	npx prisma migrate deploy
	npx prisma generate

# --- DEV ---
api_logs:
	$(DC) logs -f api

db_logs:
	$(DC) logs -f db

redis_logs:
	$(DC) logs -f redis

shell:
	$(DC) exec api sh