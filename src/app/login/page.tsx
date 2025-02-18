// // src/app/login/page.tsx


// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';

// const Login = () => {
//   const [isSignInForm, setIsSignInForm] = useState(true);
//   const [, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [showValidationHints, setShowValidationHints] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const { signIn, signUp, googleSignIn } = useAuth();
//   const router = useRouter();

//   const checkValidData = () => {
//     const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(formData.email);
//     const isPasswordValid = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(formData.password);

//     if (!isEmailValid) return "Email ID is not valid";
//     if (!isPasswordValid) return "Password is not valid";
//     return null;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const toggleSignInForm = () => {
//     setIsSignInForm(!isSignInForm);
//     setErrorMessage(null);
//     setShowValidationHints(false);
//     setFormData({ name: '', email: '', password: '' });
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       await googleSignIn();
//       router.push("/");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage('An unknown error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleButtonClick = async () => {
//     const message = checkValidData();
//     setErrorMessage(message);

//     if (message) {
//       setShowValidationHints(true);
//       return;
//     }

//     setLoading(true);

//     try {
//       if (!isSignInForm) {
//         await signUp(formData.email, formData.password, formData.name);
//       } else {
//         await signIn(formData.email, formData.password);
//       }
//       router.push("/");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage('An unknown error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       <div className="absolute inset-0 z-0">
//                 <Image 
//                   layout="fill" 
//                   src={'https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
//                   alt="Background"
//                 />
//       </div>

//       <div className="relative z-10 w-full max-w-md px-4">
//         <form 
//           onSubmit={(e) => e.preventDefault()} 
//           className="
//             w-full 
//             p-6 
//             md:p-8 
//             bg-white/70
//             backdrop-blur-sm 
//             rounded-xl 
//             shadow-lg 
//             border 
//             border-gray-200
//           "
//         >
//           <h1 className="
//             text-center 
//             font-bold 
//             font-serif 
//             text-3xl 
//             md:text-4xl 
//             py-4 
//             text-gray-800
//           ">
//             {isSignInForm ? "Sign In" : "Sign Up"}
//           </h1>

//           {!isSignInForm && (
//             <input 
//               name="name"
//               type="text" 
//               placeholder="Full name" 
//               value={formData.name}
//               onChange={handleInputChange}
//               className="
//                 w-full 
//                 p-3 
//                 md:p-4 
//                 my-2 
//                 bg-white 
//                 text-gray-800 
//                 rounded-lg 
//                 border 
//                 border-gray-300 
//                 focus:outline-none 
//                 focus:ring-2 
//                 focus:ring-gray-500
//               "
//             />
//           )}

//           <input 
//             name="email"
//             type="text" 
//             placeholder="Email address" 
//             value={formData.email}
//             onChange={handleInputChange}
//             className="
//               w-full 
//               p-3 
//               md:p-4 
//               my-2 
//               bg-white 
//               text-gray-800 
//               rounded-lg 
//               border 
//               border-gray-300 
//               focus:outline-none 
//               focus:ring-2 
//               focus:ring-gray-500
//             "
//           />

//           <input 
//             name="password"
//             type="password" 
//             placeholder="Password" 
//             value={formData.password}
//             onChange={handleInputChange}
//             className="
//               w-full 
//               p-3 
//               md:p-4 
//               my-2 
//               bg-white 
//               text-gray-800 
//               rounded-lg 
//               border 
//               border-gray-300 
//               focus:outline-none 
//               focus:ring-2 
//               focus:ring-gray-500
//             "
//           />

//           {errorMessage && (
//             <p className="text-red-500 font-bold text-sm md:text-lg py-2 text-center">
//               {errorMessage}
//             </p>
//           )}

//           {showValidationHints && (
//             <div className="text-yellow-700 text-xs md:text-sm py-2">
//               <p className="font-semibold mb-1">Password must include:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>At least 6 characters long</li>
//                 <li>One special character (@, #, $, !, etc.)</li>
//                 <li>One uppercase letter</li>
//                 <li>One lowercase letter</li>
//                 <li>One number</li>
//               </ul>
//               <p className="mt-2 text-center">Email should be in format: username@domain.com</p>
//             </div>
//           )}

//           <button 
//             className="
//               w-full 
//               p-3 
//               md:p-4 
//               my-4 
//               bg-gray-700 
//               text-white 
//               rounded-lg 
//               hover:bg-gray-800 
//               transition-colors 
//               duration-300
//             " 
//             onClick={handleButtonClick}
//           >
//             {isSignInForm ? "Sign In" : "Sign Up"}
//           </button>

