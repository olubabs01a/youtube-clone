FROM node:18

WORKDIR /app

# Install ffmpeg in the container
RUN apt-get update && apt-get install -y ffmpeg

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

COPY . .

# Make port 3000 available outside this container
EXPOSE 3000

CMD [ "npm", "start" ]