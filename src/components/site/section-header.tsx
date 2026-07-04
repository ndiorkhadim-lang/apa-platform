export function SectionHeader({
  num,
  title,
  subtitle,
}: {
  num: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header>
      <h1 className="flex flex-wrap items-center gap-3 text-2xl font-bold text-apa-green sm:text-3xl">
        <span className="apa-secnum text-lg sm:text-xl">{num}</span>
        <span>{title}</span>
      </h1>
      <div className="mt-3 h-[3px] w-full bg-apa-gold" />
      {subtitle ? <p className="mt-4 text-sm text-apa-grey">{subtitle}</p> : null}
    </header>
  );
}
