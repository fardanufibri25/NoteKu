const DB_NAME = 'noteku-db'
const STORE = 'notes'
const DB_VERSION = 1

let dbPromise

export function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(STORE)) {
          request.result.createObjectStore(STORE, { keyPath: 'id' })
        }
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }
  return dbPromise
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function transactionDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
    tx.onabort = () => reject(tx.error)
  })
}

export async function getAllNotes() {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readonly')
  return requestResult(tx.objectStore(STORE).getAll())
}

export async function putNote(note) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).put(note)
  await transactionDone(tx)
  return note
}

export async function deleteNoteById(id) {
  const db = await openDB()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).delete(id)
  await transactionDone(tx)
}

export function newNoteId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}
