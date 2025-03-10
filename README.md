# SpiritX_CompileX_01

This repository contains an authentication system developed with. The project leverages **Next.js** for the frontend/backend framework and **MongoDB** for data storage. This guide covers setup, configuration, and testing instructions to help you get started quickly.

You can try out the [hosted version](https://spiritx-compilex-01.vercel.app/) here.

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

## ⚙️ Enviroment Variables
Create a .env file at root of the project and add following.
```bash
MONGODB_URI=mongodb+srv://admin:PPtKyLIFz3ijxzmu@cluster.vgf7t.mongodb.net/Signup
ENCRYPTION_KEY=9d6a48362ac31fd73e77be8ac4ee64d1
```

## 🗄️ Database Configuration

**SpiritX_CompileX_01** uses **MongoDB** with **Mongoose** for data handling.  
By default, the system uses **our MongoDB URI**, which is above MongoDB_URI at .env file. However, if you want to use your own MongoDB URI:

#### ☁️ MongoDB Atlas Setup

Follow these steps to set up **MongoDB Atlas** and get your connection string:

1. **Create a MongoDB Atlas account**  
   🔗 [Sign up for MongoDB Atlas](https://account.mongodb.com/account/login)  

2. **Create a new cluster**  
   - Navigate to the **Clusters** section and create a cluster. 

3. **Get your connection string**  
   - Go to your **Cluster Dashboard** → Click **Connect**.  
   - Select **"Connect your application"**.  
   - Copy the **MongoDB URI** (starts with `mongodb+srv://`).  

4. **Use your connection string**  
   - Update the **.env** file at the root:  
     ```bash
     MONGODB_URI=your_mongodb_connection_string
     ```

## 🔍 Assumptions

- **MongoDB Cloud Version**: We assumed that you are using **MongoDB Atlas**, the fully managed cloud service provided by MongoDB.

## 🚀 Features

- **✅ Password Strength Indicator** 
- **✅ Real-Time Data Validation**
- **✅ 2-Factor Authentication**
- **✅ Data Handeling with Encryption**
- **✅ Route Protection**
- **✅ Responsive User Interface and Experience**

## 💻 Tech Stack

#### Frontend:
- **Next.js**

#### Backend:
- **Node.js**
- **MongoDB** with **Mongoose**

#### Technologies:
- **Shadcn UI**
- **Motion**

## 🛠️ Testing the Authentication System

#### Sign In
In homepage, you will see a signin button which will route you to the signin page or you can go to http://localhost:3000/signin and use test credentials,

```bash
Username: CompileX
Password: CompileX2025@
```

after the signin, you'll will be redirected to the dashboard page. There, you will see a personalized Hello mesage with your username,and a logout button.

#### Sign Up
In homepage, you will see a signup button which will route you to the signup page or you can go to http://localhost:3000/signup and use any username and password and see all the validations there. Upon successfull signup, you will see a notification and will be redirected to the sign in page, which is http://localhost:3000/signin


## 🎉 Additional Features

#### 2 Factor Authentication
As an additional feature, we intergrated 2 factor authentication system. You can go to http://localhost:3000/settings/two-factor and enable two factor authentication. 

1. Switch on the 2 factor authentication.
2. It will give you a QR to scan from your authenticator app or a setup key to setup the authenticator app.
3. Then add the authenticator code shown in the app and click Verify and Enable.

If you enable it, after clicking signin, first, the system validate the credentials. Then you will be pop up a dialog box asking the OTP from the authenticator app.

If you want to disable the 2 factor authentication, you can switch off the authenticator.

<!-- ### 5. Viewing User Info on MongoDB Database
To inspect the user data:

1. Visit MongoDB Sign In at https://account.mongodb.com/account/login
2. Log in using the following credentials:
    Email: teamcompilex@gmail.com
    Password: mEzmiz-wyczup-7hycto

Once logged in, navigate to the Signup database to view the stored data. 
(https://cloud.mongodb.com/v2/66e6b967c047941487e9c1d7#/metrics/replicaSet/67cbbe6c9ec8437dc8e31c3d/explorer)

In there, you will see users with usernames, hashed passwords, and 2 factor authentication detail. -->
