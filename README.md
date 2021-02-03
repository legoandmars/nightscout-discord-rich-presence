# Nightscout Discord Rich Presence
A node project that displays blood sugar values from a Nightscout site on Discord 

![An example of a discord user using rich presence](https://user-images.githubusercontent.com/34404266/106720104-e9bf9700-65b7-11eb-933d-1b33ffd5be53.png)
![Another example of a discord user using rich presence](https://user-images.githubusercontent.com/34404266/106727755-a4ec2e00-65c0-11eb-8f9d-fe68cad68686.png)

If you're not sure what Nightscout is, check out [nightscout.info](http://www.nightscout.info/) for more information. 
I highly recommend setting up a personal Nightscout site if you're diabetic.

## Usage
Simply download a Windows/Mac/Linux release from the [releases tab](https://github.com/legoandmars/nightscout-discord-rich-presence/releases).

Upon load, you'll be prompted to enter:
* Your Nightscout site's URL
* If you'd like the site to be linked on discord
* The values to trigger the low/high alarm status
* What units to use (mgdl or mmol)

If you'd like to modify any of these values later, they can be found in the `config.yaml` file automatically generated in the same folder as the program. Either manually edit the file, or delete it to run the config wizard again.

Make sure you have discord open on the same PC. If it's not showing up, double check that Game Activity is enabled in your settings.
## Development
This project is built with typescript.
### Setup
For development, you'll need [node.js](https://nodejs.org/) and yarn. 

If you don't have yarn installed, you can install it with 
`npm install --global yarn`

To install all of the project's necessary dependencies, run `yarn install`

### Commands

    yarn run build # Run the typescript compiler 
    yarn run watch # Run the typescript compiler in watch mode
    yarn run test # Run TSLint to check for errors
### Packaging
To bundle everything up into Windows/Mac/Linux executables use `yarn run pkg`

The compiled executables can be found in the `dist` folder

## License
This project is [MIT](https://github.com/legoandmars/nightscout-discord-rich-presence/) licensed.

[The Nightscout Logo](https://www.nightscoutfoundation.org/logos) by The Nightscout Foundation is licensed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).