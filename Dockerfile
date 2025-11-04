# -----------------------------------------------------------
# Stage 1: Build (Compilação do Next.js)
# -----------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Argumento de build para a URL interna da API
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}
# NÃO definimos NODE_ENV=production AQUI (esse era o erro)

# Copia arquivos de dependência
COPY package.json package-lock.json ./

# Instala TODAS as dependências (incluindo devDependencies como typescript)
RUN npm install

# Copia o restante do código fonte
COPY . .

# Constrói o projeto Next.js (agora o TypeScript estará disponível)
RUN npm run build

# -----------------------------------------------------------
# Stage 2: Runtime (Servidor Next.js Standalone)
# -----------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Define NODE_ENV=production AQUI, no estágio final
ENV NODE_ENV production
ENV PORT 3000

# Copia a saída 'standalone' otimizada do estágio de build
COPY --from=builder /app/.next/standalone ./
# Copia os assets públicos
COPY --from=builder /app/public ./public
# Copia os assets estáticos do Next.js
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# Comando para iniciar o servidor Next.js standalone
CMD ["node", "server.js"]