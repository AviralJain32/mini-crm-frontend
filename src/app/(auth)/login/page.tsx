"use client";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import Cookies from "js-cookie";

export default function LoginPage() {

  const loginWithGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/google`;
  };

    const router = useRouter();
  /* eslint-disable */
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      Cookies.set('token', token, {
        secure: true,
        sameSite: 'None',
        expires: 1,
      });

      // Remove token from URL
      router.replace('/dashboard/segments', undefined);
    }
  }, []);
  /* eslint-enable */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Welcome to Xeno Mini CRM</h1>
        <p className="text-sm text-gray-500 mb-6">
          Sign in to continue managing your campaigns and customers.
        </p>

        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 py-2 px-4 w-full rounded-lg shadow-sm transition-all"
        >
          <FcGoogle size={20} />
          <span>Continue with Google</span>
        </button>

        <p className="text-xs text-gray-400 mt-6">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
