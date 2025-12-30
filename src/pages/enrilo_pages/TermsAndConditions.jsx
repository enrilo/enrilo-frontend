export default function TermsAndConditions() {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <Section title="Effective Date" content={
            <>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>This Privacy Policy is applicable as of <span className="font-bold">December 21, 2025</span>. Any changes to this policy will be specified thereon.</li>
                <li>Last updated on  <span className="font-bold">December 21, 2025</span>.</li>
              </ul>
            </>
          } />

        <Section title="Introduction" content="These Terms and Conditions ('Terms') govern your use of the Enrilo platform. By accessing or using Enrilo, you agree to be bound by these Terms. If you do not agree, you must not use the platform." />

        <Section title="Eligibility" content="Enrilo is intended for use by educational consultancies and authorized representatives. You must be legally capable of entering into a binding agreement to use our services." />

        <Section title="Account Registration"
          content={
            <>
              <p>
                To use Enrilo, you must contact us to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide accurate and up-to-date information</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Notify us immediately of any unauthorized account use</li>
              </ul>
            </>
          }
        />

        <Section title="Use of the Platform"
          content={
            <>
              <p>You agree to use Enrilo only for lawful purposes. You must not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Upload false, misleading, or unauthorized data</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to gain unauthorized access to the platform</li>
                <li>Disrupt or interfere with platform security or functionality</li>
              </ul>
            </>
          }
        />

        <Section title="Student Data Responsibility" content="You acknowledge that any student data uploaded to Enrilo is your responsibility. You confirm that you have obtained all necessary permissions and consents from students before storing or processing their information on the platform." />

        <Section title="Data Ownership" content="You retain ownership of all data you upload to Enrilo. By using the platform, you grant Enrilo a limited license to store, process, and display this data solely for the purpose of providing the services." />

        <Section title="Subscription & Payments" content="All features of Enrilo require a paid subscription. Pricing, billing cycles, and payment terms will be clearly communicated at the time of purchase. Failure to complete payments may result in account suspension or termination." />

        <Section title="Service Availability" content="While we strive to provide uninterrupted service, Enrilo does not guarantee that the platform will always be available or error-free. Maintenance, updates, or unforeseen issues may result in temporary downtime." />

        <Section title="Termination" content="We reserve the right to suspend or terminate your account if you violate these Terms or misuse the platform. You may also terminate your account at any time, subject to applicable data retention policies." />

        <Section title="Limitation of Liability" content="To the maximum extent permitted by law, Enrilo shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform." />

        <Section title="Indemnification" content="You agree to indemnify and hold Enrilo harmless from any claims, damages, or liabilities arising from your use of the platform, including violations of these Terms or applicable laws." />

        <Section title="Changes to These Terms" content="We may update these Terms from time to time. Continued use of Enrilo after changes are posted constitutes acceptance of the revised Terms." />

        <Section title="Governing Law" content="These Terms shall be governed by and interpreted in accordance to Vadodara Jurisdiction." />

        <Section title="Contact Information"
          content={
            <>
              <p>If you have questions about these Terms, please contact us at: <span className='font-medium text-[#2563EB]'>support@enrilo.com</span></p>
            </>
          }
        />
      </div>
    </main>
  )
}

function Section({ title, content }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-[#0F172A]">
        {title}
      </h2>
      <div className="mt-1 text-[#334155] leading-relaxed">
        {content}
      </div>
    </section>
  );
}