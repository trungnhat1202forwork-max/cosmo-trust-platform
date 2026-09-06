-- COSMO Trust Platform prototype schema
-- Public read is deliberately limited to rows explicitly marked public.
-- No anonymous write policy is granted. The browser uses only a Supabase publishable key.

create extension if not exists pgcrypto;

create table if not exists public.cosmo_products (
  id text primary key,
  workspace_id text not null default 'cosmo-demo',
  slug text not null unique,
  sku text not null unique,
  brand_name text not null default 'COCOON Vietnam',
  name_vi text not null,
  name_en text not null,
  category_vi text not null,
  category_en text not null,
  price_vnd integer not null check (price_vnd >= 0),
  image_url text,
  status text not null check (status in ('verified','needs_more','review','high_risk')),
  trust_score smallint not null check (trust_score between 0 and 100),
  real_photos integer not null default 0 check (real_photos >= 0),
  verified_reviews integer not null default 0 check (verified_reviews >= 0),
  description_vi text,
  description_en text,
  is_public boolean not null default true,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.cosmo_evidence (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.cosmo_products(id) on delete cascade,
  evidence_type text not null check (evidence_type in ('image','video','document','delivery','analysis','audio','text')),
  title_vi text not null,
  title_en text not null,
  source_vi text not null,
  source_en text not null,
  source_kind text not null default 'brand' check (source_kind in ('brand','customer','delivery','cosmo','reviewer','third_party')),
  evidence_date date,
  object_url text,
  content_hash text,
  verification_status text not null default 'verified' check (verification_status in ('verified','pending','rejected')),
  note_vi text,
  note_en text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cosmo_scans (
  id uuid primary key default gen_random_uuid(),
  product_id text references public.cosmo_products(id) on delete cascade,
  media_type text not null check (media_type in ('video','image','audio','text','compare')),
  title_vi text not null,
  title_en text not null,
  risk_level text not null check (risk_level in ('low','medium','high')),
  confidence smallint check (confidence between 0 and 100),
  status text not null default 'human_reviewed' check (status in ('queued','analyzing','needs_review','human_reviewed','published')),
  findings jsonb not null default '[]'::jsonb,
  markers_seconds integer[] not null default '{}',
  reviewer_name text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table if not exists public.cosmo_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.cosmo_products(id) on delete cascade,
  reviewer_display text not null,
  rating smallint not null check (rating between 1 and 5),
  content text not null,
  order_reference text,
  delivered_order_verified boolean not null default false,
  has_photo boolean not null default false,
  needs_review boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.cosmo_complaints (
  id text primary key,
  product_id text not null references public.cosmo_products(id) on delete restrict,
  reason_vi text not null,
  reason_en text not null,
  status_vi text not null,
  status_en text not null,
  purchase_snapshot text,
  customer_evidence text,
  merchant_response text,
  comparison_result text,
  is_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cosmo_widget_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id text not null unique,
  style text not null default 'transparency_card' check (style in ('badge','transparency_card','floating_button')),
  show_status boolean not null default true,
  show_real_photos boolean not null default true,
  show_verified_reviews boolean not null default true,
  show_returns boolean not null default true,
  show_updated_at boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists cosmo_products_status_idx on public.cosmo_products(status);
create index if not exists cosmo_products_public_slug_idx on public.cosmo_products(is_public, slug);
create index if not exists cosmo_evidence_product_idx on public.cosmo_evidence(product_id);
create index if not exists cosmo_evidence_public_idx on public.cosmo_evidence(product_id, is_public);
create index if not exists cosmo_scans_product_idx on public.cosmo_scans(product_id, created_at desc);
create index if not exists cosmo_reviews_product_idx on public.cosmo_reviews(product_id, created_at desc);
create index if not exists cosmo_complaints_product_idx on public.cosmo_complaints(product_id, created_at desc);

alter table public.cosmo_products enable row level security;
alter table public.cosmo_evidence enable row level security;
alter table public.cosmo_scans enable row level security;
alter table public.cosmo_reviews enable row level security;
alter table public.cosmo_complaints enable row level security;
alter table public.cosmo_widget_settings enable row level security;

-- Least-privilege grants for browser/public Data API access.
grant select on public.cosmo_products to anon, authenticated;
grant select on public.cosmo_evidence to anon, authenticated;
grant select on public.cosmo_scans to anon, authenticated;
grant select on public.cosmo_reviews to anon, authenticated;
revoke all on public.cosmo_complaints from anon, authenticated;
revoke all on public.cosmo_widget_settings from anon, authenticated;

create policy "public_products_read"
on public.cosmo_products for select
to anon, authenticated
using (is_public = true);

create policy "public_evidence_read"
on public.cosmo_evidence for select
to anon, authenticated
using (
  is_public = true
  and exists (
    select 1 from public.cosmo_products p
    where p.id = product_id and p.is_public = true
  )
);

create policy "public_scans_read"
on public.cosmo_scans for select
to anon, authenticated
using (
  is_public = true
  and status = 'published'
  and exists (
    select 1 from public.cosmo_products p
    where p.id = product_id and p.is_public = true
  )
);

create policy "public_reviews_read"
on public.cosmo_reviews for select
to anon, authenticated
using (
  is_public = true
  and exists (
    select 1 from public.cosmo_products p
    where p.id = product_id and p.is_public = true
  )
);

insert into public.cosmo_widget_settings (workspace_id)
values ('cosmo-demo')
on conflict (workspace_id) do nothing;

insert into public.cosmo_products
(id, slug, sku, brand_name, name_vi, name_en, category_vi, category_en, price_vnd, image_url, status, trust_score, real_photos, verified_reviews, description_vi, description_en, is_public, published_at)
values
('p1','bi-dao-cleansing-water','CC-BD-001','COCOON Vietnam','Nước tẩy trang bí đao','Winter Melon Micellar Water','Làm sạch','Cleansing',295000,'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=1200&q=84','verified',92,7,142,'Sản phẩm làm sạch dịu nhẹ. Hồ sơ COSMO đối chiếu ảnh quảng cáo, ảnh thực tế, nguồn công bố và review gắn với đơn đã giao.','A gentle cleansing product. COSMO compares campaign assets, real-life photos, disclosed sources and reviews linked to delivered orders.',true,now()),
('p2','bi-dao-toner','CC-BD-002','COCOON Vietnam','Nước cân bằng bí đao','Winter Melon Toner','Cân bằng da','Toner',195000,'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=84','verified',89,5,98,'Hồ sơ đã có đủ ảnh thực tế, thông tin lô và review xác minh giao dịch.','Profile includes real-life imagery, batch information and transaction-verified reviews.',true,now()),
('p3','dak-lak-coffee-scrub','CC-CF-003','COCOON Vietnam','Cà phê Đắk Lắk làm sạch da chết cơ thể','Dak Lak Coffee Body Polish','Chăm sóc cơ thể','Body care',175000,'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=84','verified',94,9,226,'Bằng chứng nguồn nguyên liệu, ảnh đóng gói thực tế và nội dung quảng bá được liên kết trong cùng hồ sơ.','Ingredient-origin evidence, real packaging photos and campaign content are linked in one profile.',true,now()),
('p4','hung-yen-turmeric-cleanser','CC-TM-004','COCOON Vietnam','Gel rửa mặt nghệ Hưng Yên','Hung Yen Turmeric Cleanser','Làm sạch','Cleansing',245000,'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=1200&q=84','needs_more',67,2,31,'Hồ sơ đang thiếu tài liệu nguồn cho một tuyên bố định lượng và cần thêm ảnh thực tế.','Profile still lacks source documentation for one quantitative claim and needs more real-life imagery.',true,now()),
('p5','rose-aqua-gel','CC-RS-005','COCOON Vietnam','Gel dưỡng ẩm hoa hồng','Rose Hydration Gel','Dưỡng ẩm','Moisturizer',325000,'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=84','review',74,4,54,'Ảnh chiến dịch có lệch màu so với ảnh thực tế; đang chờ người kiểm duyệt xác nhận mức ảnh hưởng.','Campaign imagery shows color drift versus real photos; awaiting human review.',true,now()),
('p6','pomelo-hair-tonic','CC-PM-006','COCOON Vietnam','Tinh chất bưởi dưỡng tóc','Pomelo Hair Tonic','Chăm sóc tóc','Hair care',165000,'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&w=1200&q=84','verified',91,6,184,'Ảnh, video sử dụng thực tế và review sau giao hàng đã được liên kết.','Real-use photos, video and post-delivery reviews are linked.',true,now()),
('p7','rose-cleanser','CC-RS-007','COCOON Vietnam','Sữa rửa mặt hoa hồng','Rose Facial Cleanser','Làm sạch','Cleansing',225000,'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=84','verified',87,5,81,'Hồ sơ đủ bằng chứng ở mức hiện tại.','Profile is sufficiently evidenced for current publication.',true,now()),
('p8','sun-serum','CC-SS-008','COCOON Vietnam','Tinh chất chống nắng','Daily Sun Serum','Chống nắng','Sun care',385000,'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=84','needs_more',61,1,18,'Tuyên bố hiệu năng cần bổ sung tài liệu kiểm nghiệm trước khi công bố đầy đủ.','Performance claims require additional test documentation before full publication.',true,now()),
('p9','campaign-kit','CC-KIT-009','COCOON Vietnam','Bộ quà tặng chăm sóc da','Skincare Gift Set','Bộ sản phẩm','Gift set',645000,'https://images.unsplash.com/photo-1527633412983-d80af308e660?auto=format&fit=crop&w=1200&q=84','high_risk',42,0,6,'Video quảng bá có nhiều tín hiệu tổng hợp và hồ sơ thiếu tệp gốc; tạm dừng trạng thái xanh.','Campaign video has multiple synthetic-content signals and lacks source files; green status is suspended.',true,now()),
('p10','lip-balm','CC-LB-010','COCOON Vietnam','Son dưỡng thuần chay','Vegan Lip Balm','Chăm sóc môi','Lip care',145000,'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=1200&q=84','verified',90,8,119,'Hồ sơ có ảnh thực tế, nguồn công bố và review xác minh giao dịch.','Profile includes real imagery, disclosed sources and transaction-verified reviews.',true,now())
on conflict (id) do update set
  trust_score = excluded.trust_score,
  status = excluded.status,
  real_photos = excluded.real_photos,
  verified_reviews = excluded.verified_reviews,
  updated_at = now();

insert into public.cosmo_evidence
(product_id, evidence_type, title_vi, title_en, source_vi, source_en, source_kind, evidence_date, verification_status, note_vi, note_en, is_public)
values
('p1','image','Bộ ảnh sản phẩm thực tế','Real product photo set','Doanh nghiệp','Brand','brand','2026-09-04','verified','7 ảnh chụp ở nhiều điều kiện ánh sáng.','7 photos across multiple lighting conditions.',true),
('p1','video','Video chiến dịch 18 giây','18-second campaign video','Doanh nghiệp','Brand','brand','2026-09-04','verified','Đã kiểm tra tín hiệu chỉnh sửa và lưu mốc cần xem lại.','Scanned for manipulation signals and review markers saved.',true),
('p1','delivery','Đối chiếu review với trạng thái giao hàng','Review-to-delivery reconciliation','Dữ liệu đơn hàng','Order data','delivery','2026-09-05','verified','142 review gắn với đơn đã giao thành công.','142 reviews linked to delivered orders.',true),
('p4','analysis','Ghi nhận khoảng trống bằng chứng','Evidence gap record','COSMO phân tích','COSMO analysis','cosmo','2026-09-06','verified','Tuyên bố định lượng chưa có tài liệu nguồn tương ứng.','A quantitative claim does not yet have matching source documentation.',true),
('p5','analysis','Đối chiếu màu quảng cáo – thực tế','Campaign-to-real color comparison','COSMO phân tích','COSMO analysis','cosmo','2026-09-06','pending','Đang chờ người kiểm duyệt xác nhận mức ảnh hưởng.','Awaiting human confirmation of material impact.',true),
('p9','analysis','Video có nhiều tín hiệu tổng hợp','Video with multiple synthetic-content signals','COSMO phân tích','COSMO analysis','cosmo','2026-09-06','pending','Thiếu tệp gốc và có nhiều lớp tín hiệu cùng xuất hiện.','Original source is missing and multiple signal layers coincide.',true)
on conflict do nothing;

insert into public.cosmo_scans
(product_id, media_type, title_vi, title_en, risk_level, confidence, status, findings, markers_seconds, reviewer_name, is_public, reviewed_at)
values
('p1','video','Video chiến dịch đã kiểm tra','Reviewed campaign video','low',81,'published','[{"title":"Không phát hiện tín hiệu can thiệp đáng kể","position":"Toàn video"}]'::jsonb,'{}','Người kiểm duyệt COSMO',true,now()),
('p9','video','Video thay khuôn mặt — tình huống kiểm duyệt','Face-swap video — review case','high',82,'needs_review','[{"title":"Biên khuôn mặt bất ổn","position":"00:04"},{"title":"Đồng bộ môi–giọng lệch","position":"00:11"},{"title":"Ánh sáng vùng mặt không đổi","position":"00:18"}]'::jsonb,array[4,11,18],null,false,null)
on conflict do nothing;

insert into public.cosmo_reviews
(product_id, reviewer_display, rating, content, order_reference, delivered_order_verified, has_photo, needs_review, is_public)
values
('p1','Minh Anh',5,'Sản phẩm dễ dùng, ảnh thực tế trong hồ sơ giúp mình hình dung rõ hơn.','ORD-260904-1182',true,true,false,true),
('p1','Thu Trang',4,'Mình xem phần bằng chứng trước khi mua và thấy thông tin nguồn khá rõ.','ORD-260904-1210',true,false,false,true),
('p9','Tài khoản chưa đối chiếu',5,'Rất tốt, rất tốt, rất tốt.',null,false,false,true,false)
on conflict do nothing;

insert into public.cosmo_complaints
(id, product_id, reason_vi, reason_en, status_vi, status_en, purchase_snapshot, customer_evidence, merchant_response, comparison_result)
values
('KN-2026-0148','p1','Màu bao bì thực tế trầm hơn ảnh','Packaging color appears darker than campaign image','Đã có kết quả đối chiếu','Comparison completed','Ảnh và mô tả tại thời điểm mua đã được lưu phiên bản.','Ảnh khách hàng gửi sau khi nhận hàng.','Doanh nghiệp đã phản hồi về điều kiện ánh sáng.','Khác biệt chủ yếu do ánh sáng; chưa thấy thay đổi thuộc tính chính.'),
('KN-2026-0151','p8','Chưa thấy tài liệu cho tuyên bố hiệu năng','Performance claim document not visible','Chờ doanh nghiệp bổ sung','Awaiting brand evidence','Phiên bản mô tả công khai được lưu lại.','Yêu cầu khách hàng về nguồn kiểm nghiệm.','Đang bổ sung tài liệu.','Chưa đủ dữ liệu để kết luận.'),
('KN-2026-0156','p9','Video quảng bá có dấu hiệu tổng hợp','Campaign video shows synthetic-content signals','Đang kiểm duyệt','Under review','Video chiến dịch tại thời điểm mua được ghi nhận.','Khách gửi đường dẫn nội dung quảng bá.','Doanh nghiệp được yêu cầu gửi tệp gốc.','Đang chờ kiểm duyệt thủ công.')
on conflict (id) do nothing;
