/**
 * Vercel Serverless Function — Initialisation d'un paiement GeniusPay
 * Endpoint : POST /api/geniuspay/checkout
 * Documentation : https://pay.genius.ci/api/v1/merchant/payments
 */
'use strict';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  const apiKey = process.env.GENIUSPAY_API_KEY || '';
  const apiSecret = process.env.GENIUSPAY_API_SECRET || '';

  if (!apiKey || !apiSecret) {
    return res.status(200).json({
      success: false,
      mode: 'local_guichet',
      message: 'Clés GeniusPay non configurées sur Vercel (mode guichet intégré actif).'
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const amount = Number(body.amount || 0);
    if (!amount || amount < 100) {
      return res.status(400).json({ success: false, error: 'Montant invalide (minimum 100 XOF).' });
    }

    const payload = {
      amount,
      currency: 'XOF',
      description: String(body.description || 'Commande PanierMalin').slice(0, 500),
      customer: {
        name: body.customer?.name || 'Client PanierMalin',
        phone: body.customer?.phone || ''
      }
    };

    // Omettre payment_method pour afficher le guichet hébergé complet GeniusPay (Wave, OM, MTN, Moov, Carte)
    if (body.payment_method) {
      payload.payment_method = body.payment_method;
    }

    const response = await fetch('https://pay.genius.ci/api/v1/merchant/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        'X-API-Secret': apiSecret
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok || !data?.data?.checkout_url) {
      return res.status(response.status || 502).json({
        success: false,
        error: data?.message || 'Erreur lors de la création du paiement GeniusPay.'
      });
    }

    return res.status(200).json({
      success: true,
      mode: 'geniuspay_live',
      reference: data.data.reference,
      checkout_url: data.data.checkout_url
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Impossible de contacter GeniusPay : ' + err.message
    });
  }
};
