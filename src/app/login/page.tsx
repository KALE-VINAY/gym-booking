// // src/app/login/page.tsx

// 'use client';

// import { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';

// export default function LoginPage() {
//   const { signIn } = useAuth();
//   const router = useRouter();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     try {
//       await signIn(email, password);
//       router.push('/dashboard'); // Redirect to the dashboard after login
//     } catch (err: any) {
//       setError(err.message || 'Failed to log in');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <form
//         className="bg-white p-6 rounded shadow-md space-y-4"
//         onSubmit={handleLogin}
//       >
//         <h1 className="text-2xl text-gray-900 font-bold">Login</h1>
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//             Email
//           </label>
//           <input
//             type="email"
//             id="email"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//             Password
//           </label>
//           <input
//             type="password"
//             id="password"
//             className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded-md shadow-sm hover:bg-indigo-700"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showValidationHints, setShowValidationHints] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const { signIn, signUp, googleSignIn } = useAuth();
  const router = useRouter();

  const checkValidData = () => {
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(formData.email);
    const isPasswordValid = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(formData.password);

    if (!isEmailValid) return "Email ID is not valid";
    if (!isPasswordValid) return "Password is not valid";
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
    setErrorMessage(null);
    setShowValidationHints(false);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = async () => {
    const message = checkValidData();
    setErrorMessage(message);

    if (message) {
      setShowValidationHints(true);
      return;
    }

    setLoading(true);

    try {
      if (!isSignInForm) {
        await signUp(formData.email, formData.password, formData.name);
      } else {
        await signIn(formData.email, formData.password);
      }
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          src='https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' 
          alt="bg img"
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <form 
          onSubmit={(e) => e.preventDefault()} 
          className="
            w-full 
            p-6 
            md:p-8 
            bg-white/70
            backdrop-blur-sm 
            rounded-xl 
            shadow-lg 
            border 
            border-gray-200
          "
        >
          <h1 className="
            text-center 
            font-bold 
            font-serif 
            text-3xl 
            md:text-4xl 
            py-4 
            text-gray-800
          ">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>

          {!isSignInForm && (
            <input 
              name="name"
              type="text" 
              placeholder="Full name" 
              value={formData.name}
              onChange={handleInputChange}
              className="
                w-full 
                p-3 
                md:p-4 
                my-2 
                bg-white 
                text-gray-800 
                rounded-lg 
                border 
                border-gray-300 
                focus:outline-none 
                focus:ring-2 
                focus:ring-gray-500
              "
            />
          )}

          <input 
            name="email"
            type="text" 
            placeholder="Email address" 
            value={formData.email}
            onChange={handleInputChange}
            className="
              w-full 
              p-3 
              md:p-4 
              my-2 
              bg-white 
              text-gray-800 
              rounded-lg 
              border 
              border-gray-300 
              focus:outline-none 
              focus:ring-2 
              focus:ring-gray-500
            "
          />

          <input 
            name="password"
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleInputChange}
            className="
              w-full 
              p-3 
              md:p-4 
              my-2 
              bg-white 
              text-gray-800 
              rounded-lg 
              border 
              border-gray-300 
              focus:outline-none 
              focus:ring-2 
              focus:ring-gray-500
            "
          />

          {errorMessage && (
            <p className="text-red-500 font-bold text-sm md:text-lg py-2 text-center">
              {errorMessage}
            </p>
          )}

          {showValidationHints && (
            <div className="text-yellow-700 text-xs md:text-sm py-2">
              <p className="font-semibold mb-1">Password must include:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>At least 6 characters long</li>
                <li>One special character (@, #, $, !, etc.)</li>
                <li>One uppercase letter</li>
                <li>One lowercase letter</li>
                <li>One number</li>
              </ul>
              <p className="mt-2 text-center">Email should be in format: username@domain.com</p>
            </div>
          )}

          <button 
            className="
              w-full 
              p-3 
              md:p-4 
              my-4 
              bg-gray-700 
              text-white 
              rounded-lg 
              hover:bg-gray-800 
              transition-colors 
              duration-300
            " 
            onClick={handleButtonClick}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <p 
            className="
              text-center 
              py-2 
              cursor-pointer 
              font-serif 
              text-gray-700 
              hover:text-gray-900 
              transition-colors 
              duration-300
            " 
            onClick={toggleSignInForm}
          >
            {isSignInForm 
              ? "New to here? Sign up now" 
              : "Already a member? Sign in"}
          </p>

          <p className='flex justify-center text-gray-700 font-serif'>or</p>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="
              w-full 
              p-3 
              md:p-4 
              my-2 
              bg-white 
              text-gray-700 
              border 
              border-gray-300 
              rounded-lg 
              hover:bg-gray-50 
              transition-colors 
              duration-300 
              flex 
              items-center 
              justify-center 
              gap-2
            "
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;