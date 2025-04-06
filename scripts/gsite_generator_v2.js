const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const args = process.argv.slice(2);

const TEST_MODE = args.includes('--test-mode');
const upgradedPath = path.resolve(__dirname, '../output/upgraded-docs-preview.json');
const upgradedDocs = JSON.parse(fs.readFileSync(upgradedPath));
const testPage = upgradedDocs[0];

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function captureFailure(page, stepName) {
  const filePath = path.resolve(__dirname, '../output/failshot-' + stepName + '.png');
  await page.screenshot({ path: filePath, fullPage: true });
  console.log(`🧯 Screenshot captured: ${filePath}`);
}

(async () => {
  const browser = await chromium.launch({ headless: false });
  const loginStatePath = path.resolve(__dirname, 'google-login.json');
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    ...(fs.existsSync(loginStatePath) && { storageState: loginStatePath })
  });


  const page = await context.newPage();
  try {
    console.log('🌐 Launching Google Sites...');
    await page.goto('https://sites.google.com/new', { waitUntil: 'load', timeout: 60000 });

    console.log('🕒 Waiting for Google Sites UI...');
    const blankButton = await page.waitForSelector('[aria-label="Blank"], text=Blank', { timeout: 15000 }).catch(() => null);
    if (!blankButton) throw new Error('❌ Could not find "Blank" site button.');
    await blankButton.click();

    console.log('📄 Setting site name...');
    await page.waitForSelector('[aria-label="Enter site name"]', { timeout: 15000 });
    await page.fill('[aria-label="Enter site name"]', testPage.pageTitle);

    if (TEST_MODE) {
      console.log('🧪 TEST MODE: Pausing after site title input.');
      await captureFailure(page, 'site-title');
      await delay(10000);
    }

    console.log(`📝 Inserting content for: ${testPage.pageTitle}`);
    await page.click('[aria-label="Add text"]');
    await delay(1000);
    await page.keyboard.type(testPage.aiContent.substring(0, 500), { delay: 5 });

    if (TEST_MODE) {
      console.log('🧪 TEST MODE: Pausing after content input.');
      await captureFailure(page, 'content-input');
      await delay(10000);
    }
    if (!fs.existsSync(loginStatePath)) {
      await context.storageState({ path: loginStatePath });
      console.log('🔐 Login session saved to google-login.json');
    }
    console.log('✅ Site content added.');
  } catch (err) {
    console.error('🚨 ERROR:', err.message);
    await captureFailure(page, 'fatal-error');
  } finally {
    if (!TEST_MODE) {
      await browser.close();
    }
  }
})();
