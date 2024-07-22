import { simpleParser } from 'mailparser';
import { inspect } from 'util';
import moment from 'moment';
import dotenv from 'dotenv';

import connection from '../config/email-config.js';
import transporter from '../config/nodemail-config.js';
import { sanitizeObject } from '../utils/index.js';

dotenv.config();

const sendMail = (req, res) => {
    const { from, to, subject, text } = req.body;

    const mailOptions = {
        from,
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: 'Email sent successfully' });
        }
    });
}

const retrieveMail =  async (req, res) => {
    const emails = [];
    try {
        connection.once('ready', function () {
            connection.openBox('INBOX', true, function (err, box) {
                if (err) throw err;
                connection.search(['UNSEEN', ['SINCE', moment().format('YYYY-MM-DD')]], function (err, results) {
                    if (err) throw err;
                    var f = connection.fetch(results, { bodies: '' });
                    f.on('message', function (msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', async function (stream, info) {
                            console.log(prefix + 'Body');
                            const parsed = await simpleParser(stream)
                            emails.push(sanitizeEmailObject(parsed))
                        });
                        msg.once('attributes', function (attrs) {
                            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                        });
                        msg.once('end', function () {
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        connection.end();
                    });
                });
            });
        });
        connection.end();

        connection.once('error', function (err) {
            console.log(err);
        });

        connection.once('end', function () {
            console.log(`Connection ended - total new incoming email: ${emails?.length}`);
            res.status(200).json(emails);
        });

        connection.connect();

    } catch (error) {
        console.log('Error reading emails:', error);
        res.status(500).json({ error: 'Failed to read emails' });
    }
}

const sanitizeEmailObject = (input) => {
    return sanitizeObject(
        input, 
        [
            "html",
            "text",
            "textAsHtml",
            "subject",
            "references",
            "date",
            "to",
            "from",
            "messageId",
            "inReplyTo"
        ]
    )
}

export { sendMail, retrieveMail }