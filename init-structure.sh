#!/usr/bin/env bash

# Run from the project root (where package.json will live)
# Usage: bash init-structure.sh

set -e

mkdir -p app \
  app/login \
  app/dashboard \
  app/accounts \
  app/accounts/[id] \
  app/credit-cards \
  app/credit-cards/[id] \
  app/import \
  app/settings \
  app/api/auth \
  app/api/export/transactions \
  app/api/export/summary \
  app/api/export/tax \
  app/api/db/export \
  app/api/db/import

mkdir -p components \
  components/ui \
  components/layout \
  components/charts \
  components/dashboard \
  components/accounts \
  components/credit-cards \
  components/import \
  components/transactions \
  components/budgets \
  components/ai

mkdir -p lib \
  lib/pdf \
  lib/importers \
  lib/transactions

mkdir -p styles \
  public \
  public/empty-states \
  tests \
  tests/import

# Top-level files
touch package.json tsconfig.json next.config.mjs tailwind.config.ts postcss.config.mjs middleware.ts env.example README.md

# App-level files
touch app/layout.tsx app/page.tsx app/globals.css
touch app/login/page.tsx
touch app/dashboard/page.tsx
touch app/accounts/page.tsx
touch app/accounts/[id]/page.tsx
touch app/credit-cards/page.tsx
touch app/credit-cards/[id]/page.tsx
touch app/import/page.tsx
touch app/import/actions.ts
touch app/settings/page.tsx

# API route files
touch app/api/auth/route.ts
touch app/api/export/transactions/route.ts
touch app/api/export/summary/route.ts
touch app/api/export/tax/route.ts
touch app/api/db/export/route.ts
touch app/api/db/import/route.ts

# Components
touch components/layout/shell.tsx
touch components/layout/sidebar.tsx
touch components/layout/top-nav.tsx

touch components/charts/net-worth-chart.tsx
touch components/charts/spending-vs-income-chart.tsx
touch components/charts/category-donut.tsx
touch components/charts/monthly-trend-chart.tsx

touch components/dashboard/home-cards.tsx
touch components/dashboard/alerts-panel.tsx
touch components/dashboard/timeline.tsx

touch components/accounts/account-list.tsx
touch components/accounts/account-detail.tsx

touch components/credit-cards/credit-card-list.tsx
touch components/credit-cards/credit-card-detail.tsx

touch components/import/import-wizard.tsx
touch components/transactions/transaction-table.tsx
touch components/transactions/category-badges.tsx
touch components/budgets/budget-list.tsx
touch components/ai/ai-assistant-placeholder.tsx

# Lib files
touch lib/auth.ts
touch lib/crypto.ts
touch lib/db.ts
touch lib/kv-adapter.ts
touch lib/jsondb-adapter.ts
touch lib/models.ts
touch lib/charts-data.ts
touch lib/session.ts
touch lib/constants.ts
touch lib/test-data.ts

touch lib/pdf/parse-bank-statement.ts
touch lib/pdf/parse-credit-card-statement.ts
touch lib/pdf/parse-loan-statement.ts
touch lib/pdf/pdf-utils.ts

touch lib/importers/csv-importer.ts
touch lib/importers/xlsx-importer.ts
touch lib/importers/statement-normalizer.ts

touch lib/transactions/categorizer.ts
touch lib/transactions/rules.ts
touch lib/transactions/alerts.ts
touch lib/transactions/exports.ts

# Styles
touch styles/globals.css

# Public
touch public/logo.svg
touch public/empty-states/dashboard.svg
touch public/empty-states/accounts.svg
touch public/empty-states/import.svg

# Tests
touch tests/import/pdf-parser.test.ts
touch tests/import/csv-importer.test.ts
touch tests/import/xlsx-importer.test.ts

echo "FinSight 360 structure created."

