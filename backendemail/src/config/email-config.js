import imap from 'imap'
import dotenv from 'dotenv';

dotenv.config();

const imapOptions = {
  user: process.env.APP_USER,
  password: process.env.APP_PASS,
  host: process.env.IMAP_POP3_HOST,
  port: process.env.IMAP_POP3_PORT,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false
  },
  markSeen: true,
  fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`, 
  mailParserOptions: { streamAttachments: true }, // options to be passed to mailParser lib. 
  attachments: true, // download attachments as they are encountered to the project directory 
  attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments 
};

const connection = new imap(imapOptions);

export default connection;