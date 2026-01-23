"""
Middleware components for the RBAC Chatbot API.
"""

import time
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        logger.info(f"Incoming: {request.method} {request.url.path}")
        response = await call_next(request)
        process_time = time.time() - start_time
        logger.info(f"Completed: {request.method} {request.url.path} - {response.status_code} - {process_time:.3f}s")
        response.headers["X-Process-Time"] = str(process_time)
        return response
