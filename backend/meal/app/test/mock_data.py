restaurants_ids = [
" d3a0053b-e0cb-4243-be59-d65e915c18ca",
" 7c214364-4184-4c87-a9f6-273db2053309",
" f12d3382-4ac0-4f6a-ab4b-ceb10a9bce4c",
" 17b4873c-a287-41e4-a5fc-b8ed8396f536",
" 78aed020-6b11-451c-b99e-00ab7e465eaa",
" ee06877c-fe0f-451e-adfb-ce834e7bf6b4",
" df3c0329-f082-4328-9aae-39a3e0180fdb",
" 75f8fb80-1efd-4712-b0e0-7f98b7d5c807",
" 31f80b9e-b156-4d19-b077-e7212bf84499",
" ebfa164e-102e-4c98-9399-b5603a570a3b",
" e3352817-b077-498e-87f9-aef5334fdf6d",
" 62184bca-7374-4827-8f69-8e698dbf986a",
" 319c0aae-14b8-4a9b-ac95-75410ae4c25f",
" 52f922c2-d62c-48cb-ae60-0cc65171b436",
" 5b58298a-eb88-4568-ad95-45df226227ff",
" a4ffdc95-b6a9-4b32-a620-0290aa389891",
" acca8eac-f659-40af-b5a8-64e31b2abd86",
" f968c89a-2bdb-4869-9cbe-72fd1bb3f6c9",
" 9a7e9b67-11ab-45a5-bff0-0714c83beac2",
" 6e2b38fb-ed62-4ffa-913f-fd017ddd97b4",
]

cuisines = [
    "Kebap",
    "Tavuk",
    "Pilav",
    "Tatlı",
    "Fast Food",
    "Deniz Ürünleri",
    "Ev Yemeği",
    "Izgara",
    "Pide & Lahmacun",
    "Burger",
    "Pizza",
]

# Gerçek yemek fotoğrafları - kategorilere göre ayrılmış
food_images = {
    "Kebap": [
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1606502281107-297d1fa9f4cf?w=400&h=300&fit=crop",
    ],
    "Tavuk": [
        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&h=300&fit=crop",
    ],
    "Pilav": [
        "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1599043513900-ed6ea4d16241?w=400&h=300&fit=crop", 
        "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    ],
    "Tatlı": [
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop",
    ],
    "Fast Food": [
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1613564834361-9436948817d1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1606755962773-d324e2d53014?w=400&h=300&fit=crop",
    ],
    "Deniz Ürünleri": [
        "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=300&fit=crop",
    ],
    "Ev Yemeği": [
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1543353071-10c8ba3e5e6c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    ],
    "Izgara": [
        "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1615937722923-67b1f1be2be2?w=400&h=300&fit=crop",
    ],
    "Pide & Lahmacun": [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop",
    ],
    "Burger": [
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400&h=300&fit=crop",
    ],
    "Pizza": [
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400&h=300&fit=crop",
    ],
}

# Eski images array'ini kaldırıp yeni fonksiyon ekledik
def get_food_image_by_cuisine(cuisine: str) -> str:
    """Mutfak türüne göre uygun yemek fotoğrafı döndürür"""
    import random
    
    if cuisine in food_images:
        return random.choice(food_images[cuisine])
    else:
        # Fallback: genel yemek fotoğrafları
        all_images = []
        for images_list in food_images.values():
            all_images.extend(images_list)
        return random.choice(all_images)

# Backward compatibility için eski images array'ini de tutalım
images = [
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop", 
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop",
]