function Button({
  children,
  loading = false,
  ...props
}) {
  return (
    <button
      {...props}
      className="
        w-full
        h-16 rounded-3xl text-lg font-semibold
        bg-gradient-to-r
        from-cyan-500
        to-blue-600
        py-5 text-lg
        font-semibold
        text-white
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:shadow-xl
        hover:shadow-cyan-500/40
        active:scale-95
      "
    >
      {loading ? "Please Wait..." : children}
    </button>
  );
}

export default Button;