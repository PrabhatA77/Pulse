import LeftSideHero from "../hero/LeftSideHero";
import RightSideHero from "../hero/RightSideHero";

const Hero = () => {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-10 px-4 py-10 sm:px-6 lg:px-8 xl:flex-row xl:items-center xl:gap-12 xl:py-16">
      <LeftSideHero />
      <RightSideHero />
    </div>
  );
};

export default Hero;