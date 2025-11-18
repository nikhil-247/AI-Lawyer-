import { Link } from 'wouter';
import { Heart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-primary/5 to-accent/10">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col min-h-screen">
        <header className="flex items-center justify-between py-2 mb-6">
          <div className="flex items-center gap-2">
           
          </div>
          
        </header>

        <main className="flex-1 flex flex-col justify-center">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] items-center">
            {/* Left: hero text */}
            <section className="space-y-6">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="h-3 w-3" />
                  Designed for dementia caregivers
                </p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
                  Gentle, guided sessions
                  <br className="hidden md:block" />
                  for calmer days at home.
                </h1>
                <p className="text-sm md:text-base text-muted-foreground max-w-xl">
                  Capture familiar voices, daily routines, and comforting memories in one place.
                  Turn them into reassuring audio sessions that can be replayed whenever they&apos;re needed most.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <p>Structure morning, night, and emergency rituals with simple prompts.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <p>Record reassuring voices and stories that feel safe and familiar.</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                  <p>Keep everything organized for quick access on difficult days.</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link href="/signup">
                  <Button
                    className="w-full sm:w-auto h-11 px-6 text-sm rounded-xl"
                    size="lg"
                    data-testid="button-get-started"
                  >
                    Get started for free
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-11 px-6 text-sm rounded-xl"
                    size="lg"
                    data-testid="button-login"
                  >
                    I already have an account
                  </Button>
                </Link>
              </div>
            </section>

            {/* Right: soft visual area */}
            <aside className="hidden md:block">
              <div className="relative rounded-3xl border border-primary/20 bg-background/80 backdrop-blur p-6 shadow-sm">
                <p className="text-xs font-medium text-primary mb-3">What you can create</p>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="rounded-2xl bg-primary/5 px-4 py-3">
                    <p className="text-[11px] font-semibold text-primary mb-1">Comforting memory card</p>
                    <p>&ldquo;Mum, remember our evening walks by the lake? We&apos;re safe at home together now.&rdquo;</p>
                  </div>
                  <div className="rounded-2xl bg-accent/5 px-4 py-3">
                    <p className="text-[11px] font-semibold text-accent-foreground mb-1">Morning routine cue</p>
                    <p>&ldquo;Good morning. The sun is up, your tea is ready, and I&apos;m right here with you.&rdquo;</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-4 py-3">
                    <p className="text-[11px] font-semibold text-emerald-700 mb-1">Reassurance script</p>
                    <p>&ldquo;You are safe. You are loved. We will take this one small step at a time.&rdquo;</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="mt-10 pb-4 text-xs text-muted-foreground text-center">
          With care, for those who care
        </footer>
      </div>
    </div>
  );
}
