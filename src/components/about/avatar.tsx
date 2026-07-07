import Image from 'next/image';

/** Photo when available, else an elegant initials avatar on brand gradient. */
export function Avatar({
  name,
  photo,
  size = 96,
}: {
  name: string;
  photo?: string;
  size?: number;
}) {
  if (photo) {
    return (
      <Image
        src={photo}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover ring-2 ring-apa-gold"
        style={{ width: size, height: size }}
      />
    );
  }
  const initials = name
    .split(/\s+/)
    .filter((w) => /[A-Za-zÀ-ÿ]/.test(w[0] ?? ''))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');
  return (
    <div
      aria-hidden
      className="apa-gradient flex items-center justify-center rounded-full font-extrabold text-apa-gold-bright ring-2 ring-apa-gold"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
}
