function BoxBadge({ box }) {
  return (
    <span className={`box-badge box-${box}`}>
      Box {box}
    </span>
  );
}

export default BoxBadge;