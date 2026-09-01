'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'id';

type TranslationKeys =
  | 'nav.home' | 'nav.work' | 'nav.experience' | 'nav.contact' | 'nav.cta'
  | 'hero.role' | 'hero.blurb' | 'hero.cv' | 'hero.viewWork'
  | 'stats.years' | 'stats.projects' | 'stats.technologies' | 'stats.desc1' | 'stats.desc2' | 'stats.desc3'
  | 'cta.letsBuild' | 'cta.nextChapter' | 'cta.chapter' | 'cta.linkedin' | 'cta.contactPage' | 'cta.downloadCv'
  | 'footer.copy' | 'footer.status'
  | 'marquee.fullstack' | 'marquee.ui' | 'marquee.api' | 'marquee.db' | 'marquee.react' | 'marquee.laravel' | 'marquee.responsive' | 'marquee.ai'
  | 'marquee.ecommerce' | 'marquee.analytics' | 'marquee.cms' | 'marquee.gorontalo' | 'marquee.indonesia' | 'marquee.openToWork'
  | 'experience.heading' | 'experience.lede'
  | 'projects.heading' | 'projects.seeAll';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKeys) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': '/home',
    'nav.work': '/work',
    'nav.experience': '/experience',
    'nav.contact': '/contact',
    'nav.cta': "Let's talk →",
    'hero.role': 'Pengembang Full Stack · Desainer UI · Pembuat',
    'hero.blurb': '3+ tahun mengubah ide menjadi produk digital nyata — mencakup frontend, backend, dan segala hal di antaranya.',
    'hero.cv': 'Unduh CV ↓',
    'hero.viewWork': '/view work',
    'stats.years': 'Years of experience',
    'stats.projects': 'Projects delivered',
    'stats.technologies': 'Technologies',
    'stats.desc1': 'Dalam pengembangan web full stack — mencakup proyek lepas, magang, dan proyek klien di berbagai industri.',
    'stats.desc2': 'Dari halaman arahan hingga aplikasi web kompleks — dibuat dengan kode bersih dan perhatian pada setiap detail.',
    'stats.desc3': 'React, Next.js, Laravel, Node.js, Tailwind CSS, PostgreSQL, MySQL, and more — always learning.',
    'cta.letsBuild': "Let's build",
    'cta.nextChapter': 'Dari ide menjadi nyata.',
    'cta.chapter': 'chapter.',
    'cta.linkedin': 'LinkedIn',
    'cta.contactPage': 'Contact page',
    'cta.downloadCv': 'Unduh CV',
    'footer.copy': 'Copyright © 2026 Samsu Alam. All Rights Reserved.',
    'footer.status': 'OPEN TO WORK',
    'marquee.fullstack': 'Full Stack Development',
    'marquee.ui': 'UI Design',
    'marquee.api': 'API Integration',
    'marquee.db': 'Database Architecture',
    'marquee.react': 'React & Next.js',
    'marquee.laravel': 'Laravel & Node.js',
    'marquee.responsive': 'Responsive Design',
    'marquee.ai': 'AI Integration',
    'marquee.ecommerce': 'E-Commerce Platform',
    'marquee.analytics': 'Analytics Dashboard',
    'marquee.cms': 'Company CMS',
    'marquee.gorontalo': 'Gorontalo',
    'marquee.indonesia': 'Indonesia',
    'marquee.openToWork': 'Open To Work',
    'experience.heading': 'Work history',
    'experience.lede': '3+ years building web applications across freelance, internship, and full-time roles.',
    'projects.heading': 'Selected cases',
    'projects.seeAll': 'READ CASE →',
  },
  id: {
    'nav.home': '/beranda',
    'nav.work': '/kerja',
    'nav.experience': '/pengalaman',
    'nav.contact': '/kontak',
    'nav.cta': 'Mari bicara →',
    'hero.role': 'Pengembang Full Stack · Desainer UI · Pembuat',
    'hero.blurb': '3+ tahun mengubah ide menjadi produk digital nyata — mencakup frontend, backend, dan segala sesuatu di antaranya.',
    'hero.cv': 'Unduh CV ↓',
    'hero.viewWork': '/lihat karya',
    'stats.years': 'Tahun pengalaman',
    'stats.projects': 'Proyek selesai',
    'stats.technologies': 'Teknologi',
    'stats.desc1': 'Dalam pengembangan web full stack — mencakup proyek lepas, magang, dan proyek klien di berbagai industri.',
    'stats.desc2': 'Dari halaman arahan hingga aplikasi web kompleks — dibuat dengan kode bersih dan perhatian pada setiap detail.',
    'stats.desc3': 'React, Next.js, Laravel, Node.js, Tailwind CSS, PostgreSQL, MySQL, dan lainnya — selalu belajar.',
    'cta.letsBuild': 'Mari bangun',
    'cta.nextChapter': 'Dari ide menjadi nyata.',
    'cta.chapter': 'berikutnya.',
    'cta.linkedin': 'LinkedIn',
    'cta.contactPage': 'Halaman kontak',
    'cta.downloadCv': 'Unduh CV',
    'footer.copy': 'Hak Cipta © 2026 Samsu Alam. Semua Hak Dilindungi.',
    'footer.status': 'TERBUKA BEKERJA',
    'marquee.fullstack': 'Pengembangan Full Stack',
    'marquee.ui': 'Desain UI',
    'marquee.api': 'Integrasi API',
    'marquee.db': 'Arsitektur Basis Data',
    'marquee.react': 'React & Next.js',
    'marquee.laravel': 'Laravel & Node.js',
    'marquee.responsive': 'Desain Responsif',
    'marquee.ai': 'Integrasi AI',
    'marquee.ecommerce': 'Platform E-Commerce',
    'marquee.analytics': 'Dashboard Analitik',
    'marquee.cms': 'CMS Perusahaan',
    'marquee.gorontalo': 'Gorontalo',
    'marquee.indonesia': 'Indonesia',
    'marquee.openToWork': 'Terbuka Bekerja',
    'experience.heading': 'Riwayat pekerjaan',
    'experience.lede': '3+ tahun membangun aplikasi web melalui proyek lepas, magang, dan pekerjaan penuh waktu.',
    'projects.heading': 'Proyek pilihan',
    'projects.seeAll': 'LIHAT PROYEK →',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('id');

  useEffect(() => {
    localStorage.setItem('lang', 'id');
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: TranslationKeys): string => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
