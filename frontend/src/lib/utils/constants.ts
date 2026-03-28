export const STORAGE_KEYS = {
  auth: 'phuongxa_auth',
} as const

export const ROLES = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
} as const

export type Role = typeof ROLES[keyof typeof ROLES]
