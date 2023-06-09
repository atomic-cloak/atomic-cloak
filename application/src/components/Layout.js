export default function Layout({ children }) {
  return (
    <div className="overflow-x-hidden h-screen w-screen bg-black">
      {children}
    </div>
  );
}
