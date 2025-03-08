import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptData } from '../../../../lib/encryption';


import mongoose from 'mongoose';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../model/User';

export async function POST(request) {
    try {

        let username;

        try {
            const body = await request.json();
            username = body.username;

            if (!username) {
                username = await getUserFromSession();
            }

            if (!username) {
                const headers = request.headers;
                username = headers.get('x-username');
            }
        } catch (error) {
            username = await getUserFromSession();

            if (!username) {
                const headers = request.headers;
                username = headers.get('x-username');
            }
        }

        if (!username) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        try {
            user.is2FAEnabled = false;
            user.twoFactorSecret = '';
            await user.save();

            const db = mongoose.connection.db;
            if (db && db.collection) {
                const usersCollection = db.collection('users');
                await usersCollection.updateOne(
                    { username: username },
                    { $set: { is2FAEnabled: false, twoFactorSecret: '' } }
                );
            }

            await User.updateOne(
                { username: username },
                { $set: { is2FAEnabled: false, twoFactorSecret: '' } }
            );


            return NextResponse.json({
                message: 'Two-factor authentication has been disabled',
                is2FAEnabled: false
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({
                error: 'Failed to disable 2FA'
            }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
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

// export async function POST(request) {
//     try {
//         const username = await getUserFromSession();
//         if (!username) {
//             return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
//         }

//         await dbConnect();

//         const user = await User.findOne({ username });
//         if (!user) {
//             return NextResponse.json({ error: 'User not found' }, { status: 404 });
//         }

//         user.is2FAEnabled = false;
//         user.twoFactorSecret = '';
//         await user.save();

//         return NextResponse.json({
//             message: '2FA has been successfully disabled',
//             is2FAEnabled: false
//         }, { status: 200 });

//     } catch (error) {
//         return NextResponse.json({ error: 'Server error' }, { status: 500 });
//     }
// }
