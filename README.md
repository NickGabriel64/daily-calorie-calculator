# Daily Calorie Calculator

Browser-based estimate of daily calorie expenditure from body stats and
activity. Built with HTML, CSS and JavaScript. [Live link and screenshot: add later]

## Method

| Component | Method | Source |
|---|---|---|
| Resting burn (BMR) | Mifflin-St Jeor equation | https://pubmed.ncbi.nlm.nih.gov/2305711/ ,  |
| Walking | 0.0005 kcal per kg per meter; stride = 0.413 x height | https://fitmetriclab.com/en/tools/energy-expenditure/steps-to-calories/ |
| Running | ACSM running equation, converted to METs | https://pacompendium.com/unite-conversions/ |
| Lifting, labor, standing | MET values x weight x time | Compendium of Physical Activities, https://pacompendium.com/adult-compendium/ |

Activity calories are computed as net METs (MET - 1) so the resting burn
already included in BMR isn't counted twice.

## Design
- `calculatorfns.js` contains only functions (values in, number out).
- `app.js` handles the page. Keeping them separate allows testing the math
  without a browser UI.
- `index.html` conatins the formatting and inputs for the website itself


## Limitations
- Estimates only, not medical advice.
- Estimated Stride length, not measured
- The +/- 200 kcal range is a placeholder, not derived from published error data.
- The grade input is applied to all walking for the day. This can be solved by dividing the grade by the percentage walked at that grade but this is not obvious to users
- 


## Roadmap
Input validation, saved profile, comparison against published calculators.
Actual burned in a day vs. what is burned every day (BMR)








# DECISIONS:
## Calculator Funtction in Javascript
First decision I made was to create a personal project that would display daily calories burned in order to calculate your maintenance calories day-by-day rather than the common maintenance calculator that only averages your daily maintenance by a vague input range of how much you do and how intense your exercise is in a whole week.
I already knew Python from my courseload at School of Mines, so this is where I initially created it. There were no funtions yet.
I realized that this was too easy and decided I wanted to make it a little bit more universal and actually useful- hence creating a website.
Did some research and decided to learn basic Java and turn the code into functions as that seemed to be a necessity in the long run
realized there were a lot of repeated variables for unit conversion and turning mets over time into cals was repeated in nearly activity too, turned those into constants and a function respectively
Made the base input in imperial units because despite the statistics, Im American and use lbs and inches. I will figure out how to allow users to choose imperial or metric unit in the future.
started with only walking (steps), running, and weightlifting as options for activities alongside bmr and calories burned during casual daily activites such as work as those are the ones that I experience personally. More activites will soon be added. (Swimming, biking, hiking, etc.)
I am not going to take inputs as part of the funtions so I will in the future create the Java version of Python dictionaries (profile and day) which will contain all info that fns will run off of.
There is a final function that will sum the total of everythinmg at the end. This will also be updated over time to include additions from new exercises which will also have their own functions
Set the base margin of error to be 200 cals, will do future research to verify or adjust 
## App.js and index.html (and other changes)
Added incline to the walking model using the ACSM walking equation. Incline is uphill only, applied to all steps, and entered as a percent.
Added Daily Activities such as work of various intensities alongside standing (standing burn is minimal but still countable calorie expenditure)
- 2 new files: App.js and index.html
App.js is the file that controls, saves, and runs calculations for the website based on user inputs
Index.html actually creates the page and I used it to format a calculate button alongside input boxes for numbers alongside drop down menus for strings such as sex and lifting intensities
The two new files are connected by setting IDs for the variables they share and then taking hte variable of that ID from the other document. 
Most boxes in which numbers can be inputted should list the appropriate variable but there is little that prevents users from inputting absurd things at the moment and I will work through solving that issue next. 
