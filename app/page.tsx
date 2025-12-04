"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Download, Link as LinkIcon, Settings, RefreshCw, Palette, Zap, Box, Terminal, Share2 } from 'lucide-react';

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('');
  const [fgColor, setFgColor] = useState('#0f172a'); // Navy (Slate-900)
  const [bgColor, setBgColor] = useState('#ffffff'); // White
  const [size, setSize] = useState(300);
  const [isLibraryLoaded, setIsLibraryLoaded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);
  const qrInstanceRef = useRef(null);

  // Google Fonts & Custom CSS Injection
  useEffect(() => {
    // Load Fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;600;700&family=Noto+Sans+JP:wght@400;700&family=JetBrains+Mono:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Load QR Library
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js";
    script.async = true;
    script.onload = () => setIsLibraryLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  // QR Code Generation Logic
  useEffect(() => {
    if (isLibraryLoaded && canvasRef.current) {
      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new window.QRious({
          element: canvasRef.current,
          size: size,
          value: url,
          foreground: fgColor,
          background: bgColor,
          level: 'H',
        });
      } else {
        qrInstanceRef.current.set({
          size: size,
          value: url,
          foreground: fgColor,
          background: bgColor,
        });
      }
    }
  }, [isLibraryLoaded, url, fgColor, bgColor, size]);

  // Handle URL Change with faux-loading effect
  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 300);
  };

  // Download Logic
  const downloadQRCode = () => {
    if (!url || !canvasRef.current) return;
    try {
      const pngUrl = canvasRef.current.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `NEO_QR_${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const handleReset = () => {
    setUrl('');
    setFgColor('#0f172a');
    setBgColor('#ffffff');
  };

  // Theme Constants
  const THEME_ACCENT = '#1e3a8a'; // Navy Blue
  const THEME_BG = '#f8fafc'; // Very light gray/blue
  const THEME_TEXT = '#1e293b'; // Slate 800

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] font-sans selection:bg-[#1e3a8a] selection:text-white overflow-hidden relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: `linear-gradient(${THEME_ACCENT} 1px, transparent 1px), linear-gradient(90deg, ${THEME_ACCENT} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-[#f1f5f9] opacity-80"></div>
      </div>

      <style>{`
        body { font-family: 'Noto Sans JP', 'Chakra Petch', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        .cyber-border {
          position: relative;
          clip-path: polygon(
            0 0, 
            100% 0, 
            100% calc(100% - 20px), 
            calc(100% - 20px) 100%, 
            0 100%
          );
        }
        
        .cyber-input {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid #cbd5e1;
          transition: all 0.3s ease;
        }
        .cyber-input:focus {
          border-color: ${THEME_ACCENT};
          box-shadow: 0 0 15px rgba(30, 58, 138, 0.2);
          background: #ffffff;
        }

        .glitch-text:hover {
          color: ${THEME_ACCENT};
        }

        .scanline {
          width: 100%;
          height: 2px;
          background: ${THEME_ACCENT};
          opacity: 0.1;
          position: absolute;
          top: 0;
          left: 0;
          animation: scan 3s linear infinite;
        }
        
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-end mb-12 border-b border-slate-300 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-[#1e3a8a] text-white p-1">
                <Terminal size={20} strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase glitch-text cursor-default text-slate-900">
                Neo<span className="text-[#1e3a8a]">QR</span>
              </h1>
            </div>
            <p className="text-slate-500 font-mono text-xs md:text-sm tracking-widest uppercase font-bold">
              安全データ転送プロトコル v4.0
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-[#1e3a8a] font-mono text-xs font-bold animate-pulse">システム稼働中</div>
            <div className="text-slate-400 font-mono text-xs">遅延: 12ms</div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 flex-grow">
          
          {/* LEFT COLUMN: Controls */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8">
            
            {/* Input Section */}
            <div className="space-y-6">
              <div className="relative group">
                <label className="text-slate-500 font-bold text-xs uppercase mb-2 block flex items-center gap-2">
                  <LinkIcon size={14} className="text-[#1e3a8a]" />
                  対象リソース URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://example.com"
                    className="w-full bg-white border border-slate-300 text-slate-900 p-4 pr-12 font-mono text-sm focus:outline-none focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a] transition-all rounded-none cyber-input"
                  />
                  <div className="absolute right-0 top-0 h-full w-10 flex items-center justify-center border-l border-slate-300 bg-slate-100">
                    {url ? <Zap size={16} className="text-[#1e3a8a]" /> : <div className="w-2 h-2 bg-slate-300 rounded-full"></div>}
                  </div>
                </div>
                {/* Decorative corner accents */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-[#1e3a8a] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>

              {/* Color Controls */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-slate-500 font-bold text-xs uppercase flex items-center gap-2">
                    <Palette size={14} /> データ色（前景）
                  </label>
                  <div className="flex items-center gap-3 bg-white p-2 border border-slate-300 shadow-sm">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 bg-transparent border-none cursor-pointer p-0"
                    />
                    <span className="font-mono text-xs text-slate-700 font-bold">{fgColor.toUpperCase()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-slate-500 font-bold text-xs uppercase flex items-center gap-2">
                    <Box size={14} /> 背景色
                  </label>
                  <div className="flex items-center gap-3 bg-white p-2 border border-slate-300 shadow-sm">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 bg-transparent border-none cursor-pointer p-0"
                    />
                    <span className="font-mono text-xs text-slate-700 font-bold">{bgColor.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Status Display */}
              <div className="border border-slate-300 bg-white p-4 font-mono text-xs space-y-2 shadow-sm">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>ステータス:</span>
                  <span className={isGenerating ? "text-amber-600 font-bold" : "text-[#1e3a8a] font-bold"}>
                    {isGenerating ? "処理中..." : "待機中"}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>ライブラリ:</span>
                  <span className={isLibraryLoaded ? "text-[#1e3a8a] font-bold" : "text-red-500"}>
                    {isLibraryLoaded ? "ロード完了 [QRIOUS]" : "初期化中..."}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>サイズ:</span>
                  <span>{size}px RAW</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-[#1e3a8a] font-bold text-xs uppercase flex items-center gap-2 transition-colors"
              >
                <RefreshCw size={12} /> パラメータをリセット
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Preview & Output */}
          <div className="w-full lg:w-7/12 flex flex-col items-center justify-center relative">
            
            {/* The Artifact Container */}
            <div className="relative group perspective-1000">
              
              {/* Outer Decorative Frame */}
              <div className="absolute -inset-4 border border-slate-300 opacity-50 cyber-border bg-white shadow-xl"></div>
              <div className="absolute -inset-1 border border-[#1e3a8a] opacity-20 group-hover:opacity-60 transition-opacity duration-500 cyber-border"></div>
              
              {/* Main Display Area */}
              <div className="relative bg-white p-8 cyber-border shadow-lg border border-slate-200">
                
                {/* Scanline Effect */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-20 mix-blend-overlay opacity-50">
                  <div className="scanline"></div>
                </div>

                {/* Canvas Container */}
                <div className="relative z-10 flex items-center justify-center min-h-[300px] min-w-[300px] bg-slate-50">
                  <canvas 
                    ref={canvasRef} 
                    style={{ 
                      display: url && isLibraryLoaded ? 'block' : 'none',
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                    }}
                  />
                  
                  {(!url || !isLibraryLoaded) && (
                    <div className="flex flex-col items-center justify-center text-slate-300 animate-pulse">
                      <Settings className="w-24 h-24 mb-4 opacity-30 text-[#1e3a8a]" strokeWidth={1} />
                      <p className="font-mono text-xs tracking-widest uppercase text-slate-400 font-bold">
                        入力データ待機中
                      </p>
                    </div>
                  )}
                </div>

                {/* Technical Markings */}
                <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400">SEC-09</div>
                <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400">非代替性</div>
                
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#1e3a8a]"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#1e3a8a]"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#1e3a8a]"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#1e3a8a] "></div>
              </div>

              {/* Action Bar */}
              <div className="absolute -right-16 top-0 bottom-0 flex flex-col justify-center gap-4 hidden lg:flex">
                <button 
                  onClick={downloadQRCode}
                  disabled={!url}
                  className={`p-4 bg-white border border-slate-300 text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white transition-all duration-300 group/btn relative shadow-md ${!url ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <Download size={20} />
                  <span className="absolute right-full mr-4 bg-[#1e3a8a] text-white text-xs font-bold py-1 px-2 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap rounded shadow-lg">
                    PNGダウンロード
                  </span>
                </button>
                <div className="w-px h-8 bg-slate-300 mx-auto"></div>
                <button 
                  className="p-4 bg-white border border-slate-300 text-slate-400 hover:text-[#1e3a8a] transition-all cursor-not-allowed shadow-md"
                >
                  <Share2 size={20} />
                </button>
              </div>

              {/* Mobile Download Button (Visible only on small screens) */}
              <div className="mt-8 lg:hidden">
                 <button 
                  onClick={downloadQRCode}
                  disabled={!url}
                  className={`w-full py-4 bg-[#1e3a8a] text-white font-bold uppercase tracking-widest hover:bg-[#1e40af] transition-colors cyber-border shadow-lg ${!url ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  アーティファクトを保存
                </button>
              </div>

            </div>
            
            <p className="mt-12 font-mono text-[10px] text-slate-500 text-center max-w-sm">
              生成されたデータはローカルで処理されます。外部サーバーへの送信は行われません。
              <br />システム整合性: 100%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;