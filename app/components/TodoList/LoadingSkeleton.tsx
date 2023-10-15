const TodoLoadingSkeleton = () => {
  return (
    <section className="mt-4 overflow-hidden rounded-md bg-white text-xs text-veryLightGray dark:bg-veryDarkDesaturatedBlue">
      {Array(6)
        .fill(0)
        .map((i, idx) => (
          <div
            key={idx}
            className="relative  border-b border-b-lightGrayishBlue p-2 text-xs dark:border-b-veryDarkGrayishBlue"
          >
            <div className=" animate-pulse rounded bg-slate-200 p-3 py-4 dark:bg-slate-700"></div>
          </div>
        ))}
    </section>
  );
};

export default TodoLoadingSkeleton;
