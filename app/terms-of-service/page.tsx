// app/terms-of-service/page.tsx
import React from 'react';

export default function TermsOfService() {
  const lastUpdatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900 p-8 text-slate-800 dark:text-neutral-200">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-8">Terms of Service</h1>

        <p className="text-sm text-center text-slate-600 dark:text-neutral-300 mb-6">Last Updated: {lastUpdatedDate}</p>

        <p className="mb-4">
          Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the <b>PNG Convert</b> web application (the "Service") operated by <b>PNG Convert</b> ("us", "we", or "our").
        </p>

        <p className="mb-6">
          Your access to and use of the Service is conditioned upon your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who wish to access or use the Service.
        </p>

        <p className="mb-6 font-semibold">
          By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">1. The Service</h2>
        <p className="mb-4">
          Image Converter Pro provides a web-based tool that allows users to upload image files and convert them into various other image formats, along with optional image manipulation features (e.g., resizing, quality adjustment, filters).
        </p>
        <p className="mb-4">
          The Service is provided "as is" and "as available" without any warranties, express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">2. User Content</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li className="mb-2">
            **Your Responsibility:** You are solely responsible for the image files you upload and convert using the Service ("User Content"). You represent and warrant that you own or have the necessary licenses, rights, consents, and permissions to use and authorize us to process your User Content as described in these Terms.
          </li>
          <li className="mb-2">
            **No Storage:** As outlined in our Privacy Policy, we do not store your uploaded or converted files on our servers long-term. Files are processed temporarily and then deleted immediately after conversion and download, or after a very short period to facilitate download.
          </li>
          <li className="mb-2">
            **Prohibited Content:** You agree not to upload, post, or transmit any User Content that:
            <ul className="list-circle list-inside ml-6 mt-1">
              <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable.</li>
              <li>Infringes on any intellectual property rights (copyright, trademark, patent, trade secret) of any party.</li>
              <li>Contains viruses, malware, or any other malicious code.</li>
              <li>Violates the privacy or publicity rights of any person.</li>
            </ul>
          </li>
          <li>
            **No Endorsement:** We do not endorse any User Content and expressly disclaim any and all liability in connection with User Content.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">3. Intellectual Property</h2>
        <p className="mb-4">
          The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of PNG Convert and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PNG Convert.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">4. Links to Other Websites</h2>
        <p className="mb-4">
          Our Service may contain links to third-party websites or services that are not owned or controlled by [Your Company Name/Your Name].
        </p>
        <p className="mb-4">
          [Your Company Name/Your Name] has no control over, and assumes no responsibility for the content, privacy policies, or practices of any third-party websites or services. We do not warrant the offerings of any of these entities/individuals or their websites.
        </p>
        <p className="mb-4">
          You acknowledge and agree that [Your Company Name/Your Name] shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such third-party web sites or services.
        </p>
        <p className="mb-4">
          We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">5. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including, without limitation, if you breach the Terms.
        </p>
        <p className="mb-4">
          All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">6. Indemnification</h2>
        <p className="mb-4">
          You agree to defend, indemnify, and hold harmless [Your Company Name/Your Name] and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password; b) a breach of these Terms; or c) User Content posted on the Service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">7. Limitation Of Liability</h2>
        <p className="mb-4">
          In no event shall [Your Company Name/Your Name], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">8. Disclaimer</h2>
        <p className="mb-4">
          Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
        </p>
        <p className="mb-4">
          [Your Company Name/Your Name] its subsidiaries, affiliates, and its licensors do not warrant that a) the Service will function uninterrupted, secure, or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">9. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed and construed in accordance with the laws of Ireland, without regard to its conflict of law provisions.
        </p>
        <p className="mb-4">
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have had between us regarding the Service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">10. Changes to These Terms</h2>
        <p className="mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        <p className="mb-4">
          By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">11. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at: <a href="mailto:support@pngconvert.com" className="text-blue-500 hover:underline">support@pngconvert.com</a>
        
        </p>
      </div>
    </div>
  );
}