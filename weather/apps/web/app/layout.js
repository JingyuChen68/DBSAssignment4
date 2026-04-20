import "./globals.css";

export const metadata = {
  title: "Live Weather Dashboard",
  description: "Assignment 4 starter"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
