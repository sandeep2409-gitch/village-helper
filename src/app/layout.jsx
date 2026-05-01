import './globals.css';

export const metadata = {
  title: 'Village Explorer',
  description: 'Discover the hidden gems of your local towns and villages',
  themeColor: '#3b82f6',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
