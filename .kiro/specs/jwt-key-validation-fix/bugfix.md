# Bugfix Requirements Document

## Introduction

Backend API đang gặp lỗi crash khi khởi động do JWT key validation thất bại. Mặc dù các file appsettings.json và appsettings.Development.json đã có JWT key hợp lệ (64 ký tự), nhưng backend vẫn báo lỗi "Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: 16 bytes."

Nguyên nhân: User Secrets (UserSecretsId: 49d42c98-143d-4337-84fc-56297ff24e32) đang override JWT key với một giá trị ngắn hơn (16 bytes), khiến backend không thể khởi động.

Impact: Backend không thể khởi động, toàn bộ hệ thống API không hoạt động.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN backend khởi động với User Secrets chứa JWT key ngắn hơn 32 bytes THEN hệ thống crash với lỗi "Jwt:Key phải có ít nhất 32 bytes (256 bits) cho HMAC-SHA256. Hiện tại: 16 bytes"

1.2 WHEN User Secrets override JWT key từ appsettings.json với giá trị không hợp lệ THEN validation trong ChuongTrinh.cs (line 121) và DichVuJwt.cs phát hiện lỗi và throw exception

1.3 WHEN JWT key từ User Secrets có độ dài 16 bytes THEN UTF8 encoding tạo ra key không đủ độ dài tối thiểu cho HMAC-SHA256

### Expected Behavior (Correct)

2.1 WHEN backend khởi động THEN hệ thống SHALL sử dụng JWT key hợp lệ có độ dài ít nhất 32 bytes (256 bits)

2.2 WHEN User Secrets chứa JWT key không hợp lệ THEN hệ thống SHALL xóa hoặc cập nhật User Secrets với JWT key hợp lệ từ appsettings.Development.json

2.3 WHEN JWT key được đọc từ configuration THEN hệ thống SHALL validate và sử dụng key có độ dài ≥ 32 bytes để đảm bảo HMAC-SHA256 hoạt động đúng

2.4 WHEN backend khởi động thành công THEN JWT authentication SHALL hoạt động bình thường với key hợp lệ

### Unchanged Behavior (Regression Prevention)

3.1 WHEN JWT key trong appsettings.json và appsettings.Development.json đã hợp lệ (64 ký tự) THEN hệ thống SHALL CONTINUE TO sử dụng các key này nếu không có User Secrets override

3.2 WHEN JWT authentication được sử dụng với key hợp lệ THEN hệ thống SHALL CONTINUE TO tạo và validate JWT tokens chính xác

3.3 WHEN configuration được đọc từ nhiều nguồn (appsettings, User Secrets, Environment Variables) THEN hệ thống SHALL CONTINUE TO tuân theo thứ tự ưu tiên của ASP.NET Core configuration system

3.4 WHEN validation logic trong DichVuJwt.cs kiểm tra JWT key THEN hệ thống SHALL CONTINUE TO throw exception cho các key không hợp lệ
