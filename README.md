# Food Health Web App

A modern, scalable content management system built with Next.js, Golang, and Kubernetes. This project demonstrates enterprise-level architecture with microservices, containerization, and automated deployment pipelines.

## 🚀 Features

- **Modern Frontend**: Built with Next.js and React
- **Robust Backend**: Golang API with clean architecture
- **Security**: Firebase Authentication integration
- **Database**: PostgreSQL with GORM
- **Infrastructure**: Kubernetes orchestration across multiple VPS instances
- **CI/CD**: Automated pipelines using GitHub Actions
- **Scalability**: Containerized with Docker
- **Monitoring**: Logging and performance tracking

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

## 🛡️ Security

- Firebase Authentication
- Rate limiting
- CORS protection
- Encrypted data in transit and at rest
- Regular security audits

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

to do: 
- List any resources, libraries, or tools you used
- Credit any inspirations
- Link to relevant documentation
