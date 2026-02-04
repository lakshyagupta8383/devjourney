
## DevJourney
DevJourney is a full-stack developer portfolio and project-tracking platform that helps developers document their growth, manage projects, and generate AI-assisted task generator.


## Features

Authentication with Email/Password and Google (Firebase)

Project and task management dashboard

Protected routes with role-based access

AI-powered task generation

Responsive UI built with Tailwind CSS

Secure backend using Firebase Admin SDK

Production-grade Docker + CI/CD deployment

## Tech Stack

**Frontend:** Next.js (App Router), React, Tailwind CSS

**Backend & Services:** Firebase Authentication, Firebase Firestore, Firebase Admin SDK ,OpenAI API


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Client (exposed to browser)

`NEXT_PUBLIC_FIREBASE_API_KEY`

`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

`NEXT_PUBLIC_FIREBASE_PROJECT_ID`

`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

`NEXT_PUBLIC_FIREBASE_APP_ID`

`NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Server (never exposed)

`FIREBASE_PROJECT_ID`

`FIREBASE_CLIENT_EMAIL`

`FIREBASE_PRIVATE_KEY`

`OPENAI_API_KEY`
## Deployment

DevJourney is deployed using a fully containerized CI/CD pipeline with automated builds and zero-downtime deployment.

#### Deployment Architecture

Source code is hosted on GitLab

Docker is used to build a production-ready image

GitLab CI/CD handles automated builds and image publishing

The image is stored in GitLab Container Registry

An AWS EC2 instance pulls and runs the latest image

Nginx acts as a reverse proxy, routing public traffic to the application

Secrets and credentials are securely managed via CI/CD environment variables

The application runs in production mode using Next.js standalone output

#### Deployment Flow

Code is pushed to the main branch

GitLab CI pipeline builds the Docker image

Image is pushed to GitLab Container Registry

EC2 instance pulls the latest image

Existing container is replaced with the new version

Nginx forwards HTTP traffic to the running container on port 3000

Live Application

The application is live and accessible at:

http://devjourney.54.197.150.178.sslip.io

## Author

Lakshya Gupta