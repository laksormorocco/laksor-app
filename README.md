# 🇲🇦 LAKSOR — Tour Guide Morocco

Marketplace connectant touristes et guides locaux certifiés au Maroc.

## 🚀 Setup rapide (GitHub Codespaces)

```bash
# 1. Installer les dépendances
npm install

# 2. Copier et remplir les variables d'environnement
cp .env.example .env.local

# 3. Générer le client Prisma
npm run db:generate

# 4. Pousser le schéma vers Supabase
npm run db:push

# 5. Lancer le serveur
npm run dev
```

## ✏️ Personnaliser le branding

Modifier `content/branding.ts` pour changer :
- Logo, nom, tagline
- Couleurs
- Image hero
- Catégories
- Villes

Modifier `config/site.ts` pour changer :
- Navigation
- Commission
- Villes disponibles
- Langues

## 📦 Stack

- **Next.js 14** App Router + TypeScript
- **Supabase** Auth + PostgreSQL
- **Prisma** ORM
- **TailwindCSS** + Shadcn/ui
- **Stripe** Checkout
- **UploadThing** (photos)
- **Framer Motion**
- **Vercel** ready

## 🗄️ Base de données

```bash
npm run db:push      # Pousser le schéma
npm run db:studio    # Interface graphique Prisma
npm run db:seed      # Données de démo
```

## 🚢 Déploiement Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Variables d'env à configurer sur vercel.com :
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# DATABASE_URL, DIRECT_URL
# STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET
# UPLOADTHING_SECRET, UPLOADTHING_APP_ID
```
