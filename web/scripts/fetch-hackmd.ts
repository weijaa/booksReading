import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const bookRoot = path.resolve(__dirname, '../../Book')

interface ChapterLink {
  heading: string
  url: string
}

function extractLinks(content: string): ChapterLink[] {
  const lines = content.split('\n')
  const results: ChapterLink[] = []
  let currentHeading = '未分類'

  for (const line of lines) {
    const trimmed = line.trimStart()
    const headingMatch = trimmed.match(/^#+\s+(.+)/)
    if (headingMatch) currentHeading = headingMatch[1].trim()

    const linkMatch = trimmed.match(/\[.+?\]\((https?:\/\/hackmd\.io\/(?!_uploads)[^\)]+)\)/)
    if (linkMatch) results.push({ heading: currentHeading, url: linkMatch[1] })
  }

  return results
}

function downloadUrl(url: string): string {
  return url.replace(/#.*$/, '') + '/download'
}

function safeName(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim()
}

async function main() {
  const files = fs.readdirSync(bookRoot).filter(f => f.endsWith('.md'))
  let total = 0

  for (const file of files) {
    const content = fs.readFileSync(path.join(bookRoot, file), 'utf-8')
    const links = extractLinks(content)
    if (links.length === 0) continue

    const bookName = file.replace(/^\[ Book \]\s*/i, '').replace(/\.md$/, '')
    const bookDir = path.join(bookRoot, bookName)
    fs.mkdirSync(bookDir, { recursive: true })

    console.log(`\n📚 ${bookName}`)

    for (const link of links) {
      const fileName = safeName(link.heading) + '.md'
      const outPath = path.join(bookDir, fileName)

      if (fs.existsSync(outPath)) {
        console.log(`  - ${link.heading} (已存在，略過)`)
        continue
      }

      try {
        const res = await fetch(downloadUrl(link.url))
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const md = await res.text()
        fs.writeFileSync(outPath, md, 'utf-8')
        console.log(`  ✓ ${fileName}`)
        total++
      } catch (e) {
        console.error(`  ✗ ${link.heading}: ${e}`)
      }
    }
  }

  console.log(`\n✓ 完成，共下載 ${total} 個章節`)
}

main()
