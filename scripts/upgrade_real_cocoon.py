from pathlib import Path
import re, zlib, base64, json

root = Path('.')

def unpack_file(path):
    return zlib.decompress(base64.b64decode(Path(path).read_text().strip())).decode('utf-8')

def unpack_text(s):
    return zlib.decompress(base64.b64decode(s)).decode('utf-8')

PRODUCTS = unpack_file('.real-cocoon/products.b64')
STOREFRONT = unpack_file('.real-cocoon/storefront.b64')
AILAB = unpack_file('.real-cocoon/ailab.b64')
misc = json.loads(Path('.real-cocoon/misc.json').read_text())
CSS = unpack_text(misc['css'])
LOGO = unpack_text(misc['logo'])
ICON = unpack_text(misc['icon'])

data_path = root/'src'/'data.ts'
app_path = root/'src'/'App.tsx'
css_path = root/'src'/'styles.css'
index_path = root/'index.html'

data = data_path.read_text(encoding='utf-8')
if 'sourceUrl?: string' not in data:
    data = data.replace('  evidence: Evidence[]\n}', '  evidence: Evidence[]\n  sourceUrl?: string\n}')
data, n = re.subn(r'const productAsset[\s\S]*?(?=export interface Finding)', PRODUCTS+'\n\n', data, count=1)
if n != 1:
    raise SystemExit('Could not replace product catalog block')
data_path.write_text(data, encoding='utf-8')

app = app_path.read_text(encoding='utf-8')
app = app.replace('<button className="brand" onClick={()=>go(\'/\')}><span className="logo-mark"><ShieldCheck size={20}/></span><strong>COSMO</strong><span className="brand-sub">Trust Platform</span></button>', '<button className="brand brand-logo-button" onClick={()=>go(\'/\')} aria-label="COSMO Trust Platform"><img src="/cosmo-logo.svg" alt="COSMO Trust Platform"/></button>')
app = app.replace('<div className="sidebar-brand"><span><ShieldCheck/></span><div><b>COSMO</b><small>COCOON Vietnam</small></div><button className="mobile-close" onClick={()=>setMobile(false)}><X/></button></div>', '<div className="sidebar-brand"><img className="sidebar-logo" src="/cosmo-icon.svg" alt="COSMO"/><div><b>COSMO</b><small>Trust Platform · COCOON demo</small></div><button className="mobile-close" onClick={()=>setMobile(false)}><X/></button></div>')
app, n = re.subn(r'function Storefront\([\s\S]*?\n\}\n\n?function ProductCard', STOREFRONT+'\n\nfunction ProductCard', app, count=1)
if n != 1:
    raise SystemExit('Could not replace Storefront')
app, n = re.subn(r'function AILab\([\s\S]*?\n\}\n\n?function ReviewsAdmin', AILAB+'\n\nfunction ReviewsAdmin', app, count=1)
if n != 1:
    raise SystemExit('Could not replace AILab')
app = app.replace("{vi?'Ảnh minh họa sản phẩm':'Product illustration'}", "{vi?'Ảnh chính thức từ Cocoon':'Official Cocoon product image'}")
buy = '<button className="buy-button" onClick={()=>flash(vi?\'Đã thêm sản phẩm vào giỏ minh họa.\':\'Added product to sample cart.\')}><ShoppingBag size={19}/>{vi?\'Thêm vào giỏ\':\'Add to cart\'}</button>'
source = '{product.sourceUrl&&<a className="official-source-link" href={product.sourceUrl} target="_blank" rel="noreferrer"><Globe2 size={15}/>{vi?\'Xem nguồn sản phẩm trên Cocoon\':\'View official Cocoon product source\'}</a>}'
if buy in app and 'official-source-link' not in app:
    app = app.replace(buy, buy+source)
app = app.replace('/shop/bi-dao-cleansing-water', '/shop/nuoc-tay-trang-bi-dao-500ml')
app = app.replace('/trust/bi-dao-cleansing-water', '/trust/nuoc-tay-trang-bi-dao-500ml')
app_path.write_text(app, encoding='utf-8')

css = css_path.read_text(encoding='utf-8')
if '/* Real Cocoon media + COSMO brand content */' not in css:
    css += '\n'+CSS+'\n'
css_path.write_text(css, encoding='utf-8')

(root/'public'/'cosmo-logo.svg').write_text(LOGO, encoding='utf-8')
(root/'public'/'cosmo-icon.svg').write_text(ICON, encoding='utf-8')
index = index_path.read_text(encoding='utf-8')
if 'href="/cosmo-icon.svg"' not in index:
    index = index.replace('</head>', '  <link rel="icon" type="image/svg+xml" href="/cosmo-icon.svg" />\n</head>')
index_path.write_text(index, encoding='utf-8')
print('COSMO real Cocoon upgrade applied')
