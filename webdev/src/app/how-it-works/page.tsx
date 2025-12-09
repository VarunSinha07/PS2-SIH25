import React from 'react';
import { HeroSection } from '../../components/how-it-works/HeroSection';
import { DataInputsSection } from '../../components/how-it-works/DataInputsSection';
import { PreprocessingSection } from '../../components/how-it-works/PreprocessingSection';
import { FeatureEngineeringSection } from '../../components/how-it-works/FeatureEngineeringSection';
import { XGBoostSection } from '../../components/how-it-works/XGBoostSection';
import { SitesMap } from '../../components/how-it-works/SitesMap';
import { SummarySection } from '../../components/how-it-works/SummarySection';

export default function HowItWorksPage() {
  return (
    <main className="w-full overflow-x-hidden">
      <HeroSection />
      <div className="flex flex-col">
        <DataInputsSection />
        <PreprocessingSection />
        <FeatureEngineeringSection />
        <XGBoostSection />
        <SitesMap />
        <SummarySection />
      </div>
    </main>
  );
}