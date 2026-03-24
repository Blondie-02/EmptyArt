# Data Flow Diagram — EmptyArt

These diagrams show how data flows through the EmptyArt system for key operations.

## Level 0 — Context Diagram

```mermaid
graph LR
    USER(("👤 User"))
    ADMIN(("🛡️ Admin"))

    SYSTEM["EmptyArt<br/>Platform"]

    USER -- "Register / Login<br/>Upload Artwork<br/>Like, Comment, Bookmark<br/>Follow Users" --> SYSTEM
    SYSTEM -- "JWT Token<br/>Feed & Explore Data<br/>Profile Data<br/>Notifications" --> USER

    ADMIN -- "Manage Uploads<br/>Manage Reactions<br/>Manage Users" --> SYSTEM
    SYSTEM -- "Upload List<br/>Reaction List<br/>User List" --> ADMIN
```

## Level 1 — Main Processes

```mermaid
graph TB
    USER(("👤 User"))

    subgraph EmptyArt System
        P1["1.0<br/>Authentication"]
        P2["2.0<br/>Artwork<br/>Management"]
        P3["3.0<br/>Social<br/>Interactions"]
        P4["4.0<br/>Feed<br/>Generation"]
        P5["5.0<br/>Profile<br/>Management"]
        P6["6.0<br/>Admin<br/>Moderation"]
    end

    DB_USER[("User Store")]
    DB_UPLOAD[("Upload Store")]
    DB_REACTION[("Reaction Store")]
    DB_FOLLOW[("Follow Store")]
    FILE_STORE[("File Storage")]

    %% Authentication
    USER -- "Credentials" --> P1
    P1 -- "JWT Token" --> USER
    P1 -- "Read/Write User" --> DB_USER

    %% Artwork Management
    USER -- "Image + Metadata" --> P2
    P2 -- "Upload Confirmation" --> USER
    P2 -- "Save Image" --> FILE_STORE
    P2 -- "Write Upload Record" --> DB_UPLOAD

    %% Social Interactions
    USER -- "Like / Comment / Bookmark" --> P3
    P3 -- "Updated Counts" --> USER
    P3 -- "Write Reaction" --> DB_REACTION
    P3 -- "Read Upload" --> DB_UPLOAD

    %% Feed Generation
    USER -- "Request Feed" --> P4
    P4 -- "Feed Posts" --> USER
    P4 -- "Read Follows" --> DB_FOLLOW
    P4 -- "Read Uploads" --> DB_UPLOAD
    P4 -- "Read Reactions" --> DB_REACTION

    %% Profile Management
    USER -- "Profile Updates" --> P5
    P5 -- "Profile Data" --> USER
    P5 -- "Read/Write User" --> DB_USER
    P5 -- "Read/Write Follow" --> DB_FOLLOW

    %% Admin
    P6 -- "Read All" --> DB_UPLOAD
    P6 -- "Read All" --> DB_REACTION
    P6 -- "Read All" --> DB_USER
```

## Level 2 — Authentication Process Detail

```mermaid
graph TB
    USER(("👤 User"))

    P1_1["1.1<br/>Validate<br/>Input"]
    P1_2["1.2<br/>Check<br/>Duplicates"]
    P1_3["1.3<br/>Hash<br/>Password"]
    P1_4["1.4<br/>Create<br/>User Record"]
    P1_5["1.5<br/>Generate<br/>JWT Token"]
    P1_6["1.6<br/>Verify<br/>Credentials"]

    DB_USER[("User Store")]

    %% Registration Flow
    USER -- "Registration Data<br/>(email, username, password)" --> P1_1
    P1_1 -- "Valid Data" --> P1_2
    P1_2 -- "Read Users" --> DB_USER
    P1_2 -- "No Duplicates" --> P1_3
    P1_3 -- "Hashed Password" --> P1_4
    P1_4 -- "Write User" --> DB_USER
    P1_4 --> P1_5
    P1_5 -- "JWT Token + User Data" --> USER

    %% Login Flow
    USER -- "Login Data<br/>(email, password)" --> P1_6
    P1_6 -- "Read User" --> DB_USER
    P1_6 -- "Credentials Valid" --> P1_5

    %% Error paths
    P1_1 -. "Invalid Input" .-> USER
    P1_2 -. "Duplicate Found" .-> USER
    P1_6 -. "Invalid Credentials" .-> USER
```

## Data Flow Summary

| Flow                | Source           | Destination      | Data                                      |
| ------------------- | ---------------- | ---------------- | ----------------------------------------- |
| Registration        | User (Browser)   | Auth Service     | Email, username, password                 |
| Login               | User (Browser)   | Auth Service     | Email, password                           |
| Token Response      | Auth Service     | User (Browser)   | JWT token, user role, user data           |
| Upload Artwork      | User (Browser)   | Upload Service   | Image file, title, description            |
| Store Image         | Upload Service   | File System      | Image binary data                         |
| Save Upload Record  | Upload Service   | SQLite DB        | image_url, title, description, user_id    |
| Like/Bookmark       | User (Browser)   | Reaction Service | upload_id, reaction type                  |
| Add Comment         | User (Browser)   | Reaction Service | upload_id, comment text                   |
| Feed Request        | User (Browser)   | Feed Service     | JWT token (identifies user)               |
| Feed Response       | Feed Service     | User (Browser)   | List of uploads from followed users       |
| Follow/Unfollow     | User (Browser)   | User Service     | target user_id                            |
| Profile Update      | User (Browser)   | User Service     | bio, username, avatar image               |
| Admin Moderation    | Admin (Browser)  | Admin Service    | Action type + target resource ID          |
