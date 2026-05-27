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

  // Click first book with notes (QBQ)
  await page.click('.book-card:first-child')
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: 'screenshots/book-detail-notes.png' })
  console.log('✓ book-detail-notes.png')

  // Go back and click vibeCoding (has slides)
  await page.goBack()
  await page.waitForLoadState('networkidle')
  const vibeCard = page.locator('.book-card', { hasText: 'vibeCoding' })
  await vibeCard.click()
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: 'screenshots/book-detail-slides.png' })
  console.log('✓ book-detail-slides.png')

  await browser.close()
}

main()
