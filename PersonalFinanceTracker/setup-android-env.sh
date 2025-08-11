#!/bin/bash

# Android SDK Environment Setup
# Add these to your ~/.zshrc or ~/.bash_profile

export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

echo "Android environment variables set:"
echo "ANDROID_HOME: $ANDROID_HOME"
echo ""
echo "To make these permanent, add the following to your ~/.zshrc file:"
echo ""
echo "# Android SDK"
echo "export ANDROID_HOME=\$HOME/Library/Android/sdk"
echo "export PATH=\$PATH:\$ANDROID_HOME/emulator"
echo "export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
echo "export PATH=\$PATH:\$ANDROID_HOME/tools"
echo "export PATH=\$PATH:\$ANDROID_HOME/tools/bin"