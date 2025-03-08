// here is singin backend
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';
const bcrypt = require('bcrypt');

export async function POST(request) {
    try {
        const body = await request.json();
        const { username, password } = body;
        let errors = {};

        // Basic validation
        if (!username || !password) {
            if (!username) errors.username = 'Username is required.';
            if (!password) errors.password = 'Password is required.';
            return NextResponse.json({ errors }, { status: 400 });
        }

        // Connect to database
        await dbConnect();

        // Find user by username
        const user = await User.findOne({ username });
        
        // If user doesn't exist
        if (!user) {
            return NextResponse.json({ 
                errors: { general: 'Username not found' } 
            }, { status: 401 });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return NextResponse.json({ 
                errors: { general: 'Invalid password' } 
            }, { status: 401 });
        }

        // Successful login
        // In a real app, you would generate a token or session here
        return NextResponse.json({ 
            message: 'Login successful!',
            redirect: '/dashboard',
            user: {
                id: user._id,
                username: user.username
                // You can add more user data here, excluding sensitive information
            }
        }, { status: 200 });
        
    } catch (err) {
        console.error('Sign-in error:', err);
        return NextResponse.json({ 
            errors: { general: 'Server error' } 
        }, { status: 500 });
    }
}