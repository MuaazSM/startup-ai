# Use official Python image
FROM python:3.11-slim

WORKDIR /app

# Copy dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Run Flask API
CMD ["python", "app.py"]
