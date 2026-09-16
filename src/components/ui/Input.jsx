import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      icon,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        {icon && (
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...props}
          style={{
            paddingLeft: icon ? "52px" : "20px",
            paddingRight: "20px",
          }}
          className="w-full h-16 rounded-3xl border border-white/10 bg-white/5 text-white placeholder:text-gray-400 outline-none backdrop-blur-xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;