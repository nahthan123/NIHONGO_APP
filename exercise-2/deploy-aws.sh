#!/usr/bin/env bash
# ========================================================
# Script tự động triển khai NihonGo App Exercise 2 lên AWS EC2
# ========================================================

set -e

echo "🚀 [1/4] Đang kiểm tra Docker & Docker Compose..."
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker chưa được cài đặt. Đang tiến hành cài đặt Docker..."
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo usermod -aG docker $USER
fi

echo "📦 [2/4] Đang dọn dẹp và dừng containers cũ (nếu có)..."
docker compose down || true

echo "🔨 [3/4] Đang build và khởi chạy hệ thống (Nginx + Backend API)..."
docker compose up -d --build

echo "⏳ [4/4] Đang kiểm tra trạng thái sức khỏe (Health Check)..."
sleep 5
docker compose ps

echo "=========================================================="
echo "🎉 CHÚC MỪNG! HỆ THỐNG ĐÃ ĐƯỢC TRIỂN KHAI THÀNH CÔNG LÊN AWS!"
echo "=========================================================="
echo "🌐 Ứng dụng người dùng: http://<EC2_PUBLIC_IP>/"
echo "👑 Trang Quản trị (Admin): http://<EC2_PUBLIC_IP>/admin"
echo "🔑 Tài khoản Admin kiểm tra:"
echo "   - Email: admin@nihongo.local"
echo "   - Mật khẩu: admin123"
echo "=========================================================="
