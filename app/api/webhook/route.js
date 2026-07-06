import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const statusResponse = await request.json();

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const nomorWaSiswa = statusResponse.customer_details?.phone;
    const namaSiswa = statusResponse.customer_details?.first_name || 'Calon Siswa';

    // Memastikan status transaksi sukses dan lunas (settlement atau capture)
    if ((transactionStatus === 'settlement' || transactionStatus === 'capture') && fraudStatus === 'accept') {
      
      // Mengambil Token Fonnte dengan aman dari env
      const fonnteToken = process.env.FONNTE_TOKEN;
      if (!fonnteToken) {
        console.error('Token Fonnte belum diatur di .env.local');
        return NextResponse.json({ error: 'Token Fonnte missing' }, { status: 500 });
      }

      // Format teks pesan WhatsApp
      const pesanWa = `Halo *${namaSiswa}*,\n\nPembayaran pendaftaran Anda dengan nomor *${orderId}* telah BERHASIL kami terima.\n\nSelamat, Anda saat ini telah resmi terdaftar di sekolah kami!`;

      // Menembak API Fonnte untuk kirim pesan otomatis
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': fonnteToken
        },
        body: new URLSearchParams({
          'target': nomorWaSiswa,
          'message': pesanWa
        })
      });
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error) {
    console.error('Gagal memproses webhook:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}