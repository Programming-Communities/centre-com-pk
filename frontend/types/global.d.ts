// types/global.d.ts
// Global type declarations for Edge Runtime, Google Ads, and other globals

// ✅ ADD THIS - For CSS imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// ✅ ADD THIS - For CSS Module files
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare global {
  // Edge Runtime global variable (when running in Edge)
  const EdgeRuntime: 'edge' | undefined;
  
  // Google Ads - Add window.adsbygoogle type
  interface Window {
    adsbygoogle: any[];
  }
  
  // For Google Ads initialization
  const adsbygoogle: any[] | undefined;
  
  // Compression Stream API
  interface CompressionStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
  }
  
  const CompressionStream: {
    prototype: CompressionStream;
    new (format: 'gzip' | 'deflate' | 'br'): CompressionStream;
  };
  
  // Decompression Stream API
  interface DecompressionStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
  }
  
  const DecompressionStream: {
    prototype: DecompressionStream;
    new (format: 'gzip' | 'deflate' | 'br'): DecompressionStream;
  };
  
  // Generic Transform Stream
  interface GenericTransformStream {
    readonly readable: ReadableStream;
    readonly writable: WritableStream;
  }
}

// This ensures the file is treated as a module
export {};