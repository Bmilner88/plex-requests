import ReactDOMServer from "react-dom/server";
import NodeMailer from "nodemailer";
import UpdateEmail from "@/components/update-email";

import { fetchSingleRequest } from "@/lib/fetchRequests";
import { checkAdmin } from "@/lib/helpers";

export default async function handler(req, res) {
  const { id } = req.body;
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from auth headers

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const isAdmin = await checkAdmin(token);

  if (!isAdmin || !token) {
    return res.status(405).json({ error: "Unauthorized" });
  }

  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Grab the email from the backend so email is not exposed in json body
    const emailData = await fetchSingleRequest(id, token);

    // Generate email HTML
    const htmlContent = ReactDOMServer.renderToStaticMarkup(
      <UpdateEmail
        title={emailData[0].request_title}
        status={emailData[0].request_status}
        note={emailData[0].request_note}
        image={emailData[0].request_optional.image || ""}
      />
    );

    // Verify transporter connection before sending notification
    await transporter.verify();

    const mailOptions = {
      from: "PlexRequest Notification <bm.contact623@gmail.com>",
      to: emailData[0].request_requestor,
      subject: `${emailData[0].request_title} Update!`,
      html: htmlContent,
    };

    // Send notification
    await transporter.sendMail(mailOptions);

    // Send success response after email is sent
    return res.status(200).json({
      status: "send success",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "send fail",
      message: err.message,
    });
  }
}
