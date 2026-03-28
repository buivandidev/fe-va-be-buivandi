export const toVnDate = (value: string | Date | null | undefined): string => {
  if (!value) {
    return '-'
  }

  try {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(value))
  } catch {
    return '-'
  }
}

export const shortText = (text: string | null | undefined, length: number = 160): string => {
  if (!text) {
    return ''
  }
  if (text.length <= length) {
    return text
  }
  return `${text.slice(0, length)}...`
}
