import React, { useRef, useEffect } from 'react';

const CanvasRenderer = ({ 
  matrix, 
  size = 500, 
  styleType = 'standard', 
  fgColor = '#1a1a1a', 
  bgColor = '#fefefe',
  gradientInfo = null, // { active: boolean, start: color, end: color }
  eyeStyle = 'square', // 'square', 'circle', 'rounded'
  logoImage = null, // URL or base64 string
  logoBgColor = '#ffffff', // Hex or 'transparent'
  margin = 40 // Default Quiet Zone
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!matrix || matrix.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const scale = window.devicePixelRatio || 1;
    
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);
    
    // Calculate sizing with margin
    const availableSize = size - (margin * 2);
    const moduleSize = availableSize / matrix.length;
    
    // Inner padding for modules (gap between blocks) - dependent on style
    const padding = Math.max(0.5, moduleSize * 0.05);

    // Clear canvas with background color (this covers the margin too)
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, size, size);

    // Helper to check if x,y is part of a Position Pattern (Eye)
    // Eyes are 7x7 at (0,0), (size-7, 0), (0, size-7)
    const isEye = (x, y) => {
        const matrixSize = matrix.length;
        // Top Left
        if (x < 7 && y < 7) return true;
        // Top Right
        if (x >= matrixSize - 7 && y < 7) return true;
        // Bottom Left
        if (x < 7 && y >= matrixSize - 7) return true;
        return false;
    };

    // Prepare Fill Style (Solid or Gradient)
    let fillStyle = fgColor;
    if (gradientInfo && gradientInfo.active) {
        // Gradient should span the actual QR area, not the whole canvas? 
        // Or whole canvas? Usually safer to span the QR content area.
        const gradient = ctx.createLinearGradient(margin, margin, size - margin, size - margin);
        gradient.addColorStop(0, gradientInfo.start);
        gradient.addColorStop(1, gradientInfo.end);
        fillStyle = gradient;
    }

    // Shadow Config
    ctx.shadowBlur = 0;
    if (styleType === 'neon') {
        ctx.shadowBlur = 12;
        ctx.shadowColor = typeof fillStyle === 'string' ? fillStyle : gradientInfo?.end || fgColor;
    } else if (styleType === 'soft') {
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
        ctx.shadowOffsetY = 2;
    }

    // Render Loop
    ctx.fillStyle = fillStyle;
    
    matrix.forEach((row, y) => {
      row.forEach((isDark, x) => {
        if (!isDark) return;

        // Apply Margin offset to coordinates
        const cx = margin + (x * moduleSize);
        const cy = margin + (y * moduleSize);

        // Skip if covered by logo (approx center 20%)
        if (logoImage) {
            const centerStart = Math.floor(matrix.length * 0.4);
            const centerEnd = Math.floor(matrix.length * 0.6);
            if (x >= centerStart && x <= centerEnd && y >= centerStart && y <= centerEnd) {
                return;
            }
        }

        // Special Rendering for Eyes vs Data
        const currentIsEye = isEye(x, y);
        
        // EYE RENDERING
        if (currentIsEye) {
             if (eyeStyle === 'circle') {
                ctx.beginPath();
                ctx.arc(cx + moduleSize/2, cy + moduleSize/2, moduleSize/2, 0, Math.PI * 2);
                ctx.fill();
             } else if (eyeStyle === 'rounded') {
                ctx.beginPath();
                ctx.roundRect(cx, cy, moduleSize, moduleSize, moduleSize * 0.3);
                ctx.fill();
             } else {
                 // Square default
                 ctx.fillRect(cx, cy, moduleSize, moduleSize);
             }
             return;
        }

        // DATA MODULE RENDERING
        switch(styleType) {
            case 'standard':
                ctx.beginPath();
                ctx.roundRect(cx + padding/2, cy + padding/2, moduleSize - padding, moduleSize - padding, 2);
                ctx.fill();
                break;
                
            case 'rounded':
                ctx.beginPath();
                ctx.arc(cx + moduleSize/2, cy + moduleSize/2, (moduleSize - padding)/2, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'neon':
                ctx.beginPath();
                ctx.arc(cx + moduleSize/2, cy + moduleSize/2, (moduleSize - padding * 2)/2, 0, Math.PI * 2);
                ctx.fill();
                // Inner glow
                ctx.save();
                ctx.shadowBlur = 0;
                ctx.beginPath();
                ctx.arc(cx + moduleSize/2, cy + moduleSize/2, (moduleSize - padding * 3)/2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, 0.5)`;
                ctx.fill();
                ctx.restore();
                break;
                
            case 'dots':
                ctx.beginPath();
                ctx.arc(cx + moduleSize/2, cy + moduleSize/2, moduleSize/3, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            default:
                ctx.fillRect(cx, cy, moduleSize, moduleSize);
        }
      });
    });

    // Render Logo if present
    if (logoImage) {
        const img = new Image();
        img.src = logoImage;
        img.onload = () => {
             // Draw logo in center
             const logoSize = size * 0.22; // 22% of QR size
             const origin = (size - logoSize) / 2;
             
             ctx.save();
             
             // Draw Background if strictly defined (not transparent/null)
             if (logoBgColor && logoBgColor !== 'transparent') {
                 ctx.fillStyle = logoBgColor;
                 ctx.shadowBlur = 10;
                 ctx.shadowColor = "rgba(0,0,0,0.2)";
                 ctx.roundRect(origin - 5, origin - 5, logoSize + 10, logoSize + 10, 8);
                 ctx.fill();
             }

             // Clip to rounded rect if we want a clean cut, or just draw image if transparent?
             // If transparent, we might just want to draw the image directly without clipping to a box?
             // Let's keep the clip for consistency but make it optional if transparent? 
             // Actually, usually users want the logo to just float if transparent.
             if (logoBgColor && logoBgColor !== 'transparent') {
                 ctx.beginPath();
                 ctx.roundRect(origin, origin, logoSize, logoSize, 8);
                 ctx.clip();
             }
             
             // Draw image
             ctx.drawImage(img, origin, origin, logoSize, logoSize);
             ctx.restore();
        };
        // Trigger load if cached
        if (img.complete) img.onload();
    }

  }, [matrix, size, styleType, fgColor, bgColor, gradientInfo, eyeStyle, logoImage, logoBgColor]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
          width: size, 
          height: size, 
          maxWidth: '100%',
          display: 'block',
          borderRadius: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s ease'
      }}
      aria-label="QR Code visualization"
    />
  );
};

export default CanvasRenderer;