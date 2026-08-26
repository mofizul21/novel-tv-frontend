const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By creating an account or using Drip TV, you agree to be bound by these Terms of Use. If you do not agree, please do not use the service.",
  },
  {
    title: "2. Your Account",
    body: "You must be at least 18 years old, or have parental consent, to create a Drip TV account. You are responsible for keeping your login credentials secure and for all activity under your account.",
  },
  {
    title: "3. Subscriptions & Billing",
    body: "Subscriptions renew automatically at the end of each billing cycle until cancelled. Prices may change with advance notice. Pay-per-view purchases are billed separately and are non-refundable once viewing has started.",
  },
  {
    title: "4. Use of the Service",
    body: "Drip TV grants you a limited, non-exclusive, non-transferable license to stream content for personal, non-commercial use. Content may not be downloaded, redistributed, publicly performed, or used to train machine learning models without our written permission.",
  },
  {
    title: "5. Content & Availability",
    body: "Our catalog of movies, shows, and live channels changes over time due to licensing agreements. We do not guarantee that any specific title will remain available.",
  },
  {
    title: "6. Prohibited Conduct",
    body: "You agree not to circumvent content protection, share account access beyond your plan's device limits, or use the service in any way that violates applicable law.",
  },
  {
    title: "7. Termination",
    body: "We may suspend or terminate your account for violation of these terms. You may cancel your subscription at any time from your account settings.",
  },
  {
    title: "8. Limitation of Liability",
    body: "Drip TV is provided “as is.” To the fullest extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the service.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may update these Terms of Use from time to time. Continued use of Drip TV after changes take effect constitutes acceptance of the revised terms.",
  },
  {
    title: "10. Contact Us",
    body: "Questions about these terms? Reach us through the Contact Us page.",
  },
];

export default function TermsOfUsePage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-10">
      <h1 className="font-heading text-5xl uppercase text-text-primary sm:text-6xl">
        Terms of Use
      </h1>
      <p className="mt-2 font-body text-sm text-text-muted">
        Last updated: January 1, 2026
      </p>

      <p className="mt-6 font-body text-text-secondary">
        These Terms of Use govern your access to and use of Drip TV. This is
        placeholder text for development purposes — replace with reviewed
        legal copy before launch.
      </p>

      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="font-ui text-lg font-semibold text-text-primary">
              {section.title}
            </h2>
            <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
              {section.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
