# System Architecture Diagram — EmptyArt

This diagram shows the high-level architecture of the EmptyArt platform, illustrating how the frontend, backend, and database layers communicate.

```mermaid
graph TB
    subgraph Client["Client (Browser)"]
        direction TB
        REACT["React 19 SPA<br/>Vite + Tailwind CSS 4"]
        ROUTER["React Router 7<br/>Client-Side Routing"]
        API_JS["api.js<br/>Centralized Fetch Wrapper"]
        LS["localStorage<br/>JWT Token + Role"]

        REACT --> ROUTER
        REACT --> API_JS
        API_JS --> LS
    end

    subgraph Server["Backend Server (Flask)"]
        direction TB
        FLASK["Flask 3 Application<br/>app.py"]
        CORS_MW["Flask-CORS<br/>Middleware"]
        AUTH_MW["JWT Auth<br/>Decorators"]
        
        subgraph Blueprints["API Blueprints"]
            AUTH_BP["/api/auth<br/>Register, Login, Me"]
            UPLOAD_BP["/api/uploads<br/>CRUD, Feed, Reactions"]
            USER_BP["/api/users<br/>Profile, Follow"]
            ADMIN_BP["/api/admin<br/>Moderation Panel"]
        end

        FLASK --> CORS_MW
        CORS_MW --> AUTH_MW
        AUTH_MW --> Blueprints
    end

    subgraph Storage["Data Layer"]
        direction TB
        SQLITE[("SQLite Database<br/>instance/database.db")]
        ORM["Flask-SQLAlchemy<br/>ORM"]
        FS["File System<br/>static/uploads/"]

        ORM --> SQLITE
    end

    %% Cross-layer connections
    API_JS -- "HTTP REST API<br/>JSON + JWT Bearer Token" --> CORS_MW
    Blueprints --> ORM
    UPLOAD_BP -- "Image Files" --> FS
    FLASK -- "Serve Static Files" --> FS
```

## Layer Descriptions

### Client Layer (Frontend)
| Component        | Technology               | Responsibility                                        |
| ---------------- | ------------------------ | ----------------------------------------------------- |
| React SPA        | React 19 + Vite          | Renders the UI, manages component state               |
| Router           | React Router 7           | Client-side navigation between pages                  |
| API Wrapper      | Custom `api.js`          | Centralized HTTP requests with automatic JWT injection |
| Token Storage    | localStorage             | Stores JWT token and user role client-side             |

### Server Layer (Backend)
| Component        | Technology               | Responsibility                                        |
| ---------------- | ------------------------ | ----------------------------------------------------- |
| Flask App        | Flask 3                  | Application factory, configuration, blueprint registration |
| CORS Middleware  | Flask-CORS               | Allows cross-origin requests from the frontend        |
| Auth Middleware  | PyJWT + Custom Decorators| Validates JWT tokens, enforces role-based access      |
| Auth Blueprint   | `/api/auth`              | User registration, login, session management          |
| Uploads Blueprint| `/api/uploads`           | Artwork CRUD, feed generation, reactions              |
| Users Blueprint  | `/api/users`             | Profile management, follow system                     |
| Admin Blueprint  | `/api/admin`             | Content moderation, user role management              |

### Data Layer
| Component        | Technology               | Responsibility                                        |
| ---------------- | ------------------------ | ----------------------------------------------------- |
| Database         | SQLite                   | Persistent storage for users, uploads, reactions, follows |
| ORM              | Flask-SQLAlchemy         | Object-relational mapping for database models         |
| File Storage     | Local File System        | Stores uploaded artwork images in `static/uploads/`   |

## Communication Flow

1. **User interacts** with the React SPA in the browser.
2. **React calls** `api.js` which attaches the JWT token from localStorage to each request.
3. **HTTP request** is sent to the Flask backend (typically `http://localhost:5000`).
4. **Flask-CORS** validates the origin and allows/blocks the request.
5. **Auth decorators** (`@login_required`, `@admin_required`) verify the JWT token and check roles.
6. **Blueprint handler** processes the request, interacts with SQLAlchemy models.
7. **SQLAlchemy** reads from or writes to the SQLite database.
8. **Response** (JSON) is returned to the frontend for rendering.
