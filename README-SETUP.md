# Voal Capacitor Starter (Android + Barcode Scanner)

**Cara cepat (lokal Arch/CachyOS):**
```bash
npm install
npm i @capacitor/android @capacitor/barcode-scanner
npx cap add android
# pastikan minSdkVersion = 26 di android/variables.gradle (script CI & lokal sudah otomatis menset)
npx cap sync
npx cap open android  # build & run dari Android Studio
# atau build cepat:
./ci-local-build.sh
```
**CI (GitHub Actions):** push repo ini, lalu jalankan workflow **Android Debug APK (Capacitor)** → APK ada di tab Artifacts.

- `www/index.html` memuat webapp kamu + integrasi tombol Scan.
- `www/scan.js` berisi logika scanner (mencoba @capacitor/barcode-scanner, fallback community).
