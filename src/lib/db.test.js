import 'fake-indexeddb/auto'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { deleteNoteById, getAllNotes, newNoteId, putNote } from './db.js'

test('IndexedDB notes survive write, update, and delete', async () => {
  const id = newNoteId()
  const note = {
    id,
    title: 'Catatan uji',
    course: 'Basis Data',
    content: 'Isi catatan uji',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await putNote(note)
  assert.equal((await getAllNotes()).filter((item) => item.id === id).length, 1)

  await putNote({ ...note, title: 'Catatan uji diperbarui', updatedAt: new Date().toISOString() })
  const saved = (await getAllNotes()).find((item) => item.id === id)
  assert.equal(saved.title, 'Catatan uji diperbarui')

  await deleteNoteById(id)
  assert.equal((await getAllNotes()).some((item) => item.id === id), false)
})
