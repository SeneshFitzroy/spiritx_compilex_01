import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptData } from '../../../../lib/encryption';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../model/User';

export async function GET(request) {
    try {

        let username;

        username = await getUserFromSession();

        if (!username) {
            const headers = request.headers;
            username = headers.get('x-username');
        }

        if (!username) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ username }).lean();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            is2FAEnabled: user.is2FAEnabled === true,
            secretExists: !!user.twoFactorSecret
        }, { status: 200 });

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
