# GPT-AdminMail

**Version**: 1.0.0  
**License**: MIT

## Table of Contents

- [GPT-AdminMail](#gpt-adminmail)
  - [Table of Contents](#table-of-contents)
  - [Description](#description)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Environment Variables](#environment-variables)
  - [Docker Setup](#docker-setup)
  - [Dependencies](#dependencies)
  - [License](#license)

## Description

**GPT-AdminMail** is a Node.js application that automates email operations. It is designed to send status mails, summarize emails, and interact with the OpenAI API. The project uses Docker for easy deployment and ensures a streamlined environment for handling email-related tasks, including sending and summarizing messages using natural language processing.

## Features

- Send status emails using SMTP.
- Summarize received emails.
- Environment variables for flexible email configuration.
- Dockerized for ease of setup and portability.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/GPT-AdminMail.git
   ```

2. Navigate to the project directory:

   ```bash
   cd GPT-AdminMail
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

## Usage

After installation, you can run the project using Node.js:

```bash
node index.js
```

This will start the application based on the configurations provided in the environment variables.

## Environment Variables

The project uses environment variables for email configuration. Ensure to set these variables before running the application. You can either set them directly in your environment or create a `.env` file with the following variables:

```bash
EMAIL_USER=<your-email-username>
EMAIL_PASSWORD=<your-email-password>
EMAIL_HOST=<your-email-host>
EMAIL_PORT=<your-email-port>
EMAIL_TLS=<true-or-false>
SMTP_HOST=<your-smtp-host>
SMTP_PORT=<your-smtp-port>
SMTP_SECURE=<true-or-false>
SMTP_USER=<your-smtp-username>
SMTP_PASS=<your-smtp-password>
SMTP_FROM=<your-smtp-from-email>
MAILTO=<recipient-email-address>
```

## Docker Setup

You can easily run this project using Docker. The `docker-compose.yml` file is included for setting up the necessary services.

1. Build and run the Docker container:

   ```bash
   docker-compose up --build
   ```

   This will use the configurations defined in the `docker-compose.yml` file, which pulls the environment variables from the host machine.

## Dependencies

The following dependencies are used in this project:

- **dotenv**: To load environment variables from a `.env` file.
- **imap-simple**: For handling IMAP email operations.
- **mailparser**: To parse incoming emails.
- **nodemailer**: For sending emails via SMTP.
- **openai**: To interact with the OpenAI API.

For more details, refer to the [package.json](./package.json) file.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more information.
