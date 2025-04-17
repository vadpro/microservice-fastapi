import httpx
import json
import asyncio
import websockets

from app.config import CAST_SERVICE_HOST_URL, CAST_SERVICE_WS_URL


def is_cast_present(cast_id: int):
    r = httpx.get(f'{CAST_SERVICE_HOST_URL}{cast_id}/')
    return True if r.status_code == 200 else False


async def get_casts_info(cast_ids: list):
    try:
        async with websockets.connect(CAST_SERVICE_WS_URL) as websocket:
            await websocket.send(json.dumps(cast_ids))
            response = await websocket.recv()
            return json.loads(response)
    except Exception as e:
        print(f"Error getting cast info: {e}")
        return []
