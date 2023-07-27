# Online Shared Text Editor
Welcome to the Online Shared Text Editor! This project allows multiple users to collaboratively edit and share text in real-time. It provides a seamless editing experience with instant updates across all connected users.

# Installation
Before getting started, ensure that you have Node.js version 19.9.0 installed on your system. You can download Node.js from the official website: https://nodejs.org

To set up the Online Shared Text Editor, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/shubham-pyc/fullstack-jenni.git
Install project dependencies:
```
2. Install project dependencies:
```bash
cd fullstack-jenni
yarn install
```

3. Serve the backend:
```bash
nx serve backend
```


4. Serve the frontend

```bash
nx serve frontend
```

Once both the backend and frontend are running, you can access the Online Shared Text Editor by navigating to http://localhost:4200 in your web browser.



## Approach

For collebration we need the manage conflitcs. 

ShareDB is a realtime database backend based on Operational Transformation (OT).