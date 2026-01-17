interface FeatureBulletProps {
  children: React.ReactNode;
}

export function FeatureBullet({ children }: FeatureBulletProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#ffa737] text-xl font-bold">→</span>
      <span className="text-[#1a2b4a] text-base md:text-lg">{children}</span>
    </div>
  );
}
