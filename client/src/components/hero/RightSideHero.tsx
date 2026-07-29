import CodeShowcase from "../CodeShowcase/CodeShowcase";

const RightSideHero = () => {
  return (
    // Establishes the container-query context CodeShowcase measures
    // itself against (see CodeShowcase.tsx), and gives it the actual
    // sidebar width once the hero goes two-column at xl.
    <div className="@container flex w-full justify-center xl:w-1/2 xl:justify-end">
      <CodeShowcase />
    </div>
  );
};

export default RightSideHero;