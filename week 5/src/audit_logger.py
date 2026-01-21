import logging
import os
from logging.handlers import RotatingFileHandler
from datetime import datetime
import json


class AuditLogger:
    """
    Audit logging module for RBAC system.
    Logs user actions with timestamps, user_id, role, action, endpoint, and status.
    Supports file rotation and console logging.
    """

    def __init__(self, log_dir="../logs", log_file="audit.log", max_bytes=10485760, backup_count=7):
        """
        Initialize the audit logger.
        
        Args:
            log_dir: Directory for log files
            log_file: Name of the log file
            max_bytes: Max size of log file before rotation (default: 10MB)
            backup_count: Number of backup files to keep for daily rotation
        """
        # Create logs directory if it doesn't exist
        self.log_dir = log_dir
        if not os.path.exists(self.log_dir):
            os.makedirs(self.log_dir)
        
        self.log_path = os.path.join(self.log_dir, log_file)
        self.logger = logging.getLogger("AuditLogger")
        self.logger.setLevel(logging.INFO)
        
        # Clear any existing handlers
        self.logger.handlers = []
        
        # Define log format
        formatter = logging.Formatter(
            '[%(asctime)s] [%(levelname)s] user=%(user_id)s role=%(role)s action=%(action)s endpoint=%(endpoint)s status=%(status)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )
        
        # File handler with rotation
        file_handler = RotatingFileHandler(
            self.log_path,
            maxBytes=max_bytes,
            backupCount=backup_count
        )
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(formatter)
        self.logger.addHandler(file_handler)
        
        # Console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.INFO)
        console_handler.setFormatter(formatter)
        self.logger.addHandler(console_handler)
        
        # Track audit events for summary report
        self.audit_events = []

    def _log_event(self, user_id, role, action, endpoint, status):
        """
        Internal method to log an event with context.
        
        Args:
            user_id: ID of the user performing the action
            role: Role of the user
            action: Action being performed
            endpoint: API endpoint or resource accessed
            status: Status of the action (allowed/denied)
        """
        extra = {
            'user_id': user_id,
            'role': role,
            'action': action,
            'endpoint': endpoint,
            'status': status
        }
        
        # Log to file and console
        self.logger.info(
            f"Audit event logged",
            extra=extra
        )
        
        # Store event for summary report
        event = {
            'timestamp': datetime.now().isoformat(),
            'user_id': user_id,
            'role': role,
            'action': action,
            'endpoint': endpoint,
            'status': status
        }
        self.audit_events.append(event)

    def log_login(self, user_id, role, endpoint="/auth/login", status="allowed"):
        """
        Log a user login event.
        
        Args:
            user_id: ID of the user logging in
            role: Role of the user
            endpoint: Login endpoint
            status: Status of login attempt
        """
        self._log_event(user_id, role, "login", endpoint, status)

    def log_access(self, user_id, role, action, endpoint, status="allowed"):
        """
        Log a user access/query event.
        
        Args:
            user_id: ID of the user
            role: Role of the user
            action: Specific action (e.g., query, read, write)
            endpoint: API endpoint accessed
            status: Status of the access
        """
        self._log_event(user_id, role, f"{action}", endpoint, status)

    def log_denial(self, user_id, role, action, endpoint, reason="Unauthorized"):
        """
        Log a denied access attempt.
        
        Args:
            user_id: ID of the user
            role: Role of the user
            action: Action that was denied
            endpoint: Endpoint that was denied
            reason: Reason for denial
        """
        self._log_event(user_id, role, f"{action} (denied: {reason})", endpoint, "denied")

    def get_summary_report(self):
        """
        Generate a summary report of all logged events.
        
        Returns:
            Dictionary containing summary statistics
        """
        if not self.audit_events:
            return {"message": "No audit events logged yet"}
        
        total_events = len(self.audit_events)
        allowed_count = sum(1 for e in self.audit_events if e['status'] == 'allowed')
        denied_count = sum(1 for e in self.audit_events if e['status'] == 'denied')
        
        # Count by role
        role_counts = {}
        for event in self.audit_events:
            role = event['role']
            role_counts[role] = role_counts.get(role, 0) + 1
        
        # Count by action
        action_counts = {}
        for event in self.audit_events:
            action = event['action']
            action_counts[action] = action_counts.get(action, 0) + 1
        
        # Count by endpoint
        endpoint_counts = {}
        for event in self.audit_events:
            endpoint = event['endpoint']
            endpoint_counts[endpoint] = endpoint_counts.get(endpoint, 0) + 1
        
        summary = {
            "total_events": total_events,
            "allowed_events": allowed_count,
            "denied_events": denied_count,
            "denial_rate": f"{(denied_count / total_events * 100):.2f}%" if total_events > 0 else "0%",
            "by_role": role_counts,
            "by_action": action_counts,
            "by_endpoint": endpoint_counts,
            "timestamp_generated": datetime.now().isoformat()
        }
        
        return summary

    def export_summary_to_file(self, filename="summary_report.json"):
        """
        Export the summary report to a JSON file.
        
        Args:
            filename: Name of the output file
        """
        summary = self.get_summary_report()
        report_path = os.path.join(self.log_dir, filename)
        
        with open(report_path, 'w') as f:
            json.dump(summary, f, indent=4)
        
        return report_path

    def clear_events(self):
        """Clear the in-memory audit events list."""
        self.audit_events = []


# Create a global audit logger instance
audit_logger = AuditLogger()
