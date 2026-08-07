/** Sovereign Credential Registry — bare chrome; the page renders its own header. */
export default function RegistryLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex-1 bg-black">{children}</div>;
}
