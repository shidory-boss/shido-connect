#!/bin/bash
# ShidoConnect PWA — démarrage port 3007

cd "$(dirname "$0")"

echo "╔══════════════════════════════════════╗"
echo "║      ShidoConnect PWA — Port 3007    ║"
echo "║      Vitrine + Patient Portal        ║"
echo "╚══════════════════════════════════════╝"

export PORT=3007
export NEXT_PUBLIC_MEDICAL_API=${NEXT_PUBLIC_MEDICAL_API:-http://localhost:8001}
export NEXT_PUBLIC_CLINIC_ID=${NEXT_PUBLIC_CLINIC_ID:-3}

echo ""
echo "[1/2] Vérification des dépendances..."
if [ ! -d "node_modules" ]; then
  echo "    Installation des dépendances..."
  npm install --silent
fi

echo "[2/2] Démarrage du serveur de développement..."
echo ""
echo "  → http://localhost:3007          (vitrine)"
echo "  → http://localhost:3007/rdv      (prise de RDV)"
echo "  → http://localhost:3007/file     (file d'attente)"
echo "  → http://localhost:3007/mon-espace (espace patient)"
echo ""

npm run dev -- --port 3007
