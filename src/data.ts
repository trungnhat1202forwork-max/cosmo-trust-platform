export type Lang = 'vi' | 'en'
export type TrustStatus = 'verified' | 'needs_more' | 'review' | 'high_risk'
export type Risk = 'low' | 'medium' | 'high'

export type Localized = { vi: string; en: string }

export interface Evidence {
  id: string
  title: Localized
  type: 'image' | 'video' | 'document' | 'delivery' | 'analysis'
  source: Localized
  verified: boolean
  date: string
  note: Localized
}

export interface Product {
  id: string
  slug: string
  sku: string
  name: Localized
  category: Localized
  price: number
  image: string
  gallery: string[]
  status: TrustStatus
  trustScore: number
  updated: string
  realPhotos: number
  verifiedReviews: number
  description: Localized
  claims: Localized[]
  evidence: Evidence[]
}

const productAsset = (slug: string) => `/products/${slug}.svg`

export const products: Product[] = [
  {
    id: 'p1', slug: 'bi-dao-cleansing-water', sku: 'CC-BD-001',
    name: { vi: 'Nước tẩy trang bí đao', en: 'Winter Melon Micellar Water' },
    category: { vi: 'Làm sạch', en: 'Cleansing' }, price: 295000,
    image:productAsset('bi-dao-cleansing-water'), gallery:[productAsset('bi-dao-cleansing-water'),productAsset('bi-dao-cleansing-water'),productAsset('bi-dao-cleansing-water')],
    status: 'verified', trustScore: 92, updated: '2026-09-05', realPhotos: 7, verifiedReviews: 142,
    description: { vi: 'Sản phẩm làm sạch dịu nhẹ. Hồ sơ COSMO đối chiếu ảnh quảng cáo, ảnh thực tế, nguồn công bố và review gắn với đơn đã giao.', en: 'A gentle cleansing product. COSMO compares campaign assets, real-life photos, disclosed sources and reviews linked to delivered orders.' },
    claims: [{ vi: 'Không thử nghiệm trên động vật', en: 'Cruelty-free claim' }, { vi: 'Bao bì và thành phần được công bố', en: 'Packaging and ingredients disclosed' }],
    evidence: [
      { id:'e11', title:{vi:'Bộ ảnh sản phẩm thực tế',en:'Real product photo set'}, type:'image', source:{vi:'Doanh nghiệp',en:'Brand'}, verified:true, date:'2026-09-04', note:{vi:'7 ảnh chụp ở nhiều điều kiện ánh sáng.',en:'7 photos across multiple lighting conditions.'}},
      { id:'e12', title:{vi:'Video chiến dịch 18 giây',en:'18-second campaign video'}, type:'video', source:{vi:'Doanh nghiệp',en:'Brand'}, verified:true, date:'2026-09-04', note:{vi:'Đã chạy kiểm tra tín hiệu chỉnh sửa và lưu mốc cần xem lại.',en:'Scanned for manipulation signals and review markers saved.'}},
      { id:'e13', title:{vi:'Đối chiếu review với trạng thái giao hàng',en:'Review-to-delivery reconciliation'}, type:'delivery', source:{vi:'Dữ liệu đơn hàng',en:'Order data'}, verified:true, date:'2026-09-05', note:{vi:'142 review gắn với đơn đã giao thành công.',en:'142 reviews linked to delivered orders.'}},
    ]
  },
  {
    id:'p2', slug:'bi-dao-toner', sku:'CC-BD-002', name:{vi:'Nước cân bằng bí đao',en:'Winter Melon Toner'}, category:{vi:'Cân bằng da',en:'Toner'}, price:195000,
    image:productAsset('bi-dao-toner'), gallery:[productAsset('bi-dao-toner'),productAsset('bi-dao-toner'),productAsset('bi-dao-toner')], status:'verified', trustScore:89, updated:'2026-09-04', realPhotos:5, verifiedReviews:98,
    description:{vi:'Hồ sơ đã có đủ ảnh thực tế, thông tin lô và review xác minh giao dịch.',en:'Profile includes real-life imagery, batch information and transaction-verified reviews.'}, claims:[{vi:'Thông tin lô được ghi nhận',en:'Batch information recorded'}], evidence:[]
  },
  {
    id:'p3', slug:'dak-lak-coffee-scrub', sku:'CC-CF-003', name:{vi:'Cà phê Đắk Lắk làm sạch da chết cơ thể',en:'Dak Lak Coffee Body Polish'}, category:{vi:'Chăm sóc cơ thể',en:'Body care'}, price:175000,
    image:productAsset('dak-lak-coffee-scrub'), gallery:[productAsset('dak-lak-coffee-scrub'),productAsset('dak-lak-coffee-scrub'),productAsset('dak-lak-coffee-scrub')], status:'verified', trustScore:94, updated:'2026-09-03', realPhotos:9, verifiedReviews:226,
    description:{vi:'Bằng chứng nguồn nguyên liệu, ảnh đóng gói thực tế và nội dung quảng bá được liên kết trong cùng hồ sơ.',en:'Ingredient-origin evidence, real packaging photos and campaign content are linked in one profile.'}, claims:[{vi:'Nguồn nguyên liệu được công bố',en:'Ingredient origin disclosed'}], evidence:[]
  },
  {
    id:'p4', slug:'hung-yen-turmeric-cleanser', sku:'CC-TM-004', name:{vi:'Gel rửa mặt nghệ Hưng Yên',en:'Hung Yen Turmeric Cleanser'}, category:{vi:'Làm sạch',en:'Cleansing'}, price:245000,
    image:productAsset('hung-yen-turmeric-cleanser'), gallery:[productAsset('hung-yen-turmeric-cleanser'),productAsset('hung-yen-turmeric-cleanser'),productAsset('hung-yen-turmeric-cleanser')], status:'needs_more', trustScore:67, updated:'2026-09-06', realPhotos:2, verifiedReviews:31,
    description:{vi:'Hồ sơ đang thiếu tài liệu nguồn cho một tuyên bố định lượng và cần thêm ảnh thực tế.',en:'Profile still lacks source documentation for one quantitative claim and needs more real-life imagery.'}, claims:[{vi:'Một tuyên bố cần bổ sung nguồn',en:'One claim requires source evidence'}], evidence:[]
  },
  {
    id:'p5', slug:'rose-aqua-gel', sku:'CC-RS-005', name:{vi:'Gel dưỡng ẩm hoa hồng',en:'Rose Hydration Gel'}, category:{vi:'Dưỡng ẩm',en:'Moisturizer'}, price:325000,
    image:productAsset('rose-aqua-gel'), gallery:[productAsset('rose-aqua-gel'),productAsset('rose-aqua-gel'),productAsset('rose-aqua-gel')], status:'review', trustScore:74, updated:'2026-09-06', realPhotos:4, verifiedReviews:54,
    description:{vi:'Ảnh chiến dịch có lệch màu so với ảnh thực tế; đang chờ người kiểm duyệt xác nhận mức ảnh hưởng.',en:'Campaign imagery shows color drift versus real photos; awaiting human review.'}, claims:[{vi:'Màu bao bì đang được đối chiếu',en:'Packaging color under review'}], evidence:[]
  },
  {
    id:'p6', slug:'pomelo-hair-tonic', sku:'CC-PM-006', name:{vi:'Tinh chất bưởi dưỡng tóc',en:'Pomelo Hair Tonic'}, category:{vi:'Chăm sóc tóc',en:'Hair care'}, price:165000,
    image:productAsset('pomelo-hair-tonic'), gallery:[productAsset('pomelo-hair-tonic'),productAsset('pomelo-hair-tonic'),productAsset('pomelo-hair-tonic')], status:'verified', trustScore:91, updated:'2026-09-02', realPhotos:6, verifiedReviews:184,
    description:{vi:'Ảnh, video sử dụng thực tế và review sau giao hàng đã được liên kết.',en:'Real-use photos, video and post-delivery reviews are linked.'}, claims:[{vi:'Video thực tế đã xác minh nguồn',en:'Real-use video source verified'}], evidence:[]
  },
  {
    id:'p7', slug:'rose-cleanser', sku:'CC-RS-007', name:{vi:'Sữa rửa mặt hoa hồng',en:'Rose Facial Cleanser'}, category:{vi:'Làm sạch',en:'Cleansing'}, price:225000,
    image:productAsset('rose-cleanser'), gallery:[productAsset('rose-cleanser'),productAsset('rose-cleanser'),productAsset('rose-cleanser')], status:'verified', trustScore:87, updated:'2026-09-01', realPhotos:5, verifiedReviews:81,
    description:{vi:'Hồ sơ đủ bằng chứng ở mức hiện tại.',en:'Profile is sufficiently evidenced for current publication.'}, claims:[{vi:'Hồ sơ công khai đang hoạt động',en:'Public profile active'}], evidence:[]
  },
  {
    id:'p8', slug:'sun-serum', sku:'CC-SS-008', name:{vi:'Tinh chất chống nắng',en:'Daily Sun Serum'}, category:{vi:'Chống nắng',en:'Sun care'}, price:385000,
    image:productAsset('sun-serum'), gallery:[productAsset('sun-serum'),productAsset('sun-serum'),productAsset('sun-serum')], status:'needs_more', trustScore:61, updated:'2026-09-06', realPhotos:1, verifiedReviews:18,
    description:{vi:'Tuyên bố hiệu năng cần bổ sung tài liệu kiểm nghiệm trước khi công bố đầy đủ.',en:'Performance claims require additional test documentation before full publication.'}, claims:[{vi:'Chờ tài liệu kiểm nghiệm',en:'Awaiting test documentation'}], evidence:[]
  },
  {
    id:'p9', slug:'campaign-kit', sku:'CC-KIT-009', name:{vi:'Bộ quà tặng chăm sóc da',en:'Skincare Gift Set'}, category:{vi:'Bộ sản phẩm',en:'Gift set'}, price:645000,
    image:productAsset('campaign-kit'), gallery:[productAsset('campaign-kit'),productAsset('campaign-kit'),productAsset('campaign-kit')], status:'high_risk', trustScore:42, updated:'2026-09-06', realPhotos:0, verifiedReviews:6,
    description:{vi:'Video quảng bá có nhiều tín hiệu tổng hợp và hồ sơ thiếu tệp gốc; tạm dừng trạng thái xanh.',en:'Campaign video has multiple synthetic-content signals and lacks source files; green status is suspended.'}, claims:[{vi:'Video cần kiểm duyệt thủ công',en:'Video requires manual review'}], evidence:[]
  },
  {
    id:'p10', slug:'lip-balm', sku:'CC-LB-010', name:{vi:'Son dưỡng thuần chay',en:'Vegan Lip Balm'}, category:{vi:'Chăm sóc môi',en:'Lip care'}, price:145000,
    image:productAsset('lip-balm'), gallery:[productAsset('lip-balm'),productAsset('lip-balm'),productAsset('lip-balm')], status:'verified', trustScore:90, updated:'2026-08-31', realPhotos:8, verifiedReviews:119,
    description:{vi:'Hồ sơ có ảnh thực tế, nguồn công bố và review xác minh giao dịch.',en:'Profile includes real imagery, disclosed sources and transaction-verified reviews.'}, claims:[{vi:'Có lịch sử thay đổi công khai',en:'Public change history available'}], evidence:[]
  },
]

