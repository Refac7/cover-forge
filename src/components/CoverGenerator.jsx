import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';

// 预设字体选项 (保留功能，优化命名)
const PRESET_FONTS = [
  { name: 'System Sans', value: 'sans-serif' },
  { name: 'System Mono', value: 'monospace' },
  { name: 'Serif', value: 'serif' },
  { name: 'Impact', value: 'Impact' },
  { name: 'Arial Black', value: '"Arial Black"' },
];

// 对齐方式映射
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

// 1280x720 基准
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export default function CoverGenerator() {
  // --- 状态管理 ---
  const [config, setConfig] = useState({
    title: 'REFAC7.LOGS',
    subtitle: 'ARCHITECT OF THE DIGITAL VOID // V1.0',
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

  // --- 缩放计算 ---
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
  }, []);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  // --- 资源处理 ---
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 优化：使用 createObjectURL 提高性能
      const url = URL.createObjectURL(file);
      updateConfig('bgImage', url);
    }
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files[0];
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
        ctx.filter = `blur(${blur * 2}px) brightness(${brightness}%)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imgSrc;
    });
  };

  // --- 导出逻辑 (已修复 Bug) ---
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
        // 等待 React 渲染和图片解码
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const canvas = await html2canvas(previewRef.current, {
        scale: 1.5,
        useCORS: true,
        allowTaint: false, // 关键修复：允许 toDataURL
        backgroundColor: config.bgColor,
        logging: false,
        imageTimeout: 0,
      });

      const link = document.createElement('a');
      link.download = `REFAC7-LOG-${Date.now()}.png`;
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

  return (
    <div className="flex flex-col xl:flex-row gap-8 w-full max-w-400 mx-auto mt-10 md:p-8 relative font-sans text-zinc-300">
      
      {/* --- 左侧：视窗 --- */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* 顶部状态栏风格 */}
        <div className="flex justify-between items-end border-b border-zinc-800 pb-2">
            <div>
                <h2 className="border-l-4 pl-4 border-red-500/50 text-5xl md:text-6xl font-bold tracking-tighter text-white uppercase">Cover<br></br>Forge Sys_</h2>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-4">:: Image Generation Module</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-xs font-mono">
                <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
                <span className={isProcessing ? 'text-red-500' : 'text-emerald-500'}>
                    SYS: {isProcessing ? 'RENDERING...' : 'ONLINE'}
                </span>
            </div>
        </div>

        {/* 预览区域容器 */}
        <div className="relative group border border-zinc-800 bg-zinc-950/50 p-2 backdrop-blur-sm transition-colors hover:border-zinc-700">
          {/* 装饰角标 */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-500/50 z-20"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zinc-500/50 z-20"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zinc-500/50 z-20"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-500/50 z-20"></div>

          <div 
            ref={containerRef}
            className="w-full aspect-video relative overflow-hidden bg-zinc-900"
          >
            {/* 实际渲染节点 */}
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
              {/* 背景层 */}
              {config.bgType === 'image' && config.bgImage && (
                <img 
                  src={config.bgImage}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    filter: `blur(${config.blur}px) brightness(${config.brightness}%)`,
                    transform: 'scale(1.02)'
                  }}
                  alt="bg"
                />
              )}
              
              {/* 遮罩纹理 */}
              <div className="absolute inset-0 bg-black/20 pointer-events-none" 
                   style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))', backgroundSize: '100% 2px, 3px 100%' }}></div>

              {/* 装饰层 (仿照 Refac7 风格) */}
              {config.showDecorations && (
                <>
                  <div className="absolute top-12 right-12 flex flex-col items-end opacity-40 mix-blend-overlay">
                     <span className="text-8xl font-black tracking-tighter leading-none" style={{ color: config.textColor, opacity: 0.1 }}>RX</span>
                     <span className="text-sm font-mono tracking-[1em] mt-2 border-t border-current pt-2" style={{ color: config.themeColor }}>SYS.01</span>
                  </div>
                  
                  <div className="absolute left-12 top-0 bottom-0 w-px bg-white/10 flex flex-col justify-between py-12">
                     <div className="w-px h-20 bg-current" style={{ color: config.themeColor }}></div>
                     <div className="font-mono text-[10px] -rotate-90 tracking-widest opacity-50 text-white whitespace-nowrap origin-center">
                        IDENTITY_CORE // V.1.6
                     </div>
                     <div className="w-px h-20 bg-white/30"></div>
                  </div>
                </>
              )}

              {/* 文字内容层 */}
              <div className={`relative z-10 w-full h-full p-24 pl-32 flex flex-col gap-4 ${ALIGNMENTS[config.alignment]}`}>
                
                {/* 装饰性 Tag */}
                <div className="mb-2">
                   <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] px-2 py-1 bg-white/10 backdrop-blur-md border-l-2" style={{ borderColor: config.themeColor, color: config.themeColor }}>
                     :: Identify Log
                   </span>
                </div>

                <h1 
                  className="font-black leading-[0.9] tracking-tighter drop-shadow-2xl wrap-break-word max-w-full"
                  style={{ 
                    color: config.textColor,
                    fontFamily: config.fontFamily,
                    fontSize: `${config.fontSize}px`
                  }}
                >
                  {config.title}
                  <span className="text-transparent" style={{ WebkitTextStroke: `2px ${config.themeColor}`, opacity: 0.5 }}>.</span>
                </h1>
                
                <p 
                  className="text-2xl font-light tracking-wide opacity-80 mt-4 max-w-4xl border-l border-white/20 pl-6"
                  style={{ color: config.textColor }}
                >
                  {config.subtitle}
                </p>

                {/* 底部功能条 */}
                {config.showDecorations && (
                  <div className="absolute bottom-12 right-12 left-32 flex items-center gap-4 border-t border-white/10 pt-4">
                     <div className="flex-1 font-mono text-xs text-white/40 tracking-widest uppercase">
                        Target: Transparency, Clarity, Reality.
                     </div>
                     <div className="flex gap-2">
                        {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-white/20"></div>)}
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- 右侧：控制台 (风格化) --- */}
      <div className="flex-1 xl:max-w-md flex flex-col gap-6">
        
        <div className="bg-zinc-900/40 border border-zinc-800 p-6 backdrop-blur-sm relative overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-6xl text-zinc-700 pointer-events-none select-none">SET</div>

          <div className="space-y-8 overflow-y-auto max-h-[70vh] custom-scrollbar pr-2">
            
            <Section label="Input_Data">
              <Input 
                value={config.title} 
                onChange={(e) => updateConfig('title', e.target.value)} 
                placeholder="MAIN HEADING"
              />
              <Input 
                value={config.subtitle} 
                onChange={(e) => updateConfig('subtitle', e.target.value)} 
                placeholder="SUBTITLE / META"
              />
            </Section>

            <Section label="Typography">
              <div className="flex flex-col gap-3">
                 <div className="flex gap-2">
                    <select 
                      className="flex-1 bg-black/50 border-b border-zinc-700 p-2 text-xs text-zinc-300 focus:border-red-500 focus:outline-none transition-colors appearance-none rounded-none"
                      value={config.fontFamily}
                      onChange={(e) => updateConfig('fontFamily', e.target.value)}
                    >
                      {PRESET_FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                      {customFontName && <option value={customFontName}>* Uploaded Font</option>}
                    </select>
                    
                    <label className="cursor-pointer px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono border border-zinc-700 transition-colors flex items-center justify-center">
                      UPLOAD .TTF
                      <input type="file" accept=".ttf,.otf,.woff" onChange={handleFontUpload} className="hidden" />
                    </label>
                 </div>

                 {/* Alignment Grid */}
                 <div className="grid grid-cols-3 gap-1 w-32 border border-zinc-800 p-1 bg-black/20">
                    {Object.keys(ALIGNMENTS).map(align => (
                      <button 
                        key={align}
                        onClick={() => updateConfig('alignment', align)}
                        className={`w-full aspect-square transition-all ${config.alignment === align ? 'bg-red-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
                      />
                    ))}
                 </div>
                 
                 <RangeControl label="SIZE (PX)" value={config.fontSize} min={40} max={250} onChange={(e) => updateConfig('fontSize', e.target.value)} />
              </div>
            </Section>

            <Section label="Visual_Layers">
              <div className="flex gap-4 mb-4 text-[10px] font-mono tracking-widest">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-3 h-3 border ${config.bgType === 'color' ? 'bg-red-500 border-red-500' : 'border-zinc-500'}`}></div>
                  <input type="radio" checked={config.bgType === 'color'} onChange={() => updateConfig('bgType', 'color')} className="hidden" />
                  <span className="group-hover:text-white transition-colors">SOLID</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-3 h-3 border ${config.bgType === 'image' ? 'bg-red-500 border-red-500' : 'border-zinc-500'}`}></div>
                  <input type="radio" checked={config.bgType === 'image'} onChange={() => updateConfig('bgType', 'image')} className="hidden" />
                  <span className="group-hover:text-white transition-colors">IMAGE</span>
                </label>
                 <label className="flex items-center gap-2 cursor-pointer group ml-auto">
                  <div className={`w-3 h-3 border ${config.showDecorations ? 'bg-emerald-500 border-emerald-500' : 'border-zinc-500'}`}></div>
                  <input type="checkbox" checked={config.showDecorations} onChange={(e) => updateConfig('showDecorations', e.target.checked)} className="hidden" />
                  <span className="group-hover:text-white transition-colors">DECO</span>
                </label>
              </div>

              {config.bgType === 'color' ? (
                 <ColorPicker label="BACKGROUND" value={config.bgColor} onChange={(v) => updateConfig('bgColor', v)} />
              ) : (
                <div className="space-y-4">
                   <label className="block w-full py-8 border border-dashed border-zinc-700 hover:border-red-500 hover:bg-red-500/5 text-center cursor-pointer transition-all group">
                      <span className="text-xs font-mono text-zinc-500 group-hover:text-red-500">:: UPLOAD SOURCE ::</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                   </label>
                   <RangeControl label="BLUR" value={config.blur} min={0} max={20} onChange={(e) => updateConfig('blur', e.target.value)} />
                   <RangeControl label="BRIGHTNESS" value={config.brightness} min={0} max={200} onChange={(e) => updateConfig('brightness', e.target.value)} />
                </div>
              )}
            </Section>

            <Section label="Palette">
               <ColorPicker label="PRIMARY ACCENT" value={config.themeColor} onChange={(v) => updateConfig('themeColor', v)} />
               <ColorPicker label="TEXT COLOR" value={config.textColor} onChange={(v) => updateConfig('textColor', v)} />
            </Section>

          </div>
        </div>

        {/* 底部下载按钮 */}
        <button 
          onClick={handleDownload}
          disabled={isProcessing}
          className="group relative w-full py-4 bg-zinc-900 border border-zinc-700 hover:border-red-500/50 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-red-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          <span className="relative z-10 font-mono font-bold text-sm tracking-[0.3em] flex items-center justify-center gap-3">
             {isProcessing ? 'PROCESSING_SEQUENCE...' : 'EXECUTE_DOWNLOAD'}
             {!isProcessing && <span className="text-red-500 group-hover:translate-x-1 transition-transform">→</span>}
          </span>
        </button>

      </div>
    </div>
  );
}

