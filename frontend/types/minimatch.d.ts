declare module 'minimatch' {
  interface MinimatchOptions {
    debug?: boolean;
    nobrace?: boolean;
    noglobstar?: boolean;
    dot?: boolean;
    noext?: boolean;
    nocase?: boolean;
    nonull?: boolean;
    matchBase?: boolean;
    nocomment?: boolean;
    nonegate?: boolean;
    flipNegate?: boolean;
  }

  class Minimatch {
    pattern: string;
    options: MinimatchOptions;
    set: Array<RegExp | string>;
    regexp: RegExp | null;
    negate: boolean;
    comment: boolean;
    empty: boolean;
    
    constructor(pattern: string, options?: MinimatchOptions);
    match(fname: string): boolean;
    static defaults: (def: MinimatchOptions) => MinimatchOptions;
  }

  export function minimatch(target: string, pattern: string, options?: MinimatchOptions): boolean;
  export default minimatch;
  export { Minimatch };
  export const GLOBSTAR: unique symbol;
  export const sep: string;
  export const filter: (pattern: string, options?: MinimatchOptions) => (path: string) => boolean;
}