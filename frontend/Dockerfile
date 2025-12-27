FROM node:24-alpine

# Our install directory
WORKDIR /app

# Getting all dependencies (For React and Node)
COPY package.json ./

# Download said dependencies
RUN npm install

# Copy the rest of our app into container
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

