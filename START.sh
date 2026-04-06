#!/bin/bash

# 🚀 SmartLandLedger - QUICK REFERENCE
# =====================================

echo "🎉 SmartLandLedger - Blockchain Land Registration"
echo "=================================================="
echo ""
echo "📚 DOCUMENTATION:"
echo "  1. README.md                → Project overview"
echo "  2. QUICKSTART.md            → How to run (5 min setup)"
echo "  3. DEMONSTRATION_GUIDE.md   → How to demonstrate the system"
echo "  4. DASHBOARD_GUIDE.md       → Dashboard user guide"
echo ""
echo "🚀 AUTO STARTING SYSTEM..."
echo ""

# Function to check if port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Function to kill processes on port
kill_port() {
    local port=$1
    local name=$2
    echo "🔪 Killing existing $name processes on port $port..."
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Check and clean up ports
echo "🔍 Checking port availability..."

# Check Hardhat port (8545)
if check_port 8545; then
    echo "⚠️  Port 8545 (Hardhat) is in use"
    kill_port 8545 "Hardhat"
else
    echo "✅ Port 8545 (Hardhat) is available"
fi

# Check Next.js ports (3000-3003)
NEXTJS_PORT=""
for port in 3000 3001 3002 3003; do
    if ! check_port $port; then
        NEXTJS_PORT=$port
        echo "✅ Port $port (Next.js) is available"
        break
    fi
done

if [ -z "$NEXTJS_PORT" ]; then
    echo "⚠️  All Next.js ports (3000-3003) are in use, cleaning up..."
    for port in 3000 3001 3002 3003; do
        kill_port $port "Next.js"
    done
    NEXTJS_PORT=3000
fi

echo ""

# Check if dependencies are installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first."
    exit 1
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install app dependencies
echo "📦 Installing app dependencies..."
cd app && npm install && cd ..

# Start Hardhat node in background
echo "⛓️  Starting Hardhat blockchain node..."
npm run hardhat:node &
HARDHAT_PID=$!

# Wait a moment for node to start
sleep 3

# Deploy contracts
echo "📄 Deploying smart contracts..."
npm run hardhat:deploy

# Start frontend
echo "🌐 Starting Next.js frontend..."
cd app && npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "✅ SYSTEM STARTED SUCCESSFULLY!"
echo "========================================"
echo ""
echo "🔗 Frontend: http://localhost:$NEXTJS_PORT"
echo "⛓️  Blockchain: http://localhost:8545"
echo ""
echo "📋 DASHBOARDS:"
echo "  • Home: http://localhost:$NEXTJS_PORT"
echo "  • Seller: http://localhost:$NEXTJS_PORT/seller"
echo "  • Buyer: http://localhost:$NEXTJS_PORT/buyer"
echo "  • Inspector: http://localhost:$NEXTJS_PORT/inspector"
echo "  • All Lands: http://localhost:$NEXTJS_PORT/lands"
echo ""
echo "🛑 To stop: Press Ctrl+C or kill processes"
echo "========================================"

# Wait for user interrupt
trap "echo ''; echo '🛑 Stopping services...'; kill $HARDHAT_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
