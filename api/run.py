import os
import sys

# Add src to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from src import create_app

# Get environment from environment variable
env = os.getenv('FLASK_ENV', 'development')

# Create Flask application
app = create_app(env)

if __name__ == '__main__':
    # Get port from environment variable or default to 5000
    port = int(os.getenv('PORT', 5000))
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=port,
        debug=(env == 'development')
    )