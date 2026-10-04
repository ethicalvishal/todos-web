// One segment per task, so the bar itself shows how much is left.
function ProgressStrip({ done, total }) {
  const percent = total ? Math.round((done / total) * 100) : 0;
  const segmented = total > 0 && total <= 24;

  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Tasks completed"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
    >
      {segmented ? (
        Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={index < done ? "seg is-on" : "seg"}
          ></span>
        ))
      ) : (
        <span className="seg seg-wide">
          <span className="seg-fill" style={{ width: `${percent}%` }}></span>
        </span>
      )}
    </div>
  );
}

export default ProgressStrip;
