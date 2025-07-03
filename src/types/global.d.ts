// Type declarations for modules without complete TypeScript support

declare module 'brace' {
  const brace: any;
  export default brace;
}

declare module 'brace/mode/*' {
  const mode: any;
  export default mode;
}

declare module 'brace/theme/*' {
  const theme: any;
  export default theme;
}

declare module 'braft-editor' {
  const BraftEditor: any;
  export default BraftEditor;
}

declare module 'braft-extensions' {
  const extensions: any;
  export default extensions;
}

declare module 'material-ui-color' {
  export interface ColorPicker {
    color?: string;
    onChange?: (color: any) => void;
  }
  const ColorPicker: React.ComponentType<ColorPicker>;
  export default ColorPicker;
}

declare module 'cssjson' {
  export function toCSS(obj: any): string;
  export function toJSON(css: string): any;
}

declare module 'extract-inline-css' {
  function extractInlineCSS(html: string): any;
  export default extractInlineCSS;
}

declare module 'pretty' {
  function pretty(html: string, options?: any): string;
  export default pretty;
}

declare module 'lzutf8' {
  export function compress(data: string): Uint8Array;
  export function decompress(data: Uint8Array): string;
}

declare module 'react-perfect-scrollbar' {
  import { Component } from 'react';

  interface PerfectScrollbarProps {
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    options?: any;
    containerRef?: (ref: any) => void;
    onScrollY?: (container: any) => void;
    onScrollX?: (container: any) => void;
    component?: string;
  }

  export default class PerfectScrollbar extends Component<PerfectScrollbarProps> {}
}

// Extend Window interface for global objects
declare global {
  interface Window {
    Buffer: any;
  }
}

export {};
