# Spec 001 — Lộ trình nền tảng IELTS (từ tiếng Anh căn bản)

| Mục | Giá trị |
|---|---|
| Trạng thái | v1 — M1 (MVP) đã triển khai |
| Ngày | 2026-11-05 |
| Loại sản phẩm | Web app (PWA), mobile-first, chạy được offline |
| Phạm vi | Học nền tảng A1 → B2. **Không** luyện đề, **không** thi thử |
| Spec tiếp theo (dự kiến) | 002 — Luyện thi IELTS / thi thử (thêm sau khi có nhu cầu) |

> Spec viết theo cấu trúc User Stories → Requirements → Success Criteria. Quyết định: không dùng spec-kit. Design system: `design-system/ielts-roadmap/MASTER.md` (từ skill ui-ux-pro-max).

---

## 1. Bối cảnh & mục tiêu

Người học có tiếng Anh ở mức thông thường (khoảng A1–A2), muốn hướng tới IELTS nhưng **chưa sẵn sàng luyện thi**. Vấn đề hiện tại: không biết bắt đầu từ đâu, học lan man, không có lộ trình rõ ràng và không theo dõi được tiến độ.

**Mục tiêu sản phẩm**

1. Đưa ra **một lộ trình rõ ràng, theo thứ tự** từ căn bản đến ngưỡng sẵn sàng luyện IELTS (~B1+/B2).
2. Mỗi bước có **bài học ngắn gọn + bài tập có chấm ngay**.
3. Giúp **nhớ lâu** từ vựng bằng ôn tập ngắt quãng (spaced repetition).
4. **Nhanh, gọn, tiện**: mở là học, không cần đăng ký, dùng tốt trên điện thoại.

**Không làm trong spec này (Non-goals)**

- Đề thi thử, chấm band score, luyện đề theo format thi.
- Tài khoản, đăng nhập, đồng bộ cloud.
- Chấm Writing/Speaking bằng AI.
- Cộng đồng, chat, bảng xếp hạng.

---

## 2. Người dùng

- **Người học chính**: người Việt, trình độ A1–A2, học tự do 30–60 phút/ngày, chủ yếu trên điện thoại, thỉnh thoảng trên laptop.
- Giao diện và phần giải thích bằng **tiếng Việt**; ví dụ, bài tập bằng tiếng Anh.

---

## 3. Lộ trình học (nội dung cốt lõi)

Tổng cộng **3 giai đoạn × 12 bài = 36 bài**, mỗi giai đoạn có 1 bài **Ôn tập giai đoạn** (review, không phải thi thử). Thời lượng gợi ý với 45–60 phút/ngày.

### Giai đoạn 1 — Nền móng (A1 → A2) · ~8 tuần

| # | Bài | Trọng tâm ngữ pháp / kỹ năng | Từ vựng chủ đề |
|---|---|---|---|
| 1.1 | Phát âm: nguyên âm IPA | Nguyên âm ngắn/dài, nguyên âm đôi | Chào hỏi |
| 1.2 | Phát âm: phụ âm & âm cuối | Âm cuối, -s/-es, -ed (lỗi phổ biến của người Việt) | Số đếm, thời gian |
| 1.3 | Trọng âm & ngữ điệu | Trọng âm từ, ngữ điệu câu hỏi | Gia đình |
| 1.4 | Danh từ & mạo từ | Số ít/nhiều, a/an/the | Đồ vật, nhà cửa |
| 1.5 | Đại từ & động từ *to be* | Câu giới thiệu bản thân | Nghề nghiệp, quốc tịch |
| 1.6 | Hiện tại đơn | Trạng từ tần suất, thói quen | Thói quen hằng ngày |
| 1.7 | Hiện tại tiếp diễn | Phân biệt với hiện tại đơn | Hoạt động, thời tiết |
| 1.8 | Quá khứ đơn | Động từ có quy tắc / bất quy tắc | Kỳ nghỉ, cuối tuần |
| 1.9 | Tương lai | *will* vs *be going to* | Kế hoạch |
| 1.10 | Tính từ & so sánh | So sánh hơn, so sánh nhất | Mô tả người, nơi chốn |
| 1.11 | Giới từ | Giới từ thời gian & nơi chốn | Thành phố, chỉ đường |
| 1.12 | Câu hỏi | Yes/No, Wh-questions | Ăn uống, mua sắm |
| ★1 | Ôn tập giai đoạn 1 | Tổng hợp | — |

