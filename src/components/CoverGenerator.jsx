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
    title: 'Refac7.Logs',
    subtitle: 'Architect of the Digital Void.',
    bgType: 'color', 
    bgColor: '#18181b', // zinc-950
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

  // --- 逻辑处理 ---
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        // 增加一点内边距的缓冲
        const containerWidth = containerRef.current.offsetWidth;
        setScale((containerWidth) / BASE_WIDTH);
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

  // --- UI 组件 ---
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans selection:bg-red-500/20">
      
      <div className="max-w-350 mx-auto px-6 py-12">

        {/* 顶部标题区域：回归清爽的排版 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    <span className="font-mono text-xs text-zinc-500 tracking-[0.2em] uppercase">System :: Generator</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Cover<span className="text-zinc-400 dark:text-zinc-600">Forge</span>.
                </h1>
            </div>
            
            {/* 状态指示器 - 更加隐形 */}
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 border-l border-zinc-200 dark:border-zinc-800 pl-4">
                <span>Output: PNG/1280p</span>
                <span className="opacity-30">|</span>
                <span className={isProcessing ? "text-amber-500 animate-pulse" : "text-emerald-500"}>
                    {isProcessing ? 'RENDERING...' : 'READY'}
                </span>
            </div>
        </div>
    
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* 左侧：预览区域 (占比更大，边框更淡) */}
            <div className="lg:col-span-8 sticky top-0 bg-zinc-50 dark:bg-zinc-950 z-10">
                <div className="flex justify-between items-center mt-8 lg:mt-0 mb-4 px-1">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
                        Canvas_Preview
                    </span>
                    <span className="font-mono text-[10px] text-zinc-300 dark:text-zinc-700">
                         {BASE_WIDTH} x {BASE_HEIGHT}
                    </span>
                </div>

                {/* 容器：去掉粗边框，改用极其微妙的阴影和细线 */}
                <div className="relative group rounded-sm ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-2 transition-all duration-500 hover:shadow-md">
                    
                    {/* 预览视窗 */}
                    <div ref={containerRef} className="overflow-hidden w-full relative bg-zinc-100 dark:bg-black/40" style={{ aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}` }}>
                        {/* 透明背景格 */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                        </div>

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
                            {/* 1. 背景层 */}
                            {config.bgType === 'image' && config.bgImage && (
                                <img 
                                    src={config.bgImage}
                                    className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                                    style={{ filter: `blur(${config.blur}px) brightness(${config.brightness}%)` }}
                                    alt="bg"
                                />
                            )}
                            
                            {/* 2. 装饰层 (HUD) - 回归极简线条 */}
                            {config.showDecorations && (
                                <div className="absolute inset-0 pointer-events-none p-16">
                                    <div className="w-full h-full border-l border-white/20 relative flex flex-col justify-between">
                                        {/* 顶部装饰 */}
                                        <div className="flex items-center gap-4 pl-6 pt-2">
                                            <span className="font-mono text-xs text-white/50 tracking-widest">LOG.REFAC7</span>
                                            <div className="h-px w-16 bg-white/20"></div>
                                        </div>

                                        {/* 底部装饰 */}
                                        <div className="pl-6 pb-2">
                                            <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase block">
                                                Digital Architecture // V.1.0
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* 右上角锚点 */}
                                    <div className="absolute top-16 right-16 w-4 h-4 border-t border-r border-white/30"></div>
                                </div>
                            )}

                            {/* 3. 内容层 */}
                            <div className={`relative z-10 w-full h-full p-24 flex flex-col gap-8 ${ALIGNMENTS[config.alignment]}`}>
                                <h1 
                                    className="font-bold leading-[0.9] tracking-tighter mix-blend-difference whitespace-pre-wrap max-w-[85%]"
                                    style={{ 
                                        color: config.textColor,
                                        fontFamily: config.fontFamily,
                                        fontSize: `${config.fontSize}px`
                                    }}
                                >
                                    {config.title}
                                    <span style={{ color: config.themeColor }}>.</span>
                                </h1>

                                <div className="max-w-3xl backdrop-blur-sm">
                                    <p 
                                        className="text-4xl font-light tracking-wide opacity-90 leading-tight mix-blend-difference pl-1"
                                        style={{ color: config.textColor }}
                                    >
                                        {config.subtitle}
                                    </p>
                                    {/* 装饰性下划线 */}
                                    <div className="mt-6 h-1 w-24 bg-current opacity-80" style={{ color: config.themeColor }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧：控制台 (更加清爽的表单风格) */}
            <div className="lg:col-span-4 flex flex-col gap-10">
                
                {/* 文字设定 */}
                <section>
                    <SectionTitle number="01" title="Content_Data" />
                    <div className="space-y-6 pt-2">
                        <MinimalInput 
                            label="Heading" 
                            value={config.title} 
                            onChange={(e) => updateConfig('title', e.target.value)} 
                        />
                        <MinimalInput 
                            label="Sub_Heading" 
                            value={config.subtitle} 
                            onChange={(e) => updateConfig('subtitle', e.target.value)} 
                            isTextarea
                        />
                    </div>
                </section>

                {/* 样式设定 */}
                <section>
                    <SectionTitle number="02" title="Visual_Style" />
                    <div className="space-y-6 pt-2">
                        
                        {/* 背景模式切换 */}
                        <div className="flex gap-6 text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <span className={`w-3 h-3 rounded-full border ${config.bgType === 'color' ? 'bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white' : 'border-zinc-300'}`}></span>
                                <input type="radio" checked={config.bgType === 'color'} onChange={() => updateConfig('bgType', 'color')} className="hidden" />
                                <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">Solid Color</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <span className={`w-3 h-3 rounded-full border ${config.bgType === 'image' ? 'bg-zinc-900 border-zinc-900 dark:bg-white dark:border-white' : 'border-zinc-300'}`}></span>
                                <input type="radio" checked={config.bgType === 'image'} onChange={() => updateConfig('bgType', 'image')} className="hidden" />
                                <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">Image Overlay</span>
                            </label>
                        </div>

                        {/* 图片控制 */}
                        {config.bgType === 'image' && (
                            <div className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-sm space-y-4 animate-in fade-in slide-in-from-top-1">
                                <label className="block text-xs font-mono text-center border border-dashed border-zinc-300 dark:border-zinc-700 py-3 cursor-pointer hover:border-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-all text-zinc-500">
                                    [ Click to Upload Image ]
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                <div className="space-y-3">
                                    <RangeSlider label="Blur" value={config.blur} min={0} max={20} onChange={(v) => updateConfig('blur', v)} />
                                    <RangeSlider label="Dim" value={config.brightness} min={0} max={200} onChange={(v) => updateConfig('brightness', v)} />
                                </div>
                            </div>
                        )}

                        {/* 颜色与字体 */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <ColorDot label="Accent" value={config.themeColor} onChange={(v) => updateConfig('themeColor', v)} />
                                <ColorDot label="Text" value={config.textColor} onChange={(v) => updateConfig('textColor', v)} />
                                {config.bgType === 'color' && (
                                     <ColorDot label="Background" value={config.bgColor} onChange={(v) => updateConfig('bgColor', v)} />
                                )}
                            </div>
                            <div className="flex flex-col justify-between">
                                <div className="relative border-b border-zinc-200 dark:border-zinc-800">
                                    <select 
                                        value={config.fontFamily}
                                        onChange={(e) => updateConfig('fontFamily', e.target.value)}
                                        className="w-full bg-transparent py-1 text-xs font-mono appearance-none focus:outline-none cursor-pointer text-zinc-600 dark:text-zinc-400"
                                    >
                                        {PRESET_FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                                        {customFontName && <option value={customFontName}>Custom</option>}
                                    </select>
                                </div>
                                
                                {/* 对齐矩阵 */}
                                <div className="mt-4">
                                    <label className="text-[9px] font-mono text-zinc-400 uppercase mb-2 block">Alignment</label>
                                    <div className="grid grid-cols-3 gap-1 w-16">
                                        {Object.keys(ALIGNMENTS).map(a => (
                                            <button 
                                                key={a}
                                                onClick={() => updateConfig('alignment', a)}
                                                className={`w-full aspect-square rounded-[1px] transition-colors ${config.alignment === a ? 'bg-zinc-800 dark:bg-zinc-200' : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 装饰开关 */}
                        <div className="flex items-center justify-between pt-2">
                             <span className="text-xs font-mono text-zinc-500">HUD Elements</span>
                             <button 
                                onClick={() => updateConfig('showDecorations', !config.showDecorations)}
                                className={`w-10 h-5 rounded-full flex items-center px-1 transition-colors ${config.showDecorations ? 'bg-zinc-800' : 'bg-zinc-200'}`}
                             >
                                 <span className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${config.showDecorations ? 'translate-x-5' : 'translate-x-0'}`}></span>
                             </button>
                        </div>

                    </div>
                </section>

                {/* 操作按钮 */}
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-auto">
                    <button 
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className="w-full group relative overflow-hidden bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 py-4 px-6 transition-all hover:bg-red-600 dark:hover:bg-red-500 hover:text-white"
                    >
                        <span className="relative z-0 font-mono font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3">
                            {isProcessing ? 'Generating...' : 'Download_Image'}
                            <span className="icon-[ph--download-simple] size-4"></span>
                        </span>
                    </button>
                    <p className="text-center text-[10px] text-zinc-400 mt-3 font-mono">
                        Generated content is rendered client-side.
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}

// --- 纯净风格子组件 ---

const SectionTitle = ({ number, title }) => (
    <div className="flex items-baseline gap-2 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
        <span className="text-xs font-mono text-red-500 font-bold">{number}</span>
        <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">{title}</span>
    </div>
);

const MinimalInput = ({ label, value, onChange, isTextarea }) => (
    <div className="group">
        <label className="block text-[10px] font-mono text-zinc-400 uppercase mb-1.5 transition-colors group-focus-within:text-red-500">{label}</label>
        {isTextarea ? (
             <textarea 
                value={value}
                onChange={onChange}
                rows={2}
                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-red-500 transition-colors resize-none placeholder-zinc-300"
            />
        ) : (
            <input 
                type="text" 
                value={value}
                onChange={onChange}
                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-700 py-1 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-red-500 transition-colors placeholder-zinc-300"
            />
        )}
    </div>
);

const ColorDot = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between group cursor-pointer">
        <span className="text-[10px] font-mono text-zinc-400 uppercase group-hover:text-zinc-600">{label}</span>
        <div className="relative w-5 h-5 rounded-full border border-zinc-200 overflow-hidden shadow-sm">
             <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" />
             <div className="w-full h-full" style={{ backgroundColor: value }}></div>
        </div>
    </div>
);

const RangeSlider = ({ label, value, min, max, onChange }) => (
    <div className="flex items-center gap-3">
        <span className="text-[9px] font-mono text-zinc-400 w-8">{label}</span>
        <input 
            type="range" min={min} max={max} value={value} 
            onChange={(e) => onChange(e.target.value)} 
            className="flex-1 h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-zinc-900 [&::-webkit-slider-thumb]:rounded-full"
        />
    </div>
);