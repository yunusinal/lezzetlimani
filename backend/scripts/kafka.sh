#!/bin/bash

# Kafka Config
CONTAINER_NAME="kafka"
BROKERS="kafka:9092"
TOPICS=("user_created" "email_event")

# Create Topic
for topic in "${TOPICS[@]}"; do
    kafka-topics.sh \
        --create \
        --if-not-exists \
        --topic $topic \
        --bootstrap-server $BROKERS \
        --partitions 1 \
        --replication-factor 1
done

# List Topics
kafka-topics.sh --list --bootstrap-server $BROKERS

