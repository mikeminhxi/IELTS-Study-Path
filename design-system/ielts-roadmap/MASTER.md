# Design System — IELTS Roadmap (MASTER)

Nguồn: skill **ui-ux-pro-max** (dữ liệu `products.csv`, `colors.csv`, `typography.csv`, `styles.csv`, `ui-reasoning.csv`, `references/pro-rules.md`).
Do môi trường không cho chạy script `search.py`, các lựa chọn dưới đây được tra trực tiếp từ các file CSV của skill.

## Product match
- **#78 Language Learning App** (chính) + **#103 Flashcard & Study Tool** (cho màn ôn tập).
- Pattern: lesson structure, progress tracking, gamification nhẹ (streak, %).
- Must have (`ui-reasoning.csv`): `progress-tracking`, `gamification`; mobile → `optimize-touch-targets`; UX → `prioritize-clarity`.
- Anti-pattern: "Boring design + No motivation", "Inconsistent styling + Poor contrast ratios".

## Style
- Skill gợi ý **Claymorphism + Vibrant & Block-based**, phụ **Flat Design**.
- Áp dụng: **Flat Design làm nền + điểm nhấn Clay nhẹ** (bo góc 16–24px, viền dày 2px ở nút chính, bóng 2 lớp mềm). Người học là người lớn nên giảm độ "đồ chơi"; ưu tiên rõ ràng, ít xao nhãng.
- Pressed state: đổi màu/độ sáng, không làm xê dịch layout. Thời gian 150–200ms ease-out. Tôn trọng `prefers-reduced-motion`.

## Color tokens (Language Learning App #78)
| Token | Light | Dark |
|---|---|---|
| `--primary` | #4F46E5 | #818CF8 |
| `--on-primary` | #FFFFFF | #0F0F23 |
| `--secondary` | #818CF8 | #6366F1 |
| `--accent` / success | #15803D | #4ADE80 |
| `--bg` | #EEF2FF | #0E0F22 |
| `--fg` | #1E1B4B | #E0E7FF |
| `--card` | #FFFFFF | #1A1B36 |
| `--muted` | #EBEEF8 | #24254A |
| `--muted-fg` | #475569 | #B4BCE0 |
| `--border` | #C7D2FE | #34366B |
| `--danger` | #B91C1C | #F87171 |
| `--warning` | #B45309 | #FBBF24 |

Bộ màu Hồng và Sepia (Spec 002): xem `src/index.css` (`[data-palette='pink']`, `[data-palette='sepia']`), cả 6 tổ hợp đã đo đạt WCAG AA. Bộ Tím sáng: success → #15803D, danger → #B91C1C để chữ trên nền nhạt đạt 4.5:1.

Màu giai đoạn: GĐ1 indigo `#4F46E5`, GĐ2 teal `#0D9488` (Online Course #43), GĐ3 orange `#EA580C`.
Đúng/sai luôn kèm icon + chữ (không chỉ dựa vào màu).

## Typography
- **Vietnamese Friendly (#21)**: `Be Vietnam Pro` (tiêu đề + nội dung), fallback `Noto Sans`.
- Phiên âm IPA dùng `Noto Sans` (đủ glyph IPA). Self-host qua `@fontsource` để chạy offline.
- Base 16px, line-height 1.6 cho đoạn văn; không dưới 12px.

## Spacing & layout
- Nhịp 4/8px; section 16/24/32/48.
- Mobile-first, chiều rộng nội dung tối đa 720px (đọc dễ), bottom nav 4 mục trên mobile, sidebar trên ≥ 1024px.
- Vùng chạm ≥ 44×44px; nội dung không bị che bởi thanh cố định (padding đáy + safe-area).

## Icons
- Lucide (stroke 2px, outline, cỡ 20/24). Không dùng emoji làm icon.
- Icon trang trí cạnh chữ: `aria-hidden`. Nút chỉ có icon: `aria-label`.
