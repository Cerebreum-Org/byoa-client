import { Component, type ReactNode } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { error: Error | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };
  static getDerivedStateFromError(error: Error): State { return { error }; }
  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-900 text-red-400 gap-2 p-8">
          <div className="text-lg font-semibold">Something went wrong</div>
          <div className="text-sm text-zinc-500">{this.state.error.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
