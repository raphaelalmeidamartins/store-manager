const express = require('express');

const swaggerUI = require('swagger-ui-express');
const swaggerSettingsBr = require('./swagger-br.json');
const swaggerSettingsEn = require('./swagger-en.json');

const productsRoutes = require('./routes/productsRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();

app.get('/', (_request, response) => {
  response.send();
});

app.use('/docs/br', swaggerUI.serve, swaggerUI.setup(swaggerSettingsBr));
app.use('/docs/en', swaggerUI.serve, swaggerUI.setup(swaggerSettingsEn));

app.use(express.json());

app.use('/products', productsRoutes);
app.use('/sales', salesRoutes);

app.use((err, _req, res, _next) => {
  const { name, message } = err;
  switch (name) {
    case 'ValidationError':
      if (message.includes('length') || message.includes('greater than')) {
        return res.status(422).json({ message });
      }
      res.status(400).json({ message });
      break;
    case 'NotFoundError':
      res.status(404).json({ message });
      break;
    default:
      console.warn(err);
      res.sendStatus(500);
  }
});

module.exports = app;
