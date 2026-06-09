/// <reference types="vite/client" />

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initData: string
  initDataUnsafe: {
    user?: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
    }
  }
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string | undefined>
  MainButton: {
    show: () => void
    hide: () => void
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
}

interface TelegramGlobal {
  WebApp: TelegramWebApp
}

interface Window {
  Telegram?: TelegramGlobal
}
