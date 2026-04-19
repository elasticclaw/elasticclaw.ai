#!/bin/bash
# ElasticClaw CLI Install Script
# Usage: curl -fsSL https://elasticclaw.ai/install | bash
#
# Installs the elasticclaw CLI binary on macOS or Linux.
# To install and configure a hub server, use:
#   elasticclaw install --server ssh://root@your-server --domain hub.example.com

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

# Get latest version
VERSION="${ELASTICCLAW_VERSION:-}"
if [[ -z "$VERSION" ]]; then
  VERSION=$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" | grep '"tag_name"' | sed 's/.*"tag_name": *"\([^"]*\)".*/\1/')
fi

if [[ -z "$VERSION" ]]; then
  echo "Failed to determine latest version. Set ELASTICCLAW_VERSION to override."
  exit 1
fi

echo "Installing elasticclaw ${VERSION} (${OS}/${ARCH})..."

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/elasticclaw-${OS}-${ARCH}"
TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

curl -fsSL "$DOWNLOAD_URL" -o "$TMP_FILE"
chmod 755 "$TMP_FILE"

if [[ -w "$INSTALL_DIR" ]]; then
  mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
else
  sudo mv "$TMP_FILE" "${INSTALL_DIR}/${BINARY_NAME}"
fi

echo ""
echo "✓ elasticclaw ${VERSION} installed to ${INSTALL_DIR}/${BINARY_NAME}"
echo ""
echo "Get started:"
echo "  elasticclaw install --server ssh://root@your-server --domain hub.example.com"
echo ""
if [[ "$OS" == "darwin" ]]; then
  echo "Or on macOS, use Homebrew:"
  echo "  brew install elasticclaw/elasticclaw/elasticclaw"
fi
