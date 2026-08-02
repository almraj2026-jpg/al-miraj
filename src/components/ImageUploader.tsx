import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, RefreshCw, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
  aspectRatioLabel?: string;
  defaultPlaceholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'صورة المنتج',
  maxSizeMB = 5,
  aspectRatioLabel,
  defaultPlaceholder = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processAndCompressFile = (file: File) => {
    setError(null);

    // Validate size (max 5MB)
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`حجم الصورة كبير جداً (${(file.size / (1024 * 1024)).toFixed(1)} ميجابايت). الحد الأقصى المسموح به هو ${maxSizeMB} ميجابايت.`);
      return;
    }

    // Validate type (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setError('صيغة الملف غير مدعومة. يرجى اختيار صورة بصيغة (JPG, PNG, WEBP)');
      return;
    }

    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress and resize image using HTML5 Canvas
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Fill background for transparent PNGs converted to JPEG
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Convert to high quality compressed JPEG Data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        onChange(compressedDataUrl);
        setIsCompressing(false);
      };

      img.onerror = () => {
        setError('تعذر معالجة وقراءة ملَف الصورة.');
        setIsCompressing(false);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      setError('حدث خطأ أثناء قراءة الملف من جهازك.');
      setIsCompressing(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processAndCompressFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processAndCompressFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
          <span>{label}</span>
        </label>
        {aspectRatioLabel && (
          <span className="text-[10px] text-slate-400 font-medium">{aspectRatioLabel}</span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
      />

      {/* Main Upload Dropzone or Image Preview */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2">
          <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src={value}
              alt="Uploaded Preview"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تغيير الصورة</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>حذف</span>
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <CheckCircle className="w-3 h-3" />
              <span>تم تجهيز الصورة وضغطها بنجاح</span>
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sky-400 hover:underline font-bold"
            >
              استبدال بصورة أخرى
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
            isDragging
              ? 'border-sky-400 bg-sky-500/10 scale-[0.99]'
              : 'border-slate-700 hover:border-sky-500/50 bg-slate-950/80 hover:bg-slate-900'
          }`}
        >
          {isCompressing ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-sky-400">
              <RefreshCw className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">جاري رفع وضغط الصورة تلقائياً...</span>
            </div>
          ) : (
            <div className="py-3 flex flex-col items-center justify-center gap-2">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <span className="text-xs font-bold text-white block">
                  اضغط هنا لاختيار صورة من جهازك
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  أو اسحب ملف الصورة وأسقطه هنا (JPG, PNG, WEBP - حتى 5MB)
                </span>
              </div>

              <button
                type="button"
                className="mt-1 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition"
              >
                اختر صورة من الجهاز
              </button>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
