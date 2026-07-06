export default function LocaleLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-[3px] border-apa-line border-t-apa-green" />
        <div className="apa-rule mx-auto mt-6 opacity-60" />
      </div>
    </div>
  );
}
