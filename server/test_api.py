import urllib.request, json

def get_token():
    from src.database import SessionLocal
    from src import models
    from src.auth import create_access_token
    db = SessionLocal()
    admin = db.query(models.User).filter(models.User.email == 'admin@stocksight.ai').first()
    t = create_access_token({'sub': str(admin.id), 'role': 'admin'})
    db.close()
    return t

token = get_token()
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}

# Test stats
req = urllib.request.Request('http://localhost:8000/admin/stats', headers=headers)
with urllib.request.urlopen(req) as r:
    data = json.loads(r.read())
    print('STATS:', data)

# Test admin orders
req2 = urllib.request.Request('http://localhost:8000/admin/orders', headers=headers)
with urllib.request.urlopen(req2) as r:
    data2 = json.loads(r.read())
    print('ADMIN ORDERS count:', len(data2))
    if data2:
        print('First order:', data2[0].get('symbol'), 'user.name:', data2[0].get('user', {}).get('name'))

# Test admin users
req3 = urllib.request.Request('http://localhost:8000/admin/users', headers=headers)
with urllib.request.urlopen(req3) as r:
    data3 = json.loads(r.read())
    print('ADMIN USERS count:', len(data3))
    for u in data3:
        print(f'  id={u["id"]} name={u["name"]} email={u["email"]} role={u["role"]} active={u["is_active"]}')

# Test ban/restore user id=3
payload = json.dumps({'is_active': False}).encode()
req4 = urllib.request.Request('http://localhost:8000/admin/users/3/status', data=payload, headers=headers, method='PUT')
with urllib.request.urlopen(req4) as r:
    data4 = json.loads(r.read())
    print('BAN user 3:', data4)

payload2 = json.dumps({'is_active': True}).encode()
req5 = urllib.request.Request('http://localhost:8000/admin/users/3/status', data=payload2, headers=headers, method='PUT')
with urllib.request.urlopen(req5) as r:
    data5 = json.loads(r.read())
    print('RESTORE user 3:', data5)

# Test my orders (as admin)
req6 = urllib.request.Request('http://localhost:8000/orders/', headers=headers)
with urllib.request.urlopen(req6) as r:
    data6 = json.loads(r.read())
    print('MY ORDERS count:', len(data6))

# Test portfolio
req7 = urllib.request.Request('http://localhost:8000/users/portfolio', headers=headers)
with urllib.request.urlopen(req7) as r:
    data7 = json.loads(r.read())
    print('PORTFOLIO holdings:', len(data7))
    if data7:
        print('Sample holding:', data7[0])

print('ALL TESTS PASSED')
