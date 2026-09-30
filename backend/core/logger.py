from loguru import logger
import sys

# Remove default logger
logger.remove()

# Add formatted console logger
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
           "<level>{level}</level> | "
           "<cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - "
           "<level>{message}</level>",
    level="INFO",
    # A database URI can contain credentials.  Never include local variables
    # from an exception traceback in production logs.
    backtrace=False,
    diagnose=False,
)

# Optional: file logging
logger.add(
    "logs/app.log",
    rotation="10 MB",
    retention="7 days",
    compression="zip",
    level="INFO",
    backtrace=False,
    diagnose=False,
)

def get_logger():
    return logger
