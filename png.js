const { chromium } = require('playwright')

async function removeBg (img) {
  let count = 0
  let maxTries = 3
  while (true) {
    const browser = await chromium.launch({
		headless: false,
	})
    try {
      const page = await browser.newPage()
      await page.goto('https://www.erase.bg/upload')
      await page.setInputFiles('#uploadImage', img)
      await page.waitForLoadState('networkidle')
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.locator('.gWMEJG').click()
      ])
      await download.saveAs('image.png')
      await browser.close()
      return true
    } catch (error) {
      browser.close()
      if (++count == maxTries) {
        console.log('Ocurrió un error')
        return false
      }
    }
  }
}
exports.removeBg = removeBg
