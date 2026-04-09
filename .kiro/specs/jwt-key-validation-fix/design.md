# JWT Key Validation Fix - Bugfix Design

## Overview

Backend API đang crash khi khởi động do User Secrets override JWT key với giá trị ngắn hơn yêu cầu tối thiểu (16 bytes thay vì 32 bytes). Mặc dù appsettings.Development.json chứa JWT key hợp lệ (64 ký tự), ASP.NET Core configuration system ưu tiên User Secrets cao hơn, dẫn đến việc sử dụng key không hợp lệ. Fix này sẽ xóa hoặc cập nhật User Secrets để backend có thể khởi động với JWT key hợp lệ từ appsettings.Development.json.

## Glossary

- **Bug_Condition (C)**: Điều kiện kích hoạt bug - khi User Secrets chứa Jwt:Key có độ dài < 32 bytes
- **Property (P)**: Hành vi mong muốn - backend khởi động thành công với JWT key hợp lệ (≥ 32 bytes)
- **Preservation**: JWT authentication logic, validation logic, và configuration hierarchy phải giữ nguyên
- **User Secrets**: Cơ chế lưu trữ secrets trong development của ASP.NET Core (UserSecretsId: 49d42c98-143d-4337-84fc-56297ff24e32)
- **Configuration Hierarchy**: Thứ tự ưu tiên: Command-line > Environment Variables > User Secrets > appsettings.{Environment}.json > appsettings.json
- **HMAC-SHA256**: Thuật toán mã hóa yêu cầu key tối thiểu 256 bits (32 bytes)
- **ChuongTrinh.cs**: File khởi động backend tại `backend/phuongxa-api/src/PhuongXa.API/ChuongTrinh.cs` (line 121 validation)
- **DichVuJwt.cs**: Service tạo JWT tokens tại `backend/phuongxa-api/src/PhuongXa.Infrastructure/CacDichVu/DichVuJwt.cs`

## Bug Details

### Bug Condition

Bug xảy ra khi backend khởi động và User Secrets chứa Jwt:Key có độ dài không đủ cho HMAC-SHA256. Validation logic trong ChuongTrinh.cs và DichVuJwt.cs phát hiện key ngắn hơn 32 bytes và throw exception, khiến backend crash.

**Formal Specification:**
```
FUNCTION isBugCondition(input)
  INPUT: input of type BackendStartupConfiguration
  OUTPUT: boolean
  
  RETURN input.userSecretsExists = true
         AND input.userSecrets["Jwt:Key"] IS NOT NULL
         AND UTF8ByteLength(input.userSecrets["Jwt:Key"]) < 32
         AND input.validationEnabled = true
END FUNCTION
```

### Examples

- **Example 1**: User Secrets chứa `"Jwt:Key": "short_key_16byte"` (16 bytes) → Backend crash với error "Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: 16 bytes"
- **Example 2**: User Secrets chứa `"Jwt:Key": "abc123"` (6 bytes) → Backend crash với error "Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: 6 bytes"
- **Example 3**: User Secrets chứa `"Jwt:Key": "CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ"` (64 bytes) → Backend khởi động thành công
- **Edge Case**: User Secrets không tồn tại hoặc không chứa Jwt:Key → Backend sử dụng key từ appsettings.Development.json và khởi động thành công

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- JWT authentication logic trong DichVuJwt.cs phải tiếp tục hoạt động chính xác với key hợp lệ
- Validation logic trong ChuongTrinh.cs (line 121) và DichVuJwt.cs phải tiếp tục throw exception cho key không hợp lệ
- Configuration hierarchy của ASP.NET Core phải được tôn trọng (User Secrets > appsettings.Development.json)
- JWT token generation và validation phải hoạt động giống như trước khi có bug

**Scope:**
Tất cả các input KHÔNG liên quan đến User Secrets override của Jwt:Key phải hoạt động bình thường. Bao gồm:
- Backend khởi động với JWT key hợp lệ từ appsettings.json hoặc appsettings.Development.json
- JWT authentication với key hợp lệ từ bất kỳ configuration source nào
- Các configuration settings khác (ConnectionStrings, Cors, FileStorage, etc.)

