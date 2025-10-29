import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pagamentoRoutes from "./routes/pagamento.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.static("../public")); // serve a pasta public se quiser rodar backend+frontend juntos

app.use("/api/pagamento", pagamentoRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`💳 Servidor rodando na porta ${PORT}`));
