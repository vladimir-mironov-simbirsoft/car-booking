install: ;@echo "Installing packages....."; \
	npm install

migration: ;@echo "Migration....."; \
	node ./db/migration.js

seed: ;@echo "Seed....."; \
	node ./db/seed.js

run: ;@echo "Running....."; \
	npm run start:prod