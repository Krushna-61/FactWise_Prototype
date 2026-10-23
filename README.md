# WardFlow prototype

A dependency-free, responsive prototype for the FactWise Technical Product Manager assessment.

## What it demonstrates

- Role-based views for nurse, doctor, and admin users.
- Nurse temperature recording with range validation and duplicate-reading prevention.
- Doctor visit workflow, available only after a daily temperature exists.
- Discharge workflow based on three consecutive fever-free days, including doctor-to-admin handoff and capacity release.
- Patient list, patient history, daily task queues, and a treatment-quality dashboard.

## Run locally

Open `index.html` in a browser, or serve the folder with any static web server.

## Deploy to Vercel

1. Create a new Vercel project and import this folder or its Git repository.
2. Select **Other** as the framework preset.
3. Leave the build command and output directory empty.
4. Deploy. Vercel will serve `index.html` as the app entry point.

The prototype uses browser session storage only; it does not send or persist real patient data.
