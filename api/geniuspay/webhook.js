/**
 * Vercel Serverless Function — Webhook GeniusPay
 * Endpoint : POST /api/geniuspay/webhook
 * À renseigner dans le Tableau de bord Marchand GeniusPay (pay.genius.ci)
 */
'use strict';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ received: false, error: 'Méthode non autorisée' });
  }

  const webhookSecret = process.env.GENIUSPAY_WEBHOOK_SECRET || '';
  const signature = req.headers['x-geniuspay-signature'] || req.headers['x-webhook-secret'] || '';

  if (webhookSecret && signature && signature !== webhookSecret) {
    return res.status(401).json({ received: false, error: 'Signature webhook invalide' });
  }

  const payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const eventType = payload.event || payload.type || 'unknown';
  const reference = payload.data?.reference || payload.reference || null;

  console.log(`[GeniusPay Webhook] Événement reçu : ${eventType} · Réf : ${reference}`);

  return res.status(200).json({
    received: true,
    event: eventType,
    reference
  });
};
