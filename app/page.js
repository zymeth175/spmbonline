'use client';
import { useState, useEffect } from 'react';

export default function Pendaftaran() {
  const [nama, setNama] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  // Load script Midtrans Snap
  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Mode Sandbox (Testing)
    const clientKey = process.env.Mid-client-Swh135ezIWJyt1_r;
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  const handleBayar = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Minta Token ke Backend kita
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, whatsapp }),
      });
      const data = await res.json();

      // 2. Buka Pop-up Midtrans Snap
      window.snap.pay(data.token, {
        onSuccess: function (result) { alert('Pembayaran Sukses! Tunggu WA konfirmasi.'); },
        onPending: function (result) { alert('Menunggu pembayaran Anda.'); },
        onError: function (result) { alert('Pembayaran gagal!'); }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Pendaftaran Sekolah Baru</h2>
      <form onSubmit={handleBayar}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nama Lengkap:</label><br/>
          <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>No. WhatsApp (Format: 08xx / 62xx):</label><br/>
          <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {loading ? 'Memproses...' : 'Daftar & Bayar'}
        </button>
      </form>
    </div>
  );
}