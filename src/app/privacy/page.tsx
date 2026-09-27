import { InfoPage } from "@/components/layout/InfoPage";

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p>
        AngelsRadar is private by default. Startup profiles and pitch decks are only visible to
        approved, logged-in investors. Investor information is not publicly accessible.
      </p>
      <p>
        Founder personal contact information is never exposed publicly through a startup profile.
        AngelsRadar may use a founder&apos;s contact details internally when facilitating an
        introduction.
      </p>
      <p>
        We collect only the information needed to review and match startups and investors:
        account details, profile information you submit, and basic usage analytics to understand
        how the network is growing.
      </p>
      <p>
        For questions about your data, contact us via the Contact page.
      </p>
    </InfoPage>
  );
}
