import React, { useState } from "react";
import { createWorker } from "tesseract.js";
import { Image, Loader2, Upload } from "lucide-react";

interface ImageTranslatorProps {
  onTextExtracted: (text: string) => void;
  onError: (error: string) => void;
}

export function ImageTranslator({ onTextExtracted, onError }: ImageTranslatorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress("Initializing scanner...");

    try {
      // Setup the optical character recognition worker matching english text
      const worker = await createWorker("eng");
      
      setProgress("Scanning pixels...");
      const ret = await worker.recognize(file);
      
      setProgress("Parsing text lines...");
      const extractedText = ret.data.text;
      
      await worker.terminate();

      if (extractedText.trim()) {
        onTextExtracted(extractedText);
      } else {
        onError("No readable characters found in image. Try a higher contrast photo!");
      }
    } catch (err) {
      onError("Failed to read image template file.");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="mb-3 inline-flex rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
        <Image className="h-4 w-4" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">New Feature</p>
      <h3 className="mt-1 text-lg font-bold text-slate-800 dark:text-white">Image Text Scanner</h3>
      
      <div className="mt-3">
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-5 cursor-pointer hover:bg-slate-50 dark:border-white/20 dark:hover:bg-white/5 transition-colors ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}>
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">{progress}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-center">
              <Upload className="h-5 w-5 text-slate-400" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">Upload or drag a photo here</p>
              <p className="text-[10px] text-slate-400">PNG, JPG, or WEBP</p>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload} 
            disabled={isProcessing} 
          />
        </label>
      </div>
    </div>
  );
}
