import QRCode from 'qrcode';

export const generateQRMatrix = async (text) => {
  try {
    // Generate QR code with high error correction to allow for artistic modification
    const opts = {
      errorCorrectionLevel: 'H',
      type: 'terminal', // We just want the data, but 'terminal' isn't quite right for matrix data. 
                        // QRCode.create is better for raw data.
    };
    
    const qrData = QRCode.create(text, opts);
    const modules = qrData.modules;
    
    // Convert to a simple 2D array of booleans (or 1s and 0s)
    const size = modules.size;
    const matrix = [];
    
    for (let y = 0; y < size; y++) {
      const row = [];
      for (let x = 0; x < size; x++) {
        row.push(modules.get(x, y));
      }
      matrix.push(row);
    }
    
    return matrix;
  } catch (err) {
    console.error(err);
    return [];
  }
};