export interface Finding { id:string; title:Localized; position:string; risk:Risk; explanation:Localized; action:Localized }
export interface ScanScenario { id:string; type:'video'|'image'|'audio'|'text'|'compare'; title:Localized; subtitle:Localized; risk:Risk; confidence:number; markers:number[]; findings:Finding[] }

export const scanScenarios: ScanScenario[] = [
  { id:'video-deepfake', type:'video', title:{vi:'Video thay khuôn mặt',en:'Face-swap video'}, subtitle:{vi:'Tình huống mẫu: nhiều lớp tín hiệu cùng xuất hiện',en:'Sample case: multiple signal layers coincide'}, risk:'high', confidence:82, markers:[4,11,18], findings:[
    {id:'f1',title:{vi:'Biên khuôn mặt bất ổn',en:'Unstable facial boundary'},position:'00:04',risk:'high',explanation:{vi:'Biên mặt nhòe trong 3 khung hình khi nhân vật quay đầu.',en:'Face boundary blurs across 3 frames while the subject turns.'},action:{vi:'Yêu cầu video gốc chưa dựng.',en:'Request original unedited footage.'}},
    {id:'f2',title:{vi:'Đồng bộ môi – giọng lệch',en:'Lip–voice mismatch'},position:'00:11',risk:'medium',explanation:{vi:'Khẩu hình lệch nhẹ so với âm thanh tại cụm từ kiểm tra.',en:'Lip motion slightly mismatches audio at the inspected phrase.'},action:{vi:'Đối chiếu bản ghi âm gốc.',en:'Compare against original audio.'}},
    {id:'f3',title:{vi:'Ánh sáng vùng mặt không đổi',en:'Facial lighting remains static'},position:'00:18',risk:'high',explanation:{vi:'Vùng mặt không đổi độ sáng khi chủ thể đi qua vùng tối.',en:'Face brightness stays constant while the subject crosses a darker area.'},action:{vi:'Chuyển người kiểm duyệt.',en:'Escalate to human reviewer.'}},
  ]},
  { id:'image-retouch', type:'image', title:{vi:'Ảnh thật có chỉnh nền',en:'Real photo with background edit'}, subtitle:{vi:'Không mặc định coi là gian lận',en:'Not automatically treated as fraud'}, risk:'low', confidence:79, markers:[], findings:[{id:'i1',title:{vi:'Nền ảnh đã thay',en:'Background replaced'},position:'Toàn ảnh',risk:'low',explanation:{vi:'Chủ thể giữ nguyên tỷ lệ và chi tiết chính.',en:'Subject proportions and key details remain unchanged.'},action:{vi:'Ghi chú công khai mức chỉnh sửa.',en:'Disclose the edit level publicly.'}}]},
  { id:'audio-clone', type:'audio', title:{vi:'Giọng nói nhân bản',en:'Cloned voice'}, subtitle:{vi:'Phổ âm thanh có tín hiệu cần xem lại',en:'Audio spectrum shows review signals'}, risk:'high', confidence:80, markers:[3,12], findings:[{id:'a1',title:{vi:'Thiếu vi biến thiên hơi thở',en:'Missing breath micro-variation'},position:'00:03–00:12',risk:'high',explanation:{vi:'Nhịp nghỉ và hơi thở ít biến thiên bất thường.',en:'Breath and pause patterns show unusually low variation.'},action:{vi:'Yêu cầu bản ghi hiện trường.',en:'Request field recording.'}}]},
  { id:'text-claim', type:'text', title:{vi:'Mô tả chưa khớp bằng chứng',en:'Claim not supported by evidence'}, subtitle:{vi:'Đối chiếu tuyên bố – hồ sơ',en:'Claim-to-evidence comparison'}, risk:'medium', confidence:77, markers:[], findings:[{id:'t1',title:{vi:'Tuyên bố định lượng thiếu nguồn',en:'Quantitative claim lacks source'},position:'Đoạn mô tả 2',risk:'medium',explanation:{vi:'Không tìm thấy tài liệu kiểm nghiệm tương ứng.',en:'No matching test document was found.'},action:{vi:'Yêu cầu bổ sung nguồn hoặc sửa mô tả.',en:'Add source evidence or revise the claim.'}}]},
  { id:'compare-real', type:'compare', title:{vi:'So sánh quảng cáo – thực tế',en:'Campaign vs real-life comparison'}, subtitle:{vi:'Màu sắc và thuộc tính chính gần khớp',en:'Core attributes are closely aligned'}, risk:'low', confidence:84, markers:[], findings:[{id:'c1',title:{vi:'Ảnh quảng cáo sáng hơn',en:'Campaign image is brighter'},position:'Toàn ảnh',risk:'low',explanation:{vi:'Chênh lệch chủ yếu nằm ở ánh sáng và nền.',en:'Difference is mainly lighting and background.'},action:{vi:'Ghi chú mức hậu kỳ trên hồ sơ.',en:'Disclose post-processing level.'}}]},
]

