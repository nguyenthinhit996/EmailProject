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
};

const connection = new imap(imapOptions);

export default connection;