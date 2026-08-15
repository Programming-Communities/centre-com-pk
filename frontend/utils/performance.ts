// utils/performance.ts
export function batchDOMUpdates(callback: () => void) {
  requestAnimationFrame(() => {
    const style = document.createElement('style');
    style.textContent = '* { content-visibility: auto; }';
    document.head.appendChild(style);
    
    callback();
    
    requestAnimationFrame(() => {
      document.head.removeChild(style);
    });
  });
}