// Loaded as a function by Playwright CLI's run-code --filename command.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function verifyReferenceLifecycle(page) {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.getByRole('button', { name: 'Explore sample DNA', exact: true }).click();
  const result = JSON.parse(await page.locator('.json-card pre').textContent());
  result.style_name = 'Stale analysis must be discarded';
  await page.route('**/api/analyze', async route => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ result }) }).catch(() => {});
  });
  const png = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 8;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#92a873';
    ctx.fillRect(0, 0, 8, 8);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  const image = { name: 'reference.png', mimeType: 'image/png', buffer: Buffer.from(png, 'base64') };
  const input = page.locator('input[type=file]');
  await input.setInputFiles(image);
  await page.getByRole('button', { name: 'Analyze Style DNA', exact: true }).click();
  await page.getByRole('button', { name: 'Nordic Data Minimal', exact: true }).click();
  await page.waitForTimeout(1700);
  if (await page.locator('.analysis-head h2').textContent() !== 'Nordic Data Minimal') throw new Error('Old analysis replaced the selected demo.');

  await input.setInputFiles(image);
  await page.waitForFunction(() => [...document.querySelectorAll('button')].some(b => b.textContent?.trim() === 'Analyze Style DNA' && !b.disabled));
  await input.setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await page.locator('.error').waitFor();
  if (await page.locator('.preview-meta span').first().textContent() !== 'reference.png') throw new Error('Failed upload changed the active filename.');

  const widths = [];
  for (const width of [320, 375, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    const actual = await page.evaluate(() => document.documentElement.scrollWidth);
    if (actual > width) throw new Error(`Horizontal overflow at ${width}px: ${actual}px.`);
    widths.push({ width, scrollWidth: actual });
  }
  await page.unroute('**/api/analyze');
  return { staleAnalysisDiscarded: true, failedUploadPreservesReference: true, sameImageCanBeSelectedAgain: true, widths };
}
