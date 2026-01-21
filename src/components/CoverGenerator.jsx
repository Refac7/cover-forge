import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';

// --- 常量定义 ---
const PRESET_FONTS = [
  { name: 'System Sans', value: 'sans-serif' },
  { name: 'System Mono', value: 'monospace' },
  { name: 'Serif', value: 'serif' },
  { name: 'Impact', value: 'Impact' },
  { name: 'Arial Black', value: '"Arial Black"' },
];

const ALIGNMENTS = {
  'top-left':      'justify-start items-start text-left',
  'top-center':    'justify-start items-center text-center',
  'top-right':     'justify-start items-end text-right',
  'center-left':   'justify-center items-start text-left',
  'center':        'justify-center items-center text-center',
  'center-right':  'justify-center items-end text-right',
  'bottom-left':   'justify-end items-start text-left',
  'bottom-center': 'justify-end items-center text-center',
  'bottom-right':  'justify-end items-end text-right',
};

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export default function CoverGenerator() {
  // --- 状态管理 ---
  const [config, setConfig] = useState({
    title: 'REFAC7.LOGS',
    subtitle: 'ARCHITECT OF THE DIGITAL VOID',
    bgType: 'color', 
    bgColor: '#0e0e0e',
    bgImage: null,
    themeColor: '#ef4444', // 对应 red-500
    textColor: '#ffffff',
    fontFamily: 'sans-serif',
    alignment: 'bottom-left',
    blur: 0,
    brightness: 100,
    fontSize: 100, 
    showDecorations: true, 
  });

  const [customFontName, setCustomFontName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(1);
  
  const previewRef = useRef(null);
  const containerRef = useRef(null);

  // --- 逻辑处理 ---
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 减去 padding (p-5 = 20px * 2 = 40px)
        setScale((containerWidth - 40) / BASE_WIDTH);
      }
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateConfig('bgImage', url);
    }
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const fontName = `CustomFont_${Date.now()}`;
        const buffer = await file.arrayBuffer();
        const font = new FontFace(fontName, buffer);
        await font.load();
        document.fonts.add(font);
        setCustomFontName(fontName);
        updateConfig('fontFamily', fontName);
      } catch (err) {
        console.error("Font load failed:", err);
      }
    }
  };

  const processImageWithFilters = (imgSrc, blur, brightness) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.filter = `blur(${blur * 2}px) brightness(${brightness}%)`;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
        }
      };
      img.onerror = reject;
      img.src = imgSrc;
    });
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsProcessing(true);

    const originalBgImage = config.bgImage;
    const originalBlur = config.blur;
    const originalBrightness = config.brightness;

    try {
      if (config.bgType === 'image' && config.bgImage && (config.blur > 0 || config.brightness !== 100)) {
        const processedImage = await processImageWithFilters(config.bgImage, config.blur, config.brightness);
        updateConfig('bgImage', processedImage);
        updateConfig('blur', 0);
        updateConfig('brightness', 100);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const canvas = await html2canvas(previewRef.current, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false,
        backgroundColor: config.bgColor,
        logging: false,
        imageTimeout: 0,
      });

      const link = document.createElement('a');
      link.download = `REFAC7-COVER-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (err) {
      console.error(err);
      alert("System Error: Export Sequence Failed.");
    } finally {
      updateConfig('bgImage', originalBgImage);
      updateConfig('blur', originalBlur);
      updateConfig('brightness', originalBrightness);
      setIsProcessing(false);
    }
  };

  // --- UI 组件 ---
  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border-x border-gray-100 font-sans selection:bg-red-500/30 selection:text-red-600">
      
      <div className="relative py-12 px-6 sm:px-8 mx-auto">

        <div className="pb-10">
          
          {/* 顶栏状态条 */}
          <div className="flex items-center justify-between mb-8 text-[10px] font-mono uppercase tracking-widest text-zinc-500/60">
            <span>// SYSTEM_TOOLS // GENERATOR</span>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500">
                 <span className="relative flex h-2 w-2">
                   <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProcessing ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                   <span className={`relative inline-flex rounded-full h-2 w-2 ${isProcessing ? 'bg-amber-600' : 'bg-emerald-600'}`}></span>
                 </span>
                 <span className="font-bold text-zinc-900 dark:text-zinc-100">
                    {isProcessing ? 'PROCESSING' : 'ONLINE'}
                 </span>
            </div>
          </div>
    
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* 左侧：标题 */}
            <div className="lg:col-span-7">
              <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-zinc-900 dark:text-white leading-[0.9] -ml-1">
                CoverForge.
              </h1>
            </div>
    
            {/* 右侧：简介与数据面板 */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="border-l pl-5">
                 <p className="text-base sm:text-lg text-zinc-500 leading-relaxed">
                  Generate minimal, structured cover images for your blog posts. 
                  Designed for the digital void.
                 </p>
              </div>
    
              {/* 数据网格 - 复刻 Active_Nodes 样式 */}
              <div className="grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-800">
                {/* Viewport Info */}
                <div className="bg-white dark:bg-zinc-900/50 p-3 flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500/70 font-mono">Viewport_Size</span>
                  <span className="text-2xl font-mono font-bold text-zinc-900 dark:text-zinc-100">{BASE_WIDTH}x{BASE_HEIGHT}</span>
                </div>
                
                {/* Scale Info */}
                <div className="bg-white dark:bg-zinc-900/50 p-3 flex flex-col gap-1">
                  <span className="text-[9px] uppercase tracking-widest text-zinc-500/70 font-mono">Current_Scale</span>
                  <span className="text-sm font-mono font-bold text-zinc-500 mt-1">
                    {(scale * 100).toFixed(1)}% / FIT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        {/* 预览区域分割线 */}
        <div className="flex items-end gap-4 mb-10 select-none">
           <span className="font-mono text-4xl font-bold text-zinc-200 dark:text-zinc-800 leading-none -mb-1">01</span>
           <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500/50 mb-1">
              Canvas_Preview
           </span>
           <div className="h-px bg-linear-to-r from-zinc-200 dark:from-zinc-800 to-transparent flex-1 mb-1.5"></div>
        </div>
    
        {/* 预览 */}
        <div className="max-w-full mx-auto mb-20">
            <div 
                ref={containerRef}
                className="group relative flex flex-col p-1 sm:p-2 h-full
                       bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800
                       hover:border-black dark:hover:border-white transition-all duration-300 rounded-none overflow-hidden hover:shadow-sm"
            >
                {/* 四角标记 */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity z-20"></div>
                
                {/* 渲染区域 */}
                <div className="w-full relative overflow-hidden bg-zinc-100 dark:bg-zinc-900" style={{ aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}` }}>
                     <div 
                        ref={previewRef}
                        style={{
                            width: BASE_WIDTH,
                            height: BASE_HEIGHT,
                            backgroundColor: config.bgColor,
                            transform: `scale(${scale})`,
                            transformOrigin: 'top left',
                        }}
                        className="absolute top-0 left-0 flex overflow-hidden select-none"
                    >
                        {/* 背景图 */}
                        {config.bgType === 'image' && config.bgImage && (
                            <img 
                                src={config.bgImage}
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ filter: `blur(${config.blur}px) brightness(${config.brightness}%)` }}
                                alt="bg"
                            />
                        )}

                        {/* 装饰层 */}
                        {config.showDecorations && (
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute top-12 right-12 border-t border-r w-8 h-8 opacity-50" style={{ borderColor: config.themeColor }}></div>
                                <div className="absolute bottom-12 left-12 border-b border-l w-8 h-8 opacity-50" style={{ borderColor: config.themeColor }}></div>
                                <div className="absolute top-0 bottom-0 left-32 w-px bg-white/10 mix-blend-overlay"></div>
                            </div>
                        )}

                        {/* 内容 */}
                        <div className={`relative z-10 w-full h-full p-24 pl-40 flex flex-col gap-6 ${ALIGNMENTS[config.alignment]}`}>
                            <div className="flex items-center gap-3">
                                <span className="h-px w-8 bg-current" style={{ color: config.themeColor }}></span>
                                <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] opacity-60 mix-blend-difference" style={{ color: config.textColor }}>
                                    Article_Log
                                </span>
                            </div>

                            <h1 
                                className="font-bold leading-[0.85] tracking-tighter drop-shadow-lg whitespace-pre-wrap max-w-full mix-blend-difference"
                                style={{ 
                                    color: config.textColor,
                                    fontFamily: config.fontFamily,
                                    fontSize: `${config.fontSize}px`
                                }}
                            >
                                {config.title}
                                <span style={{ color: config.themeColor }}>.</span>
                            </h1>

                            <div className="border-l-2 pl-6 mt-2 max-w-4xl" style={{ borderColor: `${config.themeColor}80` }}>
                                <p 
                                    className="text-3xl font-light tracking-wide opacity-90 leading-tight mix-blend-difference"
                                    style={{ color: config.textColor }}
                                >
                                    {config.subtitle}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* 底部 */}
                <div className="flex items-center justify-between mt-4 px-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-zinc-500 rounded-none">Mode</span>
                        <span className="text-xs text-zinc-500 font-mono">{config.bgType === 'color' ? 'SOLID_FILL' : 'IMG_OVERLAY'}</span>
                    </div>
                    <span className="icon-[ph--arrow-up-right] size-4 text-zinc-300 group-hover:text-red-500 transition-colors"></span>
                </div>
            </div>
        </div>

        {/* 4. 控制台区域 */}
        <div id="controls-section" className="mt-12 pt-10 border-t border-dashed border-zinc-200 dark:border-zinc-800">
            <div className="grid md:grid-cols-2 gap-12">
                
                {/* 左侧：说明与下载 */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-end gap-4 mb-8 select-none">
                            <span className="font-mono text-4xl font-bold text-zinc-200 dark:text-zinc-800 leading-none -mb-1">02</span>
                            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-500/50 mb-1">
                                Controls_Mod
                            </span>
                        </div>
                        <div className="text-zinc-500 space-y-4 text-sm md:text-xl leading-relaxed border-l border-zinc-200 dark:border-zinc-800 pl-4">
                          <p>Customize the visual parameters below. The generated image will be exported as PNG.</p>
                          <p>Use high-resolution inputs for optimal results.</p>
                        </div>
                    </div>
                    
                    <div className="mt-8">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono block mb-2">Execution Channel</span>
                        <button 
                            onClick={handleDownload}
                            disabled={isProcessing}
                            className="w-full flex items-center justify-between p-4 border border-zinc-200 dark:border-zinc-800 hover:border-red-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors group text-left"
                        >
                            <span className="text-base font-mono text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                {isProcessing ? 'RENDERING_SEQUENCE...' : 'DOWNLOAD_COVER.PNG'}
                            </span>
                            <span className="icon-[ph--download-simple] size-5 text-zinc-400 group-hover:text-red-500 transition-colors"></span>
                        </button>
                    </div>
                </div>

                {/* 右侧：参数配置 (复刻 JSON 规格表风格) */}
                <div className="relative bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1">
                    {/* 角标 */}
                    <div className="absolute -top-1 -left-1 size-3 border-t-2 border-l-2 border-black"></div>
                    <div className="absolute -bottom-1 -right-1 size-3 border-b-2 border-r-2 border-black"></div>

                    <div className="bg-white dark:bg-zinc-950/50 p-6 sm:p-8 h-full flex flex-col gap-6">
                        <div className="flex justify-between items-end border-b-2 border-zinc-900 dark:border-zinc-100 pb-2">
                             <span className="font-bold text-lg uppercase text-zinc-900 dark:text-zinc-100">Parameters</span>
                             <span className="font-mono text-xs text-zinc-500">CONFIG_V1.0</span>
                        </div>
                        
                        <div className="space-y-4 font-mono text-sm">
                            
                            {/* Title Input */}
                            <InputRow label="TITLE">
                                <input 
                                    type="text" 
                                    value={config.title}
                                    onChange={(e) => updateConfig('title', e.target.value)}
                                    className="w-full bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-red-500 focus:outline-none py-1 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500/30"
                                />
                            </InputRow>

                            {/* Subtitle Input */}
                            <InputRow label="SUBTITLE">
                                <input 
                                    type="text" 
                                    value={config.subtitle}
                                    onChange={(e) => updateConfig('subtitle', e.target.value)}
                                    className="w-full bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-red-500 focus:outline-none py-1 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500/30"
                                />
                            </InputRow>

                            {/* Font Select */}
                            <InputRow label="FONT">
                                <div className="flex w-full gap-2">
                                    <select 
                                        value={config.fontFamily}
                                        onChange={(e) => updateConfig('fontFamily', e.target.value)}
                                        className="flex-1 bg-transparent border-b border-dashed border-zinc-300 dark:border-zinc-700 focus:border-red-500 focus:outline-none py-1 text-zinc-900 dark:text-zinc-100 appearance-none rounded-none"
                                    >
                                        {PRESET_FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                                        {customFontName && <option value={customFontName}>UPLOADED</option>}
                                    </select>
                                    <label className="cursor-pointer text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 flex items-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                                        UPLOAD
                                        <input type="file" accept=".ttf,.woff" onChange={handleFontUpload} className="hidden" />
                                    </label>
                                </div>
                            </InputRow>

                            {/* Background Type */}
                            <InputRow label="BG_MODE">
                                <div className="flex gap-4 pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-3 h-3 border ${config.bgType === 'color' ? 'bg-red-500 border-red-500' : 'border-zinc-400'}`}></div>
                                        <input type="radio" checked={config.bgType === 'color'} onChange={() => updateConfig('bgType', 'color')} className="hidden" />
                                        <span className="text-xs text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">COLOR</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-3 h-3 border ${config.bgType === 'image' ? 'bg-red-500 border-red-500' : 'border-zinc-400'}`}></div>
                                        <input type="radio" checked={config.bgType === 'image'} onChange={() => updateConfig('bgType', 'image')} className="hidden" />
                                        <span className="text-xs text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">IMAGE</span>
                                    </label>
                                </div>
                            </InputRow>

                            {/* Conditional Inputs */}
                            {config.bgType === 'color' ? (
                                <InputRow label="BG_COLOR">
                                     <div className="flex items-center gap-2 w-full border-b border-dashed border-zinc-300 dark:border-zinc-700 py-1">
                                        <input type="color" value={config.bgColor} onChange={(e) => updateConfig('bgColor', e.target.value)} className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer" />
                                        <span className="text-xs text-zinc-500">{config.bgColor}</span>
                                     </div>
                                </InputRow>
                            ) : (
                                <div className="border-l-2 border-zinc-200 dark:border-zinc-800 pl-4 space-y-3 py-2">
                                    <InputRow label="SOURCE">
                                        <label className="cursor-pointer text-xs border-b border-zinc-300 hover:text-red-500 hover:border-red-500 transition-colors block py-1">
                                            [CLICK_TO_UPLOAD_IMG]
                                            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                        </label>
                                    </InputRow>
                                    <InputRow label="BLUR">
                                        <input type="range" min="0" max="20" value={config.blur} onChange={(e) => updateConfig('blur', e.target.value)} className="w-full accent-red-500 h-1 bg-zinc-200 rounded-none appearance-none" />
                                    </InputRow>
                                    <InputRow label="DIM">
                                        <input type="range" min="0" max="200" value={config.brightness} onChange={(e) => updateConfig('brightness', e.target.value)} className="w-full accent-red-500 h-1 bg-zinc-200 rounded-none appearance-none" />
                                    </InputRow>
                                </div>
                            )}

                             {/* Accent Color */}
                             <InputRow label="ACCENT">
                                <div className="flex items-center gap-2 w-full border-b border-dashed border-zinc-300 dark:border-zinc-700 py-1">
                                    <input type="color" value={config.themeColor} onChange={(e) => updateConfig('themeColor', e.target.value)} className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer" />
                                    <span className="text-xs text-zinc-500">{config.themeColor}</span>
                                </div>
                            </InputRow>
                            
                            {/* Text Color */}
                            <InputRow label="TEXT">
                                <div className="flex items-center gap-2 w-full border-b border-dashed border-zinc-300 dark:border-zinc-700 py-1">
                                    <input type="color" value={config.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} className="w-5 h-5 p-0 border-0 bg-transparent cursor-pointer" />
                                    <span className="text-xs text-zinc-500">{config.textColor}</span>
                                </div>
                            </InputRow>

                            {/* Alignment */}
                            <InputRow label="ALIGN">
                                <div className="grid grid-cols-3 gap-1 w-20 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-1">
                                    {Object.keys(ALIGNMENTS).map(a => (
                                        <button 
                                            key={a}
                                            onClick={() => updateConfig('alignment', a)}
                                            className={`aspect-square ${config.alignment === a ? 'bg-red-500' : 'bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400'}`}
                                        />
                                    ))}
                                </div>
                            </InputRow>

                        </div>

                        {/* Reset / Deco Toggle */}
                        <button
                          onClick={() => updateConfig('showDecorations', !config.showDecorations)}
                          className="mt-4 w-full py-3 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900
                                     hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all duration-200
                                     font-mono text-xs font-bold tracking-widest rounded-none
                                     flex items-center justify-center gap-2 group active:scale-[0.99]"
                        >
                          <span className={`size-3 border ${config.showDecorations ? 'bg-red-500 border-red-500' : 'border-current bg-transparent'}`}></span>
                          <span>TOGGLE DECORATIONS</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// 辅助组件：复刻 JSON 列表行
const InputRow = ({ label, children }) => (
    <div className="grid grid-cols-[60px_1fr] gap-4 group/item items-start">
        <span className="text-zinc-400 text-xs py-1 select-none">{label}</span>
        <div className="text-zinc-900 dark:text-zinc-100 group-hover/item:text-red-600 transition-colors break-all">
            {children}
        </div>
    </div>
);