# references for help
# -------------------------
# - testdriven.io dockerizing Fask with Postgres ()
# - https://www.vantage-ai.com/blog/deploy-a-flask-api-in-kubernetes
# pull base image
FROM python:3.8-slim-buster

# set work directory
WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# copy project
COPY . /app

EXPOSE 5000
CMD [ "flask", "run" ]
