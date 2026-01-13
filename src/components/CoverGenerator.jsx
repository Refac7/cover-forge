import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';

// 预设字体选项
const PRESET_FONTS = [
  { name: 'System Sans', value: 'sans-serif' },
  { name: 'System Mono', value: 'monospace' },
  { name: 'Serif', value: 'serif' },
  { name: 'Impact', value: 'Impact' },
  { name: 'Arial Black', value: '"Arial Black"' },
];

// 九宫格对齐映射
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

// 设定画布的标准渲染宽度，保证所有设备上排版一致
// 1280x720 是一个清晰度足够且性能平衡的基准
const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export default function CoverGenerator() {
  // --- 状态管理 ---
  const [config, setConfig] = useState({
    title: 'COVER FORGE',
    subtitle: 'ARTICLE IMAGE GENERATOR // V1.0',
    bgType: 'color', 
    bgColor: '#111111',
    bgImage: null,
    themeColor: '#b90000',
    textColor: '#ffffff',
    fontFamily: 'sans-serif',
    alignment: 'bottom-left',
    blur: 0,
    brightness: 100,
    fontSize: 80, // 调大基准字体以适应 BASE_WIDTH
  });

  const [customFontName, setCustomFontName] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scale, setScale] = useState(1); // 用于缩放预览区
  
  const previewRef = useRef(null); // 实际要导出的节点
  const containerRef = useRef(null); // 用于计算屏幕宽度的容器

  // --- 监听窗口变化计算缩放比例 ---
  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 计算当前容器宽度与基准宽度的比例
        const newScale = containerWidth / BASE_WIDTH;
        setScale(newScale);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  const updateConfig = (key, value) => setConfig(prev => ({ ...prev, [key]: value }));

  // 图片上传
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => updateConfig('bgImage', e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // 字体上传
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
        alert("字体加载失败，请确保是有效的 .ttf/.otf 文件");
      }
    }
  };

  // 辅助函数：将滤镜效果“烘焙”到 Canvas 上生成新的图片 URL
  const processImageWithFilters = (imgSrc, blur, brightness) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // 使用 Canvas Context 滤镜（html2canvas 不支持 CSS 滤镜，但支持 Canvas 内容）
        // 注意：brightness 在 CSS 中是 %, Canvas filter 字符串中通常直接支持
        ctx.filter = `blur(${blur * 2}px) brightness(${brightness}%)`;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imgSrc;
    });
  };

  // 导出图片
  const handleDownload = async () => {
    if (!previewRef.current) return;
    setIsProcessing(true);

    // 原始状态备份
    const originalBgImage = config.bgImage;
    const originalBlur = config.blur;
    const originalBrightness = config.brightness;

    try {
      // 1. 如果有背景图且应用了滤镜，先在内存中生成一张处理好的图片
      if (config.bgType === 'image' && config.bgImage && (config.blur > 0 || config.brightness !== 100)) {
        // 临时生成带滤镜的图
        const processedImage = await processImageWithFilters(config.bgImage, config.blur, config.brightness);
        
        // 2. 临时更新状态：使用处理好的图，并移除 CSS 滤镜（防止双重滤镜）
        updateConfig('bgImage', processedImage);
        updateConfig('blur', 0);
        updateConfig('brightness', 100);
        
        // 等待 React 渲染更新
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 3. 执行截图
      const canvas = await html2canvas(previewRef.current, {
        scale: 1.5, // 已经在高分辨率基准上渲染，稍微放大即可
        useCORS: true,
        allowTaint: true,
        backgroundColor: config.bgColor,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `cover-forge-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

    } catch (err) {
      console.error(err);
      alert("生成失败");
    } finally {
      // 4. 恢复原始状态
      updateConfig('bgImage', originalBgImage);
      updateConfig('blur', originalBlur);
      updateConfig('brightness', originalBrightness);
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl mx-auto p-4 z-10 relative">
      
      {/* --- 左侧：预览视窗 --- */}
      <div className="flex-1 flex flex-col gap-4 min-w-0"> {/* min-w-0 防止 flex 子项溢出 */}
        <div className="relative border-2 border-ind-gray bg-ind-dark p-1 transition-all">
          
          {/* UI 装饰元素 */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-ind-red z-20"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-ind-light z-20"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-ind-light z-20"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-ind-red z-20"></div>
          <div className="absolute top-4 left-4 text-[10px] bg-ind-red text-white px-1 font-bold z-20 font-mono tracking-widest">
            VIEWPORT_01 // PREVIEW
          </div>

          <div 
            ref={containerRef}
            className="w-full aspect-video relative overflow-hidden bg-black/50"
          >
            <div 
              ref={previewRef}
              style={{
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
                backgroundColor: config.bgColor,
                // 关键 CSS：将大画布缩小至容器大小，左上角对齐
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
              className="absolute top-0 left-0 flex select-none overflow-hidden"
            >
              {/* 背景层：使用 img 标签代替 div background，html2canvas 兼容性更好 */}
              {config.bgType === 'image' && config.bgImage && (
                <img 
                  src={config.bgImage}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ 
                    // 仅在预览时应用 CSS 滤镜，导出时会被 temporary state 移除
                    filter: `blur(${config.blur}px) brightness(${config.brightness}%)`,
                    transform: 'scale(1.05)' // 防止 blur 导致的边缘白边
                  }}
                  alt="bg"
                />
              )}
              
              {/* 遮罩层 */}
              <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

              {/* 文字内容层 */}
              <div className={`relative z-10 w-full h-full p-20 flex flex-col gap-6 ${ALIGNMENTS[config.alignment]}`}>
                <div style={{ color: config.themeColor }} className="w-20 h-2 bg-current mb-4"></div>
                
                <h1 
                  className="font-black uppercase leading-none tracking-tighter drop-shadow-xl wrap-break-word max-w-full"
                  style={{ 
                    color: config.textColor,
                    fontFamily: config.fontFamily,
                    fontSize: `${config.fontSize}px` // 现在的 px 是相对于 1280 宽度的，不再受屏幕宽度影响
                  }}
                >
                  {config.title}
                </h1>
                
                <p 
                  className="text-3xl font-mono px-4 py-2 bg-black/60 backdrop-blur-sm border-l-4 inline-block mt-2"
                  style={{ 
                    color: config.themeColor,
                    borderColor: config.themeColor 
                  }}
                >
                  {config.subtitle}
                </p>
              </div>

              {/* 画布内装饰水印 */}
              <div className="absolute bottom-6 right-6 text-xl text-white/30 font-mono border border-white/10 px-3 py-1">
                GENERATED_BY_COVER_FORGE
              </div>
            </div>
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className="flex justify-between font-mono text-xs text-gray-500">
           <span>RENDER_BASE: {BASE_WIDTH}x{BASE_HEIGHT} px</span>
           <span className={isProcessing ? "text-ind-red animate-pulse" : "text-green-600"}>
             STATUS: {isProcessing ? 'PROCESSING...' : 'READY'}
           </span>
        </div>
      </div>

      {/* --- 右侧：控制台 --- */}
      <div className="flex-1 lg:max-w-md flex flex-col gap-6 bg-ind-dark/90 p-6 border-l-4 border-ind-red backdrop-blur-sm shadow-2xl">
        <div>
          <h1 className="text-4xl font-bold uppercase tracking-tighter text-white">Cover<span className="text-ind-red">Forge</span></h1>
          <div className="flex items-center gap-2 mt-2 text-gray-500 text-xs font-mono">
            <span className="w-2 h-2 bg-green-500 inline-block animate-pulse rounded-full"></span>
            SYSTEM ONLINE // V1.0 FIXED
          </div>
        </div>

        {/* 滚动配置区 */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar lg:max-h-[60vh]">
          
          <Section label="TEXT_INPUT">
            <Input 
              value={config.title} 
              onChange={(e) => updateConfig('title', e.target.value)} 
              placeholder="MAIN HEADING"
            />
            <Input 
              value={config.subtitle} 
              onChange={(e) => updateConfig('subtitle', e.target.value)} 
              placeholder="SUBTITLE / META INFO"
            />
          </Section>

          <Section label="TYPOGRAPHY">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <select 
                className="bg-black border border-ind-gray text-ind-light p-3 text-xs focus:border-ind-red outline-none"
                value={config.fontFamily}
                onChange={(e) => updateConfig('fontFamily', e.target.value)}
              >
                {PRESET_FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                {customFontName && <option value={customFontName}>* Uploaded Font</option>}
              </select>
              
              <label className="cursor-pointer bg-ind-gray/20 border border-dashed border-ind-gray hover:border-ind-red text-gray-400 text-[10px] flex flex-col items-center justify-center hover:text-ind-red transition-all">
                <span className="font-bold">UPLOAD .TTF</span>
                <input type="file" accept=".ttf,.otf,.woff" onChange={handleFontUpload} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-1 w-24 mb-2">
               {Object.keys(ALIGNMENTS).map(align => (
                 <button 
                   key={align}
                   onClick={() => updateConfig('alignment', align)}
                   className={`w-full aspect-square border ${config.alignment === align ? 'bg-ind-red border-ind-red' : 'bg-black border-ind-gray hover:border-ind-light'}`}
                   title={align}
                 />
               ))}
            </div>

            <RangeControl label="FONT SIZE" value={config.fontSize} min={40} max={200} onChange={(e) => updateConfig('fontSize', e.target.value)} />
          </Section>

          <Section label="BACKGROUND_LAYER">
            <div className="flex gap-2 mb-3">
              <TabButton active={config.bgType === 'color'} onClick={() => updateConfig('bgType', 'color')}>SOLID COLOR</TabButton>
              <TabButton active={config.bgType === 'image'} onClick={() => updateConfig('bgType', 'image')}>IMAGE FILE</TabButton>
            </div>

            {config.bgType === 'color' ? (
              <div className="flex items-center gap-3 bg-black border border-ind-gray p-2">
                <input type="color" value={config.bgColor} onChange={(e) => updateConfig('bgColor', e.target.value)} className="h-8 w-8 bg-transparent cursor-pointer" />
                <span className="font-mono text-xs text-gray-400">{config.bgColor.toUpperCase()}</span>
              </div>
            ) : (
              <label className="w-full h-24 cursor-pointer bg-black border-2 border-dashed border-ind-gray text-gray-500 hover:border-ind-red hover:text-ind-red transition-all flex flex-col items-center justify-center gap-1 group">
                <span className="text-xs font-bold tracking-widest group-hover:underline">SELECT IMAGE SOURCE</span>
                <span className="text-[10px] opacity-50">JPG / PNG / WEBP</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}

            {config.bgType === 'image' && (
              <div className="space-y-3 mt-3">
                <RangeControl label="BLUR (PX)" value={config.blur} min={0} max={20} onChange={(e) => updateConfig('blur', e.target.value)} />
                <RangeControl label="BRIGHTNESS (%)" value={config.brightness} min={0} max={200} onChange={(e) => updateConfig('brightness', e.target.value)} />
              </div>
            )}
          </Section>

          <Section label="THEME_ACCENT">
             <div className="flex justify-between items-center bg-black p-2 border border-ind-gray">
                <span className="text-xs text-gray-400 font-mono">PRIMARY_COLOR</span>
                <input type="color" value={config.themeColor} onChange={(e) => updateConfig('themeColor', e.target.value)} className="h-6 w-6 bg-transparent cursor-pointer" />
             </div>
             <div className="flex justify-between items-center bg-black p-2 border border-ind-gray mt-2">
                <span className="text-xs text-gray-400 font-mono">TEXT_COLOR</span>
                <input type="color" value={config.textColor} onChange={(e) => updateConfig('textColor', e.target.value)} className="h-6 w-6 bg-transparent cursor-pointer" />
             </div>
          </Section>

        </div>

        <button 
          onClick={handleDownload}
          disabled={isProcessing}
          className="relative w-full py-4 bg-transparent border-2 border-ind-light text-ind-light hover:bg-ind-light hover:text-black transition-all group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="absolute inset-0 w-0 bg-ind-light transition-all duration-250 ease-out group-hover:w-full opacity-10"></span>
          <span className="relative font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2">
            {isProcessing ? 'RENDERING...' : 'DOWNLOAD .PNG'}
          </span>
        </button>
      </div>
    </div>
  );
}

// --- 子组件保持不变 ---

const Section = ({ label, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-ind-red text-[10px] font-bold uppercase tracking-widest flex justify-between border-b border-ind-gray/50 pb-1">
      <span>{label}</span>
      <span className="opacity-30">///</span>
    </label>
    {children}
  </div>
);

const Input = (props) => (
  <textarea 
    {...props}
    rows={2}
    className="w-full bg-black border border-ind-gray p-3 text-ind-light focus:outline-none focus:border-ind-red focus:shadow-[0_0_10px_rgba(255,31,31,0.2)] resize-none text-sm font-sans placeholder-gray-700 transition-all"
  />
);

const TabButton = ({ active, children, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex-1 py-2 text-[10px] font-bold tracking-wider transition-all border ${
      active ? 'bg-ind-light text-black border-ind-light' : 'bg-transparent text-gray-500 border-ind-gray hover:text-white'
    }`}
  >
    {children}
  </button>
);

const RangeControl = ({ label, value, min, max, onChange }) => (
  <div>
    <div className="flex justify-between text-[10px] text-gray-500 font-mono mb-1">
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <input 
      type="range" min={min} max={max} value={value} onChange={onChange}
      className="w-full h-1 bg-ind-gray appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-ind-red [&::-webkit-slider-thumb]:hover:scale-125 transition-all"
    />
  </div>
);