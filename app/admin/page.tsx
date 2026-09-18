import { AdminDashboard } from "@/components/admin-dashboard";
import { getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  const data = await getSiteData();
  return (
    <AdminDashboard
      announcements={data.announcements}
      classes={data.classes}
      gallery={data.gallery}
      highlights={data.highlights}
      coaches={data.coaches}
      mission={data.mission}
      vision={data.vision}
      joinEmail={data.joinEmail}
    />
  );
}
