import './globals.css';
import 'nextra-theme-docs/style.css';
import type { Metadata } from 'next';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';
import { Banner, Head } from 'nextra/components';
import { auth } from './auth';
import { redirect } from 'next/navigation';
const isProduction = process.env.NODE_ENV === 'production';
const mainAppUrl = isProduction ? 'https://www.linkeyss.com' : 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const banner = <Banner storageKey="some-key">Linkeyss est en production 🎉</Banner>;
const footer = <Footer>MIT {new Date().getFullYear()} © Linkeyss.</Footer>;
const navbar = <Navbar logo={<b>Linkeyss</b>} />;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      dir="ltr"
      suppressHydrationWarning>
      <body className={` antialiased`}>
        <Layout
          sidebar={{}}
          banner={banner}
          navbar={navbar}
          editLink={null}
          feedback={{ content: null }}
          pageMap={await getPageMap()}
          footer={footer}>
          {children}
        </Layout>
      </body>
    </html>
  );
}
