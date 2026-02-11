import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ShieldCheck, DollarSign, Camera, Users, Sparkles } from 'lucide-react';

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="bg-primary text-primary-foreground rounded-full p-3">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-center text-white">
        <Image
          src="https://picsum.photos/seed/hero/1800/1200"
          alt="Clean, modern residential community"
          fill
          className="object-cover opacity-40"
          data-ai-hint="clean modern community"
          priority
        />
        <div className="relative z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 drop-shadow-lg">
            Keeping Communities Clean, One Paw at a Time.
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 drop-shadow-md">
            Our automated AI-powered camera system helps maintain clean, beautiful common areas by ensuring pet waste is handled responsibly.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/violations">Pay a Citation</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#property-managers">For Property Managers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-6 mb-4">
                <Camera className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. AI Cameras Monitor</h3>
              <p className="text-muted-foreground">
                State-of-the-art cameras are placed in common areas to monitor for pet waste incidents discreetly and securely.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-6 mb-4">
                <Sparkles className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Violations Identified</h3>
              <p className="text-muted-foreground">
                Our AI system automatically detects when pet waste is not picked up and identifies the responsible party based on pet registration data.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-primary text-primary-foreground rounded-full p-6 mb-4">
                 <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Notification & Resolution</h3>
              <p className="text-muted-foreground">
                A violation notice is issued, allowing for easy, private payment through our secure portal, ensuring a clean community for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For Residents Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Enjoy Cleaner, Safer Green Spaces</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our service ensures that the common areas in your community remain pristine and hygienic for you, your family, and your pets to enjoy. No more worrying about unpleasant surprises on the grass.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Promotes a healthier environment for all residents.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Reduces the risk of disease transmission from pet waste.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Holds all pet owners accountable to the same community standards.</span>
                </li>
              </ul>
            </div>
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
                <Image src="https://picsum.photos/seed/residents/800/600" alt="Family playing in a clean park" fill className="object-cover" data-ai-hint="family park" />
            </div>
          </div>
        </div>
      </section>

      {/* For Property Managers Section */}
      <section id="property-managers" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">A Smarter Solution for Property Management</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<DollarSign className="h-8 w-8" />}
              title="Reduce Costs & Generate Revenue"
              description="Lower your cleaning and maintenance expenses while creating a new revenue stream from fines. Our system pays for itself and then some."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Increase Resident Satisfaction"
              description="A clean, well-maintained property is a key driver of resident happiness and retention. Show your community you care about their living environment."
            />
             <FeatureCard
              icon={<Sparkles className="h-8 w-8" />}
              title="Automated & Effortless"
              description="Our AI handles the detection and notification process, freeing up your staff's time to focus on other management tasks."
            />
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
                <ShieldCheck className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Privacy is Our Priority</h2>
                <p className="text-lg text-muted-foreground">
                    We are committed to protecting resident privacy. Our system is designed with security at its core. All data is processed locally on secure, on-site hardware. Only footage directly related to a violation is saved, and it is stored securely in accordance with our data agreement and privacy policies. All other footage is immediately and permanently discarded.
                </p>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-background border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} PoopTicket. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
