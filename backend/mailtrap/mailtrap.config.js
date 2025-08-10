import { MailtrapClient as MailtrapClientSDK } from "mailtrap"; // Đổi tên khai báo để tránh trùng lặp
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClientSDK({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT
});

export const sender = {
  email: "hello@demomailtrap.com",
  name: "The Royal Sea Hotel",
};


// const recipients = [
//   {
//     email: "nguyenthivina0511@gmail.com",
//   }
// ];

// client
//   .send({
//     from: sender,
//     to: recipients,
//     subject: "You are awesome!",
//     text: "Congrats for sending test email with Mailtrap!",
//     category: "Integration Test",
//   })
//   .then(console.log, console.error);