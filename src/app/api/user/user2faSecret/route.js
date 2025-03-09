import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptData } from '../../../../lib/encryption';
import mongoose from 'mongoose';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../model/User';

export async function POST(request) {
    try {
        const { username, secret } = await request.json();

        if (!username || !secret) {
            return NextResponse.json({ error: 'Username and secret are required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        try {
            user.twoFactorSecret = secret;
            user.is2FAEnabled = true;
            await user.save();

            const db = mongoose.connection.db;
            const usersCollection = db.collection('users');

            await usersCollection.updateOne(
                { username: username },
                { $set: { twoFactorSecret: secret, is2FAEnabled: true } }
            );

            await User.updateOne(
                { username: username },
                { $set: { twoFactorSecret: secret, is2FAEnabled: true } }
            );

            const cookieStore = await cookies();
            const tempSecretData = encryptData(JSON.stringify({
                secret,
                username,
                timestamp: Date.now()
            }));

            cookieStore.set('temp2FASecret', tempSecretData, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60,
                path: '/',
            });

            return NextResponse.json({
                success: true,
                message: '2FA secret stored successfully'
            }, { status: 200 });
        } catch {
            return NextResponse.json({ error: 'Failed to store 2FA secret' }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
