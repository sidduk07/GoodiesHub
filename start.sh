#!/bin/bash
# GoodiesHub startup script

export DATABASE_URL="postgresql://siddappafakkirappakurabar@localhost:5432/goodieshub"
echo "🚀 Starting GoodiesHub with PostgreSQL..."
npm start
