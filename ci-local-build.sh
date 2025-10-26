#!/usr/bin/env bash
set -euo pipefail

echo "[1/5] Installing deps (npm)..."
npm install
npm i @capacitor/android @capacitor/barcode-scanner

echo "[2/5] Add Android platform..."
npx cap add android || true

echo "[3/5] Force minSdkVersion=26..."
if [ -f android/variables.gradle ]; then
  sed -i 's/minSdkVersion *= *[0-9][0-9]*/minSdkVersion = 26/g' android/variables.gradle || true
fi

echo "[4/5] Sync Capacitor..."
npx cap sync

echo "[5/5] Build Debug APK..."
pushd android >/dev/null
./gradlew assembleDebug --no-daemon
popd >/dev/null

APK=android/app/build/outputs/apk/debug/app-debug.apk
echo "Done. APK at: $APK"
