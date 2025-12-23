import { useState } from "react";

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");

  return (
    <main className="flex-1 overflow-y-auto px-6 py-16">
      <div className="max-w-4xl mx-auto space-y-12 text-center">
        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
          Simple Pricing for Growing Consultancies
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Start simple with our Regular plan or unlock advanced control with Enterprise.
        </p>

        {/* Billing Toggle */}
        <div className="mt-10 flex justify-center">
          <div className="bg-slate-200 rounded-full p-1 flex">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                billing === "monthly"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-600"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                billing === "annual"
                  ? "bg-white text-slate-900 shadow"
                  : "text-slate-600"
              }`}
            >
              Annual Billing
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {/* Regular Plan */}
          <div className="relative bg-white rounded-2xl border border-slate-200 p-8 shadow-lg flex flex-col">
            <h2 className="text-3xl font-bold text-slate-900">Regular</h2>
            <p className="mt-2 text-slate-600">
              Everything you need to manage students efficiently.
            </p>

            {/* Price */}
            <div className="mt-6 min-h-[96px]">
              <span className="text-4xl font-extrabold text-slate-900">
                ₹{billing === "monthly" ? "6900" : "5175"}
              </span>
              <span className="text-slate-600 text-sm"> /month</span>

              {billing === "annual" && (
                <p className="text-sm text-green-600 mt-1">
                  Save 25% on annual billing
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="mt-8 mb-4 space-y-4 text-left">
              {[
                "2 Master Admin",
                "10 Users",
                "Unlimited student records",
                "Follow-ups & reminders",
                "Document storage",
                "Visa & application tracking",
                "Analytics & reporting",
                "Email support",
                "Role-based access control",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-blue-600">✓</span>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className="mt-auto w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition cursor-pointer">
              Get Started
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition flex flex-col">
            <h2 className="text-3xl font-bold text-slate-900">Enterprise</h2>
            <p className="mt-2 text-slate-600">
              Tailored solutions for large teams and institutions.
            </p>

            {/* Price */}
            <div className="mt-6 min-h-[96px]">
              <span className="text-3xl font-extrabold text-slate-900">
                Custom Pricing
              </span>
              <p className="text-sm text-slate-500 mt-1">
                Based on team size & requirements
              </p>
            </div>

            {/* Features */}
            <ul className="mt-8 mb-4 space-y-4 text-left">
              {[
                "Custom Number of Master Admin",
                "Custom Number of Users",
                "Follow-ups & reminders",
                "Document storage",
                "Visa & application tracking",
                "Analytics & reporting",
                // "Custom workflows & fields",
                "Role-based access control",
                // "Dedicated account manager",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-slate-900">✓</span>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button className="mt-auto w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-16 text-sm text-slate-500">
          No hidden fees. Cancel anytime. Secure & compliant infrastructure included.
        </p>
      </div>
    </main>
  );
}
