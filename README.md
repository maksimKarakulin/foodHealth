# Food Health Web App

A modern, scalable content management system built with Next.js,TypeScript, Golang, and Kubernetes. This project demonstrates enterprise-level architecture with microservices, containerization, and automated deployment pipelines.

## 🚀 Features

### Frontend
- **Food Search & Discovery**: Advanced search functionality for finding foods
- **Meal Planning**: Interactive meal planning interface
- **User Profiles**: Personalized dietary preferences and restrictions
- **Responsive UI**: Modern interface with reusable components
- **Real-time Updates**: Dynamic content updates using React
- **Type Safety**: Full TypeScript implementation

### Backend
- **RESTful API**: Well-structured Go backend with clean architecture
- **Swagger Documentation**: API documentation with OpenAPI/Swagger
- **Authentication**: Firebase integration for secure user management
- **Error Handling**: Comprehensive error management system
- **CORS Support**: Configured cross-origin resource sharing
- **Database**: PostgreSQL with GORM for data persistence

### DevOps
- **Containerization**: Docker support for consistent environments
- **Kubernetes Orchestration**: Complete K8s configuration including:
  - Horizontal Pod Autoscaling (HPA)
  - Persistent Volume management
  - ConfigMaps and Secrets
  - Network Policies
- **High Availability**: Multiple replicas and load balancing

## 🏗 Architecture

```
├── Frontend (Next.js)
│   └── Content Management Interface
├── Backend (Golang)
│   └── RESTful API
├── Database
│   └── PostgreSQL
└── Infrastructure
    └── Kubernetes Cluster (3 VPS)
```

## 🔧 Prerequisites

- Node.js 20.x
- Go 1.21+
- Docker & Docker Compose
- kubectl
- A Kubernetes cluster
- PostgreSQL
- Firebase account

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/maksimKarakulin/foodHealth
cd project-name
```

2. Set up the backend:
```bash
cd backend
go mod download
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Configure environment variables:
```bash
# Backend (.env)
DB_CONNECTION=postgresql://user:password@localhost:5432/dbname
FIREBASE_CONFIG=your-config

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FIREBASE_CONFIG=your-config
```

5. Start development servers:
```bash
# Backend
cd backend
go run cmd/main.go

# Frontend
cd frontend
npm run dev
```

## 🚀 Deployment

The project uses GitHub Actions for CI/CD. On push to main:

1. Tests are run
2. Docker images are built
3. Images are pushed to container registry
4. Kubernetes manifests are applied

### Manual Deployment

1. Build Docker images:
```bash
docker build -t yourusername/backend:latest ./backend
docker build -t yourusername/frontend:latest ./frontend
```

2. Apply Kubernetes manifests:
```bash
kubectl apply -f k8s/
```

## API Documentation
Access Swagger documentation at http://localhost:8080/swagger/index.html

Key Endpoints:

GET /api/foods: List all food items
POST /api/foods: Create new food item
GET /api/nutrients/{id}: Get nutrient information
GET /api/users/profile: Get user profile
PUT /api/users/preferences: Update user preferences


## 🛡️ Security

- Firebase Authentication
- Rate limiting
- CORS protection
- Error handling middleware
- Encrypted data in transit and at rest
- Kubernetes network policies

## 📚 API Documentation

API documentation is available at `/api/docs` when running the server.

### Key Endpoints

- `POST /api/content`: Create new content
- `GET /api/content`: List all content
- `PUT /api/content/:id`: Update content
- `DELETE /api/content/:id`: Delete content

## 💻 Development

### Branch Structure

- `main`: Production-ready code
- `develop`: Integration branch
- Feature branches: `feature/*`
- Bug fixes: `bugfix/*`

### Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

📄 License
This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
This means:

You can view, modify, and distribute the code
Any modifications must also be open source under AGPL-3.0
If you use this code in a web service, you must make your full source code available
Full license terms are available in the LICENSE file

## 📬 Contact

Maksim Karakulin email@example.com

Project Link: [https://github.com/maksimKarakulin/foodHealth](https://github.com/maksimKarakulin/foodHealth)

## 🙏 Acknowledgments