// --- 子组件 ---

const Section = ({ label, children }) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2 text-red-500/80 mb-1">
       <span className="w-1 h-1 bg-current"></span>
       <label className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
         {label}
       </label>
       <div className="h-px bg-zinc-800 flex-1 ml-2"></div>
    </div>
    {children}
  </div>
);

const Input = (props) => (
  <textarea 
    {...props}
    rows={2}
    className="w-full bg-black/20 border-b border-zinc-700 p-3 text-zinc-200 focus:outline-none focus:border-red-500 focus:bg-zinc-900/50 resize-none text-sm font-sans placeholder-zinc-700 transition-all rounded-none"
  />
);

const RangeControl = ({ label, value, min, max, onChange }) => (
  <div className="group">
    <div className="flex justify-between text-[9px] text-zinc-500 font-mono mb-1 tracking-wider uppercase">
      <span className="group-hover:text-red-500 transition-colors">{label}</span>
      <span>{value}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} onChange={onChange}
      className="w-full h-px bg-zinc-700 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-zinc-400 [&::-webkit-slider-thumb]:hover:bg-red-500 transition-all"
    />
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between bg-black/20 p-2 border border-zinc-800 hover:border-zinc-600 transition-colors">
    <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-zinc-600">{value}</span>
      <input 
        type="color" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="h-5 w-5 bg-transparent cursor-pointer border-none p-0" 
      />
    </div>
  </div>
);