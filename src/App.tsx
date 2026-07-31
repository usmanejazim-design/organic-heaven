import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturesBar from '@/components/FeaturesBar';
import Products from '@/components/Products';
import BrandStory from '@/components/BrandStory';
import Footer from '@/components/Footer';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { onAuthChange, signOutAdmin, type User } from '@/lib/supabase';

type Route = 'store' | 'admin';

function getRoute(): Route {
  const path = window.location.pathname.toLowerCase();
  return path === '/admin' ? 'admin' : 'store';
}

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute());
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const { data } = onAuthChange((session, u) => {
      setUser(u);
      setAuthReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  if (route === 'admin') {
    if (!authReady) {
      return <div className="min-h-screen bg-forest-950" />;
    }
    if (!user) {
      return <AdminLogin onSuccess={() => setUser({} as User)} />;
    }
    return (
      <AdminDashboard
        onLogout={async () => {
          await signOutAdmin();
          setUser(null);
        }}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <Products />
        <BrandStory />
      </main>
      <Footer />
    </motion.div>
  );
}
