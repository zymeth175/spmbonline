'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  // State untuk form pendaftaran
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    whatsapp: '',
    jurusan: 'Rekayasa Perangkat Lunak (RPL)',
  });
  const [loading, setLoading] = useState(false);

  // Load script Midtrans Snap secara otomatis saat halaman dibuka
  useEffect(() => {
    const snapScript = 'https://app.sandbox.midtrans.com/snap/snap.js';
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
    
    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Fungsi untuk menangani perubahan input form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi utama ketika tombol "Daftar & Bayar Sekarang" diklik
  const handlePendaftaran = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Kirim data siswa ke API Backend kita untuk dapet Snap Token Midtrans
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nama: formData.nama,
          whatsapp: formData.whatsapp, // Nomor ini yang nanti dikirim WA oleh Fonnte
        }),
      });

      if (!res.ok) throw new Error('Gagal membuat sesi pembayaran');
      const data = await res.json();

      // 2. Panggil Pop-up Midtrans Snap menggunakan token yang didapat
      window.snap.pay(data.token, {
        onSuccess: function (result) {
          alert('Pembayaran BERHASIL! Silakan cek WhatsApp Anda untuk konfirmasi pendaftaran.');
          setFormData({ nama: '', email: '', whatsapp: '', jurusan: 'Rekayasa Perangkat Lunak (RPL)' });
        },
        onPending: function (result) {
          alert('Menunggu Pembayaran. Segera selesaikan pembayaran Anda sebelum kedaluwarsa.');
        },
        onError: function (result) {
          alert('Pembayaran GAGAL! Silakan coba beberapa saat lagi.');
        },
        onClose: function () {
          alert('Anda menutup halaman pembayaran sebelum selesai.');
        }
      });
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan sistem, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between font-sans">
      
      {/* HEADER / NAVBAR */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">SMK KARYA BANGSA</h1>
          <span className="bg-blue-500 text-xs px-3 py-1 rounded-full border border-blue-400">
            PPDB TA 2026/2027
          </span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center flex-grow">
        
        {/* KOLOM KIRI: INFO SEKOLAH */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 leading-tight">
            Penerimaan Peserta Didik Baru (PPDB) Online
          </h2>
          <p className="text-gray-600 text-lg">
            Bergabunglah bersama kami untuk mencetak generasi unggul, kompeten, dan siap kerja di era digital. Proses pendaftaran cepat, aman, dan otomatis.
          </p>
          
          {/* Alur Pendaftaran Singkat */}
          <div className="border-l-4 border-blue-600 pl-4 space-y-3 bg-blue-50 p-4 rounded-r-lg">
            <h4 className="font-bold text-blue-900">3 Langkah Mudah Mendaftar:</h4>
            <ol className="list-decimal list-inside text-sm text-gray-750 space-y-1">
              <li>Isi formulir pendaftaran di sebelah kanan.</li>
              <li>Selesaikan biaya investasi pendaftaran secara online.</li>
              <li>Dapatkan bukti resmi & nomor pendaftaran via <b>WhatsApp Instan</b>.</li>
            </ol>
          </div>
        </div>

        {/* KOLOM KANAN: FORMULIR */}
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Formulir Pendaftaran</h3>
          <p className="text-xs text-gray-500 mb-6">Investasi Pendaftaran: <span className="font-bold text-blue-600">Rp 150.000</span></p>
          
          <form onSubmit={handlePendaftaran} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Calon Siswa</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
                placeholder="Contoh: Muhammad Budi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Email Aktif</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="budi@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp (Utamakan format 62 atau 08)</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                required
                placeholder="Contoh: 081234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
              />
              <p className="text-[10px] text-gray-400 mt-1">*Pastikan nomor aktif untuk menerima notifikasi kelulusan via WhatsApp.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilihan Kompetensi Keahlian (Jurusan)</label>
              <select
                name="jurusan"
                value={formData.jurusan}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-800"
              >
                <option>Rekayasa Perangkat Lunak (RPL)</option>
                <option>Teknik Komputer & Jaringan (TKJ)</option>
                <option>Multimedia / Desain Komunikasi Visual (DKV)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-semibold py-3 px-4 rounded-md transition duration-200 mt-6 ${
                loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses Pendaftaran...
                </span>
              ) : (
                'Daftar & Bayar Sekarang'
              )}
            </button>
          </form>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-xs border-t border-gray-700">
        &copy; 2026 SMK Karya Bangsa. All Rights Reserved. Powered by Next.js & Midtrans.
      </footer>

    </div>
  );
}