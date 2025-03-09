import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptData } from '../../../lib/encryption';
import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;
        let errors = {};

        if (!username || !password) {
            if (!username) errors.username = 'Username is required.';
            if (!password) errors.password = 'Password is required.';
            return NextResponse.json({ errors }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findOne({ username }).lean();

        if (!user) {
            return NextResponse.json({
                errors: { general: 'Username not found' }
            }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json({
                errors: { general: 'Invalid password' }
            }, { status: 401 });
        }

        const cookieStore = cookies();

        const has2FA = user.is2FAEnabled === true && !!user.twoFactorSecret;

        if (has2FA) {
            const pending2FAData = encryptData(JSON.stringify({
                userId: user._id.toString(),
                username: user.username,
                requires2FA: true,
                timestamp: Date.now()
            }));

            cookieStore.set('pending2FA', pending2FAData, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 300,
                path: '/',
            });

            if (user.twoFactorSecret) {
                const tempSecretData = encryptData(JSON.stringify({
                    secret: user.twoFactorSecret,
                    username: user.username,
                    timestamp: Date.now()
                }));

                cookieStore.set('temp2FASecret', tempSecretData, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 300,
                    path: '/',
                });
            } else {
                await User.updateOne(
                    { _id: user._id },
                    { $set: { is2FAEnabled: false } }
                );

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
                    message: 'Login successful!',
                    redirect: '/dashboard',
                    user: {
                        id: user._id,
                        username: user.username
                    }
                }, { status: 200 });
            }

            return NextResponse.json({
                message: '2FA verification required',
                requires2FA: true,
                redirect: '/verify'
            }, { status: 200 });
        }

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
            message: 'Login successful!',
            redirect: '/dashboard',
            user: {
                id: user._id,
                username: user.username
            }
        }, { status: 200 });

    } catch {
        return NextResponse.json({
            errors: { general: 'Server error' }
        }, { status: 500 });
    }
}