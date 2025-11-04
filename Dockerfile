# -----------------------------------------------------------
# Stage 1: Dependências e Build (usa imagem Node completa)
# -----------------------------------------------------------
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Variável de ambiente necessária para o build do Next.js
# Usamos o endereço interno do Docker Compose para o backend (http://backend:3000/api)
# O Next.js precisa dessa variável definida no momento do build se ela for usada
# em Server Components ou Server Actions.
# Nota: Você pode precisar ajustar o valor da porta (3000) de acordo com o mapeamento
# de portas INTERNAS do seu backend no docker-compose.yml.
ARG NEXT_PUBLIC_API_URL

# Configura o ambiente
ENV NODE_ENV production
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}

# Copia arquivos de configuração e dependências
COPY package.json package-lock.json ./

# Instala dependências de build e produção
RUN npm install

# Copia o restante do código
COPY . .

# Habilita a saída standalone (Standalone Output) no next.config.ts.
# Se você não tem essa configuração lá, o build pode falhar.
# É recomendável adicionar: output: 'standalone', ao seu next.config.ts
RUN npx next build

# -----------------------------------------------------------
# Stage 2: Runtime (usa imagem Node leve)
# -----------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Define o NODE_ENV
ENV NODE_ENV production
# Define a porta que o Next.js vai escutar dentro do container (padrão 3000)
ENV PORT 3000

# Copia a saída standalone e o diretório público
# .next/standalone já contém a estrutura mínima de um servidor Node.js
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
# Copia node_modules essenciais que não foram incluídos no standalone, se necessário
COPY --from=builder /app/node_modules/next/dist/server/lib/load-components.js ./node_modules/next/dist/server/lib/load-components.js
# Adicione outras pastas que possam ter sido omitidas do standalone, se necessário
# Exemplo: COPY --from=builder /app/node_modules/@gitii/react-archer ./node_modules/@gitii/react-archer

# O frontend precisa da URL da API
# (Se for usado em Client Components, ele pode ser injetado via runtime)
ENV NEXT_PUBLIC_API_URL ${NEXT_PUBLIC_API_URL}

# Comando de inicialização do servidor standalone
CMD ["node", "server.js"]