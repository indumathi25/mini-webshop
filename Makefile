.PHONY: up down restart logs test lint clean

up:
	docker compose up --build -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

test:
	cd backend && ./mvnw test -B
	cd frontend && npm run test:ci

lint:
	cd frontend && npm run lint

clean:
	docker compose down -v --remove-orphans
	docker image prune -f
