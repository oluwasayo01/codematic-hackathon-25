// app/page.tsx
import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { FeatureCard } from '../components/ui/FeatureCard';
import { TestimonialsCarousel } from '../components/ui/TestimonialsCarousel';
import { PricingCards } from '../components/ui/PricingCards';



export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">
          Become More Articulate in 21 Days
        </h1>
        <p className="text-xl mb-8">
          AI-powered speech coaching tailored to your progress
        </p>
        <Link href="/register">
          <Button size="lg">Start Free Trial</Button>
        </Link>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Personalized Challenges"
            description="Daily prompts adapted to your skill level"
          />
          <FeatureCard 
            title="AI Feedback"
            description="Instant, detailed analysis of your speech"
          />
          <FeatureCard 
            title="Track Progress"
            description="See your improvement over 21 days"
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <TestimonialsCarousel />
      </section>

      {/* Pricing */}
      <section className="py-16">
        <PricingCards />
      </section>
    </div>
  );
}