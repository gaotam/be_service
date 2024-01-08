const nodemailer = require("nodemailer");
const prisma = require("../client");
const { mail } = require("../config/config");

const sendMail = async (to, title, html) => {
  const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    auth: {
      user: mail.auth.user,
      pass: mail.auth.pass,
    },
  });

  await transporter.sendMail({
    from: `Câu lạc bộ Tin học HIT <no_reply@hithaui.com>`,
    to: to,
    subject: title,
    html: html,
  });
}

const createJob = async(userId, type) => {
  const mail = await prisma.mail.findFirst({
    where: {
      userId,
      type 
    }
  })

  if(mail) return mail;

  const mailCreated = await prisma.mail.create({
    data: {
      status: "PENDING",
      userId,
      type
    }
  })

  if (!mailCreated) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Can not create new mail job");
  }

  return mailCreated;
}

const updateJob = async(userId, type, reason, status) => {
  const updateMail = await prisma.mail.updateMany({
    where: {
      userId,
      type
    },
    data: {
      status,
      reason
    },
  });

  if (updateMail.count == 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "mail does not exist");
  }
}
module.exports = { sendMail, createJob, updateJob }