## Hypothesized Root Cause

Dựa trên bug description và code analysis, nguyên nhân chính là:

1. **User Secrets Override**: User Secrets (UserSecretsId: 49d42c98-143d-4337-84fc-56297ff24e32) đang chứa Jwt:Key với giá trị ngắn hơn 32 bytes
   - ASP.NET Core configuration system ưu tiên User Secrets cao hơn appsettings.Development.json
   - Key từ User Secrets override key hợp lệ trong appsettings.Development.json

2. **UTF8 Encoding**: Key được encode bằng UTF8 trong ChuongTrinh.cs (line 118) và DichVuJwt.cs
   - Key 16 ký tự ASCII → 16 bytes UTF8 (không đủ cho HMAC-SHA256)
   - Validation logic yêu cầu tối thiểu 32 bytes

3. **Validation Timing**: Validation xảy ra ngay khi backend khởi động
   - ChuongTrinh.cs line 121: `if (keyBytes.Length < 32) throw ...`
   - DichVuJwt.cs constructor: tương tự validation
   - Không có cơ chế fallback hoặc warning

4. **User Secrets Location**: User Secrets được lưu tại:
   - Windows: `%APPDATA%\Microsoft\UserSecrets\49d42c98-143d-4337-84fc-56297ff24e32\secrets.json`
   - Linux/macOS: `~/.microsoft/usersecrets/49d42c98-143d-4337-84fc-56297ff24e32/secrets.json`

## Correctness Properties

Property 1: Bug Condition - Backend Khởi Động Với JWT Key Hợp Lệ

_For any_ backend startup configuration where User Secrets does not contain an invalid Jwt:Key (either absent or valid ≥32 bytes), the backend SHALL start successfully and use a valid JWT key for authentication.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - JWT Authentication và Validation Logic

_For any_ configuration where JWT key is valid (≥32 bytes) from any source (appsettings, User Secrets, Environment Variables), the backend SHALL produce exactly the same JWT authentication behavior as before the fix, preserving token generation, validation, and security.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Giả sử root cause analysis đúng, fix sẽ xóa hoặc cập nhật User Secrets:

**File**: User Secrets location (platform-dependent)

**Approach**: Xóa hoặc cập nhật Jwt:Key trong User Secrets

**Specific Changes**:
1. **Locate User Secrets File**: Tìm file secrets.json tại:
   - Windows: `%APPDATA%\Microsoft\UserSecrets\49d42c98-143d-4337-84fc-56297ff24e32\secrets.json`
   - Linux/macOS: `~/.microsoft/usersecrets/49d42c98-143d-4337-84fc-56297ff24e32/secrets.json`

2. **Option A - Remove Jwt:Key**: Xóa entry "Jwt:Key" khỏi secrets.json
   - Backend sẽ fallback sang appsettings.Development.json
   - Đơn giản và ít rủi ro nhất

3. **Option B - Update Jwt:Key**: Cập nhật với key hợp lệ từ appsettings.Development.json
   - Copy key: `"CCFZhl54yGAhYN4DHTDEb14Zzs6Swc6QJHrGAAEw/SZYyYyk/skj+qMKaM5MLyhJ"`
   - Đảm bảo consistency giữa các môi trường

4. **Option C - Delete Entire User Secrets**: Xóa toàn bộ thư mục User Secrets
   - Nếu không có secrets quan trọng khác
   - Reset hoàn toàn User Secrets

5. **Verification**: Sau khi fix, chạy backend và kiểm tra:
   - Backend khởi động thành công
   - Console log hiển thị: "DEBUG: JWT Key as UTF8: 64 bytes" (hoặc ≥32)
   - JWT authentication hoạt động bình thường

## Testing Strategy

### Validation Approach

Testing strategy gồm hai giai đoạn: đầu tiên, xác nhận bug tồn tại với User Secrets không hợp lệ; sau đó, verify fix hoạt động đúng và không ảnh hưởng đến existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Xác nhận bug tồn tại TRƯỚC KHI implement fix. Confirm hoặc refute root cause analysis.

**Test Plan**: Tạo User Secrets với Jwt:Key ngắn, khởi động backend, và observe crash. Điều này confirm rằng User Secrets đang override appsettings.Development.json.

**Test Cases**:
1. **Short Key Test**: Tạo User Secrets với `"Jwt:Key": "short_key_16byte"` → Backend crash với error "16 bytes" (will fail on unfixed code)
2. **Very Short Key Test**: Tạo User Secrets với `"Jwt:Key": "abc"` → Backend crash với error "3 bytes" (will fail on unfixed code)
3. **No User Secrets Test**: Xóa User Secrets hoàn toàn → Backend khởi động thành công với key từ appsettings.Development.json (will pass on unfixed code)
4. **Valid User Secrets Test**: Tạo User Secrets với key 64 bytes → Backend khởi động thành công (will pass on unfixed code)

**Expected Counterexamples**:
- Backend crash khi User Secrets chứa Jwt:Key < 32 bytes
- Error message: "Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: X bytes"
- Possible causes: User Secrets override, UTF8 encoding tạo ra key ngắn

### Fix Checking

**Goal**: Verify rằng với mọi input có bug condition, fixed configuration cho phép backend khởi động thành công.

**Pseudocode:**
```
FOR ALL startupConfig WHERE isBugCondition(startupConfig) DO
  result := applyFix(startupConfig)  // Remove or update User Secrets
  backendStartup := startBackend(result)
  ASSERT backendStartup.success = true
  ASSERT backendStartup.jwtKeyBytes >= 32
END FOR
```

### Preservation Checking

**Goal**: Verify rằng với mọi input KHÔNG có bug condition, backend behavior không thay đổi.

**Pseudocode:**
```
FOR ALL startupConfig WHERE NOT isBugCondition(startupConfig) DO
  ASSERT startBackend_original(startupConfig) = startBackend_fixed(startupConfig)
END FOR
```

**Testing Approach**: Property-based testing được khuyến nghị cho preservation checking vì:
- Tự động generate nhiều test cases với các configuration khác nhau
- Catch edge cases mà manual unit tests có thể bỏ sót
- Đảm bảo mạnh mẽ rằng behavior không thay đổi cho tất cả non-buggy inputs

**Test Plan**: Observe behavior trên UNFIXED code với valid configurations, sau đó viết property-based tests capture behavior đó.

**Test Cases**:
1. **Valid appsettings.json Key**: Observe backend khởi động thành công với key từ appsettings.Development.json, verify behavior giữ nguyên sau fix
2. **Valid User Secrets Key**: Observe backend khởi động thành công với User Secrets chứa key hợp lệ, verify behavior giữ nguyên sau fix
3. **JWT Token Generation**: Observe JWT tokens được tạo đúng với valid key, verify tokens giống nhau sau fix
4. **JWT Token Validation**: Observe JWT validation hoạt động đúng, verify validation logic không thay đổi sau fix

### Unit Tests

- Test backend startup với User Secrets chứa key ngắn (< 32 bytes) - expect crash trước fix
- Test backend startup sau khi xóa Jwt:Key từ User Secrets - expect success
- Test backend startup với User Secrets chứa key hợp lệ (≥ 32 bytes) - expect success
- Test validation logic trong ChuongTrinh.cs và DichVuJwt.cs với các key lengths khác nhau

### Property-Based Tests

- Generate random User Secrets configurations và verify backend khởi động đúng với valid keys
- Generate random JWT key lengths và verify validation logic hoạt động đúng
- Test configuration hierarchy với nhiều sources (appsettings, User Secrets, Environment Variables)

### Integration Tests

- Test full backend startup flow sau khi fix User Secrets
- Test JWT authentication end-to-end với key từ appsettings.Development.json
- Test rằng các API endpoints yêu cầu authentication hoạt động bình thường sau fix
- Test switching giữa các configuration sources và verify JWT authentication consistency
