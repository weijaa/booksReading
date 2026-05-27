import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bookRoot = path.resolve(__dirname, '../../Book')
const publicDir = path.resolve(__dirname, '../public')
const dataDir = path.resolve(__dirname, '../src/data')

interface SlideEntry {
  chapter: string
  publicPath: string
}

interface ChapterEntry {
  title: string
  publicPath: string
}

interface BookEntry {
  id: string
  title: string
  notePath: string | null
  slides: SlideEntry[]
  chapters: ChapterEntry[]
}

function slugify(name: string): string {
  return name
    .replace(/[^\w一-鿿㐀-䶿\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function findSlides(bookDir: string): SlideEntry[] {
  const results: SlideEntry[] = []
  function scan(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith('.')) continue
      const full = path.join(dir, entry)
      if (fs.statSync(full).isDirectory()) {
        scan(full)
      } else if (entry === 'slides.html') {
        const relFromBook = path.relative(bookDir, dir).replace(/\\/g, '/')
        const chapter = relFromBook === '' ? '總覽' : relFromBook
        const relFromRoot = path.relative(bookRoot, full).replace(/\\/g, '/')
        results.push({ chapter, publicPath: `/slides/${relFromRoot}` })
      }
    }
  }
  scan(bookDir)
  return results
}

function findChapters(bookDir: string, bookId: string): ChapterEntry[] {
  const results: ChapterEntry[] = []
  for (const entry of fs.readdirSync(bookDir)) {
    if (entry.startsWith('.') || !entry.endsWith('.md')) continue
    const title = entry.replace(/\.md$/, '')
    results.push({ title, publicPath: `/chapters/${bookId}/${entry}` })
  }
  return results.sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'))
}

function copyFile(src: string, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

function main() {
  fs.mkdirSync(path.join(publicDir, 'notes'), { recursive: true })
  fs.mkdirSync(path.join(publicDir, 'slides'), { recursive: true })
  fs.mkdirSync(path.join(publicDir, 'chapters'), { recursive: true })
  fs.mkdirSync(dataDir, { recursive: true })

  const books: BookEntry[] = []
  const entries = fs.readdirSync(bookRoot)

  // Subdirectories → books with slides and/or chapters
  const dirBooks = new Map<string, BookEntry>()
  for (const dir of entries) {
    if (dir.startsWith('.')) continue
    const full = path.join(bookRoot, dir)
    if (!fs.statSync(full).isDirectory()) continue

    const slides = findSlides(full)
    const id = slugify(dir)
    const chapters = findChapters(full, id)

    if (slides.length === 0 && chapters.length === 0) continue

    // Copy slides
    for (const slide of slides) {
      const rel = slide.publicPath.replace('/slides/', '')
      copyFile(path.join(bookRoot, rel), path.join(publicDir, 'slides', rel))
    }

    // Copy chapters
    for (const ch of chapters) {
      const rel = ch.publicPath.replace('/chapters/', '')
      copyFile(path.join(bookRoot, dir, ch.title + '.md'), path.join(publicDir, 'chapters', rel))
    }

    const book: BookEntry = { id, title: dir, notePath: null, slides, chapters }
    dirBooks.set(dir, book)
    books.push(book)
  }

  // Root-level .md files → books with notes (merge if same-named dir exists)
  for (const file of entries) {
    if (!file.endsWith('.md')) continue
    const cleanName = file.replace(/^\[ Book \]\s*/i, '').replace(/\.md$/, '')
    const id = slugify(cleanName)
    const destPath = `/notes/${id}.md`
    copyFile(path.join(bookRoot, file), path.join(publicDir, 'notes', `${id}.md`))

    // If a same-named directory also exists (with chapters), merge into it
    const existing = dirBooks.get(cleanName)
    if (existing) {
      existing.notePath = destPath
    } else {
      books.push({ id, title: cleanName, notePath: destPath, slides: [], chapters: [] })
    }
  }

  // Sort: books with more content first
  books.sort((a, b) => {
    const scoreA = (a.slides.length + a.chapters.length) * 2 + (a.notePath ? 1 : 0)
    const scoreB = (b.slides.length + b.chapters.length) * 2 + (b.notePath ? 1 : 0)
    return scoreB - scoreA || a.title.localeCompare(b.title, 'zh-TW')
  })

  fs.writeFileSync(path.join(dataDir, 'manifest.json'), JSON.stringify({ books }, null, 2), 'utf-8')
  console.log(`✓ Generated manifest with ${books.length} books`)
  books.forEach(b => {
    const tags = [
      b.notePath ? 'notes' : '',
      b.chapters.length ? `${b.chapters.length} chapters` : '',
      b.slides.length ? `${b.slides.length} slides` : '',
    ].filter(Boolean).join(', ')
    console.log(`  - ${b.title} [${tags}]`)
  })
}

main()
