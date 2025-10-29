import express from "express";
import cors from "cors";
import mercadopago from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// 🟦 Cole aqui seu TOKEN DE TESTE do Mercado Pago Developer
mercadopago.configure({
  access_token: "APP_USR-1880190853276281-102914-e7a0ba9bafda17670016114897e52552-175408884",
});

app.post("/create_preference", async (req, res) => {
  try {
    const { title, quantity, price } = req.body;

    const preference = {
      items: [
        {
          title,
          quantity,
          unit_price: Number(price),
        },
      ],
      back_urls: {
        success: "https://lojascript.netlify.app/",
        failure: "http://localhost:5500/erro.html",
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: "Erro ao se comunicar com o servidor" });
  }
});

app.listen(3000, () => console.log("✅ Servidor rodando na porta 3000"));
