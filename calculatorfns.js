//unit conversion factors
const lbs_to_kg = 0.45359237;
const in_to_cm = 2.54;
const in_to_m = 0.0254;
const mph_to_kmh = 1.6093;
const margin = 200;
//valid intensities to calc mets when lifting
//mets taken from https://pacompendium.com/adult-compendium/
const liftingIntensities = 
{
  "light": 3,
  "moderate": 4,
  "vigorous": 6,
  "very high intensity": 8,
};
// same but for daily activities such as working, etc.
const daily_activity_intensity = 
{
  "standing": 1.3,
  "physical labor (light)": 2,
  "physical labor (moderate)": 3,
  "physical labor (heavy)": 4.5,
};

/**
 * Basal metabolic rate (resting calories per day) using the
 * Mifflin-St Jeor equation.
 * @param {number} weightLbs - body weight in pounds
 * @param {number} heightCm - height in centimeters
 * @param {number} age - age in years
 * @param {string} sex - "male" or "female"
 * @returns {number} resting calories per day (kcal)
 */
function calcBmr(weightLbs, heightCm, age, sex) {
  // using the Mifflin St Jeor equation
  const weightKg=weightLbs*lbs_to_kg;
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (sex === "male") return base + 5;
  if (sex === "female") return base - 161;

    throw new Error("Invalid sex: " + sex);
}

// fn that turns the mets of an activity and the time and the weight of the person
//into cals burned
/**
 * Take METs, weight, and time and calculate calories burned over that duration
 * @param {number} weightLbs - body weight in pounds
 * @param {number} met - coefficient of energy burning based on intensity
 * @param {number} timeMins - time in minutes that that activity was done for
 * @returns {number} calories burned in that time period- kcal
 */
function met_to_cals(weightLbs, met, timeMins) {
    const weightKg=weightLbs*lbs_to_kg;
    const cals=weightKg* 3.5 *((met-1) / 200) * timeMins;
    return cals;
}


//daily step count into cals
//grade or incline will be entered as a percentage, then turned into a number such as 1.15
/**
 * Calculate calories burned based on daily steps
 * @param {number} weightLbs - body weight in pounds
 * @param {number} heightM - height in meters
 * @param {number} steps - number of steps
 * @param {number} grade - number 0-100 (viewed as percentage)
 * @returns {number} total_cal - cals burned from walking (kcal)
 */
function calcWalking(weightLbs, heightM, steps, grade = 0) {
    const weightKg = weightLbs * lbs_to_kg;
    const stride = 0.413 * heightM;
    const distanceKm = (steps * stride) / 1000;
    const calories = 0.5 * weightKg * distanceKm;
    // Approximate adjustment for incline
    const gradeMultiplier = 1 + (grade / 100) * 3.5;
    const total_cal = calories * gradeMultiplier;
    return total_cal;
}



//if they ran-> calc cals burned during the run
/**
 * Calculate calories burned if the person ran
 * @param {number} timeMins - time in minutes that that activity was done for
 * @param {number} speedMph - speed in miles per hour
 * @param {number} weightLbs - body weight in pounds
 * @returns {number} cals burned while running in kcals
 */
function calcRunning(timeMins, speedMph, weightLbs){
    const speedKmh= speedMph*mph_to_kmh;
    const met=1+ (.9524*speedKmh);
    return met_to_cals(weightLbs, met, timeMins);
}

//cals from gym
/**
 * Calculate calories burned from weightlifting
 * @param {number} weightLbs - body weight in pounds
 * @param {number} timeMins - time in minutes that that activity was done for
 * @param {string} intensity - how intensely they performed the activity, approximation
 * @returns {number} cals burned while lifting in kcals
 */
function calcWeightlifting(weightLbs, timeMins, intensity)
{
    if (!(intensity in liftingIntensities))
         {throw new Error("Invalid Intensity: " + intensity);}
    const met= liftingIntensities[intensity];
    return met_to_cals(weightLbs, met, timeMins);
}


//calc cals burned during work
/**
 * Calculation of daily activities (standing or during work)
 * @param {number} weightLbs - body weight in pounds
 * @param {number} timeMins - time in minutes that that activity was done for
 * @param {string} activity - what activity was done
 * @returns {number} cals burned during those different daily activities in kcals
 */
function calcDaily(weightLbs, timeMins, activity) 
{
if (!(activity in daily_activity_intensity)) {
        throw new Error("Invalid activity: "+ activity);
    }
    const met = daily_activity_intensity[activity];
    return met_to_cals(weightLbs, met, timeMins);
}

// sum everything up
/**
 * Sum the total with a +/- margin.
 * @param {Object} profile - { weightLbs, heightIn, age, sex }, with weight in
 *   pounds, height in inches and sex as "male" or "female"
 * @param {Object} day - any of { steps, run: {minutes, mph},
 *   lift: {minutes, intensity}, activities: {name: minutes} }; missing
 *   fields are skipped
 * @returns {Object} { bmr, total, low, high }, all in kcal
 */
function dayTotal(profile, day){
    //going to create dictionaries 
    // create these later when i take user inputs, profile will be stuff
    //that stays mostly the same, day is gonna be different on the daily and full of the diff
    // activities 
    // (Python lingo because that is what i am familiar with)
    // will have various personal stats in the user's profile
    // double yap but more explanation and nobody reads comments anyway
    // will have activities completed during the day paired with the times they were completed
    //for in the 'day' dictionary
    const heightCm = profile.heightIn * in_to_cm;
    const heightM = profile.heightIn * in_to_m;
    // bmr addition
    const bmr = calcBmr(profile.weightLbs, heightCm, profile.age, profile.sex);
    let total = bmr;

    // if no steps then day.steps is false->skip test
    if (day.steps) {
    total += calcWalking(profile.weightLbs, heightM, day.steps, day.grade ?? 0);
    }
    // same thing for running
    if (day.run) {
        total += calcRunning(day.run.minutes, day.run.mph, profile.weightLbs);
    }
    //lift
    if (day.lift) {
        total += calcWeightlifting(profile.weightLbs, day.lift.minutes, day.lift.intensity);
    }
    // 'activities' should be a key paired with value- made of options from daily_activity_intensities
    //  ({"standing" : 100}, {physical labor (moderate): 45}, etc.)
    // "for name in object" should loop over each key
    if (day.activities) {
        for (const name in day.activities) {
            total += calcDaily(profile.weightLbs, day.activities[name], name);
        }
    }

    return { bmr: bmr, total: total, low: total - margin, high: total + margin };
}