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
  sourceUrl?: string
}

const cocoonAsset = (url: string) => url

export const products: Product[] = [
  {
    id:'p1', slug:'nuoc-tay-trang-bi-dao-500ml', sku:'COCOON-WM-MICELLAR-500',
    name:{vi:'Nước tẩy trang bí đao 500ml',en:'Winter Melon Micellar Water 500ml'},
    category:{vi:'Làm sạch',en:'Cleansing'}, price:299000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/Artboard_6_3ec256ca12.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/Artboard_6_3ec256ca12.jpg')],
    status:'verified', trustScore:92, updated:'2026-09-07', realPhotos:1, verifiedReviews:4,
    description:{vi:'Nước tẩy trang Micellar dành cho da dầu, da mụn và da hỗn hợp thiên dầu; công thức có chiết xuất bí đao, rau má, tinh dầu tràm trà và NatraGem™ S150.',en:'Micellar cleansing water for oily and acne-prone skin, formulated with winter melon, centella, tea tree oil and NatraGem™ S150.'},
    claims:[{vi:'Không chứa cồn, sulfate, dầu khoáng và paraben theo công bố của Cocoon.',en:'Alcohol-, sulfate-, mineral-oil- and paraben-free according to Cocoon.'}],
    evidence:[{id:'e11',title:{vi:'Ảnh sản phẩm chính thức',en:'Official product image'},type:'image',source:{vi:'Cocoon Vietnam',en:'Cocoon Vietnam'},verified:true,date:'2026-09-07',note:{vi:'Ảnh lấy từ CDN chính thức image.cocoonvietnam.com.',en:'Image sourced from Cocoon’s official CDN.'}}],
    sourceUrl:'https://cocoonvietnam.com/san-pham/nuoc-tay-trang-bi-dao-500ml'
  },
  {
    id:'p2', slug:'sua-chong-nang-bi-dao-50ml', sku:'COCOON-WM-SUN-50',
    name:{vi:'Sữa chống nắng bí đao 50ml',en:'Winter Melon Sun Fluid 50ml'},
    category:{vi:'Chống nắng',en:'Sun care'}, price:432000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/website_1_99aec50414.png'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/website_1_99aec50414.png')],
    status:'verified', trustScore:90, updated:'2026-09-07', realPhotos:1, verifiedReviews:2,
    description:{vi:'Sữa chống nắng quang phổ rộng SPF 50+ PA++++ với chiết xuất bí đao, Synoxyl AZ và Melanin; Cocoon công bố khả năng kháng nước 80 phút.',en:'Broad-spectrum SPF 50+ PA++++ sunscreen with winter melon extract, Synoxyl AZ and Melanin; Cocoon states 80-minute water resistance.'},
    claims:[{vi:'SPF 50+ PA++++ và UVA-PF 62.6 theo công bố Cocoon.',en:'SPF 50+ PA++++ and UVA-PF 62.6 according to Cocoon.'}],
    evidence:[{id:'e21',title:{vi:'Ảnh sản phẩm chính thức',en:'Official product image'},type:'image',source:{vi:'Cocoon Vietnam',en:'Cocoon Vietnam'},verified:true,date:'2026-09-07',note:{vi:'Ảnh chính thức có nhãn giải thưởng trên website Cocoon.',en:'Official image as published on Cocoon’s website.'}}],
    sourceUrl:'https://cocoonvietnam.com/san-pham/sua-chong-nang-bi-dao-50ml'
  },
  {
    id:'p3', slug:'nuoc-bi-dao-can-bang-da-140ml', sku:'COCOON-WM-TONER-140',
    name:{vi:'Nước bí đao cân bằng da 140ml',en:'Winter Melon Toner 140ml'},
    category:{vi:'Cân bằng da',en:'Toner'}, price:192000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/z3526520920649_985aed4836bd72ca168fba71c86b4fce_36dbdab1c6.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/z3526520920649_985aed4836bd72ca168fba71c86b4fce_36dbdab1c6.jpg')],
    status:'verified', trustScore:89, updated:'2026-09-07', realPhotos:1, verifiedReviews:3,
    description:{vi:'Nước cân bằng không cồn với bí đao, rau má, tràm trà, Vitamin B3, HA và cam thảo; Cocoon mô tả công dụng cân bằng pH, giảm dầu và hỗ trợ da mụn.',en:'Alcohol-free toner with winter melon, centella, tea tree, Vitamin B3, HA and licorice.'},
    claims:[{vi:'Công thức không chứa cồn theo công bố Cocoon.',en:'Alcohol-free according to Cocoon.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/nuoc-bi-dao-can-bang-da-140ml'
  },
  {
    id:'p4', slug:'gel-bi-dao-rua-mat-140ml', sku:'COCOON-WM-CLEANSER-140',
    name:{vi:'Gel bí đao rửa mặt 140ml',en:'Winter Melon Cleanser 140ml'},
    category:{vi:'Làm sạch',en:'Cleansing'}, price:192000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/z4394607669965_ca1ceaa3a09cb9e3f966f4ac4256dd9a_1_f787014de5.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/z4394607669965_ca1ceaa3a09cb9e3f966f4ac4256dd9a_1_f787014de5.jpg')],
    status:'needs_more', trustScore:76, updated:'2026-09-07', realPhotos:1, verifiedReviews:4,
    description:{vi:'Gel rửa mặt pH 5.5 với bí đao, rau má, tràm trà, Vitamin B3, B5 và Betaine; phù hợp da dầu và da mụn theo website Cocoon.',en:'pH 5.5 cleanser with winter melon, centella, tea tree, Vitamins B3/B5 and betaine.'},
    claims:[{vi:'pH 5.5 theo công bố sản phẩm.',en:'pH 5.5 according to the product disclosure.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/gel-bi-dao-rua-mat-140ml'
  },
  {
    id:'p5', slug:'nuoc-tay-trang-hoa-hong-500ml', sku:'COCOON-ROSE-MICELLAR-500',
    name:{vi:'Nước tẩy trang hoa hồng 500ml',en:'Rose Bi-phase Micellar Water 500ml'},
    category:{vi:'Làm sạch',en:'Cleansing'}, price:345000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/Avatar_Website_Nuoc_tay_trang_hoa_hong_500ml_03a140e9d3.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/Avatar_Website_Nuoc_tay_trang_hoa_hong_500ml_03a140e9d3.jpg')],
    status:'review', trustScore:81, updated:'2026-09-07', realPhotos:1, verifiedReviews:1,
    description:{vi:'Công thức hai pha với nước cất hoa hồng hữu cơ, Vitamin B5 và Astaxanthin; Cocoon công bố phù hợp mọi loại da.',en:'Bi-phase micellar water with organic rose hydrosol, Vitamin B5 and astaxanthin.'},
    claims:[{vi:'Không cồn, dầu khoáng, paraben và sulfate theo công bố Cocoon.',en:'Alcohol-, mineral-oil-, paraben- and sulfate-free according to Cocoon.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/nuoc-tay-trang-hoa-hong-500ml-1'
  },
  {
    id:'p6', slug:'sua-rua-mat-sen-hau-giang-310ml', sku:'COCOON-LOTUS-CLEANSER-310',
    name:{vi:'Sữa rửa mặt sen Hậu Giang 310ml',en:'Hau Giang Lotus Soothing Cleanser 310ml'},
    category:{vi:'Làm sạch',en:'Cleansing'}, price:339000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/Artboard_12_ea031b6b39.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/Artboard_12_ea031b6b39.jpg')],
    status:'verified', trustScore:93, updated:'2026-09-07', realPhotos:1, verifiedReviews:0,
    description:{vi:'Sữa rửa mặt dành cho da nhạy cảm với chiết xuất sen Hậu Giang, Madecassoside, B5, Beta-glucan và Sodium PCA.',en:'Soothing cleanser for sensitive skin with Hau Giang lotus extract, madecassoside, B5, beta-glucan and sodium PCA.'},
    claims:[{vi:'Không chứa cồn, sulfate, dầu khoáng và paraben theo công bố Cocoon.',en:'Alcohol-, sulfate-, mineral-oil- and paraben-free according to Cocoon.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/sua-rua-mat-sen-hau-giang-310ml'
  },
  {
    id:'p7', slug:'ca-phe-dak-lak-lam-sach-da-chet-200ml', sku:'COCOON-COFFEE-BODY-200',
    name:{vi:'Cà phê Đắk Lắk làm sạch da chết cơ thể 200ml',en:'Dak Lak Coffee Body Polish 200ml'},
    category:{vi:'Chăm sóc cơ thể',en:'Body care'}, price:133000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/z4147355364575_e4b88c65711b8261d9c996e6797b60a1_83f203bec3.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/z4147355364575_e4b88c65711b8261d9c996e6797b60a1_83f203bec3.jpg')],
    status:'verified', trustScore:94, updated:'2026-09-07', realPhotos:1, verifiedReviews:0,
    description:{vi:'Hạt cà phê Đắk Lắk kết hợp bơ ca cao Tiền Giang trong sản phẩm làm sạch da chết cơ thể của Cocoon.',en:'Dak Lak coffee beans paired with Tien Giang cocoa butter in Cocoon’s body polish.'},
    claims:[{vi:'Không vi hạt nhựa theo công bố Cocoon.',en:'No plastic microbeads according to Cocoon.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/ca-phe-dak-lak-lam-sach-da-chet-co-the-200ml'
  },
  {
    id:'p8', slug:'tinh-chat-xit-duong-sen-hau-giang-200ml', sku:'COCOON-LOTUS-MIST-200',
    name:{vi:'Tinh chất xịt dưỡng Sen Hậu Giang 200ml',en:'Hau Giang Lotus Soothing Serum Mist 200ml'},
    category:{vi:'Dưỡng ẩm',en:'Hydration'}, price:368000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/Tinh_chat_xit_duong_SHG_KV_411995d512.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/Tinh_chat_xit_duong_SHG_KV_411995d512.jpg')],
    status:'verified', trustScore:91, updated:'2026-09-07', realPhotos:1, verifiedReviews:1,
    description:{vi:'Tinh chất xịt dưỡng hai tầng với chiết xuất sen hữu cơ Hậu Giang, prebiotics, squalane và các hoạt chất làm dịu.',en:'Two-phase soothing serum mist with organic Hau Giang lotus, prebiotics, squalane and soothing actives.'},
    claims:[{vi:'Không chứa cồn ethanol, sulfate, dầu khoáng và paraben theo công bố Cocoon.',en:'No ethanol, sulfate, mineral oil or parabens according to Cocoon.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/tinh-chat-xit-duong-sen-hau-giang-200ml'
  },
  {
    id:'p9', slug:'mat-na-nghe-hung-yen-100ml', sku:'COCOON-TURMERIC-MASK-100',
    name:{vi:'Mặt nạ nghệ Hưng Yên 100ml',en:'Hung Yen Turmeric Face Mask 100ml'},
    category:{vi:'Mặt nạ',en:'Face mask'}, price:339000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/Artboard_48_eb4d856178.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/Artboard_48_eb4d856178.jpg'),cocoonAsset('https://image.cocoonvietnam.com/uploads/slide_2_a77d9e7585.jpg'),cocoonAsset('https://image.cocoonvietnam.com/uploads/32262548_slide_3_4c163b8983.jpg'),cocoonAsset('https://image.cocoonvietnam.com/uploads/32262548_slide_2_9926273b34.jpg')],
    status:'review', trustScore:82, updated:'2026-09-07', realPhotos:1, verifiedReviews:2,
    description:{vi:'Mặt nạ tinh bột nghệ kết hợp Vitamin B3 và chiết xuất yến mạch, hướng tới da xỉn màu và có vết thâm.',en:'Turmeric-powder mask with Vitamin B3 and oat extract for dull, uneven-looking skin.'},
    claims:[{vi:'Nghệ Hưng Yên được Cocoon lựa chọn cho dòng làm sáng da.',en:'Cocoon uses Hung Yen turmeric in its brightening line.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/mat-na-nghe-hung-yen-100ml'
  },
  {
    id:'p10', slug:'gel-tam-bi-dao-500ml', sku:'COCOON-WM-SHOWER-500',
    name:{vi:'Gel tắm bí đao 500ml',en:'Winter Melon Shower Gel 500ml'},
    category:{vi:'Tắm & dưỡng thể',en:'Body wash'}, price:275000,
    image:cocoonAsset('https://image.cocoonvietnam.com/uploads/Avatar_Website_Gel_tam_bi_dao_500ml_0870b26d17.jpg'), gallery:[cocoonAsset('https://image.cocoonvietnam.com/uploads/Avatar_Website_Gel_tam_bi_dao_500ml_0870b26d17.jpg')],
    status:'needs_more', trustScore:79, updated:'2026-09-07', realPhotos:1, verifiedReviews:1,
    description:{vi:'Gel tắm có bí đao, BHA, tinh dầu tràm trà và Crinipan PMC; Cocoon mô tả sản phẩm hỗ trợ làm sạch bã nhờn và da cơ thể có mụn.',en:'Body wash with winter melon, BHA, tea tree oil and Crinipan PMC.'},
    claims:[{vi:'Không triclosan, dầu khoáng, paraben và cồn ethanol theo công bố Cocoon.',en:'No triclosan, mineral oil, parabens or ethanol according to Cocoon.'}],
    evidence:[], sourceUrl:'https://cocoonvietnam.com/san-pham/gel-tam-bi-dao-500ml'
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
