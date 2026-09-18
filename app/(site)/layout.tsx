import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HangButtons } from "@/components/hang-buttons";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-plum">
      <Nav />
      <main>{children}</main>
      <Footer />
      <HangButtons />
    </div>
  );
}