//           <p 
//             className="
//               text-center 
//               py-2 
//               cursor-pointer 
//               font-serif 
//               text-gray-700 
//               hover:text-gray-900 
//               transition-colors 
//               duration-300
//             " 
//             onClick={toggleSignInForm}
//           >
//             {isSignInForm 
//               ? "New to here? Sign up now" 
//               : "Already a member? Sign in"}
//           </p>

//           <p className='flex justify-center text-gray-700 font-serif'>or</p>

//           <button 
//             type="button"
//             onClick={handleGoogleSignIn}
//             className="
//               w-full 
//               p-3 
//               md:p-4 
//               my-2 
//               bg-white 
//               text-gray-700 
//               border 
//               border-gray-300 
//               rounded-lg 
//               hover:bg-gray-50 
//               transition-colors 
//               duration-300 
//               flex 
//               items-center 
//               justify-center 
//               gap-2
//             "
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 fill="#4285F4"
//               />
//               <path
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 fill="#34A853"
//               />
//               <path
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 fill="#FBBC05"
//               />
//               <path
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 fill="#EA4335"
//               />
//             </svg>
//             Continue with Google
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

// main below


// 'use client';

// import React, { useState } from 'react';
// import Image from 'next/image';
// import { useAuth } from '@/context/AuthContext';
// import { useRouter } from 'next/navigation';
// import { db, auth } from '@/config/firebase';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

// interface FormData {
//   name: string;
//   email: string;
//   password: string;
//   phoneNumber: string;
// }

// const Login = () => {
//   const [isSignInForm, setIsSignInForm] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [showValidationHints, setShowValidationHints] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     email: '',
//     password: '',
//     phoneNumber: ''
//   });

//   const { signIn, signUp, googleSignIn } = useAuth();
//   const router = useRouter();

//   const checkValidData = () => {
//     const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(formData.email);
//     const isPasswordValid = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(formData.password);
//     const isPhoneValid = /^\+?[1-9]\d{9,11}$/.test(formData.phoneNumber);

