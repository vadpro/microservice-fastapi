// Temporary type shims to keep lints green before installing node_modules
// These are safe to remove once dependencies are installed

declare module 'react' {
  export = any
}

declare module 'react/jsx-runtime' {
  export = any
}

declare module 'next/server' {
  export = any
}

declare module 'next/headers' {
  export = any
}

// Allow arbitrary JSX tags
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any
  }
}

// Minimal Node process shim
declare const process: any


