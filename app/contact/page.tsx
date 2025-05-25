// app/contact/page.tsx
import React from 'react';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900 p-8 text-slate-800 dark:text-neutral-200">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-8">Get in Touch</h1>

        <p className="mb-6 text-lg text-center max-w-2xl mx-auto">
          Have questions, feedback, or need assistance? We're here to help!
          Reach out to us using the options below, and we'll get back to you as soon as possible.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Email Card */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-neutral-800 rounded-lg shadow-sm border border-slate-200 dark:border-neutral-700">
            <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400 mb-3" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-neutral-100 mb-2">Email Us</h2>
            <p className="text-slate-600 dark:text-neutral-300 mb-4">
              For general inquiries, support, or partnership opportunities.
            </p>
            <a
              href="mailto:support@imageconverterpro.com"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" /> Send Email
            </a>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2">
              We typically respond within 24-48 hours.
            </p>
          </div>

          {/* Feedback/Suggestions Card */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-neutral-800 rounded-lg shadow-sm border border-slate-200 dark:border-neutral-700">
            <MessageSquare className="w-10 h-10 text-green-600 dark:text-green-400 mb-3" />
            <h2 className="text-xl font-semibold text-slate-700 dark:text-neutral-100 mb-2">Send Feedback</h2>
            <p className="text-slate-600 dark:text-neutral-300 mb-4">
              Help us improve! Share your thoughts, suggestions, or report a bug.
            </p>
            {/* You could link this to a simple feedback form, or another email address */}
            <a
              href="mailto:feedback@imageconverterpro.com"
              className="inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
            >
              <MessageSquare className="w-5 h-5 mr-2" /> Give Feedback
            </a>
            <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2">
              Your input is invaluable to us.
            </p>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-12 text-center">
          <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
          <h2 className="text-xl font-semibold text-slate-700 dark:text-neutral-100 mb-2">Our Location</h2>
          <p className="text-slate-600 dark:text-neutral-300 text-lg">
            Proudly developed in <b>Ireland</b>.
          </p>
          <p className="text-sm text-slate-500 dark:text-neutral-400 mt-2">
            While we operate primarily online, our roots are here.
          </p>
        </div>

        <p className="mt-12 text-center text-slate-600 dark:text-neutral-300">
          We look forward to hearing from you!
        </p>
      </div>
    </div>
  );
}