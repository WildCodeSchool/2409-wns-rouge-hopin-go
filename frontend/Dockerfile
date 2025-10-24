FROM node:22-alpine3.21

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY tsconfig.json tsconfig.json
COPY tsconfig.app.json tsconfig.app.json
COPY tsconfig.node.json tsconfig.node.json
COPY vite.config.ts vite.config.ts
COPY codegen.ts codegen.ts
COPY postcss.config.js postcss.config.js
COPY tailwind.config.js tailwind.config.js
COPY index.html index.html
COPY public public
COPY src src

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "dev-and-codegen"] 