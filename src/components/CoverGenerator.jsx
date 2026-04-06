import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas-pro';

// --- 常量配置 ---
const PRESET_FONTS = [
    { name: 'System Sans', value: 'system-ui, sans-serif' },
    { name: 'System Mono', value: 'ui-monospace, monospace' },
    { name: 'Serif', value: 'Georgia, serif' },
    { name: 'Impact', value: 'Impact, sans-serif' },
    { name: 'Arial Black', value: '"Arial Black", sans-serif' },
];

const ALIGNMENTS = {
    'top-left': 'justify-start items-start text-left',
    'top-center': 'justify-start items-center text-center',
    'top-right': 'justify-start items-end text-right',
    'center-left': 'justify-center items-start text-left',
    'center': 'justify-center items-center text-center',
    'center-right': 'justify-center items-end text-right',
    'bottom-left': 'justify-end items-start text-left',
    'bottom-center': 'justify-end items-center text-center',
    'bottom-right': 'justify-end items-end text-right',
};

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

// --- 主组件 ---
export default function CoverGenerator() {
    // 默认提供一组干净、高对比度的默认值
    const [config, setConfig] = useState({
        title: 'Modern Architecture',
        subtitle: 'Principles of minimalist design in the digital workspace.',
        bgType: 'color',
        bgColor: '#000000',
        bgImage: null,
        themeColor: '#09090b',
        textColor: '#ffffff',
        fontFamily: 'system-ui, sans-serif',
        alignment: 'center',
        blur: 0,
        brightness: 100,
        fontSize: 80,
        showDecorations: false,
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
            link.download = `Cover_${Date.now()}.png`;
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
        <div className="relative font-sans flex flex-col lg:flex-row min-h-screen text-foreground bg-background">

            {/* ================= LEFT PANE (Sidebar) ================= */}
            <aside className="w-full lg:w-90 xl:w-100 lg:sticky lg:top-0 lg:h-screen flex flex-col border-b lg:border-b-0 lg:border-r border-(--border) z-20 bg-background">

                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

                    {/* Header */}
                    <div className="p-8 pb-4 shrink-0 border-b border-(--border)">
                        <div className="flex items-center gap-3 mb-6 text-sm font-medium">
                            <div className="w-5 h-5 bg-foreground text-background flex items-center justify-center font-bold text-[10px]">C</div>
                            <span>Cover Generator</span>
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                            Create Canvas
                        </h1>
                        <p className="text-sm text-(--muted-foreground) leading-relaxed">
                            Configure layout, typography, and styling to generate high-quality visual assets.
                        </p>
                    </div>

                    {/* Quick Info */}
                    <div className="p-8 space-y-4">
                        <div className="flex items-center justify-between text-sm border-b border-(--border)">
                            <span className="text-(--muted-foreground)">Dimensions</span>
                            <span className="font-mono text-foreground">{BASE_WIDTH} × {BASE_HEIGHT} px</span>
                        </div>
                        <div className="flex items-center justify-between text-sm border-b border-(--border) pb-3">
                            <span className="text-(--muted-foreground)">Status</span>
                            <span className="flex items-center gap-2">
                                <span className={`w-2 h-2 ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-green-500'}`}></span>
                                {isProcessing ? 'Rendering...' : 'Ready'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Docked Action Area */}
                <div className="shrink-0 p-6 border-t border-(--border) bg-(--muted)">
                    <button
                        onClick={handleDownload}
                        disabled={isProcessing}
                        className={`w-full py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${isProcessing
                                ? 'bg-(--border) text-(--muted-foreground) cursor-not-allowed'
                                : 'bg-foreground text-(--primary-background) hover:opacity-90'
                            }`}
                    >
                        {isProcessing ? 'Processing...' : 'Export High-Res'}
                        {!isProcessing && <span>→</span>}
                    </button>
                </div>
            </aside>

            {/* ================= RIGHT PANE (Main Area) ================= */}
            <main className="flex-1 z-10 flex flex-col min-h-screen bg-(--muted)">
                <div className="p-6 lg:p-12 xl:p-16 flex-1 flex flex-col gap-12 max-w-6xl mx-auto w-full">

                    {/* 1. Canvas Preview */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold tracking-tight text-foreground">Preview</h2>
                        </div>

                        <div className="relative bg-background border border-(--border) p-4 sm:p-8" ref={containerRef}>
                            {/* Wrapper holding aspect ratio */}
                            <div className="relative overflow-hidden border border-(--border) bg-white shadow-sm" style={{ aspectRatio: `${BASE_WIDTH}/${BASE_HEIGHT}` }}>

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
                                    {/* Layer 1: Background Image */}
                                    {config.bgType === 'image' && config.bgImage && (
                                        <img
                                            src={config.bgImage}
                                            className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                                            style={{ filter: `blur(${config.blur}px) brightness(${config.brightness}%)` }}
                                            alt="bg"
                                        />
                                    )}

                                    {/* Layer 2: Minimal Decorations (不再是黑客风，而是排版标尺) */}
                                    {config.showDecorations && (
                                        <div className="absolute inset-0 pointer-events-none p-16 z-0 flex flex-col justify-between">
                                            <div className="w-full flex justify-between items-start">
                                                <div className="w-16 h-px" style={{ backgroundColor: config.themeColor, opacity: 0.5 }}></div>
                                                <span className="font-mono text-xs uppercase tracking-widest" style={{ color: config.textColor, opacity: 0.3 }}>Fig.01</span>
                                            </div>
                                            <div className="w-full flex justify-between items-end">
                                                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: config.textColor, opacity: 0.3 }}>Index / {new Date().getFullYear()}</span>
                                                <div className="w-4 h-4 border-b-2 border-r-2" style={{ borderColor: config.themeColor, opacity: 0.5 }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Layer 3: Typography */}
                                    <div className={`relative z-10 w-full h-full p-24 flex flex-col gap-6 ${ALIGNMENTS[config.alignment]}`}>
                                        <h1
                                            className="font-bold tracking-tight whitespace-pre-wrap max-w-[85%] leading-[1.05]"
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
                                            <p className="text-3xl font-medium tracking-normal opacity-80 leading-snug" style={{ color: config.textColor }}>
                                                {config.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Parameters Matrix */}
                    <section>
                        <div className="flex items-center justify-between mb-6 border-b border-(--border) pb-4">
                            <h2 className="text-lg font-semibold tracking-tight text-foreground">Settings</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

                            {/* Group: Content */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-(--muted-foreground)">Content</h3>
                                <SettingInput label="Title" value={config.title} onChange={(e) => updateConfig('title', e.target.value)} />
                                <SettingInput label="Subtitle" value={config.subtitle} onChange={(e) => updateConfig('subtitle', e.target.value)} isTextarea />
                            </div>

                            {/* Group: Visual Style */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-(--muted-foreground)">Appearance</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <SettingColorPicker label="Accent Color" value={config.themeColor} onChange={(v) => updateConfig('themeColor', v)} />
                                    <SettingColorPicker label="Text Color" value={config.textColor} onChange={(v) => updateConfig('textColor', v)} />
                                </div>

                                <div className="flex flex-col gap-4 border border-(--border) p-5 bg-background">
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-3 h-3 border flex items-center justify-center transition-colors ${config.bgType === 'color' ? 'bg-foreground border-foreground' : 'border-(--border) group-hover:border-(--muted-foreground)'}`} />
                                            <input type="radio" checked={config.bgType === 'color'} onChange={() => updateConfig('bgType', 'color')} className="hidden" />
                                            <span className="text-sm text-foreground">Solid Color</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-3 h-3 border flex items-center justify-center transition-colors ${config.bgType === 'image' ? 'bg-foreground border-foreground' : 'border-(--border) group-hover:border-(--muted-foreground)'}`} />
                                            <input type="radio" checked={config.bgType === 'image'} onChange={() => updateConfig('bgType', 'image')} className="hidden" />
                                            <span className="text-sm text-foreground">Image Base</span>
                                        </label>
                                    </div>

                                    {config.bgType === 'color' ? (
                                        <SettingColorPicker label="Background" value={config.bgColor} onChange={(v) => updateConfig('bgColor', v)} />
                                    ) : (
                                        <div className="space-y-4 pt-2">
                                            <label className="flex items-center justify-center w-full border border-dashed border-(--border) py-3 cursor-pointer hover:border-(--muted-foreground) bg-(--muted) hover:bg-(--border) transition-colors">
                                                <span className="text-sm font-medium text-foreground">Upload Image</span>
                                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                            </label>
                                            <SettingSlider label="Blur Radius" value={config.blur} min={0} max={20} onChange={(v) => updateConfig('blur', v)} />
                                            <SettingSlider label="Brightness" value={config.brightness} min={0} max={200} onChange={(v) => updateConfig('brightness', v)} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Group: Typography */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-(--muted-foreground)">Typography</h3>
                                <div className="flex flex-col gap-2 group">
                                    <label className="text-sm font-medium text-foreground">Font Family</label>
                                    <select
                                        value={config.fontFamily}
                                        onChange={(e) => updateConfig('fontFamily', e.target.value)}
                                        className="w-full bg-background border border-(--border) p-2.5 text-sm font-sans text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        {PRESET_FONTS.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                                        {customFontName && <option value={customFontName}>Custom Uploaded</option>}
                                    </select>
                                </div>
                                <label className="flex items-center justify-center w-full border border-dashed border-(--border) py-3 cursor-pointer hover:border-(--muted-foreground) transition-colors">
                                    <span className="text-sm font-medium text-foreground">Upload Custom Font (.ttf/.otf)</span>
                                    <input type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontUpload} className="hidden" />
                                </label>
                                <SettingSlider label="Font Size" value={config.fontSize} min={40} max={200} onChange={(v) => updateConfig('fontSize', v)} />
                            </div>

                            {/* Group: Layout */}
                            <div className="space-y-5">
                                <h3 className="text-sm font-medium text-(--muted-foreground)">Layout</h3>

                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col gap-3">
                                        <label className="text-sm font-medium text-foreground">Alignment</label>
                                        <div className="grid grid-cols-3 gap-1 w-24">
                                            {Object.keys(ALIGNMENTS).map(a => (
                                                <button
                                                    key={a}
                                                    onClick={() => updateConfig('alignment', a)}
                                                    className={`w-full aspect-square transition-colors border ${config.alignment === a
                                                            ? 'bg-foreground border-foreground'
                                                            : 'bg-(--muted) border-(--border) hover:border-(--muted-foreground)'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <label className="text-sm font-medium text-foreground">Show Marks</label>
                                        <button
                                            onClick={() => updateConfig('showDecorations', !config.showDecorations)}
                                            className={`w-12 h-6 border transition-colors flex items-center px-1 ${config.showDecorations ? 'bg-foreground border-foreground' : 'bg-background border-(--border)'
                                                }`}
                                        >
                                            <span className={`w-4 h-4 transition-transform ${config.showDecorations ? 'bg-background translate-x-5' : 'bg-(--border) translate-x-0'
                                                }`}></span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                </div>
            </main>
        </div>
    );
}

// --- 现代极简复用组件 ---

const SettingInput = ({ label, value, onChange, isTextarea }) => (
    <div className="flex flex-col gap-2 group">
        <label className="text-sm font-medium text-foreground">
            {label}
        </label>
        {isTextarea ? (
            <textarea
                value={value}
                onChange={onChange}
                rows={2}
                className="w-full bg-background border border-(--border) p-2.5 text-sm font-sans text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors resize-none"
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="w-full bg-background border border-(--border) p-2.5 text-sm font-sans text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground outline-none transition-colors"
            />
        )}
    </div>
);

const SettingColorPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between p-2.5 border border-(--border) bg-background focus-within:border-foreground focus-within:ring-1 focus-within:ring-foreground transition-colors">
        <span className="text-sm text-foreground">{label}</span>
        <div className="relative w-5 h-5 border border-(--border)">
            <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" />
            <div className="w-full h-full" style={{ backgroundColor: value }}></div>
        </div>
    </div>
);

const SettingSlider = ({ label, value, min, max, onChange }) => (
    <div className="flex flex-col gap-3 group">
        <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-foreground">{label}</span>
            <span className="text-sm font-mono text-(--muted-foreground)">{value}</span>
        </div>
        <input
            type="range" min={min} max={max} value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-1 bg-(--border) appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-foreground"
        />
    </div>
);