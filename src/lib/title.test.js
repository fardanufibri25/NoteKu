import assert from 'node:assert/strict'
import test from 'node:test'
import { pageTitle } from './title.js'

test('page title follows the active route', () => {
  assert.equal(pageTitle('/'), 'Dashboard — NoteKu')
  assert.equal(pageTitle('/notes'), 'Catatan — NoteKu')
  assert.equal(pageTitle('/notes/abc'), 'Detail Catatan — NoteKu')
  assert.equal(pageTitle('/notes/abc/edit'), 'Edit Catatan — NoteKu')
  assert.equal(pageTitle('/new'), 'Catatan Baru — NoteKu')
  assert.equal(pageTitle('/profile'), 'Profil — NoteKu')
  assert.equal(pageTitle('/unknown'), 'Halaman Tidak Ditemukan — NoteKu')
})
