#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# DÉPLOIEMENT VPS — Oria Care (shido-connect)
# Lancer depuis le VPS : bash deploy.sh
# ═══════════════════════════════════════════════════════════════
set -e

DEPLOY_DIR="/var/www/shido-connect"
REPO="https://github.com/shidory-boss7/shido-connect.git"  # adapter si besoin

echo "╔══════════════════════════════════════════╗"
echo "║   Déploiement Oria Care — VPS ShidoOS   ║"
echo "╚══════════════════════════════════════════╝"

# 1. Mettre à jour le code
if [ -d "$DEPLOY_DIR/.git" ]; then
    echo "[1/5] Pull latest..."
    cd "$DEPLOY_DIR" && git pull origin main
else
    echo "[1/5] Clone initial..."
    git clone "$REPO" "$DEPLOY_DIR"
    cd "$DEPLOY_DIR"
fi

# 2. Copier le .env.production
echo "[2/5] Config production..."
cp "$DEPLOY_DIR/.env.production" "$DEPLOY_DIR/.env.local"

# 3. Installer les dépendances
echo "[3/5] npm install..."
npm ci --production=false

# 4. Build Next.js
echo "[4/5] npm run build..."
npm run build

# 5. Redémarrer PM2
echo "[5/5] PM2 restart..."
pm2 describe oria-care > /dev/null 2>&1 \
    && pm2 restart oria-care \
    || pm2 start ecosystem.config.js --env production

pm2 save

echo ""
echo "✅ Oria Care déployé sur https://oriacare.shidoos.ci"
