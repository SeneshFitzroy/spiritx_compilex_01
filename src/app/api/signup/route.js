import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password, confirmPassword } = body;
        let errors = {};

        if (!username || !password || !confirmPassword) {
            if (!username) errors.username = 'Username is required.';
            if (!password) errors.password = 'Password is required.';
            if (!confirmPassword) errors.confirmPassword = 'Confirm password is required.';
            return NextResponse.json({ errors }, { status: 400 });
        }

        if (username.length < 8) {
            errors.username = 'Username must be at least 8 characters long.';
        }

        await dbConnect();
        const existingUser = await User.findOne({
            username: { $regex: new RegExp(`^${username}$`, 'i') }
        });
        if (existingUser) {
            errors.username = 'Username already exists.';
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/;
        if (!passwordRegex.test(password)) {
            errors.password = 'Password must contain at least one lowercase, one uppercase, and one special character.';
        }

        if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match.';
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        const encrypt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, encrypt);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        return NextResponse.json(
            { message: 'Signup successful! Redirecting to signin...', redirect: '/signin', delay: 2000 },
            { status: 201 }
        );
    } catch {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}