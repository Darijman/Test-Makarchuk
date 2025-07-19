import type { Metadata } from 'next';
import { Header } from '@/ui/header/Header';
import { ThemeProvider } from 'next-themes';
import { ConfigProvider } from 'antd';
import { theme } from '@/antdConfig';
import { ReduxProvider } from '@/providers/ReduxProvider';

import '@ant-design/v5-patch-for-react-19';
import './globals.css';

export const metadata: Metadata = {
  title: 'Test-Makarchuk',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <ConfigProvider theme={theme}>
            <ThemeProvider attribute='data-theme' defaultTheme='system' enableSystem>
              <Header />
              <main>{children}</main>
            </ThemeProvider>
          </ConfigProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
