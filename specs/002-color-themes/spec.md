# Spec 002 — Bộ màu giao diện (Tím / Hồng / Sepia × Sáng / Tối)

| Mục | Giá trị |
|---|---|
| Trạng thái | Đã triển khai |
| Ngày | 2026-11-05 |
| Phụ thuộc | Spec 001 (FR-014: chế độ sáng/tối) |

## 1. Mục tiêu

Cho người học chọn **bộ màu** hợp với sở thích và hoàn cảnh học (ban ngày, ban đêm, đọc lâu). Mỗi bộ màu đều có **bản Sáng và bản Tối**, kết hợp với lựa chọn "Theo máy / Sáng / Tối" đã có.

## 2. Các bộ màu

| Bộ màu | Tinh thần | Nguồn (skill ui-ux-pro-max, `colors.csv`) |
|---|---|---|
| **Tím** (mặc định) | Tập trung, hiện đại | #78 Language Learning App |
| **Hồng** | Nhẹ nhàng, tươi tắn | #39 Wedding/Event (Romantic pink), #32 Beauty (Soft pink) |
| **Sepia** | Giấy cũ, dịu mắt khi đọc lâu | #63 Bakery/Cafe (Warm brown + cream) |

→ Tổng cộng **6 tổ hợp**: Tím/Hồng/Sepia × Sáng/Tối.

## 3. User story

**US10 — Chọn bộ màu (P2)**
- **Given** đang ở Cài đặt, **When** chọn một bộ màu, **Then** toàn bộ app đổi màu ngay, không cần tải lại.
- **Given** đã chọn Hồng + Tối, **When** đóng app và mở lại, **Then** vẫn giữ Hồng + Tối.
- **Given** chọn "Theo máy", **When** điện thoại chuyển sang chế độ tối, **Then** app chuyển sang bản Tối của bộ màu đang chọn.

## 4. Yêu cầu

- **FR-017** Cài đặt có mục **Bộ màu** (Tím, Hồng, Sepia) hiển thị mẫu màu, tách riêng với mục **Sáng / tối**.
- **FR-018** Lựa chọn được lưu cùng tiến độ và đi kèm khi xuất/nhập file JSON. File xuất từ bản cũ (chưa có bộ màu) vẫn nhập được, mặc định Tím.
- **FR-019** Thanh trạng thái/trình duyệt (`theme-color`) đổi màu theo bộ màu đang dùng.
- **NFR-007** Mọi tổ hợp phải đạt **WCAG AA**: chữ thường ≥ 4.5:1 trên nền và thẻ; chữ báo đúng/sai/lưu ý ≥ 4.5:1 trên nền nhạt tương ứng; chữ trên nút chính ≥ 4.5:1.
- **NFR-008** Màu đúng/sai/lưu ý vẫn kèm icon + chữ (không chỉ dựa vào màu), giữ nguyên ý nghĩa ở mọi bộ màu.

## 5. Tiêu chí thành công

- **SC-006** Cả 6 tổ hợp qua bảng kiểm tra tương phản tự động (fg, muted-fg, primary, success/danger/warning trên nền nhạt).
- **SC-007** Đổi bộ màu không làm mất tiến độ và không làm lệch bố cục.

## 6. Ghi chú triển khai

- Màu định nghĩa bằng biến CSS theo `data-palette` + `data-theme` trên thẻ `<html>` (`src/index.css`).
- Khi đo tương phản đã phát hiện và sửa lỗi cũ của bộ Tím sáng: chữ "Chính xác!" (#16A34A) và "Chưa đúng" (#DC2626) trên nền nhạt chưa đủ 4.5:1 → đổi sang #15803D và #B91C1C.
