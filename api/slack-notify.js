// slack-notify.js — CJS version (for static HTML projects)
// Copy this file to api/slack-notify.js in any new LP project.
// Required env vars: SLACK_WEBHOOK_URL

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error('[slack-notify] SLACK_WEBHOOK_URL env var not set');
    return res.status(200).json({ ok: false, reason: 'not_configured' });
  }

  try {
    const d = req.body || {};
    const product = process.env.PRODUCT_NAME || 'Unknown Product';
    const slackPayload = {
      text: `New ${product} signup: ${d.email || 'unknown'}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*New ${product} Waitlist Signup*\n>*Email:* ${d.email || 'N/A'}\n>*Name:* ${d.firstName || ''} ${d.lastName || ''}\n>*Company:* ${d.company || 'N/A'}\n>*Role:* ${d.role || 'N/A'}\n>*CRM:* ${d.crm || 'N/A'}\n>*Accounting:* ${d.accounting || 'N/A'}\n>*Source:* ${d.source || 'direct'}`,
          },
        },
      ],
    };
    const r = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackPayload),
    });
    const text = await r.text();
    if (text !== 'ok') {
      console.error('[slack-notify] Slack error:', text);
      return res.status(200).json({ ok: false, reason: text });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[slack-notify] fetch error:', err);
    return res.status(200).json({ ok: false, reason: 'fetch_failed' });
  }
};
