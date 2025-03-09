'use client'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3"
import React from "react"

export default function ReCaptcha({ children }) {
    return (
        <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
            {children}
        </GoogleReCaptchaProvider>
    )
}