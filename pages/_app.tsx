import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import SidebarLayout from '@/components/SidebarLayout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SidebarLayout>
      <Component {...pageProps} />
    </SidebarLayout>
  );
}