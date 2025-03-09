import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptData } from '../../../../lib/encryption';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../model/User';

export async function POST(request) {
    try {

        let username;

        try {
            username = await getUserFromSession();

            if (!username) {
                const headers = request.headers;
                username = headers.get('x-username');

                if (!username) {
                    const body = await request.json();
                    username = body.username;
                }
            }
        } catch {
            try {
                const body = await request.json();
                username = body.username;
            } catch {
            }
        }

        if (!username) {
            return NextResponse.json({
                error: 'Authentication required - no username found'
            }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        const secret = speakeasy.generateSecret({
            name: `SpiritX:${username}`
        });

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        return NextResponse.json({
            secret: secret.base32,
            qrCodeUrl
        }, { status: 200 });

    } catch {
        return NextResponse.json({
            error: 'Server error'
        }, { status: 500 });
    }
}

async function getUserFromSession() {
    try {
        const cookieStore = await cookies();
        const authCookie = cookieStore.get('authToken');

        if (authCookie) {
            const userData = JSON.parse(decryptData(authCookie.value));
            return userData.username;
        }

        return null;
    } catch {
        return null;
    }
}
