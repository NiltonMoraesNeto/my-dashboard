# 🚀 Guia Rápido de Deploy - Frontend

## Variáveis de Ambiente Necessárias

Configure no Vercel:

```env
VITE_API_BASE_URL="https://seu-backend.railway.app"
```

## Passos para Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `my-dashboard` (ou o nome da pasta do frontend)
   - **Build Command**: `npm run build` (já vem pre-configurado)
   - **Output Directory**: `dist` (já vem pre-configurado)
5. Adicione variável de ambiente:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: URL do seu backend (ex: `https://seu-backend.railway.app`)
6. Clique em "Deploy"

## Verificar Deploy

Após o deploy, você terá uma URL como:
- `https://seu-projeto.vercel.app`

## Atualizar CORS no Backend

Após obter a URL do Vercel, adicione ela na variável `FRONTEND_URL` do backend:
```env
FRONTEND_URL="https://seu-projeto.vercel.app"
```

## Troubleshooting

### Erro: "API connection failed"
**Solução**: Verifique se `VITE_API_BASE_URL` está configurada corretamente no Vercel.

### Erro: "CORS error"
**Solução**: Adicione a URL do Vercel na variável `FRONTEND_URL` do backend.

### Build falha
**Solução**: Verifique os logs no Vercel e certifique-se de que o build funciona localmente (`npm run build`).
