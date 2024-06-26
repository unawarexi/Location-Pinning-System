import React from "react";

const CustomerForm = ({
  placeHolder,
  type,
  icon,
  inputState,
  inputStateFunc,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 bg-black/5 backdrop-blur-md rounded-md w-full px-4 py-2 md:py-4 lg:py-2">
      {icon}

      <input
        type={type}
        placeholder={placeHolder}
        value={inputState}
        onChange={(e) => inputStateFunc(e.target.value)}
        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm lg:text-base md:text-base outline-none text-gray-700
         md:py-3 lg:py-1 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
      />
    </div>
  );
};

export default CustomerForm;
