import React from "react";
import "./ErrorBoundary.css";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ErrorBoundary">
          <h2>Oops, we done goofed up.</h2>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
