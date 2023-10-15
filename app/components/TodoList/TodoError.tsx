import React from "react";

type Props = {
  error: string;
};

const TodoError: React.FC<Props> = ({ error }) => {
  return <div className="mt-10 text-sm">{error}</div>;
};

export default TodoError;
