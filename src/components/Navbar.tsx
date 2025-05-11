'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TiThMenu } from 'react-icons/ti';
import { AiOutlineClose } from 'react-icons/ai';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { UserType } from '@/types/User';

type NavbarProps = {
  isLoggedIn: boolean;
  token: string | undefined;
};

const menuVariants = {
  hidden: { opacity: 0, y: '-100%' },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
  exit: { opacity: 0, y: '-100%', transition: { duration: 0.4, ease: 'easeInOut' } },
};

export default function Navbar({ isLoggedIn, token }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const user: UserType | null =token ? jwtDecode(token):null

  const handleLogout = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/logout`, {
      withCredentials: true,
    });
    router.push('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Left section - Logo & Title */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image src="/AdroidCMTLogo.png" alt="Logo" width={40} height={40} /> */}
            <span className="font-bold text-lg text-gray-800">Xeno Mini CRM</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6 items-center">
          {isLoggedIn && (
            <>
              <Link href="/dashboard"><Button variant="ghost">Dashboard</Button></Link>
              <Link href="/dashboard/segments"><Button variant="ghost">Segments</Button></Link>
              <Link href="/dashboard/campaigns"><Button variant="ghost">Campaigns</Button></Link>
            </>
          )}
        </div>

        {/* User & Auth Buttons */}
        <div className="hidden lg:flex gap-4 items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
          ) : (
            <Link href="/login"><Button variant="default">Login</Button></Link>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden">
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <AiOutlineClose size={24} /> : <TiThMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="lg:hidden bg-white shadow-md border-t flex flex-col items-center py-6 gap-4"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/segments" onClick={() => setOpen(false)}>Segments</Link>
                <Link href="/dashboard/campaigns" onClick={() => setOpen(false)}>Campaigns</Link>
                <span className="text-sm text-gray-600">{user?.name}</span>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Link href="/login" onClick={() => setOpen(false)}><Button variant="default">Login</Button></Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
