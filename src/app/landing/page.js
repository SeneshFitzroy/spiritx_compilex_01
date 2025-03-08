// pages/index.js
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState, useEffect } from 'react';

export default function Home() {
  const [username, setUsername] = useState('Guest'); // Default to "Guest"

  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('Guest'); 
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>SecureConnect - Welcome</title>
        <meta name="description" content="A secure and user-friendly authentication system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>S</span> SecureConnect
        </div>
        <nav className={styles.nav}>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.title}>
            <span className={styles.greeting}>Hey</span>{' '}
            <span className={styles.userHighlight}>{username}</span>
            <br />
            <span className={styles.subtitle}>
              Welcome to <span className={styles.highlight}>SecureConnect</span>
            </span>
          </h1>
          <p className={styles.description}>
            Security redefined for the future.
          </p>
          {username !== 'Guest' && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              <span>Logout</span>
            </button>
          )}
          
        </section>

        <section id="features" className={styles.features}>
          <h2 className={styles.featuresTitle}>Next-Gen Features</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3>Fortified</h3>
              <p>Security that evolves with you.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>➡️</div>
              <h3>Frictionless</h3>
              <p>Access at the speed of thought.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>👤</div>
              <h3>Bespoke</h3>
              <p>Tailored just for you.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>SecureConnect © 2025</p>
      </footer>
    </div>
  );
}