### Giai đoạn 2 — Tiền trung cấp (A2 → B1) · ~10 tuần

| # | Bài | Trọng tâm | Từ vựng chủ đề |
|---|---|---|---|
| 2.1 | Hiện tại hoàn thành | *for/since*, *already/yet*, so với quá khứ đơn | Trải nghiệm |
| 2.2 | Quá khứ tiếp diễn & kể chuyện | *when/while*, trình tự kể | Kỷ niệm |
| 2.3 | Động từ khuyết thiếu | can, must, should, have to | Quy định, lời khuyên |
| 2.4 | Câu điều kiện 0, 1, 2 | Giả định thực tế / không thực tế | Môi trường |
| 2.5 | Câu bị động cơ bản | Hiện tại & quá khứ | Sản xuất, phát minh |
| 2.6 | Mệnh đề quan hệ | who, which, that, where | Con người, địa điểm |
| 2.7 | V-ing vs to V | Động từ theo sau | Sở thích |
| 2.8 | Đếm được / không đếm được | Lượng từ: much, many, a few, a little | Thực phẩm, sức khoẻ |
| 2.9 | Từ nối cơ bản | and, but, because, so, although | Giáo dục |
| 2.10 | Collocations thông dụng | make/do/take/have + N | Công việc |
| 2.11 | Cấu tạo từ | Tiền tố, hậu tố, đổi loại từ | Công nghệ |
| 2.12 | Viết đoạn văn & nói 1–2 phút | Cấu trúc đoạn văn đơn giản | Quê hương |
| ★2 | Ôn tập giai đoạn 2 | Tổng hợp | — |

### Giai đoạn 3 — Cầu nối IELTS (B1 → B2 nền) · ~10 tuần

| # | Bài | Trọng tâm | Ghi chú |
|---|---|---|---|
| 3.1 | IELTS là gì? | 4 kỹ năng, cấu trúc, band score (kiến thức) | Không làm đề |
| 3.2 | Paraphrasing | Từ đồng nghĩa, đổi cấu trúc câu | Kỹ năng xuyên suốt |
| 3.3 | Academic Word List | AWL sublist 1–3 | Flashcard |
| 3.4 | Câu ghép & câu phức | Mệnh đề trạng ngữ, đa dạng cấu trúc | |
| 3.5 | Điều kiện loại 3, hỗn hợp, *wish* | | |
| 3.6 | Ngôn ngữ mô tả xu hướng & số liệu | increase, decline, slightly, sharply | Chỉ học ngôn ngữ |
| 3.7 | Nêu quan điểm | Đồng ý/phản đối, đưa lý do & ví dụ | |
| 3.8 | Kỹ năng đọc | Skimming, scanning, đoán nghĩa từ ngữ cảnh | |
| 3.9 | Kỹ năng nghe | Ý chính vs chi tiết, chép số/tên/chính tả | Dùng TTS |
| 3.10 | Đoạn văn học thuật | Topic sentence → giải thích → ví dụ | |
| 3.11 | Nói trôi chảy | Mở rộng câu trả lời, từ đệm, tự sửa | |
| 3.12 | Tổng kết & định hướng | Tự đánh giá 4 kỹ năng, gợi ý bước tiếp | Cầu nối sang Spec 002 |
| ★3 | Ôn tập giai đoạn 3 | Tổng hợp | — |

### 3.1 Cấu trúc một bài học

Mỗi bài dài **20–40 phút**, gồm các phần theo thứ tự:

1. **Mục tiêu** — 2–3 dòng "Sau bài này bạn sẽ…"
2. **Lý thuyết** — giải thích ngắn bằng tiếng Việt, bảng công thức, lưu ý lỗi người Việt hay gặp.
3. **Ví dụ** — 5–10 câu có nút nghe (đọc bằng giọng máy).
4. **Luyện tập** — 8–15 câu bài tập, chấm ngay, có giải thích đáp án.
5. **Từ vựng** — 10–20 từ (nghĩa, phiên âm IPA, ví dụ, nút nghe) → tự động vào bộ flashcard.
6. **Tổng kết** — tóm tắt 3–5 ý + nút "Hoàn thành bài".

### 3.2 Các dạng bài tập

| Dạng | Mô tả | Ưu tiên |
|---|---|---|
| Trắc nghiệm | 1 đáp án đúng | P1 |
| Điền vào chỗ trống | Gõ từ, chấp nhận các biến thể hợp lệ | P1 |
| Sắp xếp từ thành câu | Kéo/chạm để sắp xếp | P1 |
| Nối cặp | Từ ↔ nghĩa, câu hỏi ↔ trả lời | P2 |
| Nghe & chép | Nghe giọng máy, gõ lại | P2 |
| Viết ngắn tự đánh giá | Viết đoạn văn, tự check theo checklist + xem bài mẫu | P2 |
| Luyện phát âm | Đọc vào micro, so khớp bằng nhận dạng giọng nói của trình duyệt | P3 |

---

## 4. User Stories & tiêu chí chấp nhận

### US1 — Xem lộ trình và biết mình đang ở đâu (P1)

Là người học, tui muốn thấy toàn bộ lộ trình và vị trí hiện tại, để biết hôm nay cần học gì.

- **Given** lần đầu mở app, **When** vào trang chủ, **Then** thấy 3 giai đoạn, các bài trong từng giai đoạn, và nút "Bắt đầu bài 1.1".
- **Given** đã học xong vài bài, **When** mở app, **Then** thấy nút "Học tiếp" dẫn thẳng vào bài kế tiếp, % hoàn thành từng giai đoạn.
- **Given** bài chưa mở khoá, **When** chạm vào, **Then** app cho phép "học vượt" kèm cảnh báo nhẹ (không chặn cứng).

### US2 — Học một bài và làm bài tập (P1)

- **Given** đang ở một bài, **When** làm bài tập và bấm "Kiểm tra", **Then** biết ngay đúng/sai và xem giải thích.
- **Given** làm sai, **When** xem kết quả, **Then** có thể làm lại câu sai.
- **Given** thoát giữa chừng, **When** quay lại, **Then** tiếp tục đúng phần đang làm.
- **Given** hoàn thành phần luyện tập với điểm ≥ 70%, **When** bấm "Hoàn thành", **Then** bài được đánh dấu xong và bài kế mở khoá.

### US3 — Ôn từ vựng bằng flashcard (P1)

- **Given** đã học bài có từ vựng, **When** vào "Ôn tập", **Then** thấy số thẻ đến hạn hôm nay.
- **Given** đang ôn, **When** lật thẻ và chọn "Quên / Khó / Nhớ / Dễ", **Then** thẻ được xếp lịch ôn lại phù hợp.
- Mỗi thẻ có: từ, IPA, loại từ, nghĩa tiếng Việt, câu ví dụ, nút nghe.

### US4 — Theo dõi tiến độ & thói quen (P2)

- Mục tiêu hằng ngày (mặc định 20 phút hoặc 1 bài), chuỗi ngày học (streak), lịch học dạng heatmap.
- Thống kê: số bài xong, số từ đã thuộc, điểm trung bình bài tập theo kỹ năng.

### US5 — Nghe phát âm (P2)

- Mọi câu ví dụ và từ vựng có nút nghe bằng giọng máy của trình duyệt; chọn được giọng Anh–Anh / Anh–Mỹ và tốc độ (0.75× / 1×).

### US6 — Tìm kiếm & sổ tay (P2)

- Tìm bài học / từ vựng theo từ khoá.
- Đánh dấu (bookmark) câu, ghi chú cá nhân trong bài.

### US7 — Sao lưu tiến độ (P2)

- Xuất toàn bộ tiến độ ra file JSON và nhập lại trên máy khác.

### US8 — Kiểm tra trình độ đầu vào (P3, tuỳ chọn)

- Bài tự đánh giá ngắn (~15 câu, < 5 phút) để gợi ý bắt đầu từ giai đoạn nào. Không chấm band, không phải thi thử. Có thể bỏ qua.

### US9 — Luyện phát âm bằng micro (P3)

- Đọc câu vào micro, app so khớp văn bản nhận dạng được với câu mẫu và tô màu từ đúng/sai. Chỉ bật khi trình duyệt hỗ trợ.

---

## 5. Yêu cầu chức năng

- **FR-001** Hiển thị lộ trình 3 giai đoạn / 36 bài + 3 bài ôn tập, với trạng thái: chưa mở, có thể học, đang học, hoàn thành.
- **FR-002** Mở khoá tuần tự; cho phép học vượt có cảnh báo.
- **FR-003** Trang bài học gồm 6 phần ở mục 3.1, có thanh tiến độ trong bài.
- **FR-004** Hỗ trợ dạng bài tập P1 (trắc nghiệm, điền từ, sắp xếp câu) ở bản đầu; P2 ở bản kế tiếp.
- **FR-005** Chấm điểm tức thì, hiện giải thích đáp án; cho làm lại câu sai.
- **FR-006** Ngưỡng hoàn thành bài: ≥ 70% phần luyện tập (có thể chỉnh trong Cài đặt).
- **FR-007** Từ vựng của bài tự động vào bộ flashcard khi người học tới phần Từ vựng của bài.
- **FR-008** Lịch ôn flashcard theo thuật toán spaced repetition (SM-2 rút gọn hoặc tương đương).
- **FR-009** Lưu toàn bộ tiến độ trên thiết bị, không cần tài khoản; tự lưu sau mỗi thao tác.
- **FR-010** Xuất / nhập tiến độ dạng JSON.
- **FR-011** Đọc to văn bản tiếng Anh (text-to-speech) cho ví dụ, từ vựng, bài nghe.
- **FR-012** Mục tiêu hằng ngày, streak, thống kê cơ bản.
- **FR-013** Tìm kiếm bài học và từ vựng.
- **FR-014** Chế độ sáng / tối, theo hệ thống mặc định.
- **FR-015** Hoạt động offline sau lần tải đầu tiên (PWA, cài lên màn hình chính được).
- **FR-016** Nội dung bài học tách khỏi code (file dữ liệu), để thêm/sửa bài không cần sửa giao diện.

## 6. Yêu cầu phi chức năng

- **NFR-001 Nhanh**: tải lần đầu < 2 giây trên 4G; chuyển trang < 200 ms; Lighthouse Performance ≥ 90.
- **NFR-002 Gọn**: bundle JS ban đầu < 200 KB gzip; nội dung bài tải theo từng giai đoạn.
- **NFR-003 Mobile-first**: dùng tốt ở màn hình 360 px; vùng chạm ≥ 44 px; không cuộn ngang.
- **NFR-004 Truy cập**: tương phản WCAG AA, điều khiển được bằng bàn phím, có nhãn cho trình đọc màn hình.
- **NFR-005 Riêng tư**: không gửi dữ liệu người học ra ngoài; không tracking.
- **NFR-006 Bền dữ liệu**: tiến độ không mất khi tải lại trang hoặc cập nhật phiên bản app.

---

## 7. Giao diện & trải nghiệm (áp dụng skill ui-ux-pro-max)

Bước thiết kế sẽ dùng skill **ui-ux-pro-max** để chọn hệ thiết kế cho nhóm sản phẩm *education / e-learning*:

- **Phong cách**: thân thiện, tập trung, ít xao nhãng; tránh cảm giác "đi thi".
- **Màu**: 1 màu chủ đạo + 1 màu nhấn; màu ngữ nghĩa cho đúng (xanh lá) / sai (đỏ) / gợi ý (vàng); mỗi giai đoạn có màu nhận diện riêng.
- **Chữ**: font hỗ trợ đầy đủ dấu tiếng Việt và ký tự IPA.
- **Bố cục**: thanh điều hướng dưới (mobile) gồm *Lộ trình · Ôn tập · Tiến độ · Cài đặt*; sidebar trên desktop.
- **Tương tác**: phản hồi đúng/sai có hiệu ứng nhẹ; tôn trọng `prefers-reduced-motion`.
- Skill sẽ được dùng để sinh: bảng màu, typography, quy tắc spacing, component (card bài học, thẻ flashcard, nút bài tập), và checklist UX trước khi bàn giao.

### Màn hình chính

1. **Lộ trình** (trang chủ): thẻ "Học tiếp", danh sách giai đoạn dạng timeline, % hoàn thành.
2. **Bài học**: các phần theo bước, thanh tiến độ, nút nghe.
3. **Bài tập**: một câu một màn hình trên mobile, nút "Kiểm tra" cố định ở đáy.
4. **Ôn tập**: số thẻ đến hạn, thẻ lật, 4 nút đánh giá.
5. **Tiến độ**: streak, heatmap, thống kê.
6. **Cài đặt**: mục tiêu ngày, giọng đọc, tốc độ, giao diện, ngưỡng hoàn thành, xuất/nhập dữ liệu.

---

## 8. Mô hình dữ liệu (khái niệm)

- **Stage**: id, tên, mô tả, cấp độ CEFR, danh sách bài.
- **Lesson**: id, stageId, thứ tự, tiêu đề, mục tiêu, các phần (lý thuyết, ví dụ, bài tập, từ vựng, tổng kết), thời lượng ước tính.
- **Exercise**: id, loại, đề, lựa chọn, đáp án (nhiều biến thể), giải thích.
- **VocabItem**: id, từ, IPA, loại từ, nghĩa, ví dụ, chủ đề, lessonId.
- **LessonProgress**: lessonId, trạng thái, phần đang học, điểm, lần cập nhật.
- **CardState** (flashcard): vocabId, hệ số dễ, khoảng cách, ngày đến hạn, số lần ôn.
- **StudyLog**: ngày, số phút, số bài, số thẻ đã ôn.
- **Settings**: mục tiêu ngày, giọng, tốc độ, giao diện, ngưỡng hoàn thành.

---

## 9. Gợi ý kỹ thuật (đầu vào cho bước `plan`)

- **Frontend**: Vite + React + TypeScript + Tailwind CSS.
- **Routing**: React Router (hoặc tương đương), chia code theo trang.
- **Lưu trữ**: IndexedDB (qua thư viện nhỏ như `idb`/Dexie) cho tiến độ & flashcard.
- **Nội dung**: file JSON/Markdown theo từng bài trong repo, kiểm tra cấu trúc bằng schema khi build.
- **Âm thanh**: Web Speech API (`speechSynthesis`; `SpeechRecognition` cho US9).
- **Offline**: PWA với service worker (vite-plugin-pwa).
- **Kiểm thử**: Vitest cho logic (chấm điểm, SRS), Playwright cho luồng chính.
- **Triển khai**: hosting tĩnh (GitHub Pages / Vercel / Netlify / Cloudflare Pages), không cần backend.

## 10. Kế hoạch phát hành

| Mốc | Nội dung |
|---|---|
| **M1 — MVP** | US1, US2, US3 + toàn bộ nội dung Giai đoạn 1; PWA offline |
| **M2** | US4–US7, bài tập P2; nội dung Giai đoạn 2 |
| **M3** | Nội dung Giai đoạn 3; US8, US9 |

## 11. Tiêu chí thành công

- **SC-001** Người mới mở app bắt đầu được bài đầu tiên trong < 30 giây, không cần hướng dẫn.
- **SC-002** 100% bài trong giai đoạn phát hành có đủ 6 phần và ≥ 8 câu bài tập.
- **SC-003** Tiến độ còn nguyên sau khi tải lại trang, tắt mạng, hoặc cập nhật app.
- **SC-004** Đạt các chỉ số ở NFR-001 đến NFR-004.
- **SC-005** Sau khi xong Giai đoạn 1, người học tự giới thiệu bản thân và kể về một ngày của mình được bằng thì hiện tại và quá khứ.

## 12. Giả định & câu hỏi mở

**Giả định**

- Nội dung bài học do Claude soạn, người dùng duyệt lại; không dùng tài liệu có bản quyền của bên thứ ba.
- Dùng giọng đọc có sẵn của trình duyệt (chất lượng phụ thuộc thiết bị).
- Một người dùng trên một thiết bị; chuyển máy bằng xuất/nhập JSON.

**Câu hỏi mở** (chốt trước bước `plan`)

1. Có muốn đồng bộ nhiều thiết bị (cần backend/đăng nhập) trong tương lai gần không?
2. Ngưỡng hoàn thành 70% có phù hợp không?
3. Ưu tiên giọng Anh–Anh hay Anh–Mỹ làm mặc định?
4. Tên app?
