FROM python:3.9

WORKDIR /app

RUN apt-get update && \
    apt-get install -y netcat-traditional && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY . /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
