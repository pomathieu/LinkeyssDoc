// auth.ts
import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const isProduction = process.env.NODE_ENV === 'production';

const mainAppUrl = isProduction ? 'https://www.linkeyss.com' : 'http://localhost:3000';
const docsUrl = isProduction ? 'https://docs.linkeyss.com' : 'http://localhost:3001';

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {},
      async authorize() {
        return null;
      },
    }),
  ],
  pages: {
    signIn: `${mainAppUrl}/login`,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        domain: isProduction ? '.linkeyss.com' : undefined, // En local, laissons le navigateur gérer
      },
    },
  },
  callbacks: {
    async jwt({ token }) {
      console.log('JWT Callback:', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback:', session);
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      console.log('Auth Status:', !!auth?.user);
      if (!auth?.user) {
        const returnUrl = encodeURIComponent(`${docsUrl}${nextUrl.pathname}`);
        return Response.redirect(`${mainAppUrl}/login?returnUrl=${returnUrl}`);
      }
      return true;
    },
  },
  trustHost: true,
  debug: true, // Activer le mode debug
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
