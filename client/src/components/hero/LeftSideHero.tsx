import StatusBadge from "./StatusBadge";

const LeftSideHero = () => {
  return (
    <div className="flex w-full flex-col items-center gap-5 text-center xl:w-1/2 xl:items-start xl:text-left">
      <StatusBadge />

      <div className="max-w-xl text-2xl font-bold uppercase text-[#1a3a5c] dark:text-white sm:text-3xl lg:text-4xl">
        Think. Code. Succeed.
      </div>

      <div className="word-wrap max-w-xl text-sm dark:text-white sm:text-base">
        Simulate technical interviews with an intelligent AI interviewer.
        <br />
        Solve curated DSA problems across multiple difficulty levels.
        <br />
        Get instant feedback on correctness, efficiency, and communication.
      </div>

      <button className="transition-all duration-300 px-4 py-2 border-none uppercase font-semibold bg-gray-200 dark:bg-gray-800 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700 dark:text-white shadow">
        get started
      </button>
    </div>
  );
};

export default LeftSideHero;