import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  isChunkError: boolean
}

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("dynamically imported module")
  )
}

export class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, isChunkError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, isChunkError: isChunkLoadError(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      isChunkLoadError(error) ? "Chunk load failed:" : "Page render error:",
      error,
      info,
    )
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">
            {this.state.isChunkError
              ? "페이지를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요."
              : "페이지 표시 중 오류가 발생했습니다."}
          </p>
          <button
            type="button"
            className="min-h-[44px] rounded-md bg-primary px-4 py-3 text-sm text-primary-foreground hover:bg-primary/90"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
