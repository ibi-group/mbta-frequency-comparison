# MBTA Frequency Comparison

Compares stop-to-stop segment-level frequencies between existing and propsed GTFS networks.

## Steps for running in development

### First-time setup

- Clone this repo
- create a new conda environment from the provided environment.yml file via `conda create`
- Install all python dependencies via Anaconda in the newly created conda environment (there are both conda and pip dependencies)
- Install all javascript dependencies locally via `npm install`

### Running the tool

- In one terminal, cd to the main app folder and run the server for the UI via `npm start`
- Separately, open the Anaconda prompt, cd to the backend folder and run `conda activate <env>` then `flask run` to start the backend server
