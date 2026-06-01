# blog.wellsstar.dev — dev/build helpers
# `make dev` serves the site on every network interface so it's reachable
# from other machines on the LAN (this is a headless box — localhost is no good).

PORT ?= 4321
HOST ?= 0.0.0.0
# First non-loopback IPv4 address, for the convenience URL printed below.
LAN_IP := $(shell hostname -I 2>/dev/null | awk '{print $$1}')

.PHONY: dev build preview install clean stop help
.DEFAULT_GOAL := help

dev: ## Run the Astro dev server on all interfaces (LAN-accessible, live reload)
	@echo "Dev server (live reload) — reachable on your LAN at:"
	@echo "    http://$(LAN_IP):$(PORT)/"
	@echo "    http://$(LAN_IP):$(PORT)/posts/the-5-3-trillion-question/"
	@echo ""
	npm run dev -- --host $(HOST) --port $(PORT)

build: ## Production build into dist/
	npm run build

preview: build ## Build, then serve the production output on all interfaces
	@echo "Preview (production build) — reachable on your LAN at:"
	@echo "    http://$(LAN_IP):$(PORT)/"
	@echo ""
	npm run preview -- --host $(HOST) --port $(PORT)

install: ## Install npm dependencies
	npm install

clean: ## Remove build artifacts
	rm -rf dist

stop: ## Free the dev port (kill whatever is listening on $(PORT))
	-fuser -k $(PORT)/tcp 2>/dev/null || true
	@echo "freed port $(PORT)"

help: ## Show this help
	@echo "Targets:"
	@grep -E '^[a-zA-Z_-]+:.*## ' $(MAKEFILE_LIST) | \
		awk -F':.*## ' '{printf "  \033[1m%-10s\033[0m %s\n", $$1, $$2}'
