// /app/auth.ts (ou dans /pages/api/auth/[...nextauth].ts si vous n'utilisez pas le Route Handler)

import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const isProduction = process.env.NODE_ENV === 'production';

// Vos URLs en fonction de l'environnement
const mainAppUrl = isProduction ? 'https://www.linkeyss.com' : 'http://localhost:3000';

const docsUrl = isProduction ? 'https://doc.linkeyss.com' : 'http://localhost:3001';

export const authConfig: NextAuthConfig = {
  // -- 1) Secret identique à Site 1
  secret: process.env.NEXTAUTH_SECRET,

  // -- 2) Session en mode JWT (comme Site 1)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },

  // -- 3) Cookies
  cookies: {
    // Au minimum, il faut configurer `sessionToken` de la même façon
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        // Pour un SSO correct entre `www.linkeyss.com` et `doc.linkeyss.com`,
        // il faut généralement sameSite: 'none'.
        sameSite: 'none',
        path: '/',
        secure: isProduction,
        // Mettre le domaine parent .linkeyss.com
        domain: isProduction ? '.linkeyss.com' : undefined,
      },
    },
    callbackUrl: {
      name: 'next-auth.callback-url',
      options: {
        domain: isProduction ? '.linkeyss.com' : undefined,
        path: '/',
        secure: isProduction,
        sameSite: 'none',
      },
    },
    csrfToken: {
      name: 'next-auth.csrf-token',
      options: {
        domain: isProduction ? '.linkeyss.com' : undefined,
        path: '/',
        secure: isProduction,
        sameSite: 'none',
      },
    },
  },

  // -- 4) Providers
  // Ici, vous pouvez laisser un CredentialsProvider "vide"
  // si vous ne voulez pas authentifier directement sur le site 2.
  // (on se contente de lire la session depuis le cookie)
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {},
      async authorize() {
        // Le site 2 n'a pas besoin d'autoriser un login direct
        // On peut juste renvoyer null si on n'utilise pas le login ici.
        return null;
      },
    }),
  ],

  // -- 5) Pages personnalisées (signIn, etc.)
  // On redirige vers la page de login de `www.linkeyss.com`
  pages: {
    signIn: `${mainAppUrl}/login`,
  },

  // -- 6) Callbacks
  callbacks: {
    async jwt({ token, user }) {
      // Comme on ne fait pas de login direct ici,
      // on se contente de renvoyer le token tel quel.
      // Si un cookie NextAuth existe déjà, NextAuth va le décoder
      // et le passer ici.
      console.log('JWT Callback (docs):', token, user);
      return token;
    },
    async session({ session, token }) {
      // Si on veut exposer les mêmes infos qu’au site 1,
      // on peut recopier les champs si on souhaite.
      console.log('Session Callback (docs):', session, token);
      // Ex: session.accessToken = token.accessToken
      // Ex: session.userId = token.userId
      return session;
    },
  },

  // -- 7) Optionnel : mode debug
  debug: !isProduction,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
