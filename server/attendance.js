export const ATTENDANCE_LABELS = {
  yes: 'С радостью приду ❤️',
  maybe: 'Постараюсь прийти',
  no: 'К сожалению, не смогу',
}

export const STATUS_LABELS = {
  yes: 'Будет присутствовать',
  no: 'Не сможет присутствовать',
}

export function getAttendanceLabel(value) {
  return ATTENDANCE_LABELS[value] ?? value
}

export function getStatusLabel(value) {
  return STATUS_LABELS[value] ?? value
}
