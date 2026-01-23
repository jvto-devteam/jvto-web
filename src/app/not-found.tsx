// File: app/not-found.tsx
'use client';

import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    // Hide body overflow
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      color: '#fff',
      background: '#000',
      fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Segoe UI", "Fira Sans", Avenir, "Helvetica Neue", "Lucida Grande", sans-serif',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      margin: 0
    }}>
      <div style={{ display: 'inline-block' }}>
        <h1 style={{
          display: 'inline-block',
          margin: '0 20px 0 0',
          paddingRight: '23px',
          fontSize: '24px',
          fontWeight: 500,
          verticalAlign: 'top',
          lineHeight: '49px',
          borderRight: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          404
        </h1>
        <div style={{ display: 'inline-block' }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: 400,
            lineHeight: '49px',
            margin: 0
          }}>
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
}