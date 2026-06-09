import type { DashboardResponse } from './types'

function getAuthHeaders(): Record<string, string> {
  const initData = window.Telegram?.WebApp?.initData ?? ''
  return initData ? { Authorization: `tma ${initData}` } : {}
}

async function parseError(response: Response) {
  try {
    const data = (await response.json()) as { error?: string }
    return data.error ?? 'Не удалось выполнить запрос.'
  } catch {
    return 'Не удалось выполнить запрос.'
  }
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  const response = await fetch('/api/admin/dashboard', {
    headers: getAuthHeaders(),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return response.json() as Promise<DashboardResponse>
}
