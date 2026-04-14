#!/bin/bash
# ElasticClaw Hub Install Script
# Usage: curl -fsSL https://elasticclaw.ai/install | bash
# Agent-friendly: set env vars before running
#
# Environment variables:
#   ELASTICCLAW_PUBLIC_URL   Public URL of this hub (e.g. https://my-server.example.com:8080)
#   ELASTICCLAW_TOKEN        User API token (auto-generated if not set)
#   ELASTICCLAW_CLAW_TOKEN   Claw auth token (auto-generated if not set)
#   ELASTICCLAW_VERSION      Version to install (default: latest)

set -euo pipefail

REPO="elasticclaw/elasticclaw"
INSTALL_DIR="/usr/local/bin"
BINARY_NAME="elasticclaw"

# Detect OS and arch
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64)  ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *)
    echo "Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

if [[ "$OS" != "linux" && "$OS" != "darwin" ]]; then
  echo "Unsupported OS: $OS. Only linux and darwin are supported."
  exit 1
fi

# Resolve version
VERSION="${ELASTICCLAW_VERSION:-}"
if [[ -z "$VERSION" ]]; then
  echo "Fetching latest release..."
  VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name"' | sed 's/.*"tag_name": "\(.*\)".*/\1/')
  if [[ -z "$VERSION" ]]; then
    echo "Failed to fetch latest version. Set ELASTICCLAW_VERSION to install a specific version."
    exit 1
  fi
fi

BINARY_FILE="${BINARY_NAME}-${OS}-${ARCH}"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_FILE}"

echo "Installing ElasticClaw ${VERSION} (${OS}/${ARCH})..."

# Download binary
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

curl -fsSL "$DOWNLOAD_URL" -o "$TMP_DIR/$BINARY_NAME"
chmod +x "$TMP_DIR/$BINARY_NAME"

# Install
if [[ -w "$INSTALL_DIR" ]]; then
  mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
else
  sudo mv "$TMP_DIR/$BINARY_NAME" "$INSTALL_DIR/$BINARY_NAME"
fi

echo "✓ elasticclaw installed to $INSTALL_DIR/$BINARY_NAME"

# Initialize hub config if not already present
if [[ ! -f "$HOME/.elasticclaw/hub.yaml" ]]; then
  echo ""
  echo "Initializing hub configuration..."
  elasticclaw hub init \
    ${ELASTICCLAW_PUBLIC_URL:+--public-url "$ELASTICCLAW_PUBLIC_URL"} \
    ${ELASTICCLAW_TOKEN:+--token "$ELASTICCLAW_TOKEN"} \
    ${ELASTICCLAW_CLAW_TOKEN:+--claw-token "$ELASTICCLAW_CLAW_TOKEN"}
else
  echo "✓ Hub config already exists at ~/.elasticclaw/hub.yaml"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " ElasticClaw is ready."
echo ""
echo " Start the hub:"
echo "   elasticclaw hub"
echo ""
echo " Docs: https://elasticclaw.ai/docs"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
