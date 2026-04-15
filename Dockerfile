FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build
RUN npx tsc server/index.ts --outDir server-dist --module commonjs --target ES2020 --esModuleInterop --skipLibCheck true

FROM node:20-alpine AS runner
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server-dist ./server-dist
EXPOSE 4174
CMD ["node", "server-dist/index.js"]
