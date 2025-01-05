import { VERIFICATION_EMAIL_TEMPLATE , PASSWORD_RESET_REQUEST_TEMPLATE , PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplet.js";
import { MailTrapclient, sender } from "./mailtrap.config.js"

export const  sendVerificationEmail=async (email,verificationToken)=>{
    const recipient=[{email}]
    try {
        const response=await MailTrapclient.send({
            from:sender,
            to:recipient,
            subject:"verify your email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
            category:"Email Verification"
        })
        console.log("Email is sent successfully ",response);

    } catch (error) {
        console.error("Email Error",error);
        throw new Error(`Error sending email verification: ${error}`)
    }
} 

export const sendWelcomeMail=async(email,name)=>{
    const recipient=[{email}]
    try {
        const response=await MailTrapclient.send({
            from:sender,
            to:recipient,
            template_uuid:"919fddb9-d0cb-4534-9c41-797174107672",
            template_variables: {
                "company_info_name": "Vikas Project",
                "name": name
              }
        })
        console.log("Welcome email send successfully",response)

    } catch (error) {
        console.error("Not able to send the welcome email",error);
        throw new Error(`Not able to send welcome email ${error}`);
    }
}

export const resetPasswordMail=async(email,resetURL)=>{
    console.log(resetURL)
    const recipient=[{email}]
    try {
        const response=await MailTrapclient.send({
            from:sender,
            to:recipient,
            subject:"Reset Your Password",
            html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
            category:"Password reset"
        })
    } catch (error) {
        console.log("Error sending the reset password");
        throw new Error(`Error in sending the reset mail ${error}`);        
    }
}

export const sendSetSuccessMail = async (email)=>{
    const recipient=[{email}]
    try {
        const response=await MailTrapclient.send({
            from:sender,
            to:recipient,
            subject:"Reset Password successfull",
            html:PASSWORD_RESET_SUCCESS_TEMPLATE,
            category:"Password reset"
        })
        console.log("Password is reset successfully",response);
    } catch (error) {
        console.log("error in sending reset password mail")
        throw new Error(`error in sending the successfully password reset mail ${error}`);        
    }
}