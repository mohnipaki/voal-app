(function () {
  const ensureBtn = () => {
    if (document.getElementById('scanBtn')) return document.getElementById('scanBtn');
    const btn = document.createElement('button');
    btn.id = 'scanBtn';
    btn.textContent = 'Scan Barcode';
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: 9999,
      padding: '12px 16px',
      borderRadius: '9999px',
      border: 'none',
      fontSize: '16px',
      boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
      cursor: 'pointer'
    });
    btn.className = (btn.className || '') + ' shadow-lg';
    document.body.appendChild(btn);
    return btn;
  };

  const setActive = (active) => {
    document.body.classList.toggle('scanner-active', !!active);
  };

  const putResult = (text) => {
    const inp = document.getElementById('barcode') || document.querySelector('input[name=barcode]');
    if (inp) {
      inp.value = text;
      inp.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      alert('Hasil scan: ' + text);
    }
    console.log('[Scanner] Result:', text);
  };

  const scan = async () => {
    const C = window.Capacitor;
    if (!C) {
      alert('Capacitor belum aktif. Build APK dan jalankan di perangkat Android.');
      return;
    }

    // Official plugin (@capacitor/barcode-scanner)
    const BS = C.Plugins && (C.Plugins.BarcodeScanner || C.Plugins['BarcodeScanner']);
    if (BS && typeof BS.scanBarcode === 'function') {
      try {
        setActive(true);
        const res = await BS.scanBarcode({
          hint: 'ALL',
          scanInstructions: 'Arahkan kamera ke barcode / QR',
          scanButton: true,
          scanText: 'Pindai',
          android: { scanningLibrary: 'zxing' },
          web: { showCameraSelection: true }
        });
        setActive(false);
        const text = res && (res.ScanResult || res.text || res.result || res.content || '');
        if (text) putResult(text);
        else alert('Tidak ada hasil.');
      } catch (e) {
        setActive(false);
        console.error('[Scanner] Error:', e);
        alert('Gagal memindai: ' + (e && e.message ? e.message : e));
      }
      return;
    }

    // Community fallback (@capacitor-community/barcode-scanner)
    const BS2 = C.Plugins && (C.Plugins['BarcodeScanner'] || C.Plugins['barcodeScanner']);
    if (BS2 && typeof BS2.startScan === 'function') {
      try {
        setActive(true);
        await (BS2.checkPermission ? BS2.checkPermission({ force: true }) : Promise.resolve());
        const res = await BS2.startScan(); // { hasContent, content }
        setActive(false);
        if (res && (res.content || res.text)) putResult(res.content || res.text);
        else if (res && res.hasContent) putResult(res.content || '');
        else alert('Tidak ada hasil.');
      } catch (e) {
        setActive(false);
        console.error('[Scanner] Error:', e);
        alert('Gagal memindai: ' + (e && e.message ? e.message : e));
      } finally {
        try { BS2.showBackground && BS2.showBackground(); } catch (_) {}
        try { BS2.stopScan && BS2.stopScan(); } catch (_) {}
      }
      return;
    }

    alert('Plugin BarcodeScanner tidak ditemukan. Pastikan sudah install plugin & cap sync.');
  };

  const btn = ensureBtn();
  btn.addEventListener('click', scan);

  const style = document.createElement('style');
  style.textContent = `
    body.scanner-active { filter: blur(1px); }
    #scanBtn { background: #111; color: white; }
    @media (prefers-color-scheme: light) {
      #scanBtn { background: #2563eb; color: #fff; }
    }
  `;
  document.head.appendChild(style);
})();
