import { NextResponse } from 'next/server';

export async function POST(request) {
  const statusResponse = await request.json();

  const orderId = statusResponse.order_id;
  const transactionStatus = statusResponse.transaction_status;
  const fraudStatus = statusResponse.fraud_status;
  const nomorWaSiswa = statusResponse.customer_details?.phone;
  const namaSiswa = statusResponse.customer_details?.first_name || 'Calon Siswa';

  // Cek jika statusnya sukses dan lunas
  if (transactionStatus === 'settlement' && fraudStatus === 'accept') {
    
    // Tembak API Fonnte untuk Kirim WhatsApp otomatis
    const pesanWa = `Halo *${namaSiswa}*,\n\nPembayaran pendaftaran Anda dengan nomor *${orderId}* telah BERHASIL kami terima.\n\nSelamat, Anda saat ini telah resmi terdaftar di sekolah kami!`;

    try {
      await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          'Authorization': process.env.Ukh4jUY1AM1kwG4semkM // Token Fonnte kamu
        },
        body: new URLSearchParams({
          'target': nomorWaSiswa,
          'message': pesanWa
        })
      });
    } catch (error) {
      console.error('Gagal mengirim WhatsApp via Fonnte:', error);
    }
  }

  return NextResponse.json({ status: 'OK' });
}