# Data Cleaner and Drag-and-Drop Machine Learning Model Builder

An interactive, web-based application for data cleaning and building machine learning models with a drag-and-drop interface. Built with Apache Spark, PyTorch, ReactJS, Node.js, WebSockets, and Django, this project enables seamless data preprocessing and machine learning model creation.

## Features

### Data Cleaning and Preprocessing
- **UI/UX:** React JS
- **Data Handling:** Apache Spark (Training) + Apache Kafka for Realtime
- **Real-Time Updates:** Instant feedback on data modifications using WebSockets.

### Drag-and-Drop Machine Learning Model Builder
- **UI/UX:** Drag-and-drop components to design machine learning workflows.
- **Model Options:** Select from various PyTorch-based models with customizable hyperparameters.
- **Workflow Management:** Integrate data sources, preprocessing steps, and model configurations with Docker + Kubernetes

### Backend Scalability and Performance
- **Apache Spark Integration:** Efficient large-scale data handling for preprocessing and feature engineering.
- **PyTorch Support:** Robust deep learning capabilities with dynamic computational graphs.

## Tech Stack
- **Frontend:** ReactJS + other CSS Libraries
- **Backend:** Django and Node.js for application logic and API handling.
- **Real-Time Communication:** WebSockets for real-time updates and feedback (Connected to Above)
- **Big Data Processing:** Apache Spark for scalable data operations on large datasets.
- **Machine Learning Framework:** PyTorch for flexible model development.
- **VM:** AWS + Docker + Kubernetes.

## How to Run

When first cloning the repo, run the following commands to install the dependencies:

```
pip install -r requirements.txt
npm install
```

to run mongoDB locally, remember to create a .env file with the MONGODB_URI variable.
also go into atlas and add your ip address to the whitelist


to run the server:

```
cd backend
python manage.py runserver
```


to run the frontend:

```
cd frontend
npm run dev
``` 

//currently, all the api are in localhost