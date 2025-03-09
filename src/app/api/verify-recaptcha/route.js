import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA token is required' },
        { status: 400 }
      );
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    
    if (!secret) {
      console.error('RECAPTCHA_SECRET_KEY is not defined in environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const url = `https://www.google.com/recaptcha/api/siteverify`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secret,
        response: token
      })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      console.log('reCAPTCHA verification failed:', data['error-codes']);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    return NextResponse.json(
      { success: false, message: 'reCAPTCHA verification failed' },
      { status: 500 }
    );
  }
}