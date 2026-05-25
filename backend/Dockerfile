# ==========================================
# Use official Python 3.11-slim base image
# ==========================================
FROM python:3.11-slim

# Prevent Python from writing .pyc files to disk
ENV PYTHONDONTWRITEBYTECODE=1
# Force stdout/stderr streams to be unbuffered (immediate logging output)
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install critical system tools (e.g. SQLite database and build essentials if compiling)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first to take advantage of Docker layer caching
COPY requirements.txt .

# Install dependencies efficiently without caching local installation indexes
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create a folder designated for the SQLite database persistent volume and grant permissions
RUN mkdir -p /app/data && chmod 777 /app/data

# Create a non-privileged user for security compliance and change owner permissions
RUN useradd -u 1000 -m appuser && chown -R appuser:appuser /app
USER appuser

# Expose FastAPI's standard server port
EXPOSE 8000

# Run Uvicorn ASGI server in production mode
# --host 0.0.0.0 is necessary to expose connection interfaces outside the container
# --workers 4 scales dynamic network connections for production environments
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
