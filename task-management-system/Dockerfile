FROM node:14

# Install meteor
RUN npm install -g meteor@2.15 --unsafe-perm

WORKDIR /usr/src/app

# Copy app code over to container
COPY . .

# Set environment variable to allow Meteor to run as root
ENV METEOR_ALLOW_SUPERUSER=true

# Add Meteor's installation directory to PATH
ENV PATH="/root/.meteor:$PATH"

# Create production bundle
RUN \
    # Install app dependencies
    meteor npm install --production && \
    # Run meteor build to create prod bundle as a tar.gz
    meteor build ../build --architecture os.linux.x86_64 && \
    # Extract the tar.gz
    cd ../build && \
    tar -xzf app.tar.gz && \
    # Install server dependencies
    cd bundle/programs/server && \
    meteor npm install

# Expose the port that Meteor will run on. 8080 for Google Cloud Run
EXPOSE 8080

# Go to where the main.js file is
WORKDIR /usr/src/build/bundle

# Set the start command
CMD ["node", "main.js"]