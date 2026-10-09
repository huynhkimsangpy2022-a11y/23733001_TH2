# HUỲNH KIM SANG - MSSV: 23733001 - URL: https://github.com/huynh-kim-sang/23733001_TH2.git - Stamp: #606095 - Số cuối: 1 - VARIANT: Dưới | phone | Shop→Giỏ→Tôi | selection | B | card

## THÔNG TIN BÀI THI THỰC HÀNH 2 - KTXGO
- **Họ và tên:** HUỲNH KIM SANG
- **Mã số sinh viên (MSSV):** 23733001
- **Mã Stamp đề thi:** `#606095`
- **Số cuối MSSV:** `1`
- **Tên Repository GitHub:** `23733001_TH2`

---

## BẢNG THÔNG SỐ VÀ CẤU HÌNH VARIANT (SỐ CUỐI: 1)

| Mục | Giá trị cấu hình | Giải thích công thức |
|---|---|---|
| **MSSV** | `23733001` | Mã số sinh viên |
| **Họ và tên** | `HUỲNH KIM SANG` | Họ tên in hoa |
| **Watermark** | `Dưới` | `LAST_DIGIT % 2 === 0` (1 % 2 = 1 -> Dưới) |
| **Ô Login** | `phone` | `LAST_DIGIT % 2 === 0 ? 'email' : 'phone'` |
| **Thứ tự Tab** | `Shop → Giỏ → Tôi` | `LAST_DIGIT >= 5 ? 'cartFirst' : 'shopFirst'` |
| **Haptic** | `selection` | `LAST_DIGIT % 3 === 0 ? 'impact' : 'selection'` |
| **Công thức Phí ship** | `B` | `BASE_SHIP_FEE + Math.round(km * 1500) + 2000` |
| **Detail Presentation** | `card` | `LAST_DIGIT >= 5 ? 'modal' : 'card'` |
| **DEBOUNCE_MS** | `400 ms` | `300 + (1 % 5) * 100` |
| **STALE_TIME_MS** | `11,000 ms` | `10000 + (1 % 20) * 1000` |
| **PRICE_MULTIPLIER** | `15,500` | `15000 + (1 % 40) * 500` |
| **BASE_SHIP_FEE** | `9,000 đ` | `8000 + (1 % 10) * 1000` |
| **ROOM_LABEL** | `P.101` | `P.${100 + (1 % 400)}` |
| **Persist Key Giỏ** | `ktxgo-cart-23733001` | `ktxgo-cart-${mssv}` |

---

## CẤU TRÚC THƯ MỤC PROJECT

```
KTXGo_23733001/
├── README.md
├── App.tsx
├── package.json
├── babel.config.js
├── tsconfig.json
├── docs/
│   ├── screenshot-th2-home.png
│   └── screenshot-th2-cart.png
└── src/
    ├── constants/
    │   ├── student.ts
    │   └── theme.ts
    ├── hooks/
    │   ├── useDebouncedValue.ts
    │   └── useCampusLocation.ts
    ├── services/
    │   ├── apiClient.ts
    │   └── productApi.ts
    ├── stores/
    │   ├── authStore.ts
    │   └── cartStore.ts
    ├── navigation/
    │   ├── RootNavigator.tsx
    │   ├── AuthStack.tsx
    │   ├── MainTabs.tsx
    │   └── ShopStack.tsx
    ├── components/
    │   ├── ProductCard.tsx
    │   └── Watermark.tsx
    └── screens/
        ├── LoginScreen.tsx
        ├── HomeScreen.tsx
        ├── DetailScreen.tsx
        ├── CartScreen.tsx
        └── MeScreen.tsx
```

---

## CÁC TÍNH NĂNG VÀ CÔNG NGHỆ ĐÃ HOÀN THÀNH

### 1. Navigation & Định danh (Câu 1)
- Cấu trúc Navigation phân tầng: `RootNavigator` chuyển đổi `AuthStack` (Login) và `MainTabs` (`ShopStack`, `Cart`, `Me`).
- Đăng nhập xác thực giả lập lưu token định dạng `ktxgo-23733001-606095`.
- Thứ tự Tab chuẩn `Shop → Giỏ → Tôi`.
- `tabBarBadge` cập nhật real-time theo tổng số lượng món trong Zustand Store (tự động ẩn khi số lượng = 0).
- Dòng định danh `Watermark` hiển thị đồng bộ `TH2 · 23733001 · HUỲNH KIM SANG · #606095` ở cạnh dưới màn hình.
- Khai báo và sử dụng đầy đủ các alias `@screens`, `@components`, `@constants`, `@services`, `@stores`, `@hooks`, `@navigation`.

### 2. FlashList & TanStack React Query (Câu 2)
- Hiển thị danh sách sản phẩm lưới 2 cột bằng `@shopify/flash-list` tối ưu hiệu năng với `numColumns={2}`, `estimatedItemSize={220}`, không bọc bên trong ScrollView dọc.
- Key item kết hợp MSSV: `23733001-${item.id}`.
- Thanh tìm kiếm ô controlled kết hợp Hook tùy biến `useDebouncedValue` với thời gian trễ `400ms`.
- Đầy đủ 3 cảnh mạng:
  - **Đang tải**: `ActivityIndicator` và thông báo đang tải.
  - **Lỗi mạng**: Hiển thị MSSV `23733001`, thông báo lỗi và nút `Thử lại` gọi hàm `refetch()`.
  - **Có dữ liệu**: FlashList 2 cột kèm tính năng kéo để làm mới (Pull-to-refresh).
- `Axios` instance với request interceptor tự động chèn header `X-Student-Id: 23733001`.

### 3. Zustand Persist & Location GPS / Haptic (Câu 3)
- `cartStore` xây dựng bằng Zustand kết hợp `persist` middleware và `AsyncStorage` lưu trữ với key `ktxgo-cart-23733001`.
- Quản lý đầy đủ các hành động: thêm món, xóa món, tăng giảm số lượng, tính tổng tiền món và phí giao hàng.
- Rung phản hồi `Haptic` (loại `selection`) khi thêm sản phẩm vào giỏ từ màn hình Home hoặc màn hình Chi tiết sản phẩm.
- Hook `useCampusLocation` xử lý toàn diện các trạng thái quyền: `granted`, `denied`, `blocked` (hỗ trợ điều hướng đến cài đặt bằng `Linking.openSettings()`).
- Tính khoảng cách GPS bằng công thức toán học **Haversine** tới cổng KTX cố định và tự động áp dụng công thức tính phí giao hàng **B** (`9000 + Math.round(km * 1500) + 2000`).
- Phí giao hàng được đồng bộ tự động từ màn hình `Tôi` sang màn hình `Giỏ hàng`.
