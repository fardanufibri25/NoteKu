import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { deleteNoteById, getAllNotes, newNoteId, putNote } from '../lib/db'

const NotesContext = createContext(null)

function sortNotes(notes) {
  return [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
}

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setNotes(sortNotes(await getAllNotes()))
      setError('')
    } catch (err) {
      setError('Catatan tidak dapat dibaca dari penyimpanan lokal.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function addNote({ title, course, content }) {
    const now = new Date().toISOString()
    const note = { id: newNoteId(), title, course, content, createdAt: now, updatedAt: now }
    await putNote(note)
    setNotes((current) => sortNotes([note, ...current]))
    return note
  }

  async function updateNote(id, { title, course, content }) {
    const existing = notes.find((note) => note.id === id)
    if (!existing) throw new Error('Catatan tidak ditemukan.')
    const updated = { ...existing, title, course, content, updatedAt: new Date().toISOString() }
    await putNote(updated)
    setNotes((current) => sortNotes(current.map((note) => (note.id === id ? updated : note))))
    return updated
  }

  async function removeNote(id) {
    await deleteNoteById(id)
    setNotes((current) => current.filter((note) => note.id !== id))
  }

  return (
    <NotesContext.Provider value={{ notes, loading, error, reload, addNote, updateNote, removeNote }}>
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) throw new Error('useNotes harus dipakai di dalam NotesProvider')
  return context
}
