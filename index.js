const express = require('express');
const { google } = require('googleapis');
const app = express();

// Renderでは秘密鍵は環境変数で管理
const key = {
  client_email: process.env.GCP_CLIENT_EMAIL,
  private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, '\n')
};

app.get('/get-token', async (req, res) => {
  try {
    const jwtClient = new google.auth.JWT({
      email: key.client_email,
      key: key.private_key,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'], // Search Consoleのスコープ
    });

    const tokens = await jwtClient.authorize();
    res.json({ access_token: tokens.access_token });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Error retrieving token');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));