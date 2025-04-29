import time
import logging
from fastapi_keycloak import FastAPIKeycloak
from app.config import (
    KEYCLOAK_SERVER_URL, KEYCLOAK_CLIENT_ID, KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ADMIN_CLIENT_ID, KEYCLOAK_ADMIN_CLIENT_SECRET,
    KEYCLOAK_REALM, KEYCLOAK_CALLBACK_URI
)

logger = logging.getLogger(__name__)

class RetryableKeycloak(FastAPIKeycloak):
    _retry_delays = [2, 5, 10, 30, 30, 60, 60]  # Retry delays in seconds
    _max_retries = len(_retry_delays)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def _get_admin_token(self):
        for retry_count, delay in enumerate(self._retry_delays):
            try:
                return super()._get_admin_token()
            except Exception as e:
                if retry_count < self._max_retries - 1:
                    logger.warning(f"Failed to connect to Keycloak (attempt {retry_count + 1}/{self._max_retries}). "
                                 f"Retrying in {delay} seconds... Error: {str(e)}")
                    time.sleep(delay)
                else:
                    logger.error(f"Failed to connect to Keycloak after {self._max_retries} attempts. "
                               f"Last error: {str(e)}")
                    raise

    @property
    def open_id_configuration(self):
        for retry_count, delay in enumerate(self._retry_delays):
            try:
                return super().open_id_configuration
            except Exception as e:
                if retry_count < self._max_retries - 1:
                    logger.warning(f"Failed to get OpenID configuration (attempt {retry_count + 1}/{self._max_retries}). "
                                 f"Retrying in {delay} seconds... Error: {str(e)}")
                    time.sleep(delay)
                else:
                    logger.error(f"Failed to get OpenID configuration after {self._max_retries} attempts. "
                               f"Last error: {str(e)}")
                    raise

idp = RetryableKeycloak(
    server_url=KEYCLOAK_SERVER_URL,
    client_id=KEYCLOAK_CLIENT_ID,
    client_secret=KEYCLOAK_CLIENT_SECRET,
    admin_client_id=KEYCLOAK_ADMIN_CLIENT_ID,
    admin_client_secret=KEYCLOAK_ADMIN_CLIENT_SECRET,
    realm=KEYCLOAK_REALM,
    callback_uri=KEYCLOAK_CALLBACK_URI
) 