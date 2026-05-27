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

interface BookEntry {
  id: string
  title: string
  notePath: string | null
  slides: SlideEntry[]
}

function slugify(name: string): string {
  return name
    .replace(/[^\w一-鿿㐀-䶿\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

function findSlides(bookDir: string, bookFolder: string): SlideEntry[] {
  const results: SlideEntry[] = []

  function scan(dir: string) {
    for (const entry of fs.readdirSync(dir)) {
      if (entry.startsWith('.')) continue
      const full = path.join(dir, entry)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
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

function copyFile(src: string, dest: string) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.copyFileSync(src, dest)
}

function main() {
  fs.mkdirSync(path.join(publicDir, 'notes'), { recursive: true })
  fs.mkdirSync(path.join(publicDir, 'slides'), { recursive: true })
  fs.mkdirSync(dataDir, { recursive: true })

  const books: BookEntry[] = []
  const entries = fs.readdirSync(bookRoot)

  // Root-level .md files → books with notes
  for (const file of entries) {
    if (!file.endsWith('.md')) continue
    const cleanName = file.replace(/^\[ Book \]\s*/i, '').replace(/\.md$/, '')
    const id = slugify(cleanName)
    const destPath = `/notes/${id}.md`
    copyFile(path.join(bookRoot, file), path.join(publicDir, 'notes', `${id}.md`))
    books.push({ id, title: cleanName, notePath: destPath, slides: [] })
  }

  // Subdirectories → books with slides
  for (const dir of entries) {
    if (dir.startsWith('.')) continue
    const full = path.join(bookRoot, dir)
    if (!fs.statSync(full).isDirectory()) continue
    const slides = findSlides(full, dir)
    if (slides.length === 0) continue

    // Copy all slides.html to public/slides/
    for (const slide of slides) {
      const relFromRoot = slide.publicPath.replace('/slides/', '')
      copyFile(
        path.join(bookRoot, relFromRoot),
        path.join(publicDir, 'slides', relFromRoot)
      )
    }

    const id = slugify(dir)
    books.push({ id, title: dir, notePath: null, slides })
  }

  fs.writeFileSync(path.join(dataDir, 'manifest.json'), JSON.stringify({ books }, null, 2), 'utf-8')
  console.log(`✓ Generated manifest with ${books.length} books`)
  books.forEach(b => {
    const tags = [b.notePath ? 'notes' : '', b.slides.length ? `${b.slides.length} slides` : ''].filter(Boolean).join(', ')
    console.log(`  - ${b.title} [${tags}]`)
  })
}

main()
