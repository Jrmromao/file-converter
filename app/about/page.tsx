// app/about/page.tsx
import React from 'react';
import { Sparkles, Image, Settings, Layers, Zap, Globe } from 'lucide-react'; // Added Globe icon

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-950 dark:to-neutral-900 p-8 text-slate-800 dark:text-neutral-200">
      <div className="max-w-4xl mx-auto bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-slate-800 dark:text-white mb-8">About Image Converter Pro</h1>

        <p className="mb-6 text-lg text-center max-w-2xl mx-auto">
          At <b>Image Converter Pro</b>, we believe in making image manipulation simple, fast, and powerful for everyone. Our mission is to provide a robust, user-friendly, and secure online tool for all your image conversion and optimization needs.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4 mt-8">Our Story</h2>
        <p className="mb-4">
          In today's digital world, the need to quickly and efficiently convert and optimize images is universal – whether you're a web developer, a graphic designer, a blogger, or just someone sharing photos online. We created Image Converter Pro to address this need with a focus on simplicity, advanced functionality, and performance.
        </p>
        <p className="mb-6">
          Developed in Ireland, our team is dedicated to building tools that enhance productivity and creativity for users worldwide.
        </p>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Effortless Conversion</h3>
              <p className="text-sm text-slate-600 dark:text-neutral-300">
                Seamlessly convert between popular image formats like PNG, JPG, JPEG, WebP, and AVIF with just a few clicks.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg">
            <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Advanced Customization</h3>
              <p className="text-sm text-slate-600 dark:text-neutral-300">
                Take control with options to adjust quality, resize dimensions, rotate, apply filters, and fine-tune brightness, contrast, and saturation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg">
            <Zap className="w-6 h-6 text-teal-600 dark:text-teal-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Lightning Fast</h3>
              <p className="text-sm text-slate-600 dark:text-neutral-300">
                Our optimized servers ensure quick processing times, delivering your converted images in seconds.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded-lg">
            <Layers className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Secure & Private</h3>
              <p className="text-sm text-slate-600 dark:text-neutral-300">
                Your privacy is paramount. We process files temporarily and delete them immediately after conversion and download.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-slate-700 dark:text-neutral-100 mb-4">Our Vision</h2>
        <p className="mb-4">
          We aim to be your go-to solution for all image conversion needs. We are continuously working to enhance our features, improve performance, and expand supported formats to ensure Image Converter Pro remains at the forefront of online image tools.
        </p>
        <p className="mb-6">
          We value your feedback and are always looking for ways to make our service even better.
        </p>

        <div className="flex flex-col items-center justify-center text-center mt-8 p-6 bg-slate-50 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700">
          <Globe className="w-10 h-10 text-orange-500 mb-3" />
          <h3 className="text-xl font-semibold text-slate-700 dark:text-neutral-100 mb-2">Proudly Developed in Ireland</h3>
          <p className="text-slate-600 dark:text-neutral-300">
            Image Converter Pro is designed and developed by a dedicated team in Ireland, committed to delivering high-quality web applications.
          </p>
        </div>

        <p className="mt-8 text-center text-slate-600 dark:text-neutral-300">
          Thank you for choosing PNG Convert!
        </p>
      </div>
    </div>
  );
}