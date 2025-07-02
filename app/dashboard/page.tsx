import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { SignOutButton } from './signout-button';
import { User, FileText, Zap, ArrowUpRight, Star, Info } from 'lucide-react';

function getInitials(name?: string | null, email?: string | null) {
  if (name) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }
  if (email) {
    return email[0]?.toUpperCase() || '?';
  }
  return '?';
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }
  const user = session.user;
  // Placeholder: conversion history (replace with real data from DB)
  const conversionHistory = [
    { id: 1, original: 'photo.png', target: 'photo.webp', date: '2024-07-01', size: '2.1MB', ai: false },
    { id: 2, original: 'logo.jpg', target: 'logo.png', date: '2024-06-28', size: '1.2MB', ai: true },
  ];
  const isPro = (user as any)?.isPro;

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 py-10">
      <div className="w-full max-w-3xl mx-auto p-6 md:p-10 bg-white/90 dark:bg-zinc-900/90 rounded-2xl shadow-xl border border-blue-100 dark:border-zinc-800">
        {/* User Info & Subscription */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow">
              {getInitials(user?.name, user?.email)}
            </div>
            <div>
              <div className="text-xl font-semibold flex items-center gap-2">
                {user?.name || user?.email}
                {isPro && (
                  <span className="group relative inline-flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 ml-1" />
                    <span className="absolute left-1/2 -translate-x-1/2 top-8 z-10 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">Pro Member</span>
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{user?.email}</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${isPro ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-200'}`}>
                {isPro ? 'Pro Plan' : 'Free Plan'}
              </span>
              <span className="relative group">
                <Info className="w-4 h-4 text-gray-400" />
                <span className="absolute left-1/2 -translate-x-1/2 top-6 z-10 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                  {isPro ? 'You have access to all Pro features.' : 'Upgrade to Pro for more features.'}
                </span>
              </span>
            </div>
            {isPro ? (
              <a href="/dashboard/billing" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                Manage Subscription <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <a href="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow transition-all duration-200 flex items-center gap-2">
                <Zap className="w-4 h-4" /> Upgrade to Pro
              </a>
            )}
            <SignOutButton />
          </div>
        </div>
        {/* Quick Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <a href="/" className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg">
            <FileText className="w-6 h-6" /> Convert a File
          </a>
          {!isPro && (
            <a href="/pricing" className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-4 rounded-xl shadow flex items-center justify-center gap-2 text-lg transition-all">
              <Zap className="w-6 h-6" /> Upgrade to Pro
            </a>
          )}
        </div>
        {/* Conversion History */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Recent Conversions
          </h2>
          {conversionHistory.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p className="mb-4">No conversions yet.</p>
              <a href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-full shadow transition-all duration-200">Convert your first file</a>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100 dark:border-zinc-800">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 dark:bg-zinc-800">
                    <th className="px-4 py-2 text-left">Original</th>
                    <th className="px-4 py-2 text-left">Converted</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Size</th>
                    <th className="px-4 py-2 text-left">AI</th>
                  </tr>
                </thead>
                <tbody>
                  {conversionHistory.map(item => (
                    <tr key={item.id} className="border-b border-gray-200 dark:border-zinc-800">
                      <td className="px-4 py-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" /> {item.original}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-500" /> {item.target}
                      </td>
                      <td className="px-4 py-2">{item.date}</td>
                      <td className="px-4 py-2">{item.size}</td>
                      <td className="px-4 py-2">{item.ai ? <span className="text-green-600 font-bold">Yes</span> : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 