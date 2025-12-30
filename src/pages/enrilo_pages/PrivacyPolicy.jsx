export default function PrivacyPolicy() {
  return (
    <main className="flex-1 overflow-y-auto px-6 py-16">
      {/* <div className="max-w-4xl mx-auto space-y-12">
        <Section title="Effective Date" content="This Privacy Policy us effective as of 21 December, 2025." />

        <Section title="Introduction" content="Enrilo ('we', 'our', or 'us') respects your privacy and is committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, and protect your data when you use the Enrilo platform." />

        <Section title="Information We Collect"
          content={
            <>
              <p>
                We collect information to provide and improve our services.
                This may include:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Account information such as name, email address, and organization details</li>
                <li>Student-related data entered by consultancies, including personal and academic details</li>
                <li>Uploaded documents such as transcripts, payment records, and visa documents</li>
                <li>Usage data such as login activity and feature interactions</li>
              </ul>
            </>
          }
        />

        <Section title="How We Use Your Information"
          content={
            <>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Provide and maintain the Enrilo platform</li>
                <li>Manage user accounts and authentication</li>
                <li>Improve system performance and user experience</li>
                <li>Communicate important updates or service-related information</li>
                <li>Ensure platform security and prevent misuse</li>
              </ul>
            </>
          }
        />

        <Section title="Data Storage and Security" content="We implement industry-standard security measures to protect your data from unauthorized access, alteration, disclosure, or destruction. While no system is completely secure, we continuously improve our safeguards to ensure your data remains protected." />

        <Section title="Data Sharing" content="We do not sell, rent, or trade your personal data. Information may be shared only with trusted service providers who assist us in operating the platform, and only to the extent necessary to provide our services." />

        <Section title="Your Responsibilities" content="Consultancies using Enrilo are responsible for ensuring they have appropriate consent from students before storing or processing their personal data on the platform." />

        <Section title="Cookies and Tracking" content="Enrilo may use cookies or similar technologies to maintain session integrity, improve usability, and analyze platform usage. You can control cookie settings through your browser preferences." />

        <Section title="Data Retention" content="We retain your data for as long as your account remains active or as required to provide our services. Upon account termination, data may be deleted in accordance with our retention policies, unless legally required otherwise." />

        <Section title="Your Rights" content="You have the right to access, update, or request deletion of your personal information. Requests can be made by contacting us using the information provided below." />

        <Section title="Changes to This Policy" content="We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date." />

        <Section title="Terms & Conditions" content={
            <>
              <p>To view our Terms and Conditions, <span><a className="font-medium text-[#2563EB]" href="/terms">Click Here.</a></span></p>
            </>
          }
        />

        <Section title="Contact Us"
          content={
            <>
              <p>If you have any questions or concerns about this Privacy Policy, you can contact us at:</p>
              <p className="font-medium text-[#2563EB]">
                support@enrilo.com
              </p>
            </>
          }
        />
      </div> */}
      <div className="max-w-4xl mx-auto space-y-12">
        <Section title="Effective Date" content={
          <>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>This Privacy Policy is applicable as of <span className="font-bold">December 21, 2025</span>. Any changes to this policy will be specified thereon.</li>
              <li>Last updated on  <span className="font-bold">December 21, 2025</span>.</li>
            </ul>
          </>
        } />

        <Section title="Introduction" content={
            <>
              <p>
                This Privacy Policy describes Our policies and procedures on the collection,
                use and disclosure of Your information when You use the Service and tells You
                about Your privacy rights and how the law protects You.
              </p>
              <p className="mt-2">
                We use Your Personal data to provide and improve the Service. By using the
                Service, you agree to the collection and use of information in accordance
                with this Privacy Policy.
              </p>
            </>
          }
        />

        <Section title="Interpretation and Definitions"
          content={
            <>
              <h3 className="font-semibold text-[#0F172A] mt-4">Interpretation</h3>
              <p className="mt-2">
                Words with the initial letter capitalized have meanings defined below. These
                definitions apply whether they appear in singular or plural.
              </p>

              <h3 className="font-semibold text-[#0F172A] mt-4">Definitions</h3>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Account:</strong> A unique account created for You to access our Service or parts of our Service.</li>
                <li><strong>Company:</strong> Refers to Enrilo LLP, Vadodara, Gujarat, INDIA.</li>
                <li><strong>Cookies:</strong> Small files placed on Your device containing browsing details, among other uses.</li>
                <li><strong>Country:</strong> Refers to India.</li>
                <li><strong>Device:</strong> Any device that can access the Service, such as a computer, cellphone, or tablet.</li>
                <li><strong>Personal Data:</strong> Any information relating to an identified or identifiable individual.</li>
                <li><strong>Service:</strong> Refers to the Website.</li>
                <li><strong>Service Provider:</strong> Any natural or legal person who processes data on behalf of the Company.</li>
                <li><strong>Usage Data:</strong> Data collected automatically, e.g., page visit duration, device info.</li>
                <li><strong>Website:</strong> Refers to Enrilo, accessible from <a className="text-[#2563EB]" href="https://www.enrilo.com">https://www.enrilo.com</a></li>
                <li><strong>You:</strong> The individual accessing or using the Service, or the company/legal entity on whose behalf the individual accesses the Service.</li>
              </ul>
            </>
          }
        />

        <Section title="Collecting and Using Your Personal Data"
          content={
            <>
              <h3 className="font-semibold text-[#0F172A] mt-4">Types of Data Collected</h3>

              <h4 className="font-semibold text-[#2563EB] mt-2">Personal Data</h4>
              <p className="mt-1">
                We may ask You to provide personally identifiable information, such as:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Email address</li>
                <li>First and last name</li>
                <li>Phone number</li>
                <li>Address, State, Province, ZIP/Postal code, City</li>
              </ul>

              <h4 className="font-semibold text-[#2563EB] mt-4">Usage Data</h4>
              <p className="mt-1">
                Automatically collected data when using the Service, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Device IP address, browser type/version</li>
                <li>Pages visited, visit times, time spent on pages</li>
                <li>Mobile device type, unique IDs, operating system</li>
                <li>Other diagnostic data</li>
              </ul>

              <h4 className="font-semibold text-[#2563EB] mt-4">Tracking Technologies and Cookies</h4>
              <p className="mt-1">
                We use Cookies, beacons, tags, and scripts to track activity, store information,
                and analyze the Service. Cookies can be Persistent or Session.
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Necessary / Essential Cookies:</strong> Session Cookies essential for authentication and service functionality.</li>
                <li><strong>Functionality Cookies:</strong> Persistent Cookies to remember your preferences, e.g., login.</li>
              </ul>

              <h4 className="font-semibold text-[#2563EB] mt-4">Use of Your Personal Data</h4>
              <p className="mt-1">
                We may use your data to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Provide and maintain the Service</li>
                <li>Manage Your Account and registration</li>
                {/* <li>Perform contracts for purchased items or services</li> */}
                <li>Contact You regarding updates, security, or promotions</li>
                <li>Manage Your requests</li>
                {/* <li>Business transfers, mergers, or asset sales</li> */}
                {/* <li>Data analysis, improving services, and marketing</li> */}
              </ul>

              <h4 className="font-semibold text-[#2563EB] mt-4">Sharing Your Personal Data</h4>
              <p className="mt-1">
                We do not share your personal data with anyone. It is safe with us.
              </p>
              {/* <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>With Service Providers to analyze or provide the Service</li>
                <li>During mergers, acquisitions, or asset sales</li>
                <li>With Affiliates who follow this Privacy Policy</li>
                <li>With business partners for products, services, or promotions</li>
                <li>With other users in public areas if You share information publicly</li>
                <li>With Your consent for any other purpose</li>
              </ul> */}
            </>
          }
        />

        <Section title="Retention and Transfer of Your Personal Data"
          content={
            <>
              <p>
                Your data is retained only as long as necessary for the purposes outlined and to comply with legal obligations. Usage Data may be retained for shorter periods, except when used for security or service improvement.
              </p>
              <p className="mt-2">
                Data may be processed and stored outside Your jurisdiction. By submitting Your information, You consent to its transfer and ensure it is protected in accordance with this Privacy Policy.
              </p>
            </>
          }
        />

        <Section title="Disclosure of Your Personal Data"
          content={
            <>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Business Transactions:</strong> Data may be transferred in mergers or acquisitions.</li>
                <li><strong>Law enforcement:</strong> Data may be disclosed to comply with laws or valid requests by authorities.</li>
                <li><strong>Other legal requirements:</strong> To protect rights, investigate wrongdoing, ensure safety, or prevent liability.</li>
              </ul>
            </>
          }
        />

        <Section title="Security of Your Personal Data" content="We implement commercially reasonable measures to protect Your data. However, no transmission or storage method is 100% secure. Absolute security cannot be guaranteed." />

        <Section title="Links to Other Websites" content="Our Service does not contain links to third-party sites." />

        <Section title="Changes to this Privacy Policy" content="We may update this Privacy Policy periodically. Changes will be posted on this page, with the 'Last updated' date updated. Notifications may also be sent via email or on the Service." />

        <Section title="Contact Us"
          content={
            <>
              <p>If you have any questions about this Privacy Policy, you can contact us:</p>
              <p className="mt-2 font-medium">
                By email: <span className="text-[#2563EB]">support@enrilo.com</span>
              </p>
              <p className="mt-1">
                By visiting: <a href="https://www.enrilo.com/contact-us" className="text-[#2563EB] underline">https://www.enrilo.com/contact-us</a>
              </p>
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
      <h2 className="text-2xl font-semibold text-[#0F172A] mb-1">
        {title}
      </h2>
      <div className="text-[#334155] leading-relaxed">
        {content}
      </div>
    </section>
  );
}