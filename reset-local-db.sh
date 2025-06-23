#!/bin/bash

echo "🔄 Resetting Estimatethat database..."

# Check if any PostgreSQL connections are active
if pgrep -f "tableplus" > /dev/null; then
    echo "⚠️  Warning: TablePlus is running. Please close it first."
    exit 1
fi

rm -rf drizzle

# Drop and recreate database
echo "🗑️  Dropping database..."
dropdb estimatethat 2>/dev/null || echo "Database didn't exist, continuing..."

echo "🆕 Creating fresh database..."
createdb estimatethat

# Restart PostgreSQL
echo "🔄 Restarting PostgreSQL service..."
brew services restart postgresql

# Run npm commands
echo "🌱 Regenerating and seeding database..."
npm run generate
npm run migrate
# npm run seed
# npm run seed:case

echo "✅ Database reset complete!"