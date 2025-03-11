#!/bin/sh

host=$(echo $1 | cut -d: -f1)
port=$(echo $1 | cut -d: -f2)
shift
cmd="$@"

until nc -z "$host" "$port"; do
  >&2 echo "MySQL is unavailable - sleeping"
  sleep 1
done

>&2 echo "MySQL is up - executing command"

# Gerar Prisma Client antes de iniciar a aplicação
npx prisma generate

exec $cmd 