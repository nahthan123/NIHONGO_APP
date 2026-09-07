# Sử dụng Nginx để phục vụ ứng dụng web tĩnh (HTML, CSS, JS)
FROM nginx:alpine

# Xóa cấu hình trang chủ mặc định của Nginx (để tránh lỗi)
RUN rm -rf /usr/share/nginx/html/*

# Copy toàn bộ code vào thư mục phục vụ của Nginx
COPY . /usr/share/nginx/html

# Mở port 80 (Nginx mặc định chạy ở port 80)
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
