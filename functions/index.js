/* eslint-disable camelcase */
const functions = require('firebase-functions')
const { IncomingWebhook } = require('@slack/webhook')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })

// Initialize App
admin.initializeApp(functions.config().firebase)

/**
 * Step 1: on showcase submit (if completed correctly)
 * => Send a slack notification after the registration in Firestore
 */
exports.showcaseSubmission = functions.firestore
  .document('showcases/{documentId}')
  .onCreate(async snap => {
    // Initialize webhook for admin private channel submission (🔒website-showcase on barbajs.slack.com)
    const webhook = new IncomingWebhook(functions.config().slack.private)
    const showcase = snap.data()
    const notif = {
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

    await webhook.send(notif)
  })

/**
 * Step 2: on showcase rejection/approval in Slack
 * => Give a feedback in the Slack discussion and
 * change the isValidated value (true/false) of the showcase in the database
 */
exports.showcaseValidation = functions.https.onRequest((req, res) => {
  res.status(200)

  const payload = JSON.parse(req.body.payload)

  // Initialize webhook for validation (🔒website-showcase on barbajs.slack.com)
  const webhook = new IncomingWebhook(payload.response_url) // Webhook of the response
  const notif = payload.original_message

  Object.assign({ replace_original: true, response_type: 'in_channel' }, notif)

  delete notif.attachments[0].actions

  /* Slack feedback */

  const processMsg = { ...notif }

  processMsg.attachments.push({
    color: '#FFA500',
    text: `The validation of ${payload.original_message.attachments[0].title} has been sent.`,
  })

  const approveMsg = { ...processMsg }

  approveMsg.attachments = [
    ...processMsg.attachments,
    {
      color: '#00FF00',
      text: `Submission has been agreed by *@${payload.user.name}*.`,
    },
  ]

  const rejectMsg = { ...processMsg }

  rejectMsg.attachments = [
    ...processMsg.attachments,
    {
      color: '#FF0000',
      text: `Submission has been rejected by *@${payload.user.name}*.`,
    },
  ]

  /* Slack feedback [end] */

  cors(req, res, () => {
    webhook.send(processMsg)

    const showcase = admin
      .firestore()
      .doc(`showcases/${payload.actions[0].name}`)

    showcase
      .get()
      .then(() => {
        if (payload.actions[0].value) {
          // If the showcase is approved
          console.info(
            `[${payload.original_message.attachments[0].title}] approved by [${payload.user.name}]`
          )
          showcase.update({
            isValidated: true,
          })
          webhook.send(approveMsg)

          return res.end()
        }

        // If the showcase is rejected
        console.info(
          `[${payload.original_message.attachments[0].title}] rejected by [${payload.user.name}]`
        )
        showcase.update({
          isValidated: false,
        })
        webhook.send(rejectMsg)

        return res.end()
      })
      .catch(error => {
        // Handle the error
        console.log(error)

        return res.status(500).send(error)
      })
  })
})

/**
 * Step 3: on showcase approval and storing in the db
 * => Send slack notifiaction to whom may be interessed
 * to show the new Barba showcase
 */
exports.showcaseNotifications = functions.firestore
  .document('showcases/{documentId}')
  .onUpdate(async change => {
    // Initialize webhook for public channel post (#showcase on barbajs.slack.com)
    const webhook = new IncomingWebhook(functions.config().slack.public)
    const showcase = change.after.data()

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

      await webhook.send(slackNotification)
    }
  })
