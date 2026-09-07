from pathlib import Path
import re
import urllib.request
from urllib.parse import urlparse

root = Path(__file__).resolve().parents[1]
app_path = root / 'src' / 'App.tsx'
styles_path = root / 'src' / 'styles.css'
data_path = root / 'src' / 'data.ts'
payload_path = root / 'scripts' / 'ailab_real_inference.tsx.txt'
css_payload_path = root / 'scripts' / 'forensics_css.txt'

app = app_path.read_text()
payload = payload_path.read_text().strip()

import_line = "import { classifyBlob, classifyVideoFile, type ImageForensicsResult, type VideoForensicsResult } from './forensics'\n"
if "from './forensics'" not in app:
    needle = "import { hasSupabase, supabase } from './supabase'\n"
    if needle not in app:
        raise SystemExit('Could not find supabase import anchor')
    app = app.replace(needle, needle + import_line, 1)

pattern = re.compile(r"function AILab\(\{lang,flash,products\}[\s\S]*?\n\}\n\nfunction ReviewsAdmin")
match = pattern.search(app)
if not match:
    raise SystemExit('Could not locate AILab block')
app = app[:match.start()] + payload + "\n\nfunction ReviewsAdmin" + app[match.end():]
app_path.write_text(app)

styles = styles_path.read_text()
css = css_payload_path.read_text()
if 'Real browser-side deepfake inference' not in styles:
    styles_path.write_text(styles.rstrip() + '\n' + css + '\n')

# Cache each primary official Cocoon product image in the public app. This keeps the
# source media authentic while avoiding cross-origin failures during canvas/model inference.
data = data_path.read_text()
product_pattern = re.compile(r"slug:'([^']+)'[\s\S]*?image:cocoonAsset\('([^']+)'\)")
out_dir = root / 'public' / 'cocoon'
out_dir.mkdir(parents=True, exist_ok=True)
seen = set()
saved = 0
for slug, url in product_pattern.findall(data):
    if slug in seen or not url.startswith('https://image.cocoonvietnam.com/'):
        continue
    seen.add(slug)
    suffix = Path(urlparse(url).path).suffix.lower()
    if suffix not in {'.jpg', '.jpeg', '.png', '.webp'}:
        suffix = '.jpg'
    local_rel = f'/cocoon/{slug}{suffix}'
    target = out_dir / f'{slug}{suffix}'
    try:
        request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 COSMO prototype'})
        with urllib.request.urlopen(request, timeout=30) as response:
            target.write_bytes(response.read())
        data = data.replace(url, local_rel)
        saved += 1
        print(f'cached {slug}: {url} -> {local_rel}')
    except Exception as exc:
        print(f'warning: could not cache {url}: {exc}')

data_path.write_text(data)
print(f'Updated App.tsx, styles.css, data.ts; cached {saved}/{len(seen)} primary Cocoon images')
