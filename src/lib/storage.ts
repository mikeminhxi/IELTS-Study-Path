const DB_NAME = 'ielts-roadmap'
const STORE = 'kv'
const LS_PREFIX = 'ielts-roadmap:'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

let dbPromise: Promise<IDBDatabase> | null = null
function db() {
  if (!dbPromise) dbPromise = openDb()
  return dbPromise
}

export async function getItem<T>(key: string): Promise<T | undefined> {
  try {
    const d = await db()
    return await new Promise<T | undefined>((resolve, reject) => {
      const req = d.transaction(STORE, 'readonly').objectStore(STORE).get(key)
      req.onsuccess = () => resolve(req.result as T | undefined)
      req.onerror = () => reject(req.error)
    })
  } catch {
    try {
      const raw = localStorage.getItem(LS_PREFIX + key)
      return raw ? (JSON.parse(raw) as T) : undefined
    } catch {
      return undefined
    }
  }
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    const d = await db()
    await new Promise<void>((resolve, reject) => {
      const tx = d.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(value, key)
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)
    })
  } catch {
    try {
      localStorage.setItem(LS_PREFIX + key, JSON.stringify(value))
    } catch {
      /* bộ nhớ không khả dụng – bỏ qua */
    }
  }
}

/** Xin trình duyệt giữ dữ liệu lâu dài (không tự xoá khi thiếu dung lượng). */
export function requestPersistence() {
  navigator.storage?.persist?.().catch(() => {})
}
