import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { HangButtons } from "@/components/hang-buttons";
import { LocalBusiness } from "@/components/local-business";
import { StartAtTop } from "@/components/start-at-top";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-plum">
      <StartAtTop />
      <LocalBusiness />
      <Nav />
      <main>{children}</main>
      <Footer />
      <HangButtons />
    </div>
  );
}
