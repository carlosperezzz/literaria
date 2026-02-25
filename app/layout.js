export const metadata = {
  title: 'LiteratIA',
  description: 'Tu librero de confianza con IA',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
