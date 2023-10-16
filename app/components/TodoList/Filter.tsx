import React from "react";

type Props = {
  selected: string;
  changeFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Filter: React.FC<Props> = ({ selected, changeFilter }) => {
  return (
    <>
      <div>
        <label
          htmlFor="all"
          className={`${
            selected === "ALL" ? "text-brightBlue" : ""
          } cursor-pointer`}
        >
          All
        </label>
        <input
          type="radio"
          value="ALL"
          id="all"
          name="todo_filters"
          className="hidden"
          onChange={changeFilter}
        />
      </div>

      <div>
        <label
          htmlFor="active"
          className={`${
            selected === "ACTIVE" ? "text-brightBlue" : ""
          } cursor-pointer`}
        >
          Active
        </label>
        <input
          type="radio"
          value="ACTIVE"
          id="active"
          name="todo_filters"
          className="hidden"
          onChange={changeFilter}
        />
      </div>

      <div>
        <label
          htmlFor="completed"
          className={`${
            selected === "COMPLETED" ? "text-brightBlue" : ""
          } cursor-pointer`}
        >
          Completed
        </label>
        <input
          type="radio"
          value="COMPLETED"
          id="completed"
          name="todo_filters"
          className="hidden"
          onChange={changeFilter}
        />
      </div>
    </>
  );
};

export default Filter;
