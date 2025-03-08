import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';
const bcrypt = require('bcrypt');

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

        const user = await User.findOne({ username });

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

        return NextResponse.json({
            message: 'Login successful!',
            redirect: '/dashboard',
            user: {
                id: user._id,
                username: user.username
            }
        }, { status: 200 });

    } catch (err) {
        console.error('Sign-in error:', err);
        return NextResponse.json({
            errors: { general: 'Server error' }
        }, { status: 500 });
    }
}