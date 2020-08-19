import { AuthenticationRequired } from '@components/authentication-required';

export default function CampaignListPage() {
  return (
    <AuthenticationRequired>
      <div>The List of Campaigns will be here</div>;
    </AuthenticationRequired>
  );
}
