# SpiritX_CompileX_01
#### Authentication System

This repository contains an authentication system. The project leverages Next.js for the frontend/backend framework and MongoDB for data storage. This guide covers setup, configuration, and testing instructions to help you get started quickly.

## Features

- **User Authentication:** Secure login and registration system.
- **Data Storage:** Submitted data is stored in MongoDB.
- **Encryption:** Uses a custom encryption key to secure sensitive information.
- **Real-time Validation** Built-in input validation.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [TailwindCSS](https://www.tailwindcss.com)

## Setup Instructions

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/SeneshFitzroy/spiritx_compilex_01.git
```

### 2. Create the Environment File
In the root directory, create a file named .env and add the following environment variables:
```bash
MONGODB_URI=mongodb+srv://admin:PPtKyLIFz3ijxzmu@cluster.vgf7t.mongodb.net/Signup
ENCRYPTION_KEY=9d6a48362ac31fd73e77be8ac4ee64d1
```

### 3. Install Dependencies
Install the necessary packages using npm or yarn:
```bash
npm install
# or
yarn install
```

### 4. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
# or
yarn dev
```

Your application should now be running at http://localhost:3000.

### 5. Testing the Authentication System

#### Sign In
In homepage, you will see a signin button which will route you to the signin page or you can go to http://localhost:3000/signin and use test credentials,

```bash
Username: CompileX
Password: CompileX2025@
```

after the signin, you'll will be redirected to the dashboard page. There you will see personalized Hello mesage with your username and a logout button.

#### Sign Up
In homepage, you will see a signup button which will route you to the signup page or you can go to http://localhost:3000/signup and use any username and password and see all the validations there. Upon successfull signup, you will be redirect to sign in page, which is http://localhost:3000/signin

#### 2 Factor Authentication (Additional)
As an additional feature, we intergrated 2 factor authentication system. You can go to http://localhost:3000/settings/two-factor and enable two factor authentication. 

1. Switch on the 2 factor authentication.
2. It will give you a QR to scan from your authenticator app or a setup key to setup the authenticator app.
3. Then add the authenticator code shown in the app and click Verify and Enable.

If you want to disable the 2 factor authentication, you can switch off the authenticator.

If you enable it, after clicking signin, you will be pop up a dialog box for asking OTP from authenticator app.

<!-- Although, we can't provide real-time authenticator code for this, if you want to try out 2 factor authentication system without setting up your own, use
```bash
Username: CompileXAuthenticator
Passsword: CompileX2025@
```
For maximum experience, we suggest you to enable 2 factor authentication using above "CompileX" account. So you can try with real OTP. -->

### 6. Viewing User Info on MongoDB Database
To inspect the user data:

<!-- 1. Visit MongoDB Sign In at https://account.mongodb.com/account/login
2. Log in using the following credentials:
    Email: teamcompilex@gmail.com
    Password: mEzmiz-wyczup-7hycto -->

Once logged in, navigate to the Signup database to view the stored data. 
(https://cloud.mongodb.com/v2/66e6b967c047941487e9c1d7#/metrics/replicaSet/67cbbe6c9ec8437dc8e31c3d/explorer)

In there, you will see users with usernames, hashed passwords, and 2 factor authentication detail.
