# SPEND-SMART 💰

A comprehensive personal finance management application to help you track expenses, manage budgets, and achieve your financial goals.

## 🚀 Features

- **Expense Tracking**: Log and categorize your daily expenses
- **Budget Management**: Set and track monthly budgets
- **Financial Insights**: Visualize your spending patterns with interactive charts
- **Multi-Device Sync**: Access your finances from anywhere, anytime

## 🛠 Tech Stack

### Frontend
- React.js
- Redux for state management
- Material-UI for components
- Chart.js for data visualization

### Backend
- Node.js with Express
- MongoDB for database
- RESTful API architecture

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/SPEND-SMART.git
   cd SPEND-SMART
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   npm run dev
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Update .env with your API URL
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 Environment Variables

### Backend
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend
Create a `.env` file in the frontend directory with the following variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 📧 Contact

Your Name - durgeshbahadursingh2003@gmail.com

Project Link: [https://github.com/Georgiandurgesh/SPEND-SMART](https://github.com/Georgiandurgesh/SPEND-SMART)
