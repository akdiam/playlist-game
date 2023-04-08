// @ts-nocheck
import NextAuth, { NextAuthOptions, TokenSet } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import { PrismaClient } from '@prisma/client';
import { PrismaAdapter } from '@next-auth/prisma-adapter';

const prisma = new PrismaClient();

const clientId = process.env.SPOTIFY_CLIENT_ID ?? '';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET ?? '';

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: clientId,
      clientSecret: clientSecret,
      authorization: {
        params: {
          scope: 'user-read-email, user-read-private',
        },
      },
    }),
  ],
  secret: process.env.SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user }) {
      if (user) {
        const userAccount = await prisma.account.findFirst({
          where: { userId: user.id, provider: 'spotify' },
        });
        let accessToken = userAccount?.access_token;
        if (userAccount.expires_at * 1000 < Date.now()) {
          try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: userAccount.refresh_token,
                client_id: clientId,
                client_secret: clientSecret,
              }),
              method: 'POST',
            });

            const tokens: TokenSet = await response.json();
            console.log(tokens);
            if (!response.ok) throw tokens;

            await prisma.account.update({
              data: {
                access_token: tokens.access_token,
                expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                refresh_token: tokens.refresh_token ?? userAccount.refresh_token,
              },
              where: {
                provider_providerAccountId: {
                  provider: 'spotify',
                  providerAccountId: userAccount.providerAccountId,
                },
              },
            });
            accessToken = tokens.access_token;
          } catch (error) {
            console.error('Error refreshing access token', error);
          }
        }
        session.accessToken = userAccount?.access_token;
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: { strategy: 'database' },
};

export default NextAuth(authOptions);
