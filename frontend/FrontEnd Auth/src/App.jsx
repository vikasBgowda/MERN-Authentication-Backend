import { Navigate, Route , Routes } from "react-router-dom"
import FloatingCompoents from "./compoents/FloatingCompoents.jsx"
import { SignUp } from './Pages/SignUp.jsx'
import { LoginPage } from './Pages/LoginPage.jsx'
import { VerifyEmail } from "./Pages/VerifyEmail.jsx"
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from "./store/authStore.js"
import { useEffect } from "react"
import { HomePage } from "./Pages/HomePage.jsx"
import LoadingSpinner from "./compoents/LoadingSpinner.jsx"
import { ForgotPassword } from "./Pages/ForgotPassword.jsx"
import AfterForgotPasswordPage from "./Pages/AfterForgotPasswordPage.jsx"
import { ResetPasswordPage } from "./Pages/ResetPasswordPage.jsx"
function App() {

  const { isCheckingAuth,checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth) return <LoadingSpinner />;

  //Protected routes that required authenitication
  const ProtectedRoutes=({children})=>{
    const {isAuthenticated , user}=useAuthStore();
    if(!isAuthenticated){
      return <Navigate to='/login' replace/>
    }
    if(!user.isVerified){
      return <Navigate to='verify-otp' replace/>
    }
    return children;
  }

  //Redirect the authenticated user to the home page
  const RedirectAuthenticatedUser=({children})=>{
    const { isAuthenticated , user}=useAuthStore();
    if(isAuthenticated && user.isVerified){
      return <Navigate to='/' replace />
    }
    return children;
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900  flex items-center justify-center relative overflow-hidden' >
      <FloatingCompoents color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0}/>
      <FloatingCompoents color="bg-emerald-500" size="w-48 h-48" top="70%" left="80%" delay={5}/>
      <FloatingCompoents color="bg-lime-500" size="w-32 h-32" top="40%" left="-10%" delay={2}/>

      <Routes>
        <Route path='/' element={<ProtectedRoutes>
          <HomePage/>
        </ProtectedRoutes>}/>
        <Route path='/signup' element={
          <RedirectAuthenticatedUser>
            <SignUp/>
          </RedirectAuthenticatedUser>
          }/>
        <Route path='/login' element={ <RedirectAuthenticatedUser>
            <LoginPage/>
          </RedirectAuthenticatedUser>}/>
        <Route path='/verify-otp' element={<VerifyEmail/>}/>
        <Route path='/forgot-password' element={<RedirectAuthenticatedUser>
            <ForgotPassword/>
          </RedirectAuthenticatedUser>}/>
        <Route path="/forgot-password-mail" element={<AfterForgotPasswordPage/>}></Route>
        <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser>
            <ResetPasswordPage/>
          </RedirectAuthenticatedUser>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
