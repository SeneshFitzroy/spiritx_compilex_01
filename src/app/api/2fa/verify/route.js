import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptData } from '../../../../lib/encryption';
import speakeasy from 'speakeasy';
import mongoose from 'mongoose';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../model/User';

export async function POST(request) {
    let requestBody = null;

    try {

        requestBody = await request.json();
        const { token, secret, username: bodyUsername } = requestBody;

        if (!token || !secret) {
            return NextResponse.json({ error: 'Token and secret are required' }, { status: 400 });
        }

        let username;

        username = await getUserFromSession();

        if (!username) {
            const headers = request.headers;
            username = headers.get('x-username');

            if (!username) {
                username = bodyUsername;
            }
        }

        if (!username) {
            return NextResponse.json({ error: 'Authentication required - no username found' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: token,
            window: 2
        });

        if (!verified) {
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        user.twoFactorSecret = secret;
        user.is2FAEnabled = true;

        console.log(`Before save - User ID: ${user._id}, Username: ${username}`);

        try {
            const db = mongoose.connection.db;
            const usersCollection = db.collection('users');

            const updateResult = await usersCollection.updateOne(
                { _id: user._id },
                {
                    $set: {
                        is2FAEnabled: true,
                        twoFactorSecret: secret,
                    }
                }
            );

            if (!updateResult.acknowledged) {
                throw new Error('Database update not acknowledged');
            }

            user.is2FAEnabled = true;
            user.twoFactorSecret = secret;

            await user.save();

            const updatedUser = await User.findOne({ username }).lean();

            return NextResponse.json({
                message: '2FA has been successfully enabled',
                is2FAEnabled: true,
                recoveryCodes: updatedUser.recoveryCodes || []
            }, { status: 200 });

        } catch (saveError) {
            try {
                const updatedDoc = await User.findOneAndUpdate(
                    { _id: user._id },
                    {
                        $set: {
                            is2FAEnabled: true,
                            twoFactorSecret: secret
                        }
                    },
                    { new: true }
                );
                if (updatedDoc) {
                    return NextResponse.json({
                        message: '2FA has been successfully enabled (alternative method)',
                        is2FAEnabled: true
                    }, { status: 200 });
                }
            } catch (altError) {
            }

            return NextResponse.json({
                error: `Failed to save 2FA settings: ${saveError.message}`
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
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
    } catch (error) {
        return null;
    }
}
