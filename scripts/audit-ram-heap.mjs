import puppeteer from 'puppeteer';

async function audit() {
  console.log('[AUDIT] Starting Chrome DevTools Heap & Performance Audit...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  const consoleLogs = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error' || msg.text().includes('loop') || msg.text().includes('Warning')) {
      consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    }
  });

  console.log('[AUDIT] Navigating to http://localhost:5173/#home...');
  await page.goto('http://localhost:5173/#home', { waitUntil: 'networkidle2', timeout: 15000 });

  const initialMetrics = await page.metrics();
  console.log(`[AUDIT] Initial JSHeapUsedSize: ${(initialMetrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`[AUDIT] Initial JSEventListeners: ${initialMetrics.JSEventListeners}`);
  console.log(`[AUDIT] Initial Nodes: ${initialMetrics.Nodes}`);

  // Let it idle for 6 seconds, measuring heap every 2 seconds
  for (let i = 1; i <= 3; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const m = await page.metrics();
    console.log(`[AUDIT] At ${i * 2}s - JSHeap: ${(m.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB | Listeners: ${m.JSEventListeners} | Nodes: ${m.Nodes}`);
  }

  // Simulate scrolling and interaction
  await page.evaluate(() => {
    window.scrollBy({ top: 300, behavior: 'smooth' });
  });
  await new Promise((r) => setTimeout(r, 2000));

  const finalMetrics = await page.metrics();
  console.log(`[AUDIT] After Scroll - JSHeap: ${(finalMetrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB | Listeners: ${finalMetrics.JSEventListeners} | Nodes: ${finalMetrics.Nodes}`);

  const heapDiff = (finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize) / 1024 / 1024;
  console.log(`[AUDIT] Net Heap Difference: ${heapDiff.toFixed(2)} MB (Negative or < 5MB indicates stable memory)`);

  if (consoleLogs.length > 0) {
    console.log('[AUDIT] Warning/Error Logs:', consoleLogs);
  } else {
    console.log('[AUDIT] ZERO console errors or unhandled warnings detected!');
  }

  await browser.close();
  console.log('[AUDIT] Audit finished successfully!');
}

audit().catch(console.error);
