import { FeatureBullet } from './FeatureBullet';
import { CurlyUnderline } from './CurlyUnderline';
import { ScrollDownIndicator } from './ScrollDownIndicator';

interface SubjectHeroSectionProps {
  subject: string;
}

export function SubjectHeroSection({ subject }: SubjectHeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-no-repeat bg-[position:center_80%]"
      style={{ backgroundImage: 'url(/hero-bcg.png)' }}
    >
      <div className="container mx-auto px-4 py-6 md:py-14">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-[#007aff]">VCE {subject}</span>{' '}
            <span className="text-[#ffa737]">Tutor</span>
          </h1>

          {/* Subtitle with underlined number */}
          <p className="text-2xl md:text-4xl text-[#1a2b4a] mb-10 font-semibold">
            Join{' '}
            <span className="relative inline-block">
              <span className="text-[#007aff]">10,000+</span>
              <CurlyUnderline strokeWidth={5} />
            </span>{' '}
            Happy Students Tutored at Aspire
          </p>

          {/* Feature Bullets */}
          <div className="flex flex-col items-center text-center gap-2 mb-10">
            <FeatureBullet>
              <span className="text-[#007aff] font-bold text-2xl">2-hour</span>{' '}
              <span className="font-semibold text-2xl">Weekly Small Group Class</span>
            </FeatureBullet>

            <FeatureBullet>
              <span className="text-[#007aff] font-bold text-2xl">Bonus Free 1-on-1</span>{' '}
              <span className="font-semibold text-2xl">Consultations &amp; Help</span>
            </FeatureBullet>

            <FeatureBullet>
              <span className="text-[#007aff] font-bold text-2xl">100+</span>{' '}
              <span className="font-semibold text-2xl">SAC &amp; Exam Practice Resources</span>
            </FeatureBullet>

            <FeatureBullet>
              <span className="text-[#007aff] font-bold text-2xl">Bonus</span>{' '}
              <span className="font-semibold text-2xl">Workshop for SAC &amp; Exam Preparation</span>
            </FeatureBullet>
          </div>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-[#1a2b4a] mb-4 max-w-4xl mx-auto">
            We help students across Victoria{' '}
            <span className="relative inline-block text-[#007aff]">
              <strong>achieve their dream ATAR</strong>
              <CurlyUnderline strokeWidth={1} />
            </span>{' '}
            by preparing them for VCE {subject} 1/2 &amp; 3/4!
          </p>

          {/* Scroll Down Indicator */}
          <div className="flex justify-center">
            <ScrollDownIndicator />
          </div>
        </div>
      </div>
    </section>
  );
}
