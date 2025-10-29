import express from "express";
import mercadopago from "mercadopago";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

// ---------- Endpoint: criar pagamento com cartão (exemplo/sandbox) ----------
router.post("/cartao", async (req, res) => {
  try {
    // Em produção, receba apenas card_token (token gerado pelo SDK do Mercado Pago)
    // Aqui usamos um exemplo simplificado (modo sandbox) — NÃO use números reais em produção.
    const { nome, numero, validade, cvv, valor } = req.body;

    const payment_data = {
      transaction_amount: Number(valor || 20),
      token: "TEST-12345", // Em produção: card_token vindo do frontend
      description: "Compra LojaScript - ex: Volkswagen Fox",
      installments: 1,
      payment_method_id: "visa", // ou detectado dinamicamente
      payer: {
        email: "comprador@exemplo.com"
      },
    };

    const payment = await mercadopago.payment.create(payment_data);

    res.json({
      status: "ok",
      id: payment.body.id,
      detail: payment.body
    });
  } catch (err) {
    console.error("Erro /cartao:", err);
    res.status(400).json({ status: "error", error: err.message });
  }
});

// ---------- Endpoint: gerar PIX (QR Code) ----------
router.post("/pix", async (req, res) => {
  try {
    // Recebe valor e descrição (opcional)
    const { valor, descricao } = req.body;
    const amount = Number(valor || 20.0);

    const payment = await mercadopago.payment.create({
      transaction_amount: amount,
      description: descricao || "Compra LojaScript - PIX",
      payment_method_id: "pix",
      payer: {
        email: "comprador@exemplo.com"
      }
    });

    // A resposta do MP inclui point_of_interaction.transaction_data com qr_code_base64 e qr_code
    const tx = payment.body.point_of_interaction.transaction_data || {};
    res.json({
      status: "ok",
      qr_code_base64: tx.qr_code_base64 || null,
      qr_code: tx.qr_code || null,
      raw: payment.body
    });
  } catch (err) {
    console.error("Erro /pix:", err);
    res.status(400).json({ status: "error", error: err.message });
  }
});

export default router;
