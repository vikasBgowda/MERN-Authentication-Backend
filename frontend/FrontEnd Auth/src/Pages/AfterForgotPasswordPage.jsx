import React from 'react'
import { motion } from "framer-motion";
import { Mail , ArrowLeft} from 'lucide-react';
import { Link } from "react-router-dom";
export const AfterForgotPasswordPage = () => {
  return (
    <motion.div className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Forgot Password
				</h2>
            </div>
        
    <div className='text-center'>
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
        >
            <Mail className='h-8 w-8 text-white' />
        </motion.div>
        <p className='text-gray-300 mb-6'>
            If an account exists for , you will receive a password reset link shortly.
        </p>
    </div>
    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<Link to={"/login"} className='text-sm text-green-400 hover:underline flex items-center'>
					<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
				</Link>
			</div>
    </motion.div>
  )
}
export default AfterForgotPasswordPage;
