FROM node:14

WORKDIR /app

# Copy package.json and package-lock.json for scrapper and cashback
COPY samsaScrap/package*.json ./samsaScrap/
COPY cashback/package*.json ./cashback/

# Install dependencies for scrapper and cashback
RUN cd samsaScrap && npm install
RUN cd cashback && npm install

# Copy the rest of the application code
COPY . .

# Define the command to run the scrapper runner.js script
CMD node ./samsaScrap/runner.js
