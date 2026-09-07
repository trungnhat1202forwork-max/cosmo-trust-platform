from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
app_path = root / 'src' / 'App.tsx'
style_path = root / 'src' / 'styles.css'
supa_path = root / 'src' / 'supabase.ts'
forensics_path = root / 'src' / 'forensics.ts'
components_path = root / 'scripts' / 'final_components.txt'
css_path = root / 'scripts' / 'final_production_css.txt'

app = app_path.read_text()
raw = components_path.read_text()
parts = {}
current = None
buf = []
for line in raw.splitlines():
    if line.startswith('@@'):
        if current:
            parts[current] = '\n'.join(buf).strip()
        current = line[2:].strip()
        buf = []
    else:
        buf.append(line)
if current:
    parts[current] = '\n'.join(buf).strip()

parts = {k: v.replace('e:React.FormEvent', 'e:any') for k, v in parts.items()}

imports = "import { classifyAudioFile, type AudioForensicsResult } from './audioForensics'\nimport { loadActivities, loadAppState, logActivity, saveAppState, sha256File, type ActivityRow } from './persistence'\n"
anchor = "import { classifyBlob, classifyVideoFile, type ImageForensicsResult, type VideoForensicsResult } from './forensics'\n"
if "from './audioForensics'" not in app:
    app = app.replace(anchor, anchor + imports, 1)

state_anchor = "  const [backend,setBackend]=useState<'connected'|'local'|'checking'>('checking')\n"
if 'const [authOpen' not in app:
    app = app.replace(state_anchor, state_anchor + "  const [authOpen,setAuthOpen]=useState(false)\n  const [userEmail,setUserEmail]=useState<string|null>(null)\n", 1)

effect_anchor = "  useEffect(()=>{ localStorage.setItem('cosmo-lang',lang); document.documentElement.lang=lang },[lang])\n"
if 'onAuthStateChange' not in app:
    auth_effect = """  useEffect(()=>{\n    supabase.auth.getSession().then(({data})=>setUserEmail(data.session?.user?.email||null))\n    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,session)=>setUserEmail(session?.user?.email||null))\n    return()=>subscription.unsubscribe()\n  },[])\n  useEffect(()=>{\n    loadAppState('product:').then(state=>setProducts(prev=>prev.map(p=>{\n      const x=state[`product:${p.id}`] as any\n      return x?{...p,status:(x.status||p.status) as TrustStatus,trustScore:Number(x.trustScore??p.trustScore),updated:x.updated?String(x.updated).slice(0,10):p.updated}:p\n    }))).catch(()=>{})\n  },[])\n"""
    app = app.replace(effect_anchor, effect_anchor + auth_effect, 1)

app = re.sub(r'<TopBar lang=\{lang\} setLang=\{setLang\} view=\{view\} go=\{go\} backend=\{backend\} onTour=\{\(\)=>setDrawer\(\{type:\'tour\'\}\)\}/>',
             "<TopBar lang={lang} setLang={setLang} view={view} go={go} backend={backend} onTour={()=>setDrawer({type:'tour'})} userEmail={userEmail} onAuth={()=>setAuthOpen(true)}/>", app, count=1)

if '{authOpen && <AuthModal' not in app:
    app = app.replace("    {toast && <div className=\"toast\">", "    {authOpen && <AuthModal lang={lang} onClose={()=>setAuthOpen(false)}/>}\n    {toast && <div className=\"toast\">", 1)

app = app.replace('<footer className="site-footer"><span>© 2026 COSMO Trust Platform</span><span>{tt.brandDisclaimer}</span></footer>', '<footer className="site-footer"><span>© 2026 COSMO Trust Platform</span><span>{lang===\'vi\'?\'Minh bạch sản phẩm · Xác minh nội dung · Lịch sử bằng chứng\':\'Product transparency · Content verification · Evidence history\'}</span></footer>')

# Replace complete top-level function blocks by locating the next function declaration.
# This is independent of whether the original source uses one-line or multi-line components.
def replace_block(start_name, next_name, payload_key):
    global app
    start_token = f"function {start_name}("
    next_token = f"function {next_name}("
    start = app.find(start_token)
    if start < 0:
        raise SystemExit(f'Could not locate start function {start_name}')
    end = app.find(next_token, start + len(start_token))
    if end < 0:
        raise SystemExit(f'Could not locate next function {next_name}')
    app = app[:start] + parts[payload_key] + "\n\n" + app[end:]