export const complaints = [
  {id:'KN-2026-0148',product:'Nước tẩy trang bí đao',reason:{vi:'Màu bao bì thực tế trầm hơn ảnh',en:'Packaging color appears darker than campaign image'},status:{vi:'Đã có kết quả đối chiếu',en:'Comparison completed'}},
  {id:'KN-2026-0151',product:'Tinh chất chống nắng',reason:{vi:'Chưa thấy tài liệu cho tuyên bố hiệu năng',en:'Performance claim document not visible'},status:{vi:'Chờ doanh nghiệp bổ sung',en:'Awaiting brand evidence'}},
  {id:'KN-2026-0156',product:'Bộ quà tặng chăm sóc da',reason:{vi:'Video quảng bá có dấu hiệu tổng hợp',en:'Campaign video shows synthetic-content signals'},status:{vi:'Đang kiểm duyệt',en:'Under review'}},
]

export const dashboardTasks = [
  {id:'t1',status:'high_risk' as TrustStatus,title:{vi:'1 video chiến dịch có rủi ro cao',en:'1 campaign video is high risk'},target:'ai'},
  {id:'t2',status:'needs_more' as TrustStatus,title:{vi:'2 sản phẩm cần bổ sung bằng chứng',en:'2 products need more evidence'},target:'products'},
  {id:'t3',status:'review' as TrustStatus,title:{vi:'1 hồ sơ đang chờ người kiểm duyệt',en:'1 profile awaits human review'},target:'products'},
]

export const formatVnd = (value:number) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫'
export const txt = (v: Localized, lang: Lang) => v[lang]
