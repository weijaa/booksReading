import { chromium } from 'playwright'

const BASE = 'http://localhost:5174'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1280, height: 800 })

  // BookList page
  await page.goto(BASE)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: 'screenshots/book-list.png' })
  console.log('✓ book-list.png')

  // Click 重構 (has chapters)
  const refactorCard = page.locator('.book-card', { hasText: '重構' })
  await refactorCard.click()
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: 'screenshots/book-chapters.png' })
  console.log('✓ book-chapters.png')

  // Click first chapter
  await page.locator('.chapter-link').first().click()
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: 'screenshots/chapter-content.png' })
  console.log('✓ chapter-content.png')

  await browser.close()
}

main()
