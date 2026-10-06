import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface SecurityQRCodeProps {
  value: string;
  size?: number;
  label?: string;
  subLabel?: string;
  bgColor?: string;
  fgColor?: string;
  includeBorder?: boolean;
}

export const SecurityQRCode: React.FC<SecurityQRCodeProps> = ({
  value,
  size = 110,
  label = 'Official Security QR',
  subLabel = 'Scan to verify authenticity',
  bgColor = '#ffffff',
  fgColor = '#0f172a',
  includeBorder = true
}) => {
  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: includeBorder ? '8px' : '0',
      background: bgColor,
      borderRadius: '8px',
      border: includeBorder ? '1px solid #cbd5e1' : 'none',
      boxShadow: includeBorder ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
      textAlign: 'center'
    }}>
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        bgColor={bgColor}
        fgColor={fgColor}
        marginSize={1}
      />
      {label && (
        <div style={{
          marginTop: '6px',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: fgColor,
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {label}
        </div>
      )}
      {subLabel && (
        <div style={{
          fontSize: '0.58rem',
          color: '#64748b',
          lineHeight: 1.1
        }}>
          {subLabel}
        </div>
      )}
    </div>
  );
};
