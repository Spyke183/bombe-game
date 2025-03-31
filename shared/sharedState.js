export const sharedState = {
    seed: 'alpha123',
    timeLeft: 900,
    errorCount: 0,
    logError: () => {
      sharedState.errorCount++;
      console.warn("💥 Erreur ! Nombre d'erreurs :", sharedState.errorCount);
    },
    onSuccess: () => {
      console.log("✅ Module terminé !");
    }
  };
  