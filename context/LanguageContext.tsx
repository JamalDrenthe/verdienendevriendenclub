import React, { createContext, useContext, useState } from 'react';

export type Language = 'nl' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  'nav.dashboard': { nl: 'Dashboard', en: 'Dashboard' },
  'nav.onboarding': { nl: 'Onboarding', en: 'Onboarding' },
  'nav.community': { nl: 'Community', en: 'Community' },
  'nav.chat': { nl: 'Chat', en: 'Chat' },
  'nav.prospects': { nl: 'Prospects', en: 'Prospects' },
  'nav.talents': { nl: 'Talents', en: 'Talents' },
  'nav.referral': { nl: 'Referral', en: 'Referral' },
  'nav.boastplug': { nl: 'Boastplug', en: 'Boastplug' },
  'nav.woningvrij': { nl: 'WoningVrij', en: 'WoningVrij' },
  'nav.profile': { nl: 'Mijn Profiel', en: 'My Profile' }, // Renamed from settings
  'nav.logout': { nl: 'Uitloggen', en: 'Logout' },
  'nav.platform': { nl: 'Platform', en: 'Platform' },
  'nav.network': { nl: 'Netwerk & Groei', en: 'Network & Growth' },
  'nav.apps': { nl: 'Apps & Tools', en: 'Apps & Tools' },

  // Dashboard
  'dash.welcome': { nl: 'Welkom terug', en: 'Welcome back' },
  'dash.teamPerf': { nl: 'Je team presteert 12% beter dan vorige week.', en: 'Your team is performing 12% better than last week.' },
  'dash.toOnboarding': { nl: 'Naar Onboarding', en: 'Go to Onboarding' },
  'dash.profile': { nl: 'Mijn Profiel', en: 'My Profile' },
  'dash.start': { nl: 'Start Direct', en: 'Start Now' },
  'dash.allUpdated': { nl: 'Alles bijgewerkt!', en: 'All up to date!' },
  'dash.activeOnboarding': { nl: 'Actieve Onboarding', en: 'Active Onboarding' },
  'dash.viewAll': { nl: 'Bekijk alles', en: 'View all' },
  'dash.steps': { nl: 'stappen', en: 'steps' },
  'dash.noActive': { nl: 'Geen actieve onboarding taken. Tijd om er een te starten!', en: 'No active onboarding tasks. Time to start one!' },
  'dash.news': { nl: 'Nieuws & Updates', en: 'News & Updates' },
  'dash.notifications': { nl: 'Meldingen', en: 'Notifications' },
  'dash.new': { nl: 'nieuw', en: 'new' },
  'dash.myTeam': { nl: 'Mijn Team', en: 'My Team' },
  'dash.teamOverview': { nl: 'Team Overzicht', en: 'Team Overview' },

  // Profile
  'profile.title': { nl: 'Mijn Profiel', en: 'My Profile' },
  'profile.subtitle': { nl: 'Beheer je persoonlijke gegevens en voorkeuren.', en: 'Manage your personal details and preferences.' },
  'profile.tab.overview': { nl: 'Overzicht', en: 'Overview' },
  'profile.tab.account': { nl: 'Account', en: 'Account' },
  'profile.tab.preferences': { nl: 'Voorkeuren', en: 'Preferences' },
  'profile.level': { nl: 'Huidig Level', en: 'Current Level' },
  'profile.xp': { nl: 'XP Voortgang', en: 'XP Progress' },
  'profile.stats': { nl: 'Statistieken', en: 'Statistics' },
  'profile.completed': { nl: 'Voltooide Taken', en: 'Completed Tasks' },
  'profile.earned': { nl: 'Totaal Verdiend', en: 'Total Earned' },
  'profile.hours': { nl: 'Uren Actief', en: 'Hours Active' },
  'profile.bio': { nl: 'Over mij', en: 'About me' },
  'profile.save': { nl: 'Opslaan', en: 'Save Changes' },
  'profile.theme': { nl: 'Thema', en: 'Theme' },
  'profile.lang': { nl: 'Taal', en: 'Language' },
};

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('nl');

  const t = (key: string) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};