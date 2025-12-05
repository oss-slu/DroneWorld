import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from flask import Response, g, jsonify, request
from werkzeug.exceptions import HTTPException

LOG = logging.getLogger(__name__)


class DroneWorldError(Exception):
    """Base class for DroneWorld errors with a standardized payload."""

    def __init__(self, code: str, message: str, status_code: int, details: Optional[Dict[str, Any]] = None):
        super().__init__(message)
        self.code = code
        self.message = message
        self.status_code = status_code
        self.details = details or {}


class ValidationError(DroneWorldError):
    def __init__(self, message: str = "Invalid input data", details: Optional[Dict[str, Any]] = None):
        super().__init__("VALIDATION_ERROR", message, 422, details)


class AuthenticationRequiredError(DroneWorldError):
    def __init__(self, message: str = "Authentication required", details: Optional[Dict[str, Any]] = None):
        super().__init__("AUTHENTICATION_REQUIRED", message, 401, details)


class AuthorizationDeniedError(DroneWorldError):
    def __init__(self, message: str = "You do not have permission to perform this action", details: Optional[Dict[str, Any]] = None):
        super().__init__("AUTHORIZATION_DENIED", message, 403, details)


class ResourceNotFoundError(DroneWorldError):
    def __init__(self, message: str = "Requested resource doesn't exist", details: Optional[Dict[str, Any]] = None):
        super().__init__("RESOURCE_NOT_FOUND", message, 404, details)


class RateLimitExceededError(DroneWorldError):
    def __init__(self, message: str = "Too many requests", details: Optional[Dict[str, Any]] = None):
        super().__init__("RATE_LIMIT_EXCEEDED", message, 429, details)


class SimulationFailedError(DroneWorldError):
    def __init__(self, message: str = "Simulation execution error", details: Optional[Dict[str, Any]] = None):
        super().__init__("SIMULATION_FAILED", message, 500, details)


class StorageError(DroneWorldError):
    def __init__(self, message: str = "File storage operation failed", details: Optional[Dict[str, Any]] = None, status_code: int = 500):
        super().__init__("STORAGE_ERROR", message, status_code, details)


class InternalServerError(DroneWorldError):
    def __init__(self, message: str = "An unexpected server error occurred", details: Optional[Dict[str, Any]] = None):
        super().__init__("INTERNAL_SERVER_ERROR", message, 500, details)


def _iso_timestamp() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def build_error_response(code: str, message: str, status_code: int, details: Optional[Dict[str, Any]] = None) -> Response:
    """Create the standardized error response envelope."""
    request_id = getattr(g, "request_id", None) or str(uuid.uuid4())
    payload = {
        "error": {
            "code": code,
            "message": message,
            "details": details or {},
            "timestamp": _iso_timestamp(),
            "request_id": request_id,
        }
    }
    response = jsonify(payload)
    response.status_code = status_code
    response.headers["X-Request-ID"] = request_id
    return response


def register_error_handlers(app):
    """Attach uniform error handling to a Flask app instance."""

    @app.before_request
    def _assign_request_id():
        g.request_id = str(uuid.uuid4())

    @app.after_request
    def _append_request_id_header(response):
        if getattr(g, "request_id", None):
            response.headers["X-Request-ID"] = g.request_id
        return response

    @app.errorhandler(DroneWorldError)
    def _handle_droneworld_error(err: DroneWorldError):
        LOG.warning("Handled DroneWorldError (%s): %s", err.code, err.details or err.message)
        return build_error_response(err.code, err.message, err.status_code, err.details)

    @app.errorhandler(HTTPException)
    def _handle_http_exception(err: HTTPException):
        LOG.error("HTTPException: %s", err, exc_info=True)
        status_code = err.code or 500
        mapped_codes = {
            400: "VALIDATION_ERROR",
            401: "AUTHENTICATION_REQUIRED",
            403: "AUTHORIZATION_DENIED",
            404: "RESOURCE_NOT_FOUND",
            429: "RATE_LIMIT_EXCEEDED",
            500: "INTERNAL_SERVER_ERROR",
        }
        code = mapped_codes.get(status_code, "INTERNAL_SERVER_ERROR")
        return build_error_response(code, err.description or "Request failed", status_code, {"path": request.path})

    @app.errorhandler(Exception)
    def _handle_unexpected_error(err: Exception):
        LOG.exception("Unhandled exception during request")
        return build_error_response("INTERNAL_SERVER_ERROR", "An unexpected server error occurred", 500, {"error_type": err.__class__.__name__})
