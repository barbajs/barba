const functions = require('firebase-functions');
const { IncomingWebhook } = require('@slack/webhook');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize App
admin.initializeApp(functions.config().firebase);

// Initialize Webhook
const webhook = new IncomingWebhook(functions.config().slack.url);

exports.showcaseSubmission = functions.firestore.document('showcases/{documentId}').onCreate(async snap => {
  const showcase = snap.data();

  const slackNotification = {
    text: 'A new showcase has been submitted.',
    attachments: [
      {
        author_name: showcase.authorName,
        author_link: showcase.authorUrl,
        title: showcase.siteName,
        title_link: showcase.siteUrl,
        fallback: 'Showcase informations',
        callback_id: 'showcase_submission',
        color: '#2e5bdc',
        image_url: showcase.pictureUrl,
        alt_text: 'Barba.js Showcase',
        actions: [
          {
            name: snap.id,
            text: 'Approve',
            style: 'primary',
            type: 'button',
            value: true,
            confirm: {
              title: 'Are you sure you want to approve?',
              text: 'Is it that good?',
              ok_text: 'Yes',
              dismiss_text: 'No',
            },
          },
          {
            name: snap.id,
            text: 'Reject',
            style: 'danger',
            type: 'button',
            value: false,
            confirm: {
              title: 'Are you sure you want to reject?',
              text: 'Is it that bad?',
              ok_text: 'Yes',
              dismiss_text: 'No',
            },
          },
        ],
      },
    ],
  }
  await webhook.send(slackNotification);
});

exports.showcaseValidation = functions.https.onRequest((req, res) => {
  // TODO: add token

  res.status(200);

  const parsedPayload = JSON.parse(req.body.payload);
  const webhook2 = new IncomingWebhook(parsedPayload.response_url);

  const slackNotification = parsedPayload.original_message;
  Object.assign({ replace_original: true, response_type: 'in_channel' }, slackNotification);
  delete slackNotification.attachments[0].actions;

  const processingMessage = { ...slackNotification };
  processingMessage.attachments.push({
    color: '#FFA500',
    text: `The validation of ${parsedPayload.original_message.attachments[0].title} has been sent.`,
  })

  const approveMessage = { ...slackNotification };
  approveMessage.attachments.push({
    color: '#00FF00',
    text: `Submission has been agreed by *@${parsedPayload.user.name}*.`,
  })

  const rejectMessage = { ...slackNotification };
  rejectMessage.attachments.push({
    color: '#FF0000',
    text: `Submission has been rejected by *@${parsedPayload.user.name}*.`,
  })

  cors(req, res, () => {

    webhook2.send(processingMessage);

    const showcase = admin.firestore().doc(`showcases/${parsedPayload.actions[0].name}`);

    showcase.get()
      .then(() => {

        if (parsedPayload.actions[0].value) {
          showcase.update({
            isValidated: true,
          })
          webhook2.send(approveMessage);
          return res.end();
        } else {
          showcase.update({
            isValidated: false,
          })
          webhook2.send(rejectMessage);
          return res.end();
        }
      })
      .catch(error => {
        // Handle the error
        console.log(error);
        return res.status(500).send(error);
      })
  })
});

exports.showcaseNotifications = functions.firestore.document('showcases/{documentId}').onUpdate(async change => {
  const showcase = change.after.data();
  const webhook3 = new IncomingWebhook('https://hooks.slack.com/services/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');

  if (!change.before.data().isValidated && showcase.isValidated) {
    const slackNotification = {
      text: 'A new showcase has been published.',
      attachments: [
        {
          author_name: showcase.authorName,
          author_link: showcase.authorUrl,
          title: showcase.siteName,
          title_link: showcase.siteUrl,
          fallback: 'Showcase informations',
          callback_id: 'showcase_submission',
          color: '#2e5bdc',
          image_url: showcase.pictureUrl,
          alt_text: 'Barba.js Showcase',
        },
      ],
    }

    await webhook3.send(slackNotification);
  }
});

