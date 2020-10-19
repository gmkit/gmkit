import { useSession } from "next-auth/client";
import { CampaignList } from "@app/components/campaigns/campaign-list";
import { Layout } from "@app/components/layout";

export default function Home() {
  const [session] = useSession();
  return <Layout>{session ? <CampaignList /> : <LandingPage />}</Layout>;
}

function LandingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "80vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2 style={{ fontSize: "4rem" }}>gmkit</h2>

      <p style={{ fontSize: "1.8rem" }}>
        Run your {"D&D 5e"} campaigns with ease.
      </p>
    </div>
  );
}
