import React from 'react';

class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Spline loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          gap: '12px',
          color: '#9ca3af'
        }}>
          <div style={{ fontSize: '2.25rem' }}>🎨</div>
          <p style={{ fontSize: '0.875rem', fontFamily: 'monospace', opacity: 0.7 }}>
            3D scene unavailable
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default SplineErrorBoundary;
