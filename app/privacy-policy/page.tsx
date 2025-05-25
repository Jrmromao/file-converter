// app/privacy-policy/page.tsx
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900 p-8 text-slate-800 dark:text-neutral-200">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-8">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy describes how <b>PNG Convert</b> ("we," "us," or "our") collects, uses, and discloses your information when you use our image conversion web application (the "Service"). We are committed to protecting your privacy.
        </p>

        <p className="mb-6">
          By using our Service, you agree to the collection and use of information in accordance with this policy.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">1. Information We Collect</h2>
        <p className="mb-2">We collect very limited information from you to provide and improve our Service:</p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li className="mb-2">
            <b>Files You Upload:</b> When you upload an image for conversion, the file is temporarily processed on our servers to perform the conversion. We do not store your uploaded files or converted files on our servers after the conversion is complete and the file is downloaded by you or after a short period (typically a few minutes) to allow for download.
          </li>
          <li className="mb-2">
            <b>Technical Data:</b> We may automatically collect certain technical information when you access and use the Service, such as your IP address, browser type, operating system, and general usage patterns. This data is used for anonymous analytics to improve service performance and is not linked to your personal identity.
          </li>
          <li>
            <b>Google Analytics:</b> We use Google Analytics to understand how our Service is used. Google Analytics collects information such as how often users visit this site, what pages they visit when they do so, and what other sites they used prior to coming to this site. We use the information we get from Google Analytics only to improve this site. Google Analytics collects only the IP address assigned to you on the date you visit this site, rather than your name or other identifying information. We do not combine the information collected through the use of Google Analytics with personally identifiable information. Although Google Analytics plants a permanent cookie on your web browser to identify you as a unique user the next time you visit this site, the cookie cannot be used by anyone but Google. Google’s ability to use and share information collected by Google Analytics about your visits to this site is restricted by the Google Analytics Terms of Use and the Google Privacy Policy. You can prevent Google Analytics from recognizing you on return visits to this site by disabling cookies on your browser.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">2. How We Use Your Information</h2>
        <p className="mb-4">We use the information we collect for the following purposes:</p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li className="mb-2">To provide and maintain our Service, including facilitating image conversions.</li>
          <li className="mb-2">To improve, personalize, and expand our Service.</li>
          <li className="mb-2">To understand and analyze how you use our Service.</li>
          <li className="mb-2">To detect, prevent, and address technical issues.</li>
          <li>To display relevant advertisements through Google AdSense (see Section 4).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">3. Data Retention</h2>
        <p className="mb-4">
          As mentioned, <b>we do not store your uploaded or converted image files long-term.</b> Files are deleted from our servers immediately after download or within a very short timeframe to ensure your privacy. Technical data collected for analytics is anonymized and retained only as long as necessary for analytical purposes.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">4. Third-Party Services</h2>
        <p className="mb-2">We use the following third-party services:</p>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li className="mb-2">
          <b>Google Analytics:</b> For website analytics (as described in Section 1).
          </li>
          <li>
          <b>Google AdSense:</b> We use Google AdSense to display advertisements on our Service. Google AdSense uses cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">5. Cookies</h2>
        <p className="mb-4">
          We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
        </p>
        <p className="mb-4">
          You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">6. Security of Your Data</h2>
        <p className="mb-4">
          The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">7. Children's Privacy</h2>
        <p className="mb-4">
          Our Service is not intended for anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">8. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@pngconvert.com" className="text-blue-500 hover:underline">support@pngconvert.com</a>
        </p>
      </div>
    </div>
  );
}