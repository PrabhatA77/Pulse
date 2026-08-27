import LegalLayout from "../components/legal/LegalLayout";

const PrivacyPolicyPage = () => {
  const sections = [
    {
      id: "overview",
      title: "Overview",
      content: (
        <p>
          This Privacy Policy explains what information Pulse collects, how we use it, and the choices
          you have. We collect only what's needed to run the platform and improve your experience.
        </p>
      ),
    },
    {
      id: "information-we-collect",
      title: "Information We Collect",
      content: (
        <>
          <p>Depending on how you use Pulse, we may collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              Account details — username, email, and password (hashed, never stored in plain text), or
              your Google account info if you sign in with Google
            </li>
            <li>Profile information you choose to add — full name, bio, and avatar image</li>
            <li>Code you write and submit, along with test results and AI feedback</li>
            <li>Usage data — submission history, activity by day, and dashboard progress</li>
            <li>Technical data such as the authentication cookie used to keep you signed in</li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use",
      title: "How We Use Your Information",
      content: (
        <>
          <p>We use the information we collect to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Create and secure your account, and keep you signed in</li>
            <li>Run and evaluate the code you submit against test cases</li>
            <li>Generate AI-powered feedback on your submissions</li>
            <li>Show your progress, streaks, and submission history on your dashboard</li>
            <li>Send verification codes and password reset emails</li>
            <li>Maintain platform security and prevent abuse of rate-limited endpoints</li>
          </ul>
        </>
      ),
    },
    {
      id: "third-parties",
      title: "Third-Party Services",
      content: (
        <>
          <p>Pulse relies on a small set of trusted third-party services to operate:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>A sandboxed code execution service, used only to run submitted code</li>
            <li>An AI model provider, used to generate feedback on your submissions</li>
            <li>Cloud image storage, used to host profile avatar images</li>
            <li>An email delivery service, used to send OTP verification and password reset emails</li>
            <li>Google Sign-In, if you choose to authenticate with your Google account</li>
          </ul>
          <p>
            We share only the data necessary for each service to perform its function — we don't sell
            your personal data to advertisers or data brokers.
          </p>
        </>
      ),
    },
    {
      id: "cookies",
      title: "Cookies & Local Storage",
      content: (
        <p>
          Pulse uses an HTTP-only authentication cookie to keep you logged in securely. We also store a
          lightweight theme preference (light/dark mode) in your browser's local storage. We don't use
          third-party advertising or tracking cookies.
        </p>
      ),
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: (
        <p>
          We keep your account data and submission history for as long as your account is active. If
          you delete your account, your profile, submissions, and associated data are permanently
          removed from our systems.
        </p>
      ),
    },
    {
      id: "your-choices",
      title: "Your Choices & Rights",
      content: (
        <>
          <p>You're in control of your data. From your profile settings, you can:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Update your profile information at any time</li>
            <li>Upload or remove your avatar image</li>
            <li>Change your password (for local accounts)</li>
            <li>Permanently delete your account and all associated data</li>
          </ul>
        </>
      ),
    },
    {
      id: "security",
      title: "Security",
      content: (
        <p>
          We use industry-standard practices to protect your data, including password hashing,
          HTTP-only cookies for authentication, and a sandboxed, resource-limited environment for code
          execution. No system is perfectly secure, but we take reasonable steps to protect your
          information.
        </p>
      ),
    },
    {
      id: "children",
      title: "Children's Privacy",
      content: (
        <p>
          Pulse is not directed at children under 13, and we don't knowingly collect personal
          information from children under that age.
        </p>
      ),
    },
    {
      id: "changes",
      title: "Changes to This Policy",
      content: (
        <p>
          We may update this Privacy Policy from time to time. If we make material changes, we'll
          reflect the updated date at the top of this page.
        </p>
      ),
    },
    {
      id: "contact",
      title: "Contact",
      content: (
        <p>
          If you have questions about this Privacy Policy or how your data is handled, reach out
          through the contact details on our landing page.
        </p>
      ),
    },
  ];

  return (
    <LegalLayout
      title="Privacy Policy"
      lastUpdated="August 27, 2026"
      intro="Your privacy matters to us. Here's a clear breakdown of what data Pulse collects and how it's used."
      sections={sections}
    />
  );
};

export default PrivacyPolicyPage;