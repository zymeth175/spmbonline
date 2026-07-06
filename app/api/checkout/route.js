import { NextResponse } from 'next/server';

export async function POST(request) {
  const { nama, whatsapp } = await request.json();
  const orderId = `REG-${Date.now()}`; // Membuat ID pendaftaran unik otomatis

  const secretKey = process.env.Mid-server-o840_c4QkobzFoY3QMxAxAzA;
  const encodedKey = Buffer.from(secretKey + ':').toString('base64');

  const payload = {
    transaction_details: {
      order_id: orderId,
      gross_amount: 150000 // Contoh biaya pendaftaran: Rp 150.000
    },
    customer_details: {
      first_name: nama,
      phone: whatsapp
    }
  };

  const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Basic ${encodedKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  return NextResponse.json({ token: data.token });
}