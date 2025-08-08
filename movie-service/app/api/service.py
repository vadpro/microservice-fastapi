import httpx
import json
import asyncio
import websockets

from app.config import CAST_SERVICE_HOST_URL, CAST_SERVICE_WS_URL


async def is_cast_present(cast_id: int, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f'{CAST_SERVICE_HOST_URL}{cast_id}/')
                return response.status_code == 200
        except httpx.TimeoutException:
            print(f"Timeout when checking cast {cast_id} (attempt {attempt + 1}/{max_retries})")
            if attempt == max_retries - 1:
                return False
            await asyncio.sleep(1)  # Wait before retry
        except httpx.RequestError as e:
            print(f"Request error when checking cast {cast_id} (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                return False
            await asyncio.sleep(1)  # Wait before retry
        except Exception as e:
            print(f"Unexpected error when checking cast {cast_id} (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                return False
            await asyncio.sleep(1)  # Wait before retry
    return False


async def get_casts_info(cast_ids: list):
    try:
        async with websockets.connect(CAST_SERVICE_WS_URL) as websocket:
            await websocket.send(json.dumps(cast_ids))
            response = await websocket.recv()
            return json.loads(response)
    except Exception as e:
        print(f"Error getting cast info: {e}")
        return []
