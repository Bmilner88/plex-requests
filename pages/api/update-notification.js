import NodeMailer from "nodemailer";
import { fetchSingleRequest } from "@/lib/fetchRequests";

export default async function handler(req, res) {
  const { status, id, title } = req.body;

  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Grab the email from the backend so email is not exposed in json body
    const emailData = await fetchSingleRequest(id);

    if (!emailData || !emailData[0].request_requestor) {
      throw new Error("Email not found");
    }

    // Verify transporter connection before sending notification
    await transporter.verify();

    const mailOptions = {
      from: "PlexRequest Notification <bm.contact623@gmail.com>",
      to: emailData[0].request_requestor,
      subject: `${title} Status Change`,
      html: `
      <h1>The Status for ${title} has changed!</h1>
      <h2>New Status: ${status}</h2>
      `, // TODO: add CSS to make this look nicer
    };

    // Send notification
    await transporter.sendMail(mailOptions);

    // Send success response after email is sent
    return res.status(200).json({
      status: "send success",
      //data: send,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "send fail",
      message: err.message,
    });
  }
}
