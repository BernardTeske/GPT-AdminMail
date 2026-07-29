/**
 * Hält den Prozess am Leben und führt die Zusammenfassung nur zur
 * geplanten Uhrzeit aus — nicht beim Container-/Prozessstart.
 */
process.env.TZ = process.env.TZ || 'Europe/Berlin';

const runSummary = require('./index');

const SUMMARY_HOUR = parseInt(process.env.SUMMARY_HOUR || '8', 10);
const SUMMARY_MINUTE = parseInt(process.env.SUMMARY_MINUTE || '0', 10);
const TIMEZONE = process.env.TZ;

function msUntilNextRun(hour, minute) {
  const now = new Date();
  const next = new Date(now);
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= now.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime() - now.getTime();
}

function formatWhen(date) {
  return date.toLocaleString('de-DE', { timeZone: TIMEZONE });
}

function scheduleNext() {
  const delay = msUntilNextRun(SUMMARY_HOUR, SUMMARY_MINUTE);
  const nextAt = new Date(Date.now() + delay);
  console.log(
    `Scheduler aktiv (${TIMEZONE}). Nächster Lauf: ${formatWhen(nextAt)} ` +
    `(in ${Math.max(1, Math.round(delay / 60000))} Min.). Kein Versand beim Start.`
  );

  setTimeout(async () => {
    console.log(`Starte geplanten Zusammenfassungs-Lauf (${formatWhen(new Date())})...`);
    try {
      await runSummary();
    } catch (err) {
      console.error('Geplanter Lauf fehlgeschlagen:', err);
    }
    scheduleNext();
  }, delay);
}

scheduleNext();
