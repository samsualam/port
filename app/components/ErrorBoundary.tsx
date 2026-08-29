'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

function isWebGLError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('webgl') ||
    message.includes('gl') ||
    message.includes('context') ||
    message.includes('shader') ||
    message.includes('three') ||
    message.includes('ogl')
  );
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    const webgl = isWebGLError(error);
    console.error(
      webgl ? '[WebGL Error caught]' : '[Error caught]:',
      error,
      errorInfo
    );
    if (webgl) {
      console.warn(
        'WebGL context may be lost or unsupported. Try disabling hardware acceleration or updating your graphics drivers.'
      );
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      const isWebGL = this.state.error ? isWebGLError(this.state.error) : false;
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
            <p className="text-gray-400 mb-4">
              {isWebGL
                ? 'Terjadi kesalahan pada grafis WebGL. Coba matikan akselerasi hardware di browser Anda atau perbarui driver grafis.'
                : 'Mohon nonaktifkan ekstensi Redux DevTools di browser Anda dan refresh halaman.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition-colors"
            >
              Refresh Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
