# Variables
DC = docker compose
EXEC = $(DC) exec api
FORMAT = pnpm exec prisma-import -s "prisma/schema.base.prisma" -s "prisma/enums/**/*.prisma" -s "prisma/models/**/*.prisma" -o "prisma/schema.prisma"

.PHONY: up down build migrate generate apply install api_logs db_logs redis_logs api_shell

# --- DOCKER ---
up:
	$(DC) up -d --remove-orphans


down:
	$(DC) down


build:
	$(DC) build --no-cache


# --- PRISMA (Toutes les commandes passent par Docker via $(EXEC)) ---
migrate:
	$(FORMAT)
	$(EXEC) pnpm run prisma:migrate


generate:
	$(EXEC) pnpm run prisma:generate


apply:
	$(EXEC) pnpm run prisma:apply


# --- DÉPENDANCES ---
install:
	pnpm install


# --- PRISMA STUDIO ---
studio:
	$(EXEC) sh -c "PRISMA_STUDIO_HOST=0.0.0.0 pnpm exec prisma studio --browser none --port 5555"


# --- DEV (LOGS & SHELL) ---
api_logs:
	$(DC) logs -f api


db_logs:
	$(DC) logs -f db


redis_logs:
	$(DC) logs -f redis


api_shell:
	$(DC) exec api sh


# --- SERVICES SPÉCIFIQUES ---

# Lancer un service (ex: make up-svc SVC=redis)
up-svc:
	$(DC) up -d $(SVC)


# Arrêter et supprimer un service (ex: make down-svc SVC=db)
down-svc:
	$(DC) down $(SVC)

stop-svc:
	$(DC) stop $(SVC)


# Redémarrer un service (ex: make restart-svc SVC=api)
restart-svc:
	$(DC) restart $(SVC)


# Accès direct à la base de données en ligne de commande
db-shell:
	docker compose exec db psql -U $(USER) -d $(DB)