import load from "process-env-loader";
load("../");
import Queue from "bull";
import mailgun from "mailgun-js";
import resetPasswordTemplate from "../templates/ResetPassword.template";

const emailQueue = new Queue("email");

emailQueue.process((job, done) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!
  });

  const data = {
    from: "noreply@emprega.com",
    to: job.data.to,
    subject: "Emprega password reset",
    html: resetPasswordTemplate(job.data.link)
  };

  mg.messages().send(data, (error, body) => {
    if (error) {
      console.error(`Failed to send email to ${job.data.to}`);
      console.error(error);
    } else {
      console.log(body);
    }
    done();
  });
});
