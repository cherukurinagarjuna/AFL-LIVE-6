const form = document.querySelector('#calorie-form');
const activity = document.querySelector('#activity');
const activityValue = document.querySelector('#activity-value');
const activityDescription = document.querySelector('#activity-description');
const formError = document.querySelector('#form-error');
const maintainCalories = document.querySelector('#maintain-calories');
const maintainValue = document.querySelector('#maintain-value');
const loseValue = document.querySelector('#lose-value');
const gainValue = document.querySelector('#gain-value');
const resultStatus = document.querySelector('#result-status');
const resultsMessage = document.querySelector('#results-message');
const energyOrbit = document.querySelector('#energy-orbit');

const activityLevels = [
  { label: 'Restful', multiplier: 1.2, description: 'Mostly seated days with little intentional exercise.' },
  { label: 'Light', multiplier: 1.375, description: 'Light exercise 1–3 days a week or an easy daily walk.' },
  { label: 'Moderate', multiplier: 1.55, description: 'Exercise 3–5 days a week, plus regular everyday movement.' },
  { label: 'High', multiplier: 1.725, description: 'Hard exercise 6–7 days a week or a physically active job.' },
  { label: 'Very high', multiplier: 1.9, description: 'Intense training, physical work, or two-a-day sessions.' }
];

const formatCalories = (value) => `${Math.round(value).toLocaleString()} kcal`;

function updateActivityCopy() {
  const selected = activityLevels[Number(activity.value)];
  activityValue.textContent = selected.label;
  activityDescription.textContent = selected.description;
}

function calculateCalories(event) {
  event.preventDefault();
  formError.textContent = '';

  const age = Number(document.querySelector('#age').value);
  const height = Number(document.querySelector('#height').value);
  const weight = Number(document.querySelector('#weight').value);
  const gender = document.querySelector('#gender').value;

  if (!age || !height || !weight || age < 13 || age > 100 || height < 100 || height > 250 || weight < 30 || weight > 300) {
    formError.textContent = 'Check your details: age 13–100, height 100–250 cm, and weight 30–300 kg.';
    return;
  }

  // Mifflin–St Jeor. The average option uses a midpoint coefficient for a neutral estimate.
  const genderOffset = gender === 'male' ? 5 : gender === 'female' ? -161 : -78;
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + genderOffset;
  const maintenance = Math.max(1200, bmr * activityLevels[Number(activity.value)].multiplier);
  const lose = Math.max(1200, maintenance - 500);
  const gain = maintenance + 300;

  maintainCalories.textContent = Math.round(maintenance).toLocaleString();
  maintainValue.textContent = formatCalories(maintenance);
  loseValue.textContent = formatCalories(lose);
  gainValue.textContent = formatCalories(gain);
  resultStatus.textContent = 'Estimate ready';
  resultsMessage.textContent = 'Use the middle number as a starting point, then listen to your body and adjust over time.';
  energyOrbit.classList.remove('is-updated');
  requestAnimationFrame(() => energyOrbit.classList.add('is-updated'));
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

activity.addEventListener('input', updateActivityCopy);
form.addEventListener('submit', calculateCalories);
updateActivityCopy();
