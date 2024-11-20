import NodeMailer from "nodemailer";

export default async function handler(req, res) {
  const { title } = req.body; // TODO: Removed email from here, but it may be nice to have user's email/name in the request email that gets sent to admins

  const transporter = NodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Verify transporter connection before sending notification
    await transporter.verify();

    const mailOptions = {
      from: "PlexRequest Notification <bm.contact623@gmail.com>",
      to: process.env.TEMP_EMAIL, // TODO: after userauth and admin side set up, change this to only be for the admin emails
      subject: `New Request: ${title}`,
      html: `
      <h1>New Request - ${title}</h1> 
      `, // TODO: add CSS to make this look nicer
    };

    // Send notification
    const send = await transporter.sendMail(mailOptions);

    // Send success response after email is sent
    return res.status(200).json({
      status: "success",
      data: send,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
}