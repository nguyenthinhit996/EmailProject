import { simpleParser } from 'mailparser';
import { inspect } from 'util';
import moment from 'moment';
import dotenv from 'dotenv';
import Imap from 'imap';
import fs from 'fs';

import connection from '../config/email-config.js';
import transporter from '../config/nodemail-config.js';
import { sanitizeObject } from '../utils/index.js';
import { log } from 'console';

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

const retrieveInBoxMailVer2 = async (req, res) => {
    let email_array = [];
    try {
        connection.once('ready', function () {
            log('Connection ready');

            connection.openBox('INBOX', false, function (err, box) {
                connection.search(['UNSEEN', ['SINCE', moment().format('YYYY-MM-DD')]], function (err, results) {
                    if (!results || !results.length) {
                        console.log("The server didn't find any emails matching the specified criteria")
                        res.status(200).json(email_array);
                        connection.end();
                        return;
                    }

                    var f = connection.fetch(results, { //you can set amount range like '1:2' or 'results' for all results
                        bodies: '',
                        struct: true
                    })

                    f.on('message', function (msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function (stream, info) {
                            //Retrieve the 'from' header and buffer the entire body of the newest message:
                            if (info.which === 'TEXT')
                                var buffer = '', count = 0;

                            stream.on('data', async function (chunk) {
                                count += chunk.length;
                                buffer += chunk.toString('utf8');
                            });

                            stream.once('end', async function () {
                                let attach = null
                                //console.log((await simpleParser(buffer))) -> to see entire data of email

                                if (((await simpleParser(buffer)).attachments).length != 0) {
                                    attach = (await simpleParser(buffer)).attachments[0].content //to get attachments
                                }

                                if (info.which !== 'TEXT') {
                                    console.log('inforWhich !== TEXT')
                                    const dataheader = Imap.parseHeader(buffer)

                                    //start -> set data, that you want to save on your DB
                                    let emails_data = {
                                        "date": dataheader.date[0],
                                        "subject": dataheader.subject[0],
                                        "from": dataheader.from[0],
                                        "to": dataheader.to[0],
                                        "content": (await simpleParser(buffer)).text,
                                        "attachment": attach
                                    }
                                    //end -> set data

                                    email_array.push(emails_data)
                                }
                                else {
                                    console.log('inforWhich === TEXT')
                                    console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                                }
                            });
                        });

                        //mark attributes email as read
                        msg.once('attributes', function (attrs) {
                            let uid = attrs.uid;
                            connection.addFlags(uid, ['\\Seen'], function (err) {
                                if (err) {
                                    console.log(`Error when set Mark as read: ${err}`);
                                } else {
                                    console.log("Done, marked email as read!")
                                }
                            });
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
                })
            })
        })

        connection.end();

        connection.once('error', function (err) {
            console.log(err);
            res.status(500).json({ error: err.message });
        });

        connection.once('end', function () {
            console.log(`Connection ended - total new incoming email: ${email_array?.length}`);
            res.status(200).json(email_array);
        });

        connection.connect();
    } catch (error) {
        console.log("Error when request open inbox mail", err)
    }
}

const retrieveInBoxMail = async (req, res) => {
    const emails = [];
    try {
        connection.once('ready', function () {
            connection.openBox('INBOX', false, function (err, box) {
                if (err) {
                    console.log('Error opening mailbox:', err);
                    connection.end();
                    res.status(500).json({ error: err.message });
                    return;
                };
                connection.search(['UNSEEN', ['SINCE', moment().format('YYYY-MM-DD')]], function (err, results) {
                    if (err) {
                        console.log('Error searching for unseen emails:', err);
                        connection.end();
                        res.status(200).json('There are no new emails');
                        return;
                    };
                    if (!results || !results.length) {
                        console.log("The server didn't find any emails matching the specified criteria")
                        connection.end();
                        return;
                    }
                    var f = connection.fetch(results, { bodies: '' });
                    f.on('message', function (msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', async function (stream, info) {
                            console.log(prefix + 'Body');
                            // const parsed = await simpleParser(stream)
                            // if (parsed?.attachments?.length > 0) {
                            //     parsed.attachments.forEach(async (attachment) => {
                            //         const contentType = attachment.contentType;
                            //         const filename = attachment.filename;
                            //         const data = attachment.content;
                            //         console.log(`Attachment name: ${filename}`);
                            //         // fs.writeFileSync(filename, data);
                            //     });
                            // }
                            // emails.push(sanitizeEmailObject(parsed))

                            var buffer = '', count = 0;
                            stream.on('data', async function (chunk) {
                                count += chunk.length;
                                buffer += chunk.toString('utf8');
                            });
                            stream.once('end', async function () {
                                let attach = null
                                //console.log((await simpleParser(buffer))) -> to see entire data of email

                                if (((await simpleParser(buffer)).attachments).length != 0) {
                                    attach = (await simpleParser(buffer)).attachments[0].content //to get attachments
                                    fs.writeFileSync('test.jpg', attach);
                                }

                                if (info.which !== 'TEXT') {
                                    console.log('inforWhich !== TEXT')
                                    const dataheader = Imap.parseHeader(buffer)

                                    //start -> set data, that you want to save on your DB
                                    let emails_data = {
                                        "date": dataheader.date[0],
                                        "subject": dataheader.subject[0],
                                        "from": dataheader.from[0],
                                        "to": dataheader.to[0],
                                        "content": (await simpleParser(buffer)).text,
                                    }
                                    //end -> set data

                                    emails.push(emails_data)
                                }
                                else {
                                    console.log('inforWhich === TEXT')
                                    console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                                }
                            });
                        });
                        msg.once('attributes', function (attrs) {
                            let uid = attrs.uid;
                            connection.addFlags(uid, ['\\Seen'], function (err) {
                                if (err) {
                                    console.log(`Error when set Mark as read: ${err}`);
                                } else {
                                    console.log("Done, marked email as read!")
                                }
                            });
                        });
                        msg.once('end', function () {
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                        res.status(500).json({ error: err.message });
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
            res.status(500).json({ error: err.message });
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
            "inReplyTo",
            // "attachments",
        ]
    )
}

export { sendMail, retrieveInBoxMail, retrieveInBoxMailVer2 }