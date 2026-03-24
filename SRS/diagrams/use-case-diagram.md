# Use Case Diagram — EmptyArt

This diagram illustrates the interactions between the three actor types (Anonymous User, Registered User, Admin) and the system's key features.

```mermaid
graph LR
    subgraph Actors
        A["🧑 Anonymous User"]
        U["🧑‍🎨 Registered User"]
        AD["🛡️ Admin"]
    end

    subgraph Authentication
        UC1["Register"]
        UC2["Login"]
        UC3["Logout"]
    end

    subgraph Artwork Management
        UC4["Browse / Explore Artworks"]
        UC5["View Artwork Details"]
        UC6["Upload Artwork"]
        UC7["Delete Own Artwork"]
    end

    subgraph Social Interactions
        UC8["Like / Unlike Artwork"]
        UC9["Comment on Artwork"]
        UC10["Bookmark / Unbookmark"]
        UC11["View Bookmarks"]
        UC12["Follow / Unfollow User"]
        UC13["View Personalized Feed"]
    end

    subgraph Profile
        UC14["View User Profile"]
        UC15["Edit Own Profile"]
        UC16["View Followers / Following"]
    end

    subgraph Admin Panel
        UC17["View All Uploads"]
        UC18["Delete Any Upload"]
        UC19["View All Reactions"]
        UC20["Delete Any Reaction"]
        UC21["View All Users"]
        UC22["Change User Role"]
    end

    %% Anonymous User
    A --> UC1
    A --> UC2
    A --> UC4
    A --> UC5
    A --> UC14

    %% Registered User (inherits Anonymous + more)
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8
    U --> UC9
    U --> UC10
    U --> UC11
    U --> UC12
    U --> UC13
    U --> UC14
    U --> UC15
    U --> UC16

    %% Admin (inherits Registered + admin panel)
    AD --> UC6
    AD --> UC7
    AD --> UC8
    AD --> UC9
    AD --> UC17
    AD --> UC18
    AD --> UC19
    AD --> UC20
    AD --> UC21
    AD --> UC22
```

## Use Case Descriptions

| Use Case ID | Name                    | Actor(s)          | Description                                                                 |
| ----------- | ----------------------- | ----------------- | --------------------------------------------------------------------------- |
| UC-1        | Register                | Anonymous         | Create a new account with email, username, and password.                     |
| UC-2        | Login                   | Anonymous         | Authenticate using email/password to receive a JWT token.                    |
| UC-3        | Logout                  | Registered        | Clear JWT token from local storage to end the session.                       |
| UC-4        | Browse / Explore        | All               | View paginated list of all artworks on the platform.                        |
| UC-5        | View Artwork Details    | All               | Open a lightbox modal showing the artwork, author, likes, and comments.     |
| UC-6        | Upload Artwork          | Registered, Admin | Upload an image file with title and description.                            |
| UC-7        | Delete Own Artwork      | Registered, Admin | Remove an artwork the user has uploaded.                                    |
| UC-8        | Like / Unlike           | Registered, Admin | Toggle a like on an artwork.                                                |
| UC-9        | Comment                 | Registered, Admin | Post a text comment on an artwork.                                          |
| UC-10       | Bookmark / Unbookmark   | Registered        | Save or unsave an artwork to the user's vault.                              |
| UC-11       | View Bookmarks          | Registered        | View all bookmarked artworks in "The Vault".                                |
| UC-12       | Follow / Unfollow       | Registered        | Toggle follow relationship with another user.                               |
| UC-13       | View Feed               | Registered        | View uploads from followed users in a personalized feed.                    |
| UC-14       | View User Profile       | All               | View a user's profile page with upload grid and follower counts.            |
| UC-15       | Edit Profile            | Registered        | Update bio, username, and avatar.                                           |
| UC-16       | View Followers/Following| Registered        | View the list of a user's followers or who they follow.                     |
| UC-17       | View All Uploads        | Admin             | Access a list of all uploads on the platform from the admin dashboard.      |
| UC-18       | Delete Any Upload       | Admin             | Remove any upload regardless of ownership.                                  |
| UC-19       | View All Reactions      | Admin             | See all likes, comments, and bookmarks across the platform.                 |
| UC-20       | Delete Any Reaction     | Admin             | Remove any reaction from the platform.                                      |
| UC-21       | View All Users          | Admin             | See a list of all registered users and their roles.                         |
| UC-22       | Change User Role        | Admin             | Promote or demote a user's role (cannot change own role).                   |
