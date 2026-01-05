import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/AppLayout';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'ZenJournal',
  description: 'A minimalist journaling app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <AppLayout>{children}</AppLayout>
              <Toaster position="bottom-right" richColors />
            </AuthProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}