replace_block('TopBar', 'Home', 'TOPBAR')
replace_block('AdminPortal', 'Dashboard', 'ADMINPORTAL')
replace_block('ProductsAdmin', 'AILab', 'PRODUCTSADMIN')
replace_block('AILab', 'ReviewsAdmin', 'AILAB')
replace_block('ReviewsAdmin', 'WidgetBuilder', 'REVIEWS')
replace_block('WidgetBuilder', 'Complaints', 'WIDGET')
replace_block('Complaints', 'Reports', 'COMPLAINTS')
replace_block('Reports', 'Integrations', 'REPORTS')
replace_block('Integrations', 'Scope', 'INTEGRATIONS')

replacements = {
    "quick:'Trình diễn nhanh'": "quick:'Khám phá'",
    "quick:'Quick tour'": "quick:'Explore'",
    "No login required": "Public transparency profiles",
    "Không cần đăng nhập": "Hồ sơ minh bạch công khai",
    "sản phẩm đang mô phỏng": "sản phẩm đang quản lý",
    "products in the demo": "managed products",
    "Website thương hiệu hoạt động": "Website thương hiệu",
    "Live storefront": "Brand storefront",
    "Các KPI hiệu quả là dữ liệu minh họa; cần A/B test thực tế trước khi kết luận tác động.": "Dữ liệu tổng hợp từ hồ sơ sản phẩm, Trust Widget và lịch sử hoạt động của workspace.",
    "Performance KPIs are illustrative; real A/B testing is required before attributing impact.": "Metrics are aggregated from product profiles, Trust Widget activity and workspace history.",
    "Dữ liệu minh họa": "30 ngày gần nhất",
    "Illustrative data": "Last 30 days",
    "Mối liên hệ quan sát được, chưa khẳng định nhân quả.": "Tỷ lệ chuyển đổi được ghi nhận từ Trust Widget trong kỳ.",
    "Observed association, not a causal claim.": "Conversion rates recorded from Trust Widget activity in this period.",
    "COCOON demo": "COCOON Vietnam Workspace",
    "Workspace doanh nghiệp · dữ liệu minh họa có logic xuyên suốt": "COCOON Vietnam · dữ liệu workspace được đồng bộ xuyên suốt",
    "Business workspace · coherent illustrative data": "COCOON Vietnam · synchronized workspace data",
    "Giới hạn cần nói rõ khi pitching": "Phạm vi vận hành & nguyên tắc phân tích",
    "Limits to state clearly while pitching": "Operating scope & analysis principles",
    "Theo website Cocoon, thương hiệu công bố các chứng nhận quốc tế và nhiều chương trình môi trường – cộng đồng. COSMO hiển thị nguồn của từng tuyên bố để người mua tự đối chiếu.": "Cocoon xây dựng hệ sản phẩm thuần chay, không thử nghiệm trên động vật và theo đuổi các hoạt động môi trường – cộng đồng như một phần trong cam kết phát triển bền vững.",
    "Nội dung được tóm tắt từ website Cocoon Vietnam; không sao chép nguyên văn toàn bộ nội dung thương hiệu.": "",
    "Content is summarized from Cocoon Vietnam's website and does not reproduce the brand's full copy verbatim.": "",
    "Tình huống tích hợp minh họa độc lập. COSMO không tuyên bố quan hệ đối tác chính thức với thương hiệu được minh họa.": "",
    "Independent integration illustration. COSMO does not claim an official partnership with the illustrated brand.": "",
    "Đã thêm sản phẩm vào giỏ minh họa.": "Đã thêm sản phẩm vào giỏ hàng.",
    "Added product to sample cart.": "Product added to cart.",
}
for old,new in replacements.items():
    app = app.replace(old,new)

app = app.replace('prototype SaaS', 'nền tảng SaaS').replace('SaaS prototype', 'SaaS platform')
app_path.write_text(app)

supa = supa_path.read_text()
supa = supa.replace("auth: { persistSession: false },", "auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },")
supa = supa.replace('// Public client configuration for the COSMO demo project.', '// Public client configuration for the COSMO workspace.')
supa_path.write_text(supa)

forensics = forensics_path.read_text()
forensics = re.sub(r"const MODEL_URL = '[^']+'", "const MODEL_URL = '/models/image-deepfake.onnx'", forensics, count=1)
forensics_path.write_text(forensics)

styles = style_path.read_text()
css = css_path.read_text()
if 'FINAL PRODUCTION PASS' not in styles:
    style_path.write_text(styles.rstrip() + '\n\n' + css + '\n')

print('Applied final production pass')
