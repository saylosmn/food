import logging
import os
import random
import uuid
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Serverless-д (Vercel) модуль cold start бүрт дахин ачаалагддаг тул
# клиентийг эхний хэрэглээ дээр залхуу байдлаар үүсгэнэ.
_client: AsyncIOMotorClient | None = None
_seeded = False


def get_db():
    global _client
    if _client is None:
        mongo_url = os.environ.get('MONGO_URL')
        if not mongo_url:
            raise HTTPException(status_code=500, detail="MONGO_URL тохируулаагүй байна")
        _client = AsyncIOMotorClient(mongo_url)
    return _client[os.environ.get('DB_NAME', 'food_delivery')]


async def ensure_seeded(db):
    global _seeded
    if _seeded:
        return
    if await db.menu.count_documents({}) == 0:
        await db.menu.insert_many([dict(item) for item in MENU_ITEMS])
    _seeded = True

PAYMENT_BANK = "М банк"
PAYMENT_ACCOUNT = "8000499100"
PAYMENT_HOLDER = "Санжид Цэрэнбат"

app = FastAPI()
api_router = APIRouter(prefix="/api")

IMG = "?crop=entropy&cs=srgb&fm=jpg&q=85&w=800&auto=format&fit=crop"

MENU_ITEMS = [
    {"id": "1", "name": "Pizza chicken", "category": "pizza", "price": 74000,
     "portions": ["2-3 хүний 74k", "3-4 хүний 104k", "5-6 хүний 135k"],
     "img": "https://images.unsplash.com/photo-1594007654729-407eedc4be65" + IMG},
    {"id": "2", "name": "Махан цугуулга", "category": "meat", "price": 89000,
     "portions": ["2-3 хүний 89k", "3-4 хүний 109k", "5-6 хүний 135k"],
     "img": "https://images.unsplash.com/photo-1633309343061-29cdc618d5e9" + IMG},
    {"id": "3", "name": "Chicken set", "category": "chicken", "price": 69000,
     "portions": ["2-3 хүний 69k", "3-4 хүний 89k", "5-6 хүний 109k"],
     "img": "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec" + IMG},
    {"id": "4", "name": "Калбимжим", "category": "meat", "price": 105000,
     "portions": ["3-4 хүний 105k", "5-6 хүний 135k"],
     "img": "https://images.unsplash.com/photo-1527324688151-0e627063f2b1" + IMG},
    {"id": "5", "name": "Чанасан мах", "category": "meat", "price": 109000,
     "portions": ["2-3 хүний 109k", "3-4 хүний 129k", "5-6 хүний 135k"],
     "img": "https://images.unsplash.com/photo-1750461325551-02b7ea57625a" + IMG},
    {"id": "6", "name": "Хуйтай хорхог", "category": "meat", "price": 135000,
     "portions": ["3-4 хүний 135k", "5-6 хүний 155k"],
     "img": "https://images.unsplash.com/photo-1775493495785-d8e6748769cd" + IMG},
    {"id": "7", "name": "Буузь сэт", "category": "set", "price": 74000,
     "portions": ["2-3 хүний 74k", "3-4 хүний 94k", "5-6 хүний 115k"],
     "img": "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb" + IMG},
    {"id": "8", "name": "Цуцван", "category": "noodle", "price": 59000,
     "portions": ["2-3 хүний 59k", "3-4 хүний 79k", "5-6 хүний 99k"],
     "img": "https://images.unsplash.com/photo-1555126634-323283e090fa" + IMG},
    {"id": "9", "name": "Хүхшүүр сэт", "category": "set", "price": 89000,
     "portions": ["3-4 хүний 89k", "5-6 хүний 129k"],
     "img": "https://images.unsplash.com/photo-1496116218417-1a781b1c416c" + IMG},
    {"id": "10", "name": "Хүхшүүр буузь сэт", "category": "set", "price": 129000,
     "portions": ["3-4 хүний 129k", "5-6 хүний 149k"],
     "img": "https://images.unsplash.com/photo-1589047133481-02b4a5327d89" + IMG},
    {"id": "11", "name": "Coca Cola", "category": "drink", "price": 3000,
     "portions": ["500ml"],
     "img": "https://images.unsplash.com/photo-1624552184280-9e9631bbeee9" + IMG},
    {"id": "12", "name": "Sprite", "category": "drink", "price": 3000,
     "portions": ["500ml"],
     "img": "https://images.unsplash.com/photo-1544241907-f3f1f5ded15a" + IMG},
]


class OrderItem(BaseModel):
    id: str
    name: str
    price: int
    quantity: int


class OrderCreate(BaseModel):
    items: list[OrderItem]
    phone: str = Field(min_length=6)
    address: str = Field(min_length=3)
    bank_name: str = Field(min_length=2)
    account_name: str = Field(min_length=2)
    notes: str | None = ""


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order_number: str
    items: list[OrderItem]
    total: int
    phone: str
    address: str
    bank_name: str
    account_name: str
    notes: str = ""
    payment_bank: str = PAYMENT_BANK
    payment_account: str = PAYMENT_ACCOUNT
    payment_holder: str = PAYMENT_HOLDER
    payment_code: str = Field(default_factory=lambda: f"{random.randint(1000, 9999)}")
    status: str = "Баталгаажсан"
    delivery_time: str = "20-60 минут"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@api_router.get("/")
async def root():
    return {"message": "Mongolian Food Delivery API"}


@api_router.get("/menu")
async def get_menu():
    db = get_db()
    await ensure_seeded(db)
    items = await db.menu.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/orders", response_model=Order)
async def create_order(input: OrderCreate):
    db = get_db()
    await ensure_seeded(db)
    if not input.items:
        raise HTTPException(status_code=400, detail="Сагс хоосон байна")
    menu_docs = await db.menu.find({}, {"_id": 0}).to_list(1000)
    price_map = {m["id"]: m["price"] for m in menu_docs}
    name_map = {m["id"]: m["name"] for m in menu_docs}
    total = 0
    items = []
    for item in input.items:
        if item.id not in price_map or item.quantity < 1:
            raise HTTPException(status_code=400, detail="Буруу бүтээгдэхүүн")
        total += price_map[item.id] * item.quantity
        items.append(OrderItem(id=item.id, name=name_map[item.id], price=price_map[item.id], quantity=item.quantity))
    order = Order(
        order_number=f"MH-{uuid.uuid4().hex[:6].upper()}",
        items=items,
        total=total,
        phone=input.phone,
        address=input.address,
        bank_name=input.bank_name,
        account_name=input.account_name,
        notes=input.notes or "",
    )
    await db.orders.insert_one(order.model_dump())
    return order


@api_router.get("/orders/{order_id}", response_model=Order)
async def get_order(order_id: str):
    db = get_db()
    doc = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Захиалга олдсонгүй")
    return doc


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


