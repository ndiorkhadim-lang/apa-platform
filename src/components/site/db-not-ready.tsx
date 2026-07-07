export function DBNotReady({ locale }: { locale: string }) {
  const fr = locale !== 'en';
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-lg text-center">
        <div className="text-5xl mb-4">🏗️</div>
        <h1 className="text-2xl font-bold text-apa-green">
          {fr ? 'Module en cours de déploiement' : 'Module deploying'}
        </h1>
        <div className="apa-rule mx-auto my-6" />
        <p className="text-sm text-apa-grey">
          {fr
            ? 'Cette section nécessite la base de données qui sera connectée prochainement. Revenez dans quelques heures.'
            : 'This section requires the database which will be connected shortly. Check back in a few hours.'}
        </p>
      </div>
    </div>
  );
}
