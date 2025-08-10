import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', // Thư mục gốc của dự án
  base: './', // Cơ sở cho tài nguyên
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'), // Alias cho thư mục src
    },
  },
  server: {
   // port: 7003, // Cổng mà ứng dụng sẽ chạy
    open: true, // Mở trình duyệt khi server khởi động
  },
  build: {
    outDir: 'dist', // Thư mục xuất ra khi build
    sourcemap: true, // Tạo sourcemap cho các tệp đã build
  },
});
