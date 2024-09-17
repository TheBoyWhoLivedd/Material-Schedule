# Material Schedule Application Documentation

## Introduction

The Material Schedule Application is a powerful tool that serves as an operational aid for the Uganda Revenue Authority's (URA) unit responsible for VAT exemptions for aid-funded construction projects. This application primarily aids in the calculation of construction materials based on the Bill of Quantities (BOQ) values. It further enhances our tracking capabilities of the materials allocated every time a taxpayer applies for them.

## Access and Login

The application is accessible via [materialschedule.vercel.app](https://materialschedule.vercel.app). Upon reaching the login page, the user must enter their unique username and password to gain system access. New users, added by the supervisor, will have a default password (1234), and they are strongly advised to modify their password via user settings after their first login.

## Main Dashboard

After login, users are directed to the dashboard (/dash). This dashboard features a Navbar on the top of the screen with a button for triggering the left-hand menu sidebar, a home button, and a theme toggle (light/dark mode).

The collapsible sidebar houses the primary navigation of the system. Depending on user roles (admin or employee), the sidebar will display various navigational buttons, such as "View Projects," "Add New Project," "View User Settings," and "Add New User." These buttons will lead to respective routes within the application. At the bottom of the sidebar, you'll find the logged-in user's name, their role, and a logout button.

On the main dashboard, each employee will see their assigned projects depicted as cards. Hovering over a card unveils an edit button (top right corner), allowing users to alter project details based on their access rights. Each card also contains two action buttons—'Schedules' and 'Applications,' leading to /dash/schedules/:id and /dash/schedules/:id/application respectively.

## Schedule Creation and Tracking

Navigation to /dash/schedules/:id takes the user to a resourceful section where the calculation of required materials based on the given BOQ takes place. This page also includes an intuitive data table representing all the calculated materials to date.

Adding new materials is facilitated through a dynamic form accessed by clicking the 'Add Materials' button. The form's inputs vary depending on the BOQ item selected for calculation, such as concrete. Once the necessary parameters are filled and the user hits 'Generate,' the resulting materials (e.g., cement, sand, aggregates) get added to the data table.

The summary page (/dash/schedules/:id/summary) provides an aggregate view of all the calculated materials, displayed in a collapsible accordion. Clicking on each accordion element reveals individual components that make up the final material count.

## Material Applications Management

The application management page (/dash/schedules/:id/application) keeps a record of materials applications every time a contractor submits a request. This page offers an accordion list of applications sorted by the date of submission. Additional application details can be accessed by clicking on individual list items in the accordion.

Adding new applications is simplified with an 'Add Application' button that presents a form with necessary fields such as 'items requested,' 'supplier,' 'requested amount,' and 'amount allowed.'

The page also provides a 'View Summary' button, redirecting to /dash/schedules/:id/requested, which aggregates all the material requests made to date.

## Project and User Management

The route /dash/schedules/new allows the admin to add new projects and assign them to officers. Similarly, user management is facilitated through /dash/users, where admins can view and edit details of all users. Non-admin employees can use this route to change their password. Adding new users to the system is streamlined through /dash/users/new, which is exclusively available to admins.

---

Version 1.0.0 – [Date]

### Contact Information

For any inquiries or feedback regarding the Material Schedule Application, please contact our team at ayesigwar@gmail.com.

[Additional contact information or relevant links can be added here if needed.]

