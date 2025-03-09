'use client'
import Head from 'next/head';
import styles from '../dashboard/Home.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import Link from 'next/link';


export default function Home() {
  const [username, setUsername] = useState('Guest');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setLoading(false);
    } else {
      router.push('/signin');
    }
  }, [router]);

  if (loading) {
    return <div className={styles.container}>Loading...</div>;
  }

  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('Guest');
    router.push('/signin');
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
        <nav className={`flex items-center ${styles.nav}`}>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="ml-9">
                <AvatarImage />
                <AvatarFallback className="text-black text-xs">User</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-5">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/settings/two-factor">
                <DropdownMenuItem>Security</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <button onClick={handleLogout}>
                  <span>Logout</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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