//     if (!isEmailValid) return "Email ID is not valid";
//     if (!isPasswordValid) return "Password is not valid";
//     if (!isSignInForm && !isPhoneValid) return "Please enter a valid phone number";
//     return null;
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const toggleSignInForm = () => {
//     setIsSignInForm(!isSignInForm);
//     setErrorMessage(null);
//     setShowValidationHints(false);
//     setFormData({ name: '', email: '', password: '', phoneNumber: '' });
//   };

//   const checkGymOwnerStatus = async (uid: string): Promise<boolean> => {
//     try {
//       const gymOwnersRef = doc(db, 'gymOwners', 'list');
//       const docSnap = await getDoc(gymOwnersRef);
      
//       if (docSnap.exists()) {
//         const gymOwners = docSnap.data().uids || [];
//         return gymOwners.includes(uid);
//       }
//       return false;
//     } catch (error) {
//       console.error('Error checking gym owner status:', error);
//       return false;
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       await googleSignIn();
//       const user = auth.currentUser;
//       if (user) {
//         const isGymOwner = await checkGymOwnerStatus(user.uid);
//         router.push(isGymOwner ? "/dashboard" : "/");
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage('An unknown error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveUserData = async (uid: string) => {
//     await setDoc(doc(db, 'users', uid), {
//       name: formData.name,
//       email: formData.email,
//       phoneNumber: formData.phoneNumber,
//       createdAt: new Date().toISOString()
//     });
//   };

//   const handleButtonClick = async () => {
//     const message = checkValidData();
//     setErrorMessage(message);

//     if (message) {
//       setShowValidationHints(true);
//       return;
//     }

//     setLoading(true);

//     try {
//       if (!isSignInForm) {
//         await signUp(formData.email, formData.password, formData.name);
//         const user = auth.currentUser;
//         if (user) {
//           await saveUserData(user.uid);
//           const isGymOwner = await checkGymOwnerStatus(user.uid);
//           router.push(isGymOwner ? "/dashboard" : "/");
//         }
//       } else {
//         await signIn(formData.email, formData.password);
//         const user = auth.currentUser;
//         if (user) {
//           const isGymOwner = await checkGymOwnerStatus(user.uid);
//           router.push(isGymOwner ? "/dashboard" : "/");
//         }
//       }
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         setErrorMessage(error.message);
//       } else {
//         setErrorMessage('An unknown error occurred');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center">
//       <div className="absolute inset-0 z-0">
//         {/* <Image 
//           layout="fill" 
//           src={'https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
//           alt="Background"
//           className="object-cover"
//         /> */}
//       </div>

//       <div className="relative z-10 w-full max-w-md px-4">
//         <form 
//           onSubmit={(e) => e.preventDefault()} 
//           className="w-full p-6 md:p-8 bg-white rounded-xl shadow-lg border border-gray-200"
//         >
//           {/* bg-white/70 backdrop-blur-sm */}
//           <h1 className="text-center font-bold font-serif text-3xl md:text-4xl py-4 text-gray-800">
//             {isSignInForm ? "Sign In" : "Sign Up"}
//           </h1>

//           {!isSignInForm && (
//             <>
//               <input 
//                 name="name"
//                 type="text" 
//                 placeholder="Full name" 
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full p-3 md:p-4 my-2 bg-white text-gray-800 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//               />
//               <input 
//                 name="phoneNumber"
//                 type="tel" 
//                 placeholder="Phone number" 
//                 value={formData.phoneNumber}
//                 onChange={handleInputChange}
//                 className="w-full p-3 md:p-4 my-2 bg-white text-gray-800 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//               />
//             </>
//           )}

//           <input 
//             name="email"
//             type="text" 
//             placeholder="Email address" 
//             value={formData.email}
//             onChange={handleInputChange}
//             className="w-full p-3 md:p-4 my-2 bg-white text-gray-800 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//           />

//           <input 
//             name="password"
//             type="password" 
//             placeholder="Password" 
//             value={formData.password}
//             onChange={handleInputChange}
//             className="w-full p-3 md:p-4 my-2 bg-white text-gray-800 rounded-lg border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
//           />

//           {errorMessage && (
//             <p className="text-red-500 font-bold text-sm md:text-lg py-2 text-center">
//               {errorMessage}
//             </p>
//           )}

//           {showValidationHints && (
//             <div className="text-yellow-700 text-xs md:text-sm py-2">
//               <p className="font-semibold mb-1">Password must include:</p>
//               <ul className="list-disc pl-5 space-y-1">
//                 <li>At least 6 characters long</li>
//                 <li>One special character (@, #, $, !, etc.)</li>
//                 <li>One uppercase letter</li>
//                 <li>One lowercase letter</li>
//                 <li>One number</li>
//               </ul>
//               <p className="mt-2 text-center">Email should be in format: username@domain.com</p>
//               {!isSignInForm && (
//                 <p className="mt-2 text-center">Phone number should be 10-12 digits</p>
//               )}
//             </div>
//           )}

//           <button 
//             className={`w-full p-3 md:p-4 my-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             onClick={handleButtonClick}
//             disabled={loading}
//           >
//             {loading ? 'Processing...' : (isSignInForm ? "Sign In" : "Sign Up")}
//           </button>

//           <p 
//             className="text-center py-2 cursor-pointer font-serif text-gray-700 hover:text-gray-900 transition-colors duration-300"
//             onClick={toggleSignInForm}
//           >
//             {isSignInForm 
//               ? "Not a member? Sign up now" 
//               : "Already a member? Sign in"}
//           </p>

//           <p className='flex justify-center text-gray-700 font-serif'>or</p>

//           <button 
//             type="button"
//             onClick={handleGoogleSignIn}
//             disabled={loading}
//             className={`w-full p-3 md:p-4 my-2 bg-white text-gray-700 border-2 border-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//           >
//             <svg className="w-5 h-5" viewBox="0 0 24 24">
//               <path
//                 d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//                 fill="#4285F4"
//               />
//               <path
//                 d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//                 fill="#34A853"
//               />
//               <path
//                 d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//                 fill="#FBBC05"
//               />
//               <path
//                 d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//                 fill="#EA4335"
//               />
//             </svg>
//             Continue with Google
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;







'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface FormData {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export default function Login() {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showValidationHints, setShowValidationHints] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phoneNumber: ''
  });

  const { signIn, signUp, googleSignIn } = useAuth();
  const router = useRouter();

  const checkValidData = () => {
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(formData.email);
    const isPasswordValid = /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(formData.password);
    const isPhoneValid = /^\+?[1-9]\d{9,11}$/.test(formData.phoneNumber);

    if (!isEmailValid) return "Email ID is not valid";
    if (!isPasswordValid) return "Password is not valid";
    if (!isSignInForm && !isPhoneValid) return "Please enter a valid phone number";
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
    setFormData({ name: '', email: '', password: '', phoneNumber: '' });
  };

  const checkGymOwnerStatus = async (uid: string): Promise<boolean> => {
    try {
      const gymOwnersRef = doc(db, 'gymOwners', 'list');
      const docSnap = await getDoc(gymOwnersRef);
      
      if (docSnap.exists()) {
        const gymOwners = docSnap.data().uids || [];
        return gymOwners.includes(uid);
      }
      return false;
    } catch (error) {
      console.error('Error checking gym owner status:', error);
      return false;
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      const user = auth.currentUser;
      if (user) {
        const isGymOwner = await checkGymOwnerStatus(user.uid);
        router.push(isGymOwner ? "/dashboard" : "/");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveUserData = async (uid: string) => {
    await setDoc(doc(db, 'users', uid), {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      createdAt: new Date().toISOString()
    });
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
        const user = auth.currentUser;
        if (user) {
          await saveUserData(user.uid);
          const isGymOwner = await checkGymOwnerStatus(user.uid);
          router.push(isGymOwner ? "/dashboard" : "/");
        }
      } else {
        await signIn(formData.email, formData.password);
        const user = auth.currentUser;
        if (user) {
          const isGymOwner = await checkGymOwnerStatus(user.uid);
          router.push(isGymOwner ? "/dashboard" : "/");
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-black">
      {/* Overlay with dark gradient */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-black/60 to-black/90"></div>
        <Image 
          src="https://plus.unsplash.com/premium_photo-1661920538067-c48451160c72?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="mix-blend-overlay opacity-80"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 py-6 md:py-0">
        <div className="text-center mb-6 text-white">
          <div className="mx-auto w-40 h-40 rounded-full bg-white/35 mb-2 mt-32 md:mt-0 p-2">
          <Image 
              src="/rfithublogo.png" 
              alt="Background"
              width={400}
              height={400}
              className=" z-10"
            />
            
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">Welcome to RFITHUB
            
          </h1>
          <p className="text-gray-300 text-lg">Plan your workout time with us</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
          <h2 className="text-center font-bold text-2xl mb-6 text-white">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h2>

          <form onSubmit={(e) => e.preventDefault()}>
            {!isSignInForm && (
              <>
                <div className="mb-4">
                  <input 
                    name="name"
                    type="text" 
                    placeholder="Full name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                  />
                </div>
                <div className="mb-4">
                  <input 
                    name="phoneNumber"
                    type="tel" 
                    placeholder="Phone number" 
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <input 
                name="email"
                type="text" 
                placeholder="Email address" 
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
              />
            </div>

            <div className="mb-4">
              <input 
                name="password"
                type="password" 
                placeholder="Password" 
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
              />
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm mb-4 text-center">
                {errorMessage}
              </p>
            )}

            {showValidationHints && (
              <div className="text-gray-300 text-xs mb-4">
                <p className="font-semibold mb-1">Password must include:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>At least 6 characters long</li>
                  <li>One special character (@, #, $, !, etc.)</li>
                  <li>One uppercase letter</li>
                  <li>One lowercase letter</li>
                  <li>One number</li>
                </ul>
                <p className="mt-2 text-center">Email should be in format: username@domain.com</p>
                {!isSignInForm && (
                  <p className="mt-2 text-center">Phone number should be 10-12 digits</p>
                )}
              </div>
            )}

            <button 
              className={`w-full p-3 my-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleButtonClick}
              disabled={loading}
            >
              {loading ? 'Processing...' : (isSignInForm ? "Sign In" : "Sign Up")}
            </button>

            <div className="flex items-center justify-center my-4">
              <div className="flex-grow h-px bg-white/20"></div>
              <p className="mx-2 text-sm text-gray-300">or</p>
              <div className="flex-grow h-px bg-white/20"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`w-full p-3 mb-4 bg-transparent text-white border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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

          <p 
            className="text-center py-2 cursor-pointer text-gray-300 hover:text-white transition-colors duration-300"
            onClick={toggleSignInForm}
          >
            {isSignInForm 
              ? "Not a member? Sign up now" 
              : "Already a member? Sign in"}
          </p>
        </div>
      </div>
    </div>
  );
}