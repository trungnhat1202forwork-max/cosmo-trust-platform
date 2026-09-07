import { test, expect } from '@playwright/test'

const base = process.env.COSMO_BASE_URL || 'https://cosmotrustplatform.pages.dev'
const productSlug = 'nuoc-tay-trang-bi-dao-500ml'

async function coreJourney(page: any, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport)

  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await expect(page.getByRole('img', { name: /COSMO Trust Platform/i }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: /Đăng nhập|Sign in/i })).toBeVisible()
  await page.getByRole('button', { name: /Đăng nhập|Sign in/i }).click()
  await expect(page.getByRole('heading', { name: /Đăng nhập COSMO Workspace|Sign in to COSMO Workspace/i })).toBeVisible()
  await page.getByRole('button').filter({ has: page.locator('svg') }).first().press('Escape').catch(() => {})
  await page.keyboard.press('Escape').catch(() => {})
  await page.locator('.modal-x').click().catch(() => {})

  await page.goto(`${base}/shop`, { waitUntil: 'networkidle' })
  await expect(page.getByText('Nước tẩy trang bí đao 500ml').first()).toBeVisible()

  await page.goto(`${base}/shop/${productSlug}`, { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: /Nước tẩy trang bí đao 500ml/i })).toBeVisible()
  await expect(page.getByText(/Hồ sơ minh bạch|Transparency profile/i).first()).toBeVisible()

  await page.goto(`${base}/trust/${productSlug}`, { waitUntil: 'networkidle' })
  await expect(page.getByText(/COSMO PUBLIC PROFILE/i)).toBeVisible()
  const qrButton = page.getByRole('button', { name: /Mở QR|Open QR/i })
  await qrButton.click()
  await expect(page.getByText(/Quét QR|Scan QR/i)).toBeVisible()
  await page.locator('.modal-x').click().catch(() => {})

  await page.goto(`${base}/admin/dashboard`, { waitUntil: 'networkidle' })
  await expect(page.getByRole('heading', { name: /Tổng quan|Overview/i })).toBeVisible()

  for (const route of ['products', 'reviews', 'widget', 'complaints', 'reports', 'integrations', 'scope']) {
    await page.goto(`${base}/admin/${route}`, { waitUntil: 'networkidle' })
    await expect(page.locator('.admin-content')).toBeVisible()
    await expect(page.locator('.admin-body')).toBeVisible()
  }

  await page.goto(`${base}/admin/ai`, { waitUntil: 'networkidle' })
  await expect(page.getByText(/PHÒNG KIỂM TRA ĐA PHƯƠNG TIỆN|MULTIMEDIA INSPECTION LAB/i)).toBeVisible()

  // Image: official Cocoon product image -> real model inference.
  await page.getByRole('button', { name: /Chạy phân tích AI|Run AI analysis/i }).click()
  await expect(page.getByText(/Khả năng AI|AI-generated/i)).toBeVisible({ timeout: 180000 })

  // Audio: product-matched synthetic control -> AASIST anti-spoof inference.
  await page.getByRole('button', { name: /^Âm thanh$|^Audio$/i }).click()
  await page.getByRole('button', { name: /Dùng mẫu giọng tổng hợp kiểm thử|Use synthetic voice control/i }).click()
  await page.getByRole('button', { name: /Chạy phân tích AI|Run AI analysis/i }).click()
  await expect(page.getByText(/Spoof signal/i)).toBeVisible({ timeout: 180000 })

  // Video: product-matched local test video -> sampled-frame inference.
  await page.getByRole('button', { name: /^Video$/i }).click()
  await page.getByRole('button', { name: /Dùng video kiểm thử sản phẩm|Use product test video/i }).click()
  await page.getByRole('button', { name: /Chạy phân tích AI|Run AI analysis/i }).click()
  await expect(page.getByText(/Frame cao nhất|Max frame/i)).toBeVisible({ timeout: 180000 })

  // Real file export.
  await page.goto(`${base}/admin/reports`, { waitUntil: 'networkidle' })
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: /Tải CSV|Download CSV/i }).click()
  const file = await download
  expect(file.suggestedFilename()).toContain('cosmo-report')

  // Integration test hits Supabase and returns a real health result.
  await page.goto(`${base}/admin/integrations`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /^Kiểm tra$|^Test$/i }).first().click()
  await expect(page.locator('.toast')).toContainText(/hoạt động bình thường|healthy/i)

  // Language switch is global.
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.locator('.lang-toggle').click()
  await expect(page.getByText(/Turn product information into evidence|Biến thông tin sản phẩm thành bằng chứng/i).first()).toBeVisible()
}

test('desktop end-to-end journey', async ({ page }) => {
  test.setTimeout(420000)
  await coreJourney(page, { width: 1440, height: 1000 })
})

test('mobile end-to-end journey', async ({ page }) => {
  test.setTimeout(420000)
  await coreJourney(page, { width: 390, height: 844 })
})
