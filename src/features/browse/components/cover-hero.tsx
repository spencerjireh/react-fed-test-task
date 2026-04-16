const COVER_HERO_JPG = 'cover-hero.jpg';
const COVER_HERO_WEBP = 'cover-hero.webp';

export function CoverHero() {
  const base = import.meta.env.BASE_URL;

  return (
    <section
      aria-label="Pick a name"
      className="relative mt-6 flex flex-col items-center gap-6 md:mt-[24px] md:gap-8 lg:min-h-[814px] lg:justify-end lg:gap-0"
    >
      <picture>
        <source srcSet={`${base}${COVER_HERO_WEBP}`} type="image/webp" />
        <img
          src={`${base}${COVER_HERO_JPG}`}
          width={417}
          height={671}
          alt=""
          loading="eager"
          fetchPriority="high"
          data-testid="cover-hero-img"
          className="max-h-[280px] w-full max-w-[417px] object-cover md:max-h-none"
        />
      </picture>

      <p
        className="whitespace-pre-wrap text-center font-heading text-[96px] font-bold leading-[80px] text-red-main md:text-[160px] md:leading-[130px] lg:absolute lg:inset-x-0 lg:top-[60px] lg:text-[280px] lg:leading-[230px]"
        style={{
          textShadow:
            '0px 2px 12px rgba(58,53,51,0.1), 0px 0px 2px rgba(58,53,51,0.2)',
        }}
      >
        {`I NEED  A NAME`}
      </p>
    </section>
  );
}
