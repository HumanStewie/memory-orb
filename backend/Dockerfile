FROM python:3.14-slim AS build

# Set environment variables to prevent Python from writing .pyc files and to run in unbuffered mode
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install core dependencies.
RUN apt-get update && apt-get install -y libpq-dev build-essential

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD [ "fastapi", "dev", "main.py", "--host", "0.0.0.0", "--port", "8000" ]