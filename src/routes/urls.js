const express = require('express');
const router = express.Router();
const Url = require('../models/url');
const config = require('../config');
const validator = require('validator');

router.post('/shorten', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    if (!validator.isURL(url)) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    // Проверка: есть ли уже такая ссылка
    const existing = await Url.findByOriginalUrl(url);
    if (existing) {
      const shortUrl = `${config.baseUrl}/${existing.short_code}`;
      return res.json({
        original_url: existing.original_url,
        short_url: shortUrl,
        short_code: existing.short_code
      });
    }

    // Если нет — создаём новую
    const urlRecord = await Url.create(url);
    const shortUrl = `${config.baseUrl}/${urlRecord.short_code}`;

    res.json({
      original_url: urlRecord.original_url,
      short_url: shortUrl,
      short_code: urlRecord.short_code
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;
    const urlRecord = await Url.findByShortCode(shortCode);

    if (!urlRecord) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.redirect(urlRecord.original_url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;