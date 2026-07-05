#!/bin/bash
# wsl_setup.sh
# Automates the setup of Python, pip, uv, and CUDA integration inside WSL 2 Ubuntu.

echo "=== 1. Updating package lists ==="
apt-get update

echo "=== 2. Installing Python pip and venv ==="
apt-get install -y python3-pip python3-venv

echo "=== 3. Installing nvidia-cuda-toolkit ==="
apt-get install -y nvidia-cuda-toolkit

echo "=== Setup complete ==="
