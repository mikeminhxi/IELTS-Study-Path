# Lộ trình IELTS — Nền tảng

Web app (PWA) học tiếng Anh nền tảng hướng tới IELTS, từ căn bản. Spec: `specs/001-ielts-foundation-roadmap/spec.md`.

## Chạy

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # test logic + kiểm tra cấu trúc nội dung
npm run build      # xuất ra dist/ (hosting tĩnh: GitHub Pages, Netlify, Vercel…)
```

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| `src/content/roadmap.ts` | Lộ trình 3 giai đoạn, metadata bài, nạp nội dung theo giai đoạn |
| `src/content/stage1/` | Nội dung 12 bài Giai đoạn 1 (lý thuyết, ví dụ, bài tập, từ vựng) |
| `src/lib/` | Chấm điểm, flashcard SM-2, lưu tiến độ (IndexedDB), giọng đọc |
| `src/pages/` | Lộ trình, Bài học, Ôn tập, Tiến độ, Cài đặt |
| `design-system/ielts-roadmap/MASTER.md` | Design system từ skill ui-ux-pro-max |
| `.claude/skills/ui-ux-pro-max/` | Skill ui-ux-pro-max (dùng cho các bước thiết kế sau) |

## Thêm bài học mới

1. Tạo file nội dung theo kiểu `Lesson` (xem `src/content/types.ts`), ví dụ `src/content/stage2/`.
2. Đăng ký loader trong `loaders` ở `src/content/roadmap.ts` và đặt `available: true` cho giai đoạn.
3. `npm test` để kiểm tra cấu trúc (đủ phần, ≥ 8 câu bài tập, đáp án hợp lệ).
