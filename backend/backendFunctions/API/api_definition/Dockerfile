FROM python:3.13-slim

WORKDIR /edukit-tp-API

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:api", "--host", "0.0.0.0", "--port", "8080"]