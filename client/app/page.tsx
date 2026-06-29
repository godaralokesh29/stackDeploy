'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Background } from '@/components/stackd/background';
import { Hero } from '@/components/stackd/hero';
import { DeployCard } from '@/components/stackd/deploy-card';
import { DeployButton } from '@/components/stackd/deploy-button';
import { LoadingAnimation } from '@/components/stackd/loading-animation';
import { SuccessCard } from '@/components/stackd/success-card';
import { FeaturesSection } from '@/components/stackd/features-section';
import { StatsSection } from '@/components/stackd/stats-section';
import { Footer } from '@/components/stackd/footer';

type DeploymentState = 'idle' | 'loading' | 'success' | 'error';

export default function Page() {
  const [state, setState] = useState<DeploymentState>('idle');
  const [repoUrl, setRepoUrl] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [deploymentUrl, setDeploymentUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [deploymentDuration, setDeploymentDuration] = useState(0);

  // ingestion-service listens on port 3000, not the request-handler on 3001
  const API_URL ='http://localhost:3000';

  // Simulate deployment steps while loading
  useEffect(() => {
    if (state === 'loading') {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev >= 5) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);

      // Track deployment duration
      const startTime = Date.now();
      const durationInterval = setInterval(() => {
        setDeploymentDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 100);

      return () => {
        clearInterval(interval);
        clearInterval(durationInterval);
      };
    }
  }, [state]);

  const handleDeploy = async () => {
    setError(null);
    setDeploymentUrl('');

    if (!repoUrl.trim()) {
      setError('Please enter a repository URL.');
      return;
    }

    setState('loading');
    setLoadingStep(0);
    setDeploymentDuration(0);

    try {
      const response = await fetch(`${API_URL}/deploy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl: repoUrl.trim() }),
      });

      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || `Deploy request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.id) {
        throw new Error('Invalid response from deploy service.');
      }

      setDeploymentUrl(`http://${data.id}.127.0.0.1.nip.io:3001/`);
      setState('success');
    } catch (err) {
      setError((err as Error).message || 'Failed to create deployment.');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setRepoUrl('');
    setLoadingStep(0);
    setDeploymentUrl('');
    setError(null);
    setDeploymentDuration(0);
  };

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Background />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-4xl mx-auto w-full">
          <Hero />

          {/* Main interaction area */}
          <div className="mt-20">
            <AnimatePresence mode="wait">
              {(state === 'idle' || state === 'error') && (
                <motion.div
                  key="deploy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <DeployCard
                    url={repoUrl}
                    onUrlChange={setRepoUrl}
                    onDeploy={handleDeploy}
                    isLoading={false}
                    isSuccess={false}
                  />

                  {error && (
                    <motion.div
                      className="max-w-lg mx-auto bg-destructive/10 border border-destructive/50 rounded-xl p-4 text-destructive text-sm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <DeployButton
                      onClick={handleDeploy}
                      isLoading={false}
                      isSuccess={false}
                      disabled={!repoUrl.trim()}
                    />
                  </motion.div>
                </motion.div>
              )}

              {state === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <LoadingAnimation currentStep={loadingStep} />
                </motion.div>
              )}

              {state === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                >
                  <SuccessCard deploymentUrl={deploymentUrl} onDeploy={handleReset} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
