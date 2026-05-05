const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE = 'http://localhost:3000';
const OUT = path.join(__dirname);

const USERS = [
  { phone: '9000000001', name: 'TestCitizen',    role: 'CITIZEN',    file: 'citizen.png' },
  { phone: '9000000002', name: 'TestVolunteer',  role: 'VOLUNTEER',  file: 'volunteer.png' },
  { phone: '9000000003', name: 'TestAuthority',  role: 'AUTHORITY',  file: 'authority.png' },
];

async function login(page, phone, name, role) {
  await page.goto(BASE, { waitUntil: 'networkidle2' });
  await page.type('input[type="tel"]', phone);
  // fill name
  const nameInput = await page.$('input[type="text"]');
  if (nameInput) { await nameInput.click({ clickCount: 3 }); await nameInput.type(name); }
  // select role
  await page.select('select', role);
  // send OTP
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 0 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  // wait for OTP step
  await page.waitForSelector('input[type="text"]', { timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 500));
  const otpInput = await page.$('input[type="text"]');
  if (otpInput) { await otpInput.click({ clickCount: 3 }); await otpInput.type('123456'); }
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 8000 }).catch(() => {}),
    page.click('button[type="submit"]'),
  ]);
  await new Promise(r => setTimeout(r, 1500));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900'],
    defaultViewport: { width: 1400, height: 900 },
  });

  // Login page screenshot (step 1 — before submitting)
  console.log('Capturing login.png...');
  const loginPage = await browser.newPage();
  await loginPage.goto(BASE, { waitUntil: 'networkidle2' });
  await loginPage.type('input[type="tel"]', '9000000001');
  const ni = await loginPage.$('input[type="text"]');
  if (ni) { await ni.click({ clickCount: 3 }); await ni.type('Demo User'); }
  await loginPage.screenshot({ path: path.join(OUT, 'login.png'), fullPage: false });
  console.log('  saved login.png');
  await loginPage.close();

  // Dashboard screenshots
  for (const u of USERS) {
    console.log(`Capturing ${u.file} (${u.role})...`);
    const page = await browser.newPage();
    try {
      await login(page, u.phone, u.name, u.role);
      await page.screenshot({ path: path.join(OUT, u.file), fullPage: true });
      console.log(`  saved ${u.file}`);
    } catch (e) {
      console.error(`  ERROR: ${e.message}`);
    }
    await page.close();
  }

  await browser.close();
  console.log('Done.');
})();
