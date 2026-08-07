#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ORIGEM="$BASE_DIR/sqlite-data/banco_manutencao.db"
DESTINO="$BASE_DIR/backup"
RETENCAO_DIAS="${BACKUP_RETENTION_DAYS:-7}"

if [[ ! -f "$ORIGEM" ]]; then
  echo "Banco não encontrado em: $ORIGEM" >&2
  exit 1
fi

mkdir -p "$DESTINO"

ARQUIVO="$DESTINO/banco_manutencao-$(date +%F-%H%M%S).db"
cp "$ORIGEM" "$ARQUIVO"

find "$DESTINO" -type f -name 'banco_manutencao-*.db' -mtime "+$RETENCAO_DIAS" -delete

echo "Backup criado: $ARQUIVO"
