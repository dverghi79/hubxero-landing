// resend-notify.js — CJS version (for static HTML projects without "type":"module" in package.json)
// Copy this file to api/resend-notify.js in any new LP project.
// Required env vars: RESEND_API_KEY, RESEND_FROM_EMAIL, CONTACT_EMAIL
// Optional: RESEND_SEGMENT_ID — Resend segment UUID for this product's waitlist.
//   Set this in Vercel for each LP deployment so signup contacts auto-join their segment.

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[resend-notify] RESEND_API_KEY env var not set');
    return res.status(200).json({ ok: false, reason: 'not_configured' });
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Dario - LeanAI Studio <dario@leanaistudio.com>';
  const contactEmail = process.env.CONTACT_EMAIL || 'contact@leanaistudio.com';
  const segmentId = process.env.RESEND_SEGMENT_ID || null;

  const { email, first_name, product } = req.body || {};
  if (!email) {
    return res.status(200).json({ ok: false, reason: 'missing_email' });
  }

  const productName = product || 'YourProduct';
  const firstName = first_name || '';
  const greeting = firstName ? 'Hi ' + firstName + ',' : 'Hi there,';

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const results = {};

  // Step 1: Create contact in Resend (with source tracking + segment assignment)
  // IMPORTANT: All properties used here (source, product, signed_up_at) must be pre-defined
  // in the Resend audience dashboard BEFORE deployment. Otherwise you get 422 errors.
  try {
    const contactPayload = {
      email: email,
      first_name: firstName || undefined,
      unsubscribed: false,
      properties: {
        source: productName,
        product: productName,
        signed_up_at: new Date().toISOString(),
      },
    };
    // Atomically assign to the product's waitlist segment on contact creation
    if (segmentId) {
      contactPayload.segments = [segmentId];
    }

    const contactRes = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });
    const contactJson = await contactRes.json();
    results.contact = { status: contactRes.status, body: contactJson };
    if (!contactRes.ok) {
      console.error('[resend-notify] Contact creation error:', JSON.stringify(contactJson));
    }
  } catch (err) {
    console.error('[resend-notify] Contact fetch error:', err);
    results.contact = { error: err.message };
  }

  await delay(1100);

  // Step 2: Send welcome email to subscriber (via Resend template)
  try {
    const welcomeRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        template: {
          id: 'waitlist-confirmation',
          variables: {
            PRODUCT_NAME: productName,
            GREETING: greeting,
          },
        },
      }),
    });
    const welcomeJson = await welcomeRes.json();
    results.welcome = { status: welcomeRes.status, body: welcomeJson };
    if (!welcomeRes.ok) {
      console.error('[resend-notify] Welcome email error:', JSON.stringify(welcomeJson));
    }
  } catch (err) {
    console.error('[resend-notify] Welcome email fetch error:', err);
    results.welcome = { error: err.message };
  }

  await delay(1100);

  // Step 3: Send notification email to site owner
  try {
    const notifyRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [contactEmail],
        subject: '[' + productName + '] New waitlist signup: ' + email,
        html: '<p><strong>New waitlist signup</strong></p><p><strong>Product:</strong> ' + productName + '</p><p><strong>Email:</strong> ' + email + '</p><p><strong>Name:</strong> ' + (firstName || 'n/a') + '</p>',
      }),
    });
    const notifyJson = await notifyRes.json();
    results.notify = { status: notifyRes.status, body: notifyJson };
    if (!notifyRes.ok) {
      console.error('[resend-notify] Notify email error:', JSON.stringify(notifyJson));
    }
  } catch (err) {
    console.error('[resend-notify] Notify fetch error:', err);
    results.notify = { error: err.message };
  }

  return res.status(200).json({ ok: true, results });
};
