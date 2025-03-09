# SpiritX_CompileX_01
#### Authentication System

This repository contains an authentication system developed with <b>Next.js</b>, and <b>MongoDB Atlas</b> The project leverages Next.js for the frontend/backend framework and MongoDB for data storage. This guide covers setup, configuration, and testing instructions to help you get started quickly.

## 📦 Prerequisites
Ensure you have the following installed on your system:

- **Node.js** 🔗 [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js) or **Yarn** 🔗 [Download Yarn](https://yarnpkg.com/)

## ⚡️ Installation

#### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/SeneshFitzroy/spiritx_compilex_01.git
```

#### 2. Install Dependencies
Install the necessary packages using npm or yarn:
```bash
npm install
# or
yarn install
```

#### 3. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
# or
yarn dev
```

Your application should now be running at http://localhost:3000.

## 🗄️ Database Configuration

**SpiritX_CompileX_01** uses **MongoDB** with **Mongoose** for data handling.  
By default, the **MongoDB URI** is hardcoded. However, if you want to use your own MongoDB URI:

#### ☁️ MongoDB Atlas Setup

Follow these steps to set up **MongoDB Atlas** and get your connection string:

1. **Create a MongoDB Atlas account**  
   🔗 [Sign up for MongoDB Atlas](https://account.mongodb.com/account/login)  

2. **Create a new cluster**  
   - Navigate to the **Clusters** section and create a clsuter. 

3. **Get your connection string**  
   - Go to your **Cluster Dashboard** → Click **Connect**.  
   - Select **"Connect your application"**.  
   - Copy the **MongoDB URI** (starts with `mongodb+srv://`).  

4. **Use your connection string**  
   - Open your project and navigate to:  
     ```plaintext
     src/lib/dbConnect.js
     ```
   - Update the connection string:  
     ```javascript
     const MONGODB_URI = process.env.MONGODB_URI;
     ```
   - Create a **.env** file and add:  
     ```bash
     MONGODB_URI=your_mongodb_connection_string
     ```

## 🔍 Assumptions

- **MongoDB Cloud Version**: It is assumed that you are using **MongoDB Atlas**, the fully managed cloud service provided by MongoDB.

## 💻 Tech Stack

#### Frontend:
- **Next.js**
- **Shadcn UI**
- **Motion**

#### Backend:
- **Node.js**

#### Database:
- **MongoDB** with **Mongoose**

## 🚀 Features

- **PasswordSstrenth Indicator:** 
- **Data Handeling with Encryption:**
- **Real-Time data Validation**
- **2-Factor Authentication**
- **Route Protection**
- **Responsive User Interface anf Experience**


## 🛠️ Testing the Authentication System

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

### 5. Viewing User Info on MongoDB Database
To inspect the user data:

<!-- 1. Visit MongoDB Sign In at https://account.mongodb.com/account/login
2. Log in using the following credentials:
    Email: teamcompilex@gmail.com
    Password: mEzmiz-wyczup-7hycto -->

Once logged in, navigate to the Signup database to view the stored data. 
(https://cloud.mongodb.com/v2/66e6b967c047941487e9c1d7#/metrics/replicaSet/67cbbe6c9ec8437dc8e31c3d/explorer)

In there, you will see users with usernames, hashed passwords, and 2 factor authentication detail.