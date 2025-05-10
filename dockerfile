# ===== STAGE 1: Build =====
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 종속성 설치를 위한 package.json만 복사
COPY package.json package-lock.json* ./

# 종속성 설치 (npm ci 권장 - CI 환경에 적합)
RUN npm ci

# 나머지 프로젝트 파일 복사
COPY . .

# Vite 빌드 (build 폴더 생성됨)
RUN npm run build

# ===== STAGE 2: Serve =====
FROM nginx:alpine

# Nginx 설정 파일 교체 (선택)
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
