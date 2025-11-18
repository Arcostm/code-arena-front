const ProgressBar = ({ value = 0 }) => {
    const v = Math.max(0, Math.min(100, Number(value) || 0));
    return (
      <div className="w-full h-3 rounded-full border border-black bg-white overflow-hidden">
        <div
          className="h-full bg-black transition-all"
          style={{ width: `${v}%` }}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={v}
        />
      </div>
    );
  };
  
  export default ProgressBar;
  