'use client'

// app/faq/page.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // Using ChevronDown for accordion-style questions

export default function FAQ() {
  const faqItems = [
    {
      question: "What image formats can I convert from?",
      answer: "Image Converter Pro currently supports converting from common image formats including PNG, JPG, JPEG, WebP, and AVIF. Simply upload your file, and we'll detect its format automatically."
    },
    {
      question: "What image formats can I convert to?",
      answer: "You can convert your images to PNG, JPG, JPEG, WebP, and AVIF. Choose the format that best suits your needs from the 'Convert to' dropdown."
    },
    {
      question: "Is there a limit on file size or number of conversions?",
      answer: "Currently, there is no strict limit on the file size, though very large files might take longer to process. For optimal performance, we recommend images under 50MB. There is no limit on the number of conversions you can perform."
    },
    {
      question: "Are my uploaded images secure and private?",
      answer: "Yes, absolutely. Your privacy is our top priority. We process your images temporarily on our servers, and they are deleted immediately after you download the converted file or after a very short time (typically a few minutes). We do not store your images long-term or share them with third parties. Please see our Privacy Policy for more details."
    },
    {
      question: "Can I resize or compress my images during conversion?",
      answer: "Yes! Our 'Advanced Options' section allows you to customize your output. You can adjust the image quality (compression), set specific width and height dimensions, rotate the image, apply various filters, and even enhance brightness, contrast, and saturation. You can also enable 'Optimize' for general file size reduction."
    },
    {
      question: "What does 'Quality' slider do?",
      answer: "The 'Quality' slider primarily affects the compression level of your output image, especially for formats like JPG and WebP. A lower quality percentage means more compression and a smaller file size, but potentially a loss of detail. A higher quality percentage means less compression, larger file size, and better image fidelity."
    },
    {
      question: "What is 'Progressive Loading'?",
      answer: "Progressive loading (or progressive JPEG/PNG) allows the image to load in stages, starting with a low-resolution version that gradually becomes clearer. This can improve the perceived loading speed on slower connections, as users see a full image quickly, even if it's not yet fully detailed."
    },
    {
      question: "What is 'Lossless Compression'?",
      answer: "Lossless compression is a type of data compression that allows the original data to be perfectly reconstructed from the compressed data. When applied to images, it means no quality is lost, even if the file size is reduced. This is primarily applicable to formats like PNG, and can also be an option for WebP and some AVIF profiles."
    },
    {
      question: "Why is the converted file still large even after reducing quality?",
      answer: "Several factors can influence the final file size, including the complexity of the image, the chosen output format, and the original image's properties. While reducing quality helps, converting to a format like PNG (which is lossless by default) might result in a larger file than a highly compressed JPG, even if you set a lower 'Quality' percentage. Also, ensure 'Optimize' is checked for general size reduction."
    },
    {
      question: "I received an error during conversion. What should I do?",
      answer: "First, please ensure your internet connection is stable. Then, try uploading the file again. If the issue persists, check if the file format is supported and if the file is corrupted. If you continue to experience problems, please contact us at support@imageconverterpro.com with details about the file and the error message."
    },
    {
      question: "Do you offer an API for developers?",
      answer: "Currently, we do not offer a public API. However, we are always evaluating new features and services. Please feel free to send us your interest and use case via our contact page."
    },
    {
      question: "Is Image Converter Pro free to use?",
      answer: "Yes, Image Converter Pro is completely free to use for all conversions. We may display advertisements to support the operation and maintenance of the service."
    },
    {
      question: "Where is Image Converter Pro developed?",
      answer: "Image Converter Pro is proudly designed and developed by a dedicated team in Ireland."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900 p-8 text-slate-800 dark:text-neutral-200">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-8">Frequently Asked Questions</h1>

        <p className="mb-8 text-lg text-center max-w-2xl mx-auto">
          Find answers to common questions about Image Converter Pro, its features, and how it works.
        </p>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-slate-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <button
                className="flex justify-between items-center w-full p-5 text-left bg-slate-50 dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 transition-colors duration-200 focus:outline-none"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-medium text-slate-700 dark:text-neutral-100">{item.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-slate-500 dark:text-neutral-300 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-screen opacity-100 p-5' : 'max-h-0 opacity-0'
                }`}
                style={{
                  paddingTop: openIndex === index ? '1.25rem' : '0',
                  paddingBottom: openIndex === index ? '1.25rem' : '0',
                }}
              >
                <p className="text-slate-600 dark:text-neutral-300 leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-slate-600 dark:text-neutral-300">
          <p>Can't find your answer? Feel free to <a href="/contact" className="text-blue-600 hover:underline dark:text-blue-400">contact us directly</a>.</p>
        </div>
      </div>
    </div>
  );
}