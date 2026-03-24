# EMPTYART

## Software Requirements Specification (SRS)

**Prepared by:** Mbanza Teta Darcy  
**Institution:** African Leadership University  
**Date:** March 24, 2026  
**Version:** 101 (Infant-Project)

---

## Mission Statement

My mission is to create an interactive application that shows within an artist's soul. There, users are going to be able to witness artworks and engage with the creative process behind them. The main purpose isn't just to understand the journey of an artist, but to help users find their own creative voice. The goal is to show that art is not just a job or a finished product; it is identity, and a tool for self-expression.

Even the name **Empty Art** makes someone wonder — *how can art be empty?* That curiosity is the starting point. The platform forces interaction, pushes people to ask questions, and challenges them to see art not as a finished object but as a living experience.

### Relevance in the African Context

In many African societies, art is seen as a tool to fill space (decoration). In education, we are supposed to consume knowledge instead of creating, asking questions, or expressing ourselves. Creativity is seen as extra, too much. As a result, many people grow up disconnected from their own creativity, thinking that art is something they aren't a part of instead of something that lives inside them.

I use technology to exhibit art as living rather than an object; this project challenges the mindset by proving that art is a human experience. It struggles, grows, and has an identity. This approach helps the Youth remember that art is not separate from who we are. Instead, art is us, and this project is a bridge to that truth.

### Problem Statement

The youth admire art but can't find ways to engage with it in a meaningful way. Education systems focus on consumption over creation, making the youth appreciate art as something to observe or own.

The youth across Africa are curious, but a lack of guidance is killing their ability to be creative; they observe and admire, and never ask why the particular artwork was made or how, yet they interact with art every day (school, museums, social media, etc). Art is everywhere — schools, galleries, and social media — but it remains without change if the youth don't stop and wonder "why?" or "how?". As long as these youth think that art is for others or too difficult to engage with, we have failed as a community in aspects of self-expression and creativity. With the lack of an interactive platform that connects youth with how art moves from an idea to a final creation, they will keep consuming art more than they are questioning or creating it.

---

## Revision History

| Name            | Date            | Reason For Changes | Version |
| --------------- | --------------- | ------------------ | ------- |
| Infant-Project  | March 24, 2026  | First draft        | 101     |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [External Interface Requirements](#3-external-interface-requirements)
4. [Requirement Specifications](#4-requirement-specifications)
5. [Other Nonfunctional Requirements](#5-other-nonfunctional-requirements)
6. [Appendix](#6-appendix)

---

## 1. Introduction

### 1.1 Purpose

**Name of the product:** Empty Art  
**Release number:** 101

**Description of the Project:**

Empty Art is a digital social platform that invites users to step inside the world of art. At first glance, art looks finished and silent. But when users explore deeper — through uploads, comments, likes, and conversations — they discover the ideas, struggles, emotions, and stories behind each piece.

Users engage with artworks by:

- **Exploring** — Browsing artworks uploaded by artists across the platform
- **Interacting** — Liking, commenting, and bookmarking pieces that move them
- **Connecting** — Following artists, building a personalized feed, and joining a creative community
- **Creating** — Uploading their own artworks with titles and descriptions that tell their story

The goal is not only to understand artists, but to help users find their own creative voice. Art is shown as a living human experience, not just a product.

### 1.2 Document Conventions

- All section headings are numbered: 1, 1.1, 1.2… to avoid misunderstandings.
- Words in **bold** are headings, subtitles, and important abbreviations.
- Functional requirements are prefixed **FR** and a number (e.g., FR 1, FR 2).
- Non-functional requirements are prefixed **NFR** and a number (e.g., NFR 1, NFR 2).
- All requirements are written using clear, readable language.
- All requirements are mandatory.

### 1.3 Intended Audience and Reading Suggestions

This document is intended for:

- **Myself** — to show what the software needs to do, how, and to keep everything organized.
- **Facilitators** — to check my understanding of software development and give feedback.
- **Classmates** — to pick their brains and to give feedback.

**Suggestions on how to read it:**

1. Start with **Section 1** to understand the idea
2. Read **Section 2** for the system overview
3. Read **Section 3** for interfaces
4. Read **Section 4** for features
5. Read **Section 5** for quality rules
6. Read **Section 6** for appendix, glossary, and analysis models

### 1.4 Product Scope

Empty Art turns passive art viewing into an interactive social experience.

The main objectives of the product are:

- To help users engage with artworks beyond surface-level viewing.
- To encourage users to think, comment, and show their own creativity.
- To fill the gap between artist and audience through social interaction and storytelling.
- To support learning, self-discovery, and creative growth.
- To build a community of creative individuals who follow, inspire, and challenge each other.

### 1.5 References

| Reference                  | Description                                                   |
| -------------------------- | ------------------------------------------------------------- |
| IEEE Std 830-1998          | Recommended Practice for Software Requirements Specifications |
| Flask Documentation        | https://flask.palletsprojects.com/                            |
| React Documentation        | https://react.dev/                                            |
| Tailwind CSS Documentation | https://tailwindcss.com/docs                                  |

---

## 2. Overall Description

### 2.1 Product Perspective

Empty Art is a new, self-contained web-based platform. It is not a replacement for any existing system. It stores user data, artwork uploads, and social interactions using a local SQLite database. The backend serves as a REST API, and the frontend is a single-page application that communicates with it.

**Technology Stack:**

| Layer      | Technology                                                                  |
| ---------- | --------------------------------------------------------------------------- |
| Frontend   | React 19, Vite, Tailwind CSS 4, React Router 7, Motion (Framer Motion)     |
| Backend    | Flask 3, Flask-SQLAlchemy, PyJWT, Flask-CORS                                |
| Database   | SQLite                                                                      |
| Auth       | JWT (JSON Web Token, stored in localStorage)                                |

### 2.2 Product Functions

At a high level, the system will:

1. **Register and log in users** with email and password
2. **Show artworks** uploaded by artists with titles and descriptions
3. **Display artist profiles** with their portfolio grids, bios, and follower counts
4. **Allow likes, comments, and bookmarks** on artworks
5. **Follow system** — users follow other artists to build a personalized feed
6. **Personalized feed** showing uploads from followed artists
7. **Explore page** for browsing all artworks across the platform
8. **The Vault** — a bookmarks collection where users save artworks that move them
9. **User profiles** with editable bio, username, and avatar
10. **Admin dashboard** for content moderation and user management
11. **Dark/light theme toggle** for user comfort

### 2.3 User Classes and Characteristics

| User Class                             | Description                                                                 | Skill Level |
| -------------------------------------- | --------------------------------------------------------------------------- | ----------- |
| **General Users (Art Explorers)**      | Students, art lovers, and curious users who browse and explore artworks.     | Low         |
| **Creative Users (Aspiring Artists)**  | Users interested in uploading their own art, commenting, and engaging.       | Moderate    |
| **Administrators**                     | Manage content, users, and system configuration. Limited number with elevated privileges. | High        |

### 2.4 Operating Environment

**Hardware Platform:**
- Desktop computers, laptops, and tablets

**Operating Systems:**
- Windows 10 or later
- macOS

**Software Environment:**
- Browsers: Google Chrome, Microsoft Edge, Mozilla Firefox, Safari
- Backend server: Python 3.10+
- Frontend dev server: Node.js 18+
- Internet connection is needed

### 2.5 Design and Implementation Constraints

- Web technologies only (HTML, CSS, JavaScript, Python)
- Private REST API (Flask backend)
- Limited hosting budget (student-level resources)
- Must protect user data (hashed passwords, JWT authentication)
- Maximum upload file size: 16 MB
- Allowed image formats: PNG, JPG, JPEG, GIF, WEBP
- SQLite database (single-file, suitable for small-to-medium scale)

### 2.6 User Documentation

The following user documentation will be delivered along with the software:

- **README.md** — Quick-start guide with setup instructions
- **API Tester** — Built-in HTML page for testing backend endpoints
- **This SRS document** — Full system specification

All documentation is provided in English.

### 2.7 Assumptions and Dependencies

**Assumptions:**
- Users have internet access
- Users know how to use a web browser
- The platform will be accessed on modern browsers that support ES6+ JavaScript

**Dependencies:**
- Hosting platform availability
- Browser compatibility with modern web standards
- Node.js and Python runtime environments

---

## 3. External Interface Requirements

### 3.1 User Interfaces

The system provides a user interface with:

- Clean, modern design using Tailwind CSS
- Responsive layout for desktop, tablet, and mobile
- Sidebar navigation (desktop) and bottom navigation (mobile)
- Explore page for browsing all artworks
- Drag-and-drop artwork upload form
- Lightbox modal for viewing artwork details and comments
- User profile pages with upload grids
- Admin dashboard with tabbed management panels
- Dark/light theme toggle
- Toast notifications for user feedback

### 3.2 Hardware Interfaces

- Keyboard and mouse input
- Touch input for tablet and mobile users
- No special hardware devices are required

### 3.3 Software Interfaces

| Interface               | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| Flask REST API          | Backend server handling all business logic and data operations      |
| SQLite Database         | Stores users, uploads, reactions (likes/comments/bookmarks), follows |
| File System             | Stores uploaded artwork images in `static/uploads/`                |
| React SPA               | Frontend single-page application consuming the API                 |

Data exchanged includes:
- Artwork images and metadata (title, description)
- User profiles, comments, and reactions
- Authentication tokens (JWT)
- Follow relationships

### 3.4 Communications Interfaces

- **HTTP/HTTPS** for all client-server communication
- **RESTful API** design pattern for all endpoints
- **JSON** as the data exchange format
- **CORS** (Cross-Origin Resource Sharing) enabled for frontend-backend communication
- **JWT Bearer Tokens** in Authorization headers for authenticated requests

### API Endpoints Summary

| Method | Endpoint                       | Auth     | Description                     |
| ------ | ------------------------------ | -------- | ------------------------------- |
| POST   | `/api/auth/register`           | None     | Register a new user             |
| POST   | `/api/auth/login`              | None     | Login and receive JWT           |
| GET    | `/api/auth/me`                 | Required | Get current user profile        |
| GET    | `/api/uploads/`                | Optional | List all uploads (paginated)    |
| GET    | `/api/uploads/<id>`            | Optional | Get single upload               |
| POST   | `/api/uploads/`                | Required | Create new upload               |
| DELETE | `/api/uploads/<id>`            | Required | Delete own upload               |
| GET    | `/api/uploads/feed`            | Required | Personalized feed               |
| GET    | `/api/uploads/user/<id>`       | Optional | Uploads by a user               |
| POST   | `/api/uploads/<id>/like`       | Required | Toggle like                     |
| POST   | `/api/uploads/<id>/bookmark`   | Required | Toggle bookmark                 |
| POST   | `/api/uploads/<id>/comment`    | Required | Add comment                     |
| GET    | `/api/uploads/<id>/comments`   | Optional | Get comments (paginated)        |
| GET    | `/api/uploads/bookmarked`      | Required | Get bookmarked uploads          |
| GET    | `/api/users/<id>`              | Optional | Get user profile                |
| PUT    | `/api/users/<id>`              | Required | Update profile                  |
| POST   | `/api/users/<id>/follow`       | Required | Toggle follow                   |
| GET    | `/api/admin/uploads`           | Admin    | List all uploads                |
| DELETE | `/api/admin/uploads/<id>`      | Admin    | Delete any upload               |
| GET    | `/api/admin/reactions`         | Admin    | List all reactions              |
| DELETE | `/api/admin/reactions/<id>`    | Admin    | Delete any reaction             |
| GET    | `/api/admin/users`             | Admin    | List all users                  |
| PUT    | `/api/admin/users/<id>/role`   | Admin    | Change user role                |

### Frontend Routes

| Route          | Component          | Access       |
| -------------- | ------------------ | ------------ |
| `/`            | Landing / Feed     | Public/Auth  |
| `/explore`     | Explore            | Auth         |
| `/upload`      | Upload             | Auth         |
| `/bookmarks`   | Bookmarks          | Auth         |
| `/profile/:id` | Profile            | Public       |
| `/admin`       | AdminDashboard     | Admin        |

---

## 4. Requirement Specifications

### Functional Requirements

| Req ID | Requirement         | Description                                                                                           |
| ------ | ------------------- | ----------------------------------------------------------------------------------------------------- |
| FR 1   | Registration        | Users create accounts with email, username, and password (minimum 6 characters). Duplicate emails/usernames are rejected. |
| FR 2   | Log In              | Users log in with email and password, receiving a JWT token valid for 24 hours. Passwords are verified against stored hashes. |
| FR 3   | Explore Art         | Registered users can browse paginated artworks (20 per page) on the Explore page.                        |
| FR 4   | Upload Artwork      | Authenticated users upload images (max 16 MB) with a title and description via drag-and-drop. The frontend validates that the file is an image before uploading. |
| FR 5   | View Artwork Detail | Users can open any artwork in a lightbox modal showing the image, title, description, author info, like count, and comments. |
| FR 6   | Like / Unlike       | Authenticated users toggle likes on artworks. Each user can like an artwork only once.                |
| FR 7   | Comments            | Authenticated users post text comments on artworks. Comments are paginated and tied to both user and artwork. |
| FR 8   | Bookmark (The Vault)| Authenticated users save/unsave artworks to their personal bookmarks collection ("The Vault").        |
| FR 9   | Follow / Unfollow   | Authenticated users follow or unfollow other users to build their creative network.                   |
| FR 10  | Personalized Feed   | The home feed displays artworks from followed users, encouraging discovery through connection.        |
| FR 11  | User Profiles       | Each user has a profile page showing their bio, avatar, upload grid, follower count, and following count. Users can edit their own profile. |
| FR 12  | Theme Toggle        | Users can switch between dark and light mode for their viewing comfort.                               |
| FR 13  | Admin Dashboard     | Admins can view and delete any upload, view and delete any reaction, view all users, and change user roles (cannot change own role). |

### Stakeholder Requirements

| Stakeholder    | Requirement                                                                                |
| -------------- | ------------------------------------------------------------------------------------------ |
| Users          | A safe, interactive platform to explore, share, and discuss art                            |
| Artists        | Ability to upload work with context (title, description) and receive feedback (likes, comments) |
| Admin          | Tools to moderate content and manage the community                                         |
| Developer (Me) | Clean, maintainable codebase with separation of concerns (frontend/backend/database)       |

---

## 5. Other Nonfunctional Requirements

| Requirement Type | Req ID | Description                                                                                   |
| ---------------- | ------ | --------------------------------------------------------------------------------------------- |
| Performance      | NFR 1  | Pages must load in less than 5 seconds on a normal internet connection.                       |
| Performance      | NFR 2  | The system must support at least 10 concurrent users without performance degradation.         |
| Performance      | NFR 3  | Images are loaded efficiently with standard browser rendering.                                |
| Security         | NFR 4  | All passwords are hashed using Werkzeug before storage.                                       |
| Security         | NFR 5  | All authenticated API endpoints require a valid JWT Bearer token.                             |
| Security         | NFR 6  | Admin endpoints verify admin role on both client (frontend guard) and server (backend decorator). |
| Security         | NFR 7  | Uploaded files are validated on the frontend to ensure they are image files before uploading.  |
| Security         | NFR 8  | CORS is configured to restrict cross-origin requests.                                         |
| Usability        | NFR 9  | New users should understand the basic features within 5 minutes due to simplicity.            |
| Usability        | NFR 10 | The frontend is responsive across desktop, tablet, and mobile devices.                        |
| Usability        | NFR 11 | Toast notifications provide immediate feedback for user actions.                              |
| Usability        | NFR 12 | Text is clear and readable in English.                                                        |
| Reliability      | NFR 13 | The system should be available and recover from errors without losing user data.               |
| Maintainability  | NFR 14 | Code is organized with separation of concerns: routes as blueprints, models in database.py, helpers in helpers.py. |
| Maintainability  | NFR 15 | The codebase follows RESTful API design conventions.                                          |
| Scalability      | NFR 16 | The system supports pagination to handle growing datasets.                                    |
| Portability      | NFR 17 | The system works on tablets and computers across major browsers.                              |

### Performance Requirements

- The home page must load in less than 5 seconds on a normal internet connection.
- Artwork pages must load in less than 5 seconds.
- The feed must appear in less than 2 seconds.
- The system must support at least 10 users at the same time without slowing down.

**Rationale:** Fast loading keeps users engaged and prevents them from leaving without interacting with the app.

### Safety Requirements

- Admins can remove any content that is harmful or inappropriate from the admin dashboard.
- The admin dashboard shows a confirmation prompt before deleting any content.

**Rationale:** User safety and emotional well-being are important, especially when building a non-judgmental space for expression.

### Security Requirements

- All user passwords are hidden (hashed with Werkzeug).
- The system uses HTTPS-ready architecture for all data transfers.
- Users log in using an email and a password, receiving a JWT token.
- Only admins can delete any artwork or reaction from the platform.
- Users can delete their own uploads.

**Rationale:** Users feeling safe to share their points of view and takes on any artwork is the system's main priority.

### Software Quality Attributes

**Usability:**
- New users should be able to understand the basic features within 5 minutes due to its simplicity.
- Text is clear and readable in English.

**Reliability:**
- The system should be available.
- The system must recover from damage without losing any data.

**Maintainability:**
- Code is written in an organized manner with clear separation (routes, models, helpers, components).
- New features can be easily added later through the blueprint/component architecture.

**Portability:**
- The system works on tablets and computers.

**Scalability:**
- The system allows more users as it grows through pagination and modular design.

### Business Rules

- Only users with accounts can comment, like, or bookmark.
- Only admins can delete any artwork or reaction from the platform.
- Users can delete their own uploads.
- Users must follow community guidelines when posting.
- Admins can change user roles but cannot change their own role.

---

## 6. Appendix

### Database Requirements

- The database stores users, uploads (artworks), reactions (likes, comments, bookmarks), and follow relationships.
- The system stores artwork metadata such as title, description, image URL, and creation timestamp.
- The database must not duplicate user accounts using the same email address or username.
- Deleting an upload cascades to delete all associated reactions.
- Follow relationships enforce uniqueness (a user cannot follow the same person twice).

### Appendix A: Glossary

| Term             | Definition                                                                              |
| ---------------- | --------------------------------------------------------------------------------------- |
| **Empty Art**    | The application name. The name provokes curiosity — *how can art be empty?*             |
| **Artwork**      | A creative work (image) uploaded by a user to be shared on the platform.                |
| **Infant-Project** | The name of this app in its early stages, meaning version 101.                       |
| **The Vault**    | The bookmarks section where users save artworks that moved them.                        |
| **Reaction**     | A user interaction with an artwork — can be a like, comment, or bookmark.               |
| **Feed**         | A personalized timeline showing artworks from users you follow.                         |
| **Explore**      | A page showing all artworks across the platform for discovery.                          |
| **JWT**          | JSON Web Token — used for authenticating users after login.                             |
| **SPA**          | Single Page Application — the frontend loads once and navigates without full page reloads. |
| **REST**         | Representational State Transfer — the API design pattern used by the backend.           |
| **CRUD**         | Create, Read, Update, Delete — the four basic data operations.                          |
| **CORS**         | Cross-Origin Resource Sharing — allows the frontend and backend to communicate across different ports. |
| **Blueprint**    | A Flask concept for organizing routes into modular groups.                              |

### Appendix B: Analysis Models

The following diagrams are included in the [diagrams/](diagrams/) subfolder:

1. **[Use Case Diagram](diagrams/use-case-diagram.md)**
   Shows interactions between users and the system (e.g., Browse Art, Upload, Comment, Follow, Admin Moderation).

2. **[Entity-Relationship Diagram (ERD)](diagrams/er-diagram.md)**
   Shows database tables: Users, Uploads, Reactions, and Follows with their relationships and constraints.

3. **[System Architecture Diagram](diagrams/system-architecture-diagram.md)**
   Shows the structure of the system: React frontend → Flask backend → SQLite database + file storage.

4. **[Data Flow Diagram (DFD)](diagrams/data-flow-diagram.md)**
   Shows how data moves between users, the system, the database, and file storage across multiple levels (Context, Level 1, Level 2).

---

*End of SRS Document*
