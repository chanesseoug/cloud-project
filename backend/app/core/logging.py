
import json
import logging
from datetime import UTC, datetime

security_logger = logging.getLogger(
    "roombooking.security"
)

security_logger.setLevel(logging.INFO)

if not security_logger.handlers:
    handler = logging.StreamHandler()

    handler.setFormatter(
        logging.Formatter("%(message)s")
    )

    security_logger.addHandler(handler)

security_logger.propagate = False


def log_security_event(
    event: str,
    outcome: str,
    user_id: int | None = None,
    client_ip: str | None = None,
) -> None:

    record = {
        "timestamp": datetime.now(
            UTC
        ).isoformat(),
        "service": "roombooking-api",
        "category": "security",
        "event": event,
        "outcome": outcome,
        "user_id": user_id,
        "client_ip": client_ip,
    }

    message = json.dumps(
        record,
        ensure_ascii=False,
    )

    if outcome == "failure":
        security_logger.warning(message)
    else:
        security_logger.info(message)
