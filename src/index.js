require(`dotenv`).config();

const express = require('express');
const cors = require('cors');
const { rotas } = require('./routes/rotas');
const app = express();

app.use(express.json());
app.use(cors());
app.use(rotas);
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor Express rodando em http://localhost:${process.env.PORT}`);
});

