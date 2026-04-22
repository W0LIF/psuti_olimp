from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models import Transaction, Category
from datetime import date, timedelta
from collections import defaultdict

async def generate_insights(db: AsyncSession, user_id: int):
    insights = []
    today = date.today()
    first_day_month = date(today.year, today.month, 1)
    last_month_start = date(today.year, today.month-1, 1) if today.month > 1 else date(today.year-1, 12, 1)
    
    # 1. Самая большая категория расходов в этом месяце
    result = await db.execute(
        select(Category.name, func.sum(Transaction.amount))
        .join(Transaction, Transaction.category_id == Category.id)
        .where(Transaction.user_id == user_id, Transaction.type == "expense", Transaction.date >= first_day_month)
        .group_by(Category.id)
        .order_by(func.sum(Transaction.amount).desc())
        .limit(1)
    )
    top_cat = result.first()
    if top_cat:
        cat_name, amount = top_cat
        insights.append(f"💰 Твоя самая большая трата в этом месяце — {cat_name}: {amount:.2f} ₽.")
    
    # 2. Сравнение расходов с прошлым месяцем
    current_exp = await db.execute(
        select(func.sum(Transaction.amount)).where(
            Transaction.user_id == user_id, Transaction.type == "expense", Transaction.date >= first_day_month
        )
    )
    current_total = current_exp.scalar() or 0.0
    last_exp = await db.execute(
        select(func.sum(Transaction.amount)).where(
            Transaction.user_id == user_id, Transaction.type == "expense",
            Transaction.date >= last_month_start, Transaction.date < first_day_month
        )
    )
    last_total = last_exp.scalar() or 0.0
    if last_total > 0:
        diff = current_total - last_total
        if diff > 0:
            insights.append(f"📈 Расходы выросли на {diff:.2f} ₽ по сравнению с прошлым месяцем.")
        elif diff < 0:
            insights.append(f"📉 Отлично! Ты тратишь на {abs(diff):.2f} ₽ меньше, чем в прошлом месяце.")
    
    # 3. Мелкие ежедневные траты (например, кофе)
    small_expenses = await db.execute(
        select(Transaction.amount, Transaction.date)
        .where(Transaction.user_id == user_id, Transaction.type == "expense", Transaction.amount <= 300,
               Transaction.date >= date(today.year, today.month, 1))
    )
    small_list = small_expenses.all()
    if len(small_list) > 5:
        total_small = sum(a for a, _ in small_list)
        yearly_projection = total_small * 12
        insights.append(f"☕ Ты сделал {len(small_list)} мелких покупок (до 300 ₽) в этом месяце на сумму {total_small:.2f} ₽. За год это может быть {yearly_projection:.2f} ₽ — почти новый телефон!")
    
    # 4. Предупреждение если остаток до конца месяца низкий (можно добавить логику)
    # 5. Совет по категории с высокими тратами
    if top_cat and amount > 5000:
        insights.append(f"💡 Совет: попробуй сократить расходы на {cat_name} на 20% — это сэкономит {amount*0.2:.2f} ₽ в месяц.")
    
    return insights[:5]  # не больше 5 подсказок