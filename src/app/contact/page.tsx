import { InfoPage } from "@/components/layout/InfoPage";

export default function ContactPage() {
  return (
    <InfoPage title="Contact & Support">
      <p>
        Need help with your AngelsRadar account, a startup submission, or an investor
        application? Reach out and our team will get back to you.
      </p>
      <p>
        Email:{" "}
        <a href="mailto:support@angelsradar.com" className="text-accent hover:underline">
          support@angelsradar.com
        </a>
      </p>
    </InfoPage>
  );
}
