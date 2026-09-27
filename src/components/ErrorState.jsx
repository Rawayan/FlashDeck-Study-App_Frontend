function ErrorState({
  message = "Something went wrong.",
}) {
  return (
    <div className="error-state">
      <p>{message}</p>
    </div>
  );
}

export default ErrorState;