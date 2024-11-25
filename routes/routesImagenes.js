const express = require('express');
const axios = require('axios');
const sharp = require('sharp');
const { createClient } = require('redis');

const app = express();
const PORT = 3000;

// Configuración de Redis
const redisClient = createClient();
redisClient.connect().catch(console.error);

app.get('/process-image', async (req, res) => {
  const imageUrl = "https://www.vidkar.com:3006/Peliculas/Extranjeras/2024/Your.Monster.2024/fanart.jpg"
  const idPeli = req.query.idPeli; // URL de la imagen
  const width = parseInt(req.query.width) || 300; // Ancho máximo
  const height = parseInt(req.query.height) || 300; // Alto máximo
  const cacheKey = `${imageUrl}-${width}x${height}`; // Clave única para la imagen

  if (!imageUrl) {
    return res.status(400).send('Por favor proporciona una URL de imagen.');
  }

  try {
    // Verificar si la imagen ya está en caché
    const cachedImage = await redisClient.get(cacheKey);

    if (cachedImage) {
      console.log('Imagen servida desde caché');
      res.set('Content-Type', 'image/jpeg');
      return res.send(Buffer.from(cachedImage, 'base64')); // Decodificar desde base64
    }

    // Descargar la imagen desde la URL
    const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'arraybuffer',
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      });

    // Procesar la imagen con Sharp
    const compressedImage = await sharp(response.data)
      .resize(width, height, { fit: 'inside' })
      .jpeg({ quality: 70 })
      .toBuffer();

    // Guardar la imagen comprimida en Redis (como base64 para almacenamiento eficiente)
    await redisClient.set(cacheKey, compressedImage.toString('base64'), {
      EX: 3600, // Tiempo de expiración en segundos (1 hora)
    });

    console.log('Imagen procesada y guardada en caché');

    // Enviar la imagen comprimida al cliente
    res.set('Content-Type', 'image/jpeg');
    res.send(compressedImage);
  } catch (error) {
    console.error('Error al procesar la imagen:', error.message);
    res.status(500).send('Error al procesar la imagen.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
