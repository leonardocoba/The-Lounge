const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <head>{/* Add global metadata, links, or other head elements here */}</head>
    <body>{children}</body>
  </html>
);

export default RootLayout;
