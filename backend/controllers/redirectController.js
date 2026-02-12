import QR from '../models/QR.js';

export const handleRedirect = async (req, res) => {
  try {
    const { shortId } = req.params;
    
    // Find QR by shortId
    const qr = await QR.findOne({ shortId });
    
    if (!qr) {
      return res.status(404).send('QR Code not found');
    }
    
    if (!qr.isActive) {
      return res.status(410).send('This QR Code has been deactivated');
    }
    
    // Increment scan count
    qr.scans += 1;
    await qr.save();
    
    // Handle redirection based on type
    if (qr.type === 'url') {
      let url = qr.content;
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      return res.redirect(url);
    } 
    
    // For other types, display a simple page with the content
    // This is a basic implementation. Enhancements can be made later.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Scanned QR Content</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f0f2f5; }
            .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 90%; width: 400px; text-align: center; }
            h1 { color: #1a1a1a; margin-top: 0; }
            .content { background: #f8f9fa; padding: 1rem; border-radius: 0.5rem; word-break: break-all; margin: 1rem 0; font-family: monospace; }
            .btn { background: #4f46e5; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; display: inline-block; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>QR Content</h1>
            <div class="content">${qr.content}</div>
            <p>Type: ${qr.type}</p>
          </div>
        </body>
      </html>
    `;
    
    res.send(htmlContent);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Server Error');
  }
};
