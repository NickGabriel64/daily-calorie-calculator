// on click of the calculate button:  
document.getElementById("calculate").addEventListener("click", function () {
// take and read inputs from website as constants
const weight = Number(document.getElementById("weight").value);
const height = Number(document.getElementById("height").value);
const age = Number(document.getElementById("age").value);
const sex = document.getElementById("sex").value;
//walking constants
const steps = Number(document.getElementById("steps").value);
const grade = Number(document.getElementById("grade").value);
//running constants
const timeRan = Number(document.getElementById("timeRan").value);
const runMph = Number(document.getElementById("runMph").value);
//lifting constants
const timeLifted = Number(document.getElementById("timeLifted").value);
const liftIntensity= document.getElementById("liftIntensity").value;


// personal profile containing all personal attributes necessary for calcs
const profile = { weightLbs: weight, heightIn: height, age: age, sex: sex };
// dictionary of actions done today paired with time/quantity (dependant on action)
const day = {};
if (steps > 0) 
  {day.steps = steps; day.grade = grade;}

if (timeRan>0 && runMph>0) 
  {day.run={minutes: timeRan, mph: runMph};}

if (timeLifted>0)
  {day.lift={minutes: timeLifted, intensity: liftIntensity};}


//daily activities/work
const activities = {};
  const activityInputs = document.querySelectorAll(".activity-input");
  for (const input of activityInputs) 
  {const minutes = Number(input.value);
    if (minutes > 0) 
      {activities[input.dataset.activity] = minutes;}}
  if (Object.keys(activities).length > 0) 
    {day.activities = activities;}



//run dayTotal over every activity done for the day
const result = dayTotal(profile, day);

document.getElementById("result").textContent =
`Estimated burn: ${Math.round(result.low)} to ${Math.round(result.high)} ` +
`calories (BMR: ${Math.round(result.bmr)})`;
});