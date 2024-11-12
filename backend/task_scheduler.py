from datetime import datetime, timedelta

def greedy_task_scheduler(tasks):
    sorted_tasks = sorted(tasks, key=lambda x: x['profit'], reverse=True)
    max_deadline = max(task['deadline'] for task in sorted_tasks)
    schedule = [None] * (max_deadline + 1)
    total_profit = 0
    scheduled_tasks = []

    for task in sorted_tasks:
        for day in range(task['deadline'], 0, -1):
            if schedule[day] is None:
                schedule[day] = task
                total_profit += task['profit']
                scheduled_tasks.append(task)
                break

    return scheduled_tasks, total_profit

def schedule_tasks(tasks):
    today = datetime.now().date()
    for task in tasks:
        task['deadline'] = (datetime.strptime(task['deadline'], '%Y-%m-%d').date() - today).days + 1

    scheduled_tasks, total_profit = greedy_task_scheduler(tasks)

    for task in scheduled_tasks:
        task['deadline'] = (today + timedelta(days=task['deadline'])).strftime('%Y-%m-%d')

    return {
        'scheduled_tasks': scheduled_tasks,
        'total_profit': total_profit
    }