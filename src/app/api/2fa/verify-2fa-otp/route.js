import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptData, encryptData } from '../../../../lib/encryption';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../model/User';
import speakeasy from 'speakeasy';

export async function POST(request) {
    try {
        const body = await request.json();
        const { token } = body;

        if (!token) {
            return NextResponse.json({ error: 'Token is required' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const pending2FACookie = cookieStore.get('pending2FA');

        if (!pending2FACookie) {
            return NextResponse.json({ error: 'No pending 2FA verification' }, { status: 401 });
        }

        const decryptedData = decryptData(pending2FACookie.value);
        if (!decryptedData) {
            return NextResponse.json({ error: 'Invalid session data' }, { status: 401 });
        }

        const pendingAuth = JSON.parse(decryptedData);

        if (Date.now() - pendingAuth.timestamp > 300000) {
            cookieStore.delete('pending2FA');
            return NextResponse.json({ error: '2FA verification expired, please login again' }, { status: 401 });
        }

        await dbConnect();

        let secret = null;
        let user = null;

        user = await User.findOne({ username: pendingAuth.username }).lean();
        if (user?.twoFactorSecret) {
            secret = user.twoFactorSecret;
        }

        if (!secret) {
            const tempSecretCookie = cookieStore.get('temp2FASecret');
            if (tempSecretCookie) {
                try {
                    const decryptedSecret = decryptData(tempSecretCookie.value);
                    if (decryptedSecret) {
                        const secretData = JSON.parse(decryptedSecret);
                        if (secretData.username === pendingAuth.username) {
                            secret = secretData.secret;
                        }
                    }
                } catch {
                }
            }
        }

        if (!secret && !user) {
            user = await User.findById(pendingAuth.userId).lean();
            if (user?.twoFactorSecret) {
                secret = user.twoFactorSecret;
            }
        }

        if (!secret) {
            return NextResponse.json({
                error: 'No 2FA secret found. Please set up 2FA again.'
            }, { status: 400 });
        }

        const windowSizes = [1, 2, 4];
        let verified = false;

        for (const window of windowSizes) {
            verified = speakeasy.totp.verify({
                secret: secret,
                encoding: 'base32',
                token: token.replace(/\s+/g, ''),
                window
            });

            if (verified) break;
        }

        if (!verified) {
            return NextResponse.json({
                error: 'Invalid verification code',
            }, { status: 400 });
        }

        if (secret && (!user?.twoFactorSecret || user.twoFactorSecret !== secret)) {
            try {
                await User.updateOne(
                    { _id: user._id },
                    { $set: { twoFactorSecret: secret, is2FAEnabled: true } }
                );
            } catch {
            }
        }

        cookieStore.delete('pending2FA');
        cookieStore.delete('temp2FASecret');

        const authToken = encryptData(JSON.stringify({
            userId: user._id.toString(),
            username: user.username,
            timestamp: Date.now()
        }));

        cookieStore.set('authToken', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return NextResponse.json({
            message: '2FA verification successful',
            redirect: '/dashboard',
            user: {
                id: user._id,
                username: user.username
            }
        }, { status: 200 });

    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
