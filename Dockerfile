# Stage 1: Build C library with Emscripten
FROM emscripten/emsdk:latest as build-c-library

WORKDIR /app

# Copy the C source files and build script
COPY extern/OasisC /app/oasisc

WORKDIR /app/oasisc

# Build the C library with Emscripten
RUN emcmake cmake -B build -DOASIS_BUILD_PARANOID=OFF -DOASIS_BUILD_TESTS=OFF -DOASIS_BUILD_IO=ON .
RUN emmake cmake --build build

# Stage 2: Build Next.js application
FROM node:18-alpine as build-nextjs

WORKDIR /app

# Copy the Next.js application files
COPY . /app/nextjsapp

# Copy the build artifacts from the previous stage
COPY --from=build-c-library /app/oasisc/build/OasisC.js /app/nextjsapp/src/app/app/
COPY --from=build-c-library /app/oasisc/build/OasisC.wasm /app/nextjsapp/src/app/app/

WORKDIR /app/nextjsapp

# Install dependencies and build the Next.js application
RUN npm install
RUN npm run build

# Stage 3: Run the Next.js application
FROM node:18-alpine as run-nextjs

WORKDIR /app

# Copy the built Next.js application from the previous stage
COPY --from=build-nextjs /app/nextjsapp /app/nextjsapp

WORKDIR /app/nextjsapp

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]