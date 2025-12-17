from typing import Union

from fastapi import FastAPI

import asyncio
import asyncpg

async def run():
    conn = await asyncpg.connect(user='memorycube', database='mcDB')
    values = await conn.fetch(
        'SELECT * FROM users'
    )
    print(values)
    await conn.close()

asyncio.run(run())
