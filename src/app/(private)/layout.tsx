// import Footer from "../components/Footer";
// import Navbar from "../components/Navbar";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
