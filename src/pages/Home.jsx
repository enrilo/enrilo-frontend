export default function Home() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="w-full bg-[#F8FAFC] text-[#334155]">
        {/* HERO */}
        <section className="px-6 py-24 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] leading-tight">
              All Your Consultancy Records. <br className="hidden md:block" />
              One Powerful Platform.
            </h1>

            <p className="mt-6 text-lg text-[#334155] max-w-3xl mx-auto">
              Manage students, documents, applications, and follow-ups without spreadsheets or chaos. Enrilo is built specifically for educational consultancies.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 rounded-lg bg-[#2563EB] text-white font-semibold hover:opacity-90 transition cursor-pointer">
                Book a Free Demo
              </button>
              <button className="px-8 py-3 rounded-lg bg-[#FACC15] text-[#0F172A] font-semibold hover:opacity-90 transition cursor-pointer">
                Get Started
              </button>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Still Managing Everything in Excel?
            </h2>

            <p className="mt-4 text-[#64748B]">
              Most consultancies still rely on spreadsheets, WhatsApp messages,
              and scattered files.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6 text-left">
              {[ "Missed follow-ups and deadlines", "Confusing application statuses", "Lost or outdated documents", "No single source of truth for student data" ].map((item) => (
                <div key={item} className="p-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#94A3B8]">
                  <p className="font-medium text-[#334155]">{item}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 font-semibold text-[#2563EB]">
              Enrilo replaces chaos with clarity.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section className="px-6 py-20 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#0F172A]">
              Everything Your Consultancy Needs, In One Place
            </h2>

            <div className="mt-14 grid md:grid-cols-2 gap-10">
              <Feature title="Student Management" description="Personal details, academic history, visa status, and counseling notes, all in one unified profile." />
              <Feature title="Smart Follow-Ups" description="Automatically maintain follow up lists so your team never misses a call or reminder." />
              <Feature title="Document Storage" description="Store transcripts, offer letters, payments, and visa documents with clear received/pending status." />
              <Feature title="Application Tracking" description="Track universities applied to and see outcomes instantly whether it is accepted, rejected, or pending." />
            </div>
          </div>
        </section>

        {/* DIFFERENTIATOR */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Built Specifically for Educational Consultancies
            </h2>

            <p className="mt-6 text-[#64748B] max-w-3xl mx-auto">
              Enrilo is not a generic CRM and not another spreadsheet. It’s built
              around how consultancies actually work.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-6 text-left">
              {/* {[ "Simple UI your team can learn quickly", "Works for small and large consultancies", "No unnecessary or confusing features", "Designed for India-based workflows, scalable globally", ].map((item) => ( */}
              {[ "Simple UI your team can learn quickly", "Works for small and large consultancies", "No unnecessary or confusing features"].map((item) => (
                <div key={item} className="p-5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#94A3B8]">
                  <p className="text-[#334155]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="px-6 py-20 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-[#0F172A]">
              How Enrilo Works
            </h2>

            <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-5 gap-6 text-center">
              {[ "Add a student", "Upload documents", "Track applications", "Monitor visa & payments", "Stay on top of follow-ups" ].map((step, index) => (
                <div key={step} className="p-6 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#94A3B8]">
                  <div className="text-[#2563EB] font-bold text-xl">
                    {index + 1}
                  </div>
                  <p className="mt-3 font-medium text-[#334155]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="px-6 py-24 bg-[#1E293B] text-white">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Replace Spreadsheets for Good?
            </h2>

            <p className="mt-4 text-[#CBD5E1]">
              Bring clarity, structure, and efficiency to your consultancy
              operations.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-8 py-3 rounded-lg bg-[#2563EB] text-white font-semibold hover:opacity-90 transition cursor-pointer">
                Book a Free Demo
              </button>
              <button className="px-8 py-3 rounded-lg bg-[#FACC15] text-[#0F172A] font-semibold hover:opacity-90 transition cursor-pointer">
                Start Free Trial
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ title, description }) {
  return (
    <div className="p-6 rounded-xl bg-white border border-[#E2E8F0]">
      <h3 className="text-xl font-semibold text-[#0F172A]">{title}</h3>
      <p className="mt-3 text-[#64748B]">{description}</p>
    </div>
  );
}