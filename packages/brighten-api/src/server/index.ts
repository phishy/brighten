import express, { Request, Response } from 'express';
import cors from 'cors';
import type { Config } from '../config/schema.js';
import { OperationRouter } from '../router/index.js';
import type { OperationType } from '../operations/types.js';
import { generateOpenAPISpec } from '../openapi.js';

function getHomepageHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brighten API – Image Processing Infrastructure</title>
  <meta name="description" content="The image processing API for modern applications. Background removal, restoration, colorization, and enhancement at scale.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0b0c0e;
      --surface: #151619;
      --fg: #fff;
      --gray-400: #94a3b8;
      --gray-500: #71717a;
      --gray-600: #52525b;
      --primary: #3b82f6;
      --primary-glow: rgba(59, 130, 246, 0.25);
      --purple-glow: rgba(139, 92, 246, 0.2);
      --pink-glow: rgba(236, 72, 153, 0.15);
      --border: rgba(255,255,255,0.08);
      --border-hover: rgba(255,255,255,0.16);
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--fg);
      line-height: 1.5;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    ::selection { background: rgba(59, 130, 246, 0.3); }
    
    .bg-gradient {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      z-index: 0;
      overflow: hidden;
      pointer-events: none;
    }
    
    .bg-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
    }
    
    .bg-orb:nth-child(1) {
      width: 800px;
      height: 800px;
      background: var(--primary-glow);
      top: -300px;
      right: -200px;
      animation: float1 8s ease-in-out infinite;
    }
    
    .bg-orb:nth-child(2) {
      width: 600px;
      height: 600px;
      background: var(--purple-glow);
      bottom: 0;
      left: -200px;
      animation: float2 10s ease-in-out infinite;
    }
    
    .bg-orb:nth-child(3) {
      width: 500px;
      height: 500px;
      background: var(--pink-glow);
      top: 30%;
      left: 40%;
      animation: float3 12s ease-in-out infinite;
    }
    
    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-80px, 60px) scale(1.1); }
    }
    
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(100px, -80px) scale(1.15); }
    }
    
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(60px, -40px) scale(1.05); }
      66% { transform: translate(-40px, 60px) scale(0.95); }
    }
    
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      background: rgba(11, 12, 14, 0.8);
      backdrop-filter: saturate(180%) blur(20px);
      border-bottom: 1px solid var(--border);
    }
    
    .nav-inner {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .logo {
      font-weight: 600;
      font-size: 15px;
      letter-spacing: -0.02em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .logo-icon {
      color: var(--primary);
    }
    
    .nav-links {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .nav-links a {
      color: var(--gray-400);
      text-decoration: none;
      font-size: 14px;
      padding: 8px 16px;
      border-radius: 6px;
      transition: color 0.15s, background 0.15s;
    }
    
    .nav-links a:hover { color: var(--fg); }
    
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.15s;
      cursor: pointer;
      border: none;
      white-space: nowrap;
    }
    
    .btn-primary {
      background: var(--primary);
      color: var(--fg);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
    
    .btn-primary:hover {
      background: #60a5fa;
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
    }
    
    .btn-secondary {
      background: transparent;
      color: var(--fg);
      border: 1px solid var(--border);
    }
    
    .btn-secondary:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--border-hover);
    }
    
    .btn-lg { padding: 14px 28px; font-size: 15px; }
    
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 160px 24px 120px;
      text-align: center;
    }
    
    .hero-content {
      position: relative;
      z-index: 1;
      max-width: 800px;
    }
    
    .hero-announce {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: 6px 6px 6px 16px;
      background: var(--gray-950);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 13px;
      color: var(--gray-400);
      margin-bottom: 32px;
    }
    
    .hero-announce-tag {
      padding: 4px 10px;
      background: var(--fg);
      color: var(--bg);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .hero h1 {
      font-size: clamp(40px, 8vw, 72px);
      font-weight: 700;
      line-height: 1.05;
      letter-spacing: -0.03em;
      margin-bottom: 24px;
    }
    
    .hero h1 {
      background: linear-gradient(to bottom, #fff 0%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero h1 .gradient {
      background: linear-gradient(135deg, var(--primary) 0%, #a78bfa 50%, #ec4899 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .hero-sub {
      font-size: 18px;
      color: var(--gray-400);
      max-width: 520px;
      margin: 0 auto 40px;
      line-height: 1.6;
    }
    
    .hero-ctas {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .hero-visual {
      position: relative;
      z-index: 1;
      margin-top: 80px;
      width: 100%;
      max-width: 900px;
    }
    
    .terminal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      text-align: left;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    
    .terminal-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .terminal-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    
    .terminal-dot:nth-child(1) { background: #ef4444; }
    .terminal-dot:nth-child(2) { background: #eab308; }
    .terminal-dot:nth-child(3) { background: #22c55e; }
    
    .terminal-title {
      flex: 1;
      text-align: center;
      font-size: 13px;
      color: var(--gray-500);
    }
    
    .terminal-body {
      padding: 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.8;
      color: var(--gray-400);
      overflow-x: auto;
    }
    
    .terminal-body .prompt { color: var(--gray-500); }
    .terminal-body .cmd { color: var(--fg); }
    .terminal-body .str { color: #a5d6ff; }
    .terminal-body .comment { color: var(--gray-600); }
    .terminal-body .key { color: #7ee787; }
    
    section {
      position: relative;
      z-index: 1;
      padding: 120px 24px;
    }
    
    .container { max-width: 1200px; margin: 0 auto; }
    
    .section-header {
      text-align: center;
      max-width: 600px;
      margin: 0 auto 64px;
    }
    
    .section-header h2 {
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }
    
    .section-header p {
      font-size: 17px;
      color: var(--gray-400);
      line-height: 1.6;
    }
    
    .features-section { border-top: 1px solid var(--border); }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }
    
    @media (max-width: 900px) {
      .features-grid { grid-template-columns: 1fr; }
    }
    
    .feature {
      background: linear-gradient(180deg, var(--surface) 0%, rgba(21, 22, 25, 0.4) 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all 0.2s;
    }
    
    .feature:hover { 
      border-color: var(--border-hover);
      transform: translateY(-4px);
    }
    
    .feature-icon {
      width: 48px;
      height: 48px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 20px;
      color: var(--primary);
    }
    
    .feature h3 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      letter-spacing: -0.01em;
    }
    
    .feature p {
      font-size: 14px;
      color: var(--gray-400);
      line-height: 1.6;
    }
    
    .code-section { border-top: 1px solid var(--border); }
    
    .code-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 64px;
      align-items: center;
    }
    
    @media (max-width: 900px) {
      .code-grid { grid-template-columns: 1fr; gap: 48px; }
    }
    
    .code-content h2 {
      font-size: clamp(28px, 4vw, 40px);
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }
    
    .code-content p {
      font-size: 16px;
      color: var(--gray-400);
      line-height: 1.7;
      margin-bottom: 32px;
    }
    
    .pricing-section { border-top: 1px solid var(--border); }
    
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    @media (max-width: 700px) {
      .pricing-grid { grid-template-columns: 1fr; }
    }
    
    .price-card {
      background: linear-gradient(180deg, var(--surface) 0%, rgba(21, 22, 25, 0.4) 100%);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      position: relative;
      transition: all 0.2s;
    }
    
    .price-card:hover {
      border-color: var(--border-hover);
    }
    
    .price-card.featured {
      border-color: var(--primary);
      box-shadow: 0 0 0 1px var(--primary), 0 25px 50px -12px rgba(59, 130, 246, 0.15);
    }
    
    .price-badge {
      position: absolute;
      top: 16px;
      right: 16px;
      padding: 4px 10px;
      background: var(--primary);
      color: var(--fg);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    
    .price-name {
      font-size: 14px;
      font-weight: 500;
      color: var(--gray-400);
      margin-bottom: 8px;
    }
    
    .price-amount {
      font-size: 48px;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 4px;
    }
    
    .price-period {
      font-size: 14px;
      color: var(--gray-500);
      margin-bottom: 24px;
    }
    
    .price-features {
      list-style: none;
      margin-bottom: 32px;
    }
    
    .price-features li {
      padding: 10px 0;
      font-size: 14px;
      color: var(--gray-400);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .price-features li::before {
      content: '';
      width: 16px;
      height: 16px;
      background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%2322c55e'%3E%3Cpath d='M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z'/%3E%3C/svg%3E") no-repeat center;
      flex-shrink: 0;
    }
    
    .price-card .btn { width: 100%; }
    
    .cta-section {
      border-top: 1px solid var(--border);
      text-align: center;
    }
    
    .cta-section h2 {
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 16px;
    }
    
    .cta-section p {
      font-size: 17px;
      color: var(--gray-400);
      margin-bottom: 32px;
    }
    
    footer {
      position: relative;
      z-index: 1;
      padding: 40px 24px;
      border-top: 1px solid var(--border);
    }
    
    .footer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .footer-links {
      display: flex;
      gap: 24px;
    }
    
    .footer-links a {
      color: var(--gray-500);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.15s;
    }
    
    .footer-links a:hover { color: var(--fg); }
    
    .footer-copy {
      font-size: 14px;
      color: var(--gray-600);
    }
    
    @media (max-width: 600px) {
      .footer-inner { flex-direction: column; gap: 16px; }
      .nav-links a:not(.btn) { display: none; }
    }
  </style>
</head>
<body>
  <div class="bg-gradient">
    <div class="bg-orb"></div>
    <div class="bg-orb"></div>
    <div class="bg-orb"></div>
  </div>
  
  <nav>
    <div class="nav-inner">
      <div class="logo">
        <svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        Brighten <span style="color: var(--gray-500); font-weight: 400;">API</span>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="/docs">Docs</a>
        <a href="https://github.com/phishy/brighten" target="_blank">GitHub</a>
        <a href="#signup" class="btn btn-primary">Get Started</a>
      </div>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-content">
      <div class="hero-announce">
        Introducing Brighten API
        <span class="hero-announce-tag">Beta</span>
      </div>
      <h1>Image processing<br><span class="gradient">infrastructure</span></h1>
      <p class="hero-sub">
        The API for AI-powered image processing. Background removal, restoration, 
        colorization, and enhancement—production-ready at any scale.
      </p>
      <div class="hero-ctas">
        <a href="#signup" class="btn btn-primary btn-lg">Start for Free</a>
        <a href="/docs" class="btn btn-secondary btn-lg">Documentation</a>
      </div>
    </div>
    
    <div class="hero-visual">
      <div class="terminal">
        <div class="terminal-header">
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-dot"></span>
          <span class="terminal-title">terminal</span>
        </div>
        <div class="terminal-body">
<span class="comment"># Remove background from an image</span>
<span class="prompt">$</span> <span class="cmd">curl</span> <span class="str">https://api.brighten.dev/api/v1/background-remove</span> \\
    <span class="cmd">-H</span> <span class="str">"Authorization: Bearer \$API_KEY"</span> \\
    <span class="cmd">-d</span> <span class="str">'{"image": "data:image/png;base64,..."}'</span>

<span class="comment"># Response</span>
{
  <span class="key">"image"</span>: <span class="str">"data:image/png;base64,..."</span>,
  <span class="key">"metadata"</span>: { <span class="key">"processingTime"</span>: <span class="str">1240</span> }
}</div>
      </div>
    </div>
  </section>

  <section class="features-section" id="features">
    <div class="container">
      <div class="section-header">
        <h2>Built for developers</h2>
        <p>Production-ready AI endpoints with a simple, unified interface.</p>
      </div>
      
      <div class="features-grid">
        <div class="feature">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/>
              <path d="M9 3v18"/>
            </svg>
          </div>
          <h3>Background Removal</h3>
          <p>Pixel-perfect edge detection for product photos, portraits, and complex scenes.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 1 0 10 10"/>
              <path d="M12 12l4-4"/>
              <path d="M16 8h-4v4"/>
            </svg>
          </div>
          <h3>Photo Restoration</h3>
          <p>Automatically fix scratches, tears, and damage in old or degraded photos.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
              <line x1="9.69" y1="8" x2="21.17" y2="8"/>
              <line x1="7.38" y1="12" x2="13.12" y2="2.06"/>
            </svg>
          </div>
          <h3>Colorization</h3>
          <p>Add realistic color to black and white images using deep learning models.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/>
              <polyline points="2 17 12 22 22 17"/>
              <polyline points="2 12 12 17 22 12"/>
            </svg>
          </div>
          <h3>Enhancement</h3>
          <p>Upscale, sharpen, and improve image quality with AI-powered processing.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <path d="M9 9h.01"/>
              <path d="M15 15h.01"/>
              <path d="M9 15l6-6"/>
            </svg>
          </div>
          <h3>Object Removal</h3>
          <p>Seamlessly remove unwanted objects with intelligent inpainting.</p>
        </div>
        <div class="feature">
          <div class="feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4"/>
              <path d="M12 18v4"/>
              <path d="M4.93 4.93l2.83 2.83"/>
              <path d="M16.24 16.24l2.83 2.83"/>
              <path d="M2 12h4"/>
              <path d="M18 12h4"/>
              <path d="M4.93 19.07l2.83-2.83"/>
              <path d="M16.24 7.76l2.83-2.83"/>
            </svg>
          </div>
          <h3>Sub-second Latency</h3>
          <p>Optimized infrastructure for production workloads at any scale.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="code-section">
    <div class="container">
      <div class="code-grid">
        <div class="code-content">
          <h2>One API for everything</h2>
          <p>
            Simple, consistent endpoints for all operations. No SDKs required—just 
            send a request and get your processed image back in seconds.
          </p>
          <a href="/docs" class="btn btn-secondary">Read the docs →</a>
        </div>
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-dot"></span>
            <span class="terminal-title">api.ts</span>
          </div>
          <pre class="terminal-body"><span class="key">const</span> response = <span class="key">await</span> fetch(
  <span class="str">'https://api.brighten.dev/api/v1/colorize'</span>,
  {
    <span class="key">method</span>: <span class="str">'POST'</span>,
    <span class="key">headers</span>: {
      <span class="str">'Authorization'</span>: <span class="str">\`Bearer \${key}\`</span>,
      <span class="str">'Content-Type'</span>: <span class="str">'application/json'</span>,
    },
    <span class="key">body</span>: JSON.stringify({ <span class="key">image</span>: base64 }),
  }
);

<span class="key">const</span> { image } = <span class="key">await</span> response.json();</pre>
        </div>
      </div>
    </div>
  </section>

  <section class="pricing-section" id="pricing">
    <div class="container">
      <div class="section-header">
        <h2>Simple pricing</h2>
        <p>Start free, then pay as you grow. No surprises.</p>
      </div>
      
      <div class="pricing-grid">
        <div class="price-card">
          <div class="price-name">Free</div>
          <div class="price-amount">$0</div>
          <div class="price-period">100 requests/month</div>
          <ul class="price-features">
            <li>All 5 operations</li>
            <li>Community support</li>
            <li>Standard rate limits</li>
          </ul>
          <a href="#signup" class="btn btn-secondary">Get Started</a>
        </div>
        <div class="price-card featured">
          <div class="price-badge">Popular</div>
          <div class="price-name">Pro</div>
          <div class="price-amount">$29</div>
          <div class="price-period">10,000 requests/month</div>
          <ul class="price-features">
            <li>All 5 operations</li>
            <li>Priority support</li>
            <li>Higher rate limits</li>
            <li>Usage analytics</li>
          </ul>
          <a href="#signup" class="btn btn-primary">Start Free Trial</a>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-section" id="signup">
    <div class="container">
      <h2>Start building today</h2>
      <p>Get your API key in seconds. No credit card required.</p>
      <a href="mailto:hello@brighten.dev?subject=API%20Access%20Request" class="btn btn-primary btn-lg">Request Access</a>
    </div>
  </section>

  <footer>
    <div class="footer-inner">
      <div class="footer-links">
        <a href="/docs">Documentation</a>
        <a href="/api/openapi.json">OpenAPI</a>
        <a href="https://github.com/phishy/brighten" target="_blank">GitHub</a>
      </div>
      <div class="footer-copy">© 2025 Brighten</div>
    </div>
  </footer>
</body>
</html>`;
}

function getDocsHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brighten API Documentation</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <redoc spec-url="/api/openapi.json" 
         hide-download-button="false"
         theme='{
           "colors": { "primary": { "main": "#3b82f6" } },
           "typography": { "fontFamily": "Inter, sans-serif", "code": { "fontFamily": "JetBrains Mono, monospace" } },
           "sidebar": { "backgroundColor": "#1a1a2e" }
         }'>
  </redoc>
  <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
</body>
</html>`;
}

export function createServer(config: Config) {
  const app = express();
  const router = new OperationRouter(config);

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  app.get('/', (_req: Request, res: Response) => {
    res.type('html').send(getHomepageHtml());
  });

  app.get('/docs', (_req: Request, res: Response) => {
    res.type('html').send(getDocsHtml());
  });

  app.get('/api/openapi.json', (_req: Request, res: Response) => {
    const openApiSpec = generateOpenAPISpec(config);
    res.json(openApiSpec);
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/operations', (_req: Request, res: Response) => {
    res.json({
      operations: router.getAvailableOperations().map(op => ({
        name: op,
        provider: router.getProviderForOperation(op),
      })),
    });
  });

  app.post('/api/v1/:operation', async (req: Request, res: Response) => {
    const { operation } = req.params;
    const { image, options } = req.body;

    if (!image) {
      res.status(400).json({ error: 'Image is required' });
      return;
    }

    const base64Match = image.match(/^data:([^;]+);base64,(.+)$/);
    let imageBuffer: Buffer;
    let mimeType: string;

    if (base64Match) {
      mimeType = base64Match[1];
      imageBuffer = Buffer.from(base64Match[2], 'base64');
    } else {
      mimeType = 'image/png';
      imageBuffer = Buffer.from(image, 'base64');
    }

    try {
      const result = await router.execute(operation as OperationType, {
        image: imageBuffer,
        mimeType,
        options,
      });

      const base64Result = result.image.toString('base64');

      res.json({
        image: `data:${result.mimeType};base64,${base64Result}`,
        metadata: result.metadata,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Operation ${operation} failed:`, message);
      res.status(500).json({ error: message });
    }
  });

  return app;
}

export async function startServer(config: Config) {
  const app = createServer(config);
  const port = config.server.port;
  const host = config.server.host;

  return new Promise<typeof app>((resolve) => {
    app.listen(port, host, () => {
      console.log(`Brighten API running at http://${host}:${port}`);
      console.log(`API docs at http://${host}:${port}/docs`);
      console.log(`OpenAPI spec at http://${host}:${port}/api/openapi.json`);
      resolve(app);
    });
  });
}
