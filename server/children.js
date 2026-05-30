export const CHILDREN_LABELS = {
  none: 'Нет',
  '1': 'Да, 1 ребёнок',
  '2': 'Да, 2 ребёнка',
  '3plus': 'Да, 3 и более детей',
}

export const CHILDREN_VALUES = Object.keys(CHILDREN_LABELS)

export function getChildrenLabel(value) {
  return CHILDREN_LABELS[value] ?? value ?? '—'
}

export function getChildrenCount(value) {
  switch (value) {
    case '1':
      return 1
    case '2':
      return 2
    case '3plus':
      return 3
    default:
      return 0
  }
}
