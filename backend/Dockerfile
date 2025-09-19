FROM node:20-alpine

WORKDIR /app

# מתקין תלויות (כולל Prisma CLI שיש לך ב-deps לפי package.json)
COPY package*.json ./
RUN npm ci

# מעתיקים את הקוד (כולל prisma/)
COPY . .

# מייצרים את Prisma Client כבר בזמן ה-build של האימג'
RUN npx prisma generate

# בונים את Nest ל-dist
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/main.js"]
