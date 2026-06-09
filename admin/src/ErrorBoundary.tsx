import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[admin] Render error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'sans-serif', color: '#8f3d3d' }}>
          <h1 style={{ fontSize: 18 }}>Не удалось загрузить приложение</h1>
          <p>{this.state.error.message}</p>
          <p style={{ color: '#666' }}>Попробуйте закрыть Web App и открыть снова из Telegram.</p>
        </div>
      )
    }

    return this.props.children
  }
}
