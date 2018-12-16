# Dependencies
This requires NodeJS which can be downloaded [here](https://nodejs.org/en/).

# Installation
To install, [download the ZIP](https://github.com/leogandmars/nightscout-discord-rich-presence/archive/master.zip) and extract it somewhere.

Once you've extracted the ZIP, run installDependencies.bat to automatically install the neccesary dependencies.

NOTE: Because this is not a signed exe file, Windows SmartScreen will falsely block it from running. Worry not - simply just run it anyways, as this is just a false positive. [VirusTotal link](https://www.virustotal.com/#/file-analysis/MDUzZjM1NWY0ZjQ4NjM5YzliYjA1YTdmZDIxYmJkNTg6MTU0NDk2MDUxNQ==)

# Configuration
Once you've installed this item, go into config.json and change a few settings.

Replace "YOURSITEHERE" with the link to your nightscout site. It should look something like this: "yournightscout.herokuapp.com"

If you want to publicly display the link to your nightscout site, set displayNightscoutSite to true. (False by default)

Additionally, if you use mmol/L change units to "mmol". (Note: the alarm values will still be in mg/dl.)

Feel free to adjust the low/high alarm values as necessary. 

# Running
To run, simply run "run.bat". As long as this is running, your Discord account should look like this:

![none](https://i.imgur.com/RL7O8AS.png)

NOTE: Discord must be open for this to work.
