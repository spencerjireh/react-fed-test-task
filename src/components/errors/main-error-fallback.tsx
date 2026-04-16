export function MainErrorFallback() {
  return (
    <div
      className="flex h-screen w-screen flex-col items-center justify-center"
      role="alert"
    >
      <h1 className="font-heading text-2xl text-neutral-dark">
        Something went wrong
      </h1>
      <button
        className="mt-4 rounded-md bg-red-main px-4 py-2 text-white"
        onClick={() => window.location.assign(import.meta.env.BASE_URL)}
      >
        Reload
      </button>
    </div>
  );
}
