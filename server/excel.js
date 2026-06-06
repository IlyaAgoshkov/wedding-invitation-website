import ExcelJS from 'exceljs'
import { getStatusLabel } from './attendance.js'
import { getChildrenLabel } from './children.js'
import { getFullName } from './stats.js'

export async function buildRsvpWorkbook(responses) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'DimaAlena Wedding RSVP'
  workbook.created = new Date()

  const sheet = workbook.addWorksheet('RSVP', {
    views: [{ state: 'frozen', ySplit: 1 }],
  })

  sheet.columns = [
    { header: 'Дата', key: 'createdAt', width: 22 },
    { header: 'Фамилия', key: 'lastName', width: 22 },
    { header: 'Имя', key: 'firstName', width: 20 },
    { header: 'Статус', key: 'attendance', width: 24 },
    { header: 'Взрослых', key: 'adults', width: 12 },
    { header: 'Дети', key: 'children', width: 24 },
    { header: 'Любимая песня / музыка', key: 'favoriteSong', width: 34 },
    { header: 'Комментарий', key: 'comment', width: 42 },
  ]

  sheet.getRow(1).font = { bold: true }

  responses.forEach((item) => {
    sheet.addRow({
      createdAt: new Date(item.createdAt).toLocaleString('ru-RU'),
      lastName: item.lastName ?? getFullName(item).split(' ')[0] ?? '—',
      firstName:
        item.firstName ?? (getFullName(item).split(' ').slice(1).join(' ') || '—'),
      attendance: getStatusLabel(item.attendance),
      adults: item.attendance === 'yes' ? item.adults ?? 1 : 0,
      children: item.attendance === 'yes' ? getChildrenLabel(item.children) : '—',
      favoriteSong: item.favoriteSong || '—',
      comment: item.comment || '—',
    })
  })

  return workbook
}

export async function buildRsvpExcelBuffer(responses) {
  const workbook = await buildRsvpWorkbook(responses)
  return workbook.xlsx.writeBuffer()
}
