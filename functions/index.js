const functions = require('firebase-functions');
const { IncomingWebhook } = require('@slack/webhook');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

// Initialize App
admin.initializeApp(functions.config().firebase);

// Initialize Webhook (test-app's channel on barbajs.slack.com)
const webhook = new IncomingWebhook(functions.config().slack.url);

/*
Step 1: on showcase submit (if completed correctly) => Send a slack notification after the registration in Firestore
*/
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
          // Approve the submission (to publish it on Barba)
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
          // Reject the submission (will stay in the database but won't be published)
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

/*
Step 2: on showcase rejection/approval in Slack => Give a feedback in the Slack discussion and change the isValidated value (true/false) of the showcase in the database
*/
exports.showcaseValidation = functions.https.onRequest((req, res) => {
  // TODO: add token

  res.status(200);

  const parsedPayload = JSON.parse(req.body.payload);
  const webhook2 = new IncomingWebhook(parsedPayload.response_url); // Webhook of the response

  const slackNotification = parsedPayload.original_message;
  Object.assign({ replace_original: true, response_type: 'in_channel' }, slackNotification);
  delete slackNotification.attachments[0].actions;

  /* Slack feedback */
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
  /* Slack feedback [end] */

  cors(req, res, () => {

    webhook2.send(processingMessage);

    const showcase = admin.firestore().doc(`showcases/${parsedPayload.actions[0].name}`);

    showcase.get()
      .then(() => {
        // If the showcase is approved
        if (parsedPayload.actions[0].value) {
          showcase.update({
            isValidated: true,
          })
          webhook2.send(approveMessage);
          return res.end();
        }
        // If the showcase is rejected
        else {
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

/*
Step 3: on showcase approval and storing in the db => Send slack notifiaction to whom may be interessed to show the new Barba showcase
*/
exports.showcaseNotifications = functions.firestore.document('showcases/{documentId}').onUpdate(async change => {
  const showcase = change.after.data();
  const webhook3 = new IncomingWebhook('https://hooks.slack.com/services/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'); // Webhook of Olivier K discussion on epicagency.slack.com

  // The notification is sent only if isValidated change from false to true, not for the other updates
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

