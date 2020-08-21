import { useSession } from 'next-auth/client';
import { CampaignList } from '@app/components/campaigns/campaign-list';
import { Layout } from '@app/components/layout';

export default function Home() {
  const [session] = useSession();
  return <Layout>{session && <CampaignList />}</Layout>;
}
