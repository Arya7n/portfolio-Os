import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-dvh flex-col gap-3 bg-os-void p-6 text-os-text">
        <p className="font-display text-xl">Desktop failed to load</p>
        <pre className="overflow-auto whitespace-pre-wrap border border-os-fail/40 bg-os-panel p-3 font-mono text-xs text-os-fail">
          {this.state.error.message}
          {"\n\n"}
          {this.state.error.stack}
        </pre>
        <button
          type="button"
          className="w-fit border border-os-line px-3 py-2 text-sm"
          onClick={() => this.setState({ error: null })}
        >
          Retry
        </button>
      </div>
    );
  }
}
