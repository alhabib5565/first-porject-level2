import nodemailer from 'nodemailer';
export const sendMail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: "alhabib5565@gmail.com",
            pass: "yhmd kegj axwb exgt",
        },
    });

    await transporter.sendMail({
        from: 'alhabib5565@gmail.com', // sender address
        to, // list of receivers
        subject: "Reset password within 10 minute", // Subject line
        text: "Hello world?", // plain text body
        html: html, // html body
    });
}

