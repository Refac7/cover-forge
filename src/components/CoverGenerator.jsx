import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';

// --- 常量配置 ---
const PRESET_FONTS =[
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

// --- 主组件 ---
export default function CoverGenerator() {
  const [config, setConfig] = useState({
    title: 'Refac7.Logs',
    subtitle: 'Architect of the Digital Void.',
    bgType: 'color', 
    bgColor: '#18181b',
    bgImage: null,
    themeColor: '#ef4444', 
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

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setScale(containerWidth / BASE_WIDTH);
      }
    };
    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  },[]);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateConfig('bgImage', url);
      updateConfig('bgType', 'image');
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
      link.download = `REFAC7_LOG_${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error: Export failed.");
    } finally {
      updateConfig('bgImage', originalBgImage);
      updateConfig('blur', originalBlur);
      updateConfig('brightness', originalBrightness);
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative font-sans flex flex-col lg:flex-row min-h-screen text-foreground bg-background selection:bg-primary/20">
      
      {/* ================= LEFT PANE (1/3) ================= */}
      <aside className="w-full lg:w-1/3 lg:sticky lg:top-0 lg:h-screen flex flex-col border-b lg:border-b-0 lg:border-r border-border z-20 bg-background/95 backdrop-blur-md">
        
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {/* Top Status Bar */}
          <div className="p-6 lg:p-8 xl:p-12 pb-0 shrink-0">
            <div className="flex flex-row justify-between items-start text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 select-none">
                <span>// SYS_GENERATOR // V.2.0</span>
                <div className="flex items-center gap-2 text-primary">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-none bg-emerald-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-none h-1.5 w-1.5 bg-emerald-600"></span>
                    </span>
                    <span className="text-foreground font-bold">ENGINE: ONLINE</span>
                </div>
            </div>
          </div>

          {/* Hero Title */}
          <div className="flex-1 flex flex-col justify-center p-6 lg:p-8 xl:p-12 min-h-62.5">
             <h1 className="text-6xl sm:text-8xl lg:text-7xl xl:text-8xl font-black tracking-tighter text-foreground leading-[0.8] mb-6 -ml-1 select-none">
              COVER<br/>FORGE<span className="text-primary">.</span>
             </h1>
             <div className="h-px w-16 bg-border mt-8 mb-4"></div>
             <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase">
                <span className="icon-[ph--image-bold] size-4"></span>
                <span>Visual Synthesis</span>
             </div>
          </div>

          {/* Intro Box */}
          <div className="shrink-0 p-6 xl:p-8 bg-muted/30 border-t border-border/50 border-dashed">
             <span className="block text-[10px] uppercase text-muted-foreground/50 font-mono tracking-wider mb-4">// MODULE_INFO</span>
             <p className="text-sm text-muted-foreground/80 leading-loose font-mono">
               Real-time graphics rendering engine.<br/>
               Configure parameters in the matrix to generate deployable cover assets.
               <br/><br/>
               <span className="text-primary/80">{'>'} Awaiting parameters...</span>
             </p>
          </div>
        </div>

        {/* Docked Action Area */}
        <div className="flex flex-col shrink-0 border-t border-border">
            <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
                <div className="bg-background hover:bg-muted/20 transition-colors p-6 flex flex-col items-center justify-center h-24 xl:h-28">
                   <span className="text-xl font-mono font-bold text-foreground/90">1280x720</span>
                   <span className="text-[9px] font-mono uppercase text-muted-foreground mt-2 tracking-widest">Resolution</span>
                </div>
                <div className="bg-background hover:bg-muted/20 transition-colors p-6 flex flex-col items-center justify-center h-24 xl:h-28">
                   <span className={`text-lg font-mono font-bold ${isProcessing ? 'text-amber-500 animate-pulse' : 'text-emerald-500'}`}>
                      {isProcessing ? 'RENDERING' : 'READY'}
                   </span>
                   <span className="text-[9px] font-mono uppercase text-muted-foreground mt-2 tracking-widest">Status</span>
                </div>
            </div>
            
            <button 
                onClick={handleDownload}
                disabled={isProcessing}
                className={`w-full py-6 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 ${
                    isProcessing 
                        ? 'bg-muted text-muted-foreground cursor-not-allowed border-t border-border' 
                        : 'bg-foreground text-background hover:bg-primary'
                }`}
            >
                <span>{isProcessing ? 'Processing_Queue...' : 'Initialize_Export'}</span>
                {!isProcessing && <span className="icon-[ph--download-simple-bold] size-4"></span>}
            </button>
        </div>
      </aside>

      {/* ================= RIGHT PANE (2/3) ================= */}
      <main className="w-full lg:w-2/3 z-10 flex flex-col min-h-screen">
        <div className="p-6 lg:p-10 xl:p-16 flex-1 flex flex-col gap-16">
          
          {/* 1. Canvas Preview */}
          <div>
            <div className="flex items-end justify-between border-b border-border/80 pb-4 mb-8 select-none">
               <div className="flex items-center">
                   <span className="font-mono text-xs text-primary mr-3">01</span>
                   <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground/80">Canvas_Preview</h2>
               </div>
               <span className="text-[10px] font-mono text-muted-foreground/50">LIVE_FEED</span>
            </div>

            <div className="relative group bg-muted/10 border border-border p-4 sm:p-8" ref={containerRef}>
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/0 group-hover:border-primary/50 transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/0 group-hover:border-primary/50 transition-colors"></div>

                {/* Wrapper holding aspect ratio */}
                <div className="relative overflow-hidden border border-border bg-black/50 shadow-2xl" style={{ aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}` }}>
                    
                    {/* Background Grid Pattern (using the utility from your CSS) */}
                    <div className="absolute inset-0 opacity-[0.2] pointer-events-none bg-grid-pattern"></div>

                    {/* Actual Rendered Canvas */}
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
                        {/* Layer 1: Background */}
                        {config.bgType === 'image' && config.bgImage && (
                            <img 
                                src={config.bgImage}
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                                style={{ filter: `blur(${config.blur}px) brightness(${config.brightness}%)` }}
                                alt="bg"
                            />
                        )}
                        
                        {/* Layer 2: HUD Decorations */}
                        {config.showDecorations && (
                            <div className="absolute inset-0 pointer-events-none p-16 z-0">
                                <div className="w-full h-full border-l border-white/10 relative flex flex-col justify-between mix-blend-overlay">
                                    <div className="flex items-center gap-4 pl-6 pt-2">
                                        <span className="font-mono text-xs text-white/40 tracking-widest">LOG.REFAC7</span>
                                        <div className="h-px w-16 bg-white/10"></div>
                                    </div>
                                    <div className="pl-6 pb-2">
                                        <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase block">
                                            Digital Architecture // V.1.0
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute top-16 right-16 w-4 h-4 border-t border-r border-white/20 mix-blend-overlay"></div>
                            </div>
                        )}

                        {/* Layer 3: Typography */}
                        <div className={`relative z-10 w-full h-full p-24 flex flex-col gap-8 ${ALIGNMENTS[config.alignment]}`}>
                            <h1 
                                className="font-bold leading-[0.9] tracking-tighter whitespace-pre-wrap max-w-[85%]"
                                style={{ 
                                    color: config.textColor,
                                    fontFamily: config.fontFamily,
                                    fontSize: `${config.fontSize}px`
                                }}
                            >
                                {config.title}
                                <span style={{ color: config.themeColor }}>.</span>
                            </h1>
                            <div className="max-w-3xl">
                                <p className="text-4xl font-light tracking-wide opacity-90 leading-tight pl-1" style={{ color: config.textColor }}>
                                    {config.subtitle}
                                </p>
                                <div className="mt-6 h-1 w-24 opacity-80" style={{ backgroundColor: config.themeColor }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>

          {/* 2. Control Matrix */}
          <div>
            <div className="flex items-end justify-between border-b border-border/80 pb-4 mb-8 select-none">
               <div className="flex items-center">
                   <span className="font-mono text-xs text-primary mr-3">02</span>
                   <h2 className="font-mono text-sm font-bold uppercase tracking-widest text-foreground/80">Parameters_Matrix</h2>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
                
                {/* Group: Content */}
                <div className="space-y-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2 block">
                       [ Data_Input ]
                    </span>
                    <TechInput label="Heading" value={config.title} onChange={(e) => updateConfig('title', e.target.value)} />
                    <TechInput label="Sub_Heading" value={config.subtitle} onChange={(e) => updateConfig('subtitle', e.target.value)} isTextarea />
                </div>

                {/* Group: Visual Style */}
                <div className="space-y-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2 block">
                       [ Style_Config ]
                    </span>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <TechColorPicker label="Accent" value={config.themeColor} onChange={(v) => updateConfig('themeColor', v)} />
                        <TechColorPicker label="Text" value={config.textColor} onChange={(v) => updateConfig('textColor', v)} />
                    </div>

                    <div className="flex flex-col gap-4 border border-border p-4 bg-muted/10 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-3 h-3 border transition-colors rounded-none ${config.bgType === 'color' ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`} />
                                <input type="radio" checked={config.bgType === 'color'} onChange={() => updateConfig('bgType', 'color')} className="hidden" />
                                <span className="text-xs font-mono text-foreground/80 uppercase">Solid_Color</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-3 h-3 border transition-colors rounded-none ${config.bgType === 'image' ? 'bg-primary border-primary' : 'border-border group-hover:border-primary/50'}`} />
                                <input type="radio" checked={config.bgType === 'image'} onChange={() => updateConfig('bgType', 'image')} className="hidden" />
                                <span className="text-xs font-mono text-foreground/80 uppercase">Image_Overlay</span>
                            </label>
                        </div>
                        
                        {config.bgType === 'color' ? (
                            <TechColorPicker label="Background" value={config.bgColor} onChange={(v) => updateConfig('bgColor', v)} />
                        ) : (
                            <div className="space-y-4 animate-in fade-in">
                                <label className="flex items-center justify-center w-full border border-dashed border-border py-2 cursor-pointer hover:border-primary/50 hover:text-primary hover:bg-muted/30 transition-colors">
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">Upload_Asset</span>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                <TechSlider label="Blur" value={config.blur} min={0} max={20} onChange={(v) => updateConfig('blur', v)} />
                                <TechSlider label="Dim" value={config.brightness} min={0} max={200} onChange={(v) => updateConfig('brightness', v)} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Group: Typography */}
                <div className="space-y-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2 block">
                       [ Typography ]
                    </span>
                    <div className="flex items-center justify-between border border-border bg-background px-3 py-2 hover:border-primary/40 transition-colors">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Font_Family</span>
                        <select 
                            value={config.fontFamily}
                            onChange={(e) => updateConfig('fontFamily', e.target.value)}
                            className="bg-transparent text-sm font-mono text-foreground outline-none cursor-pointer text-right appearance-none"
                        >
                            {PRESET_FONTS.map(f => <option key={f.value} value={f.value} className="bg-background text-foreground">{f.name}</option>)}
                            {customFontName && <option value={customFontName} className="bg-background text-foreground">Custom</option>}
                        </select>
                    </div>
                    <label className="flex items-center justify-center w-full border border-dashed border-border py-2 cursor-pointer hover:border-primary/50 hover:text-primary hover:bg-muted/30 transition-colors">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">Upload_TTF/OTF</span>
                        <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} className="hidden" />
                    </label>
                    <TechSlider label="Font_Size" value={config.fontSize} min={40} max={200} onChange={(v) => updateConfig('fontSize', v)} />
                </div>

                {/* Group: Layout */}
                <div className="space-y-6">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2 block">
                       [ Layout_Control ]
                    </span>
                    
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Position_Anchor</span>
                            <div className="grid grid-cols-3 gap-1 w-20">
                                {Object.keys(ALIGNMENTS).map(a => (
                                    <button 
                                        key={a}
                                        onClick={() => updateConfig('alignment', a)}
                                        className={`w-full aspect-square transition-colors rounded-none border ${
                                            config.alignment === a 
                                                ? 'bg-primary border-primary' 
                                                : 'bg-muted/20 border-border hover:bg-primary/20 hover:border-primary/40'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">HUD_Overlay</span>
                            <button 
                                onClick={() => updateConfig('showDecorations', !config.showDecorations)}
                                className={`w-12 h-6 border transition-colors flex items-center px-1 rounded-none ${
                                    config.showDecorations ? 'bg-primary/20 border-primary' : 'bg-muted/20 border-border'
                                }`}
                            >
                                <span className={`w-4 h-4 rounded-none transition-transform ${
                                    config.showDecorations ? 'bg-primary translate-x-5' : 'bg-muted-foreground/30 translate-x-0'
                                }`}></span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- 科技风复用组件 ---

const TechInput = ({ label, value, onChange, isTextarea }) => (
    <div className="flex flex-col gap-2 group">
        <label className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest transition-colors group-focus-within:text-primary">
            {label}
        </label>
        {isTextarea ? (
             <textarea 
                value={value}
                onChange={onChange}
                rows={2}
                className="w-full bg-background border border-border p-3 text-sm font-sans text-foreground focus:border-primary/50 outline-none transition-colors resize-none rounded-none"
            />
        ) : (
            <input 
                type="text" 
                value={value}
                onChange={onChange}
                className="w-full bg-background border border-border p-3 text-sm font-sans text-foreground focus:border-primary/50 outline-none transition-colors rounded-none"
            />
        )}
    </div>
);

const TechColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-3 border border-border bg-background hover:border-primary/40 transition-colors group">
        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">{label}</span>
        <div className="relative w-5 h-5 border border-border">
             <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" />
             <div className="w-full h-full" style={{ backgroundColor: value }}></div>
        </div>
    </div>
);

const TechSlider = ({ label, value, min, max, onChange }) => (
    <div className="flex flex-col gap-3 p-3 border border-border bg-background hover:border-primary/40 transition-colors">
        <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{label}</span>
            <span className="text-[10px] font-mono text-primary">{value}</span>
        </div>
        <input 
            type="range" min={min} max={max} value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="w-full h-1 bg-border appearance-none cursor-pointer[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary rounded-none"
        />
    </div>
);