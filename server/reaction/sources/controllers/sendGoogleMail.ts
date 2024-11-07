import { google } from 'googleapis';

const gmail = google.gmail("v1");

export const googleSendEmail = async (emailContext: {access_token: string, subject: string, body: any }) => {

    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: emailContext.access_token });
    google.options({ auth });

    const utf8Subject = `=?utf-8?B?${Buffer.from(emailContext.subject).toString('base64')}?=`;
    const messageParts = [
        'From: AREA Project',
        `To: me`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        'This is a autogenerated message.',
        `${emailContext.body}`,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    const res = await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });
    return res;
};