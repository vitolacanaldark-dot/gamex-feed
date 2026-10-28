import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { NewsFeed } from './components/NewsFeed.tsx';
import { CommunityFeed } from './components/CommunityFeed.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { ProfileView } from './components/ProfileView.tsx';
import { ReleaseCalendar } from './components/ReleaseCalendar.tsx';
import { ArticleModal } from './components/ArticleModal.tsx';
import { CreatePostModal } from './components/CreatePostModal.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { DiscordModal } from './components/DiscordModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import { Footer } from './components/Footer.tsx';
import { XpToasts } from './components/XpToasts.tsx';
import { PushNotificationToast } from './components/PushNotificationToast.tsx';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, setIsSplashOpen, setIsLoginModalOpen } = useApp();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['home', 'news', 'community', 'calendar', 'profile'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
    if (params.get('splash') === '1') setIsSplashOpen(true);
    if (params.get('login') === '1') setIsLoginModalOpen(true);
  }, [setActiveTab, setIsSplashOpen, setIsLoginModalOpen]);

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#F3F4F6] flex flex-col cyber-grid-bg">
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="w-full">
          {activeTab === 'home' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* COLUNA ESQUERDA (Hero + Feed de Notícias) */}
              <div className="lg:col-span-8 w-full space-y-8 order-2 lg:order-1">
                <HeroSection />
                <NewsFeed isHomeScreen={true} /> 
              </div>

              {/* COLUNA DIREITA (Sidebar Fixa no Topo) */}
              <div className="lg:col-span-4 w-full order-1 lg:order-2 sticky top-24">
                <Sidebar />
              </div>
              
            </div>
          )}

          {activeTab === 'news' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 w-full order-2 lg:order-1">
                <NewsFeed isHomeScreen={false} /> 
              </div>
              <div className="lg:col-span-4 w-full order-1 lg:order-2 sticky top-24">
                <Sidebar />
              </div>
            </div>
          )}

          {activeTab === 'community' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 w-full order-2 lg:order-1">
                <CommunityFeed />
              </div>
              <div className="lg:col-span-4 w-full order-1 lg:order-2 sticky top-24">
                <Sidebar />
              </div>
            </div>
          )}

          {activeTab === 'calendar' && <ReleaseCalendar />}
          {activeTab === 'profile' && <ProfileView />}
        </div>
      </main>

      <Footer />
      <MobileNav />

      <ArticleModal />
      <CreatePostModal />
      <GlobalSearchModal />
      <DiscordModal />
      <LoginModal />
      <SplashScreen />
      <XpToasts />
      <PushNotificationToast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}