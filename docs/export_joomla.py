#!/usr/bin/env python3
"""
Joomla Content Exporter — Adequate Safaris
Exports articles, categories, users, custom fields to JSON for migration.
Run ON THE LIVE SERVER (SSH) or via Docker exec.
"""

import json
import mysql.connector
import os
import sys
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

# ──────────────────────────────────────────────
# CONFIG — UPDATE THESE FOR YOUR ENVIRONMENT
# ──────────────────────────────────────────────
DB_CONFIG = {
    'host': os.getenv('JOOMLA_DB_HOST', 'localhost'),
    'port': int(os.getenv('JOOMLA_DB_PORT', '3306')),
    'user': os.getenv('JOOMLA_DB_USER', 'joomla'),
    'password': os.getenv('JOOMLA_DB_PASSWORD', 'joomla'),
    'database': os.getenv('JOOMLA_DB_NAME', 'joomla'),
    'charset': 'utf8mb4',
    'collation': 'utf8mb4_unicode_ci',
}

TABLE_PREFIX = os.getenv('JOOMLA_TABLE_PREFIX', 'j4_')  # Adjust if different
OUTPUT_DIR = Path(os.getenv('EXPORT_OUTPUT_DIR', './migration-export'))

# Safari-relevant category IDs (from your site map)
SAFARI_CATEGORY_IDS = [
    17,  # Kenya Lodge Safaris
    236, 246, 247, 248, 249, 250, 251, 252, 253, 254,  # Sub-categories
    237,  # Kenya Camping Safaris
    238,  # Kenya Flying Safaris
    240,  # Mt Kenya Climb
    242,  # Short Excursions
    243,  # Tanzania Safaris
    244,  # Uganda Safaris
]
ACCOMMODATION_CAT_ID = 14

# ──────────────────────────────────────────────
# DATABASE CONNECTION
# ──────────────────────────────────────────────
def get_connection():
    return mysql.connector.connect(**DB_CONFIG)

# ──────────────────────────────────────────────
# EXPORT FUNCTIONS
# ──────────────────────────────────────────────
def export_categories(conn) -> List[Dict]:
    """Export category hierarchy."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT id, parent_id, lft, rgt, level, path, title, alias, description,
               published, language, access, params, metadesc, metakey, metadata
        FROM `{TABLE_PREFIX}categories`
        WHERE extension = 'com_content'
        ORDER BY lft
    """)
    rows = cursor.fetchall()
    cursor.close()
    
    # Build tree
    cat_map = {r['id']: {**r, 'children': []} for r in rows}
    roots = []
    for r in rows:
        if r['parent_id'] in cat_map:
            cat_map[r['parent_id']]['children'].append(cat_map[r['id']])
        else:
            roots.append(cat_map[r['id']])
    return roots

def export_articles(conn, cat_ids: List[int]) -> List[Dict]:
    """Export articles in given categories."""
    if not cat_ids:
        return []
    
    placeholders = ','.join(['%s'] * len(cat_ids))
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT a.id, a.asset_id, a.catid, a.title, a.alias, a.introtext, a.fulltext,
               a.state, a.featured, a.language, a.created, a.created_by, a.created_by_alias,
               a.modified, a.modified_by, a.checked_out, a.checked_out_time,
               a.publish_up, a.publish_down, a.images, a.urls, a.attribs, a.version,
               a.ordering, a.metadesc, a.metakey, a.metadata, a.hits,
               c.title as category_title, c.alias as category_alias
        FROM `{TABLE_PREFIX}content` a
        LEFT JOIN `{TABLE_PREFIX}categories` c ON a.catid = c.id
        WHERE a.catid IN ({placeholders})
        ORDER BY a.catid, a.ordering
    """, tuple(cat_ids))
    rows = cursor.fetchall()
    cursor.close()
    return rows

def export_custom_fields(conn) -> Dict[int, Dict]:
    """Export custom field values for content items."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT cf.id, cf.title, cf.name, cf.type, cf.fieldparams, cf.params
        FROM `{TABLE_PREFIX}fields` cf
        WHERE cf.context = 'com_content.article'
    """)
    fields = {f['id']: f for f in cursor.fetchall()}
    cursor.close()
    
    if not fields:
        return {}
    
    field_ids = list(fields.keys())
    placeholders = ','.join(['%s'] * len(field_ids))
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT item_id, field_id, value
        FROM `{TABLE_PREFIX}fields_values`
        WHERE field_id IN ({placeholders})
    """, tuple(field_ids))
    values = cursor.fetchall()
    cursor.close()
    
    # Group by item_id
    result = {}
    for v in values:
        item_id = v['item_id']
        if item_id not in result:
            result[item_id] = {}
        field = fields[v['field_id']]
        result[item_id][field['name']] = v['value']
    return result

def export_users(conn) -> List[Dict]:
    """Export users (minimal for migration)."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT id, name, username, email, block, sendEmail, registerDate,
               lastvisitDate, activation, params, lastResetTime, resetCount
        FROM `{TABLE_PREFIX}users`
        WHERE block = 0
    """)
    rows = cursor.fetchall()
    cursor.close()
    
    # Get user groups
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT user_id, group_id
        FROM `{TABLE_PREFIX}user_usergroup_map`
    """)
    ug_map = {}
    for r in cursor.fetchall():
        ug_map.setdefault(r['user_id'], []).append(r['group_id'])
    cursor.close()
    
    for u in rows:
        u['groups'] = ug_map.get(u['id'], [])
    return rows

def export_media(conn) -> List[Dict]:
    """Export media manager files (images)."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT id, folder, filename, title, description, created, modified
        FROM `{TABLE_PREFIX}media`
        WHERE mime LIKE 'image/%'
    """)
    rows = cursor.fetchall()
    cursor.close()
    return rows

def export_tags(conn) -> List[Dict]:
    """Export tags."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT t.id, t.title, t.alias, t.description, t.language, t.parent_id,
               tl.link_type, tl.link_id
        FROM `{TABLE_PREFIX}tags` t
        LEFT JOIN `{TABLE_PREFIX}ucm_content` tl ON t.id = tl.core_content_id
        WHERE tl.core_type_alias = 'com_content.article' OR tl.core_type_alias IS NULL
    """)
    rows = cursor.fetchall()
    cursor.close()
    return rows

def export_menus(conn) -> List[Dict]:
    """Export menu items for URL structure."""
    cursor = conn.cursor(dictionary=True)
    cursor.execute(f"""
        SELECT id, menutype, title, alias, note, path, link, type, published,
               parent_id, level, component_id, language, params, home, browserNav, access
        FROM `{TABLE_PREFIX}menu_items`
        WHERE published = 1
        ORDER BY menutype, lft
    """)
    rows = cursor.fetchall()
    cursor.close()
    return rows

# ──────────────────────────────────────────────
# TRANSFORMATION HELPERS
# ──────────────────────────────────────────────
def parse_joomla_json(json_str: Optional[str]) -> Dict:
    """Safely parse Joomla JSON params."""
    if not json_str:
        return {}
    try:
        return json.loads(json_str)
    except json.JSONDecodeError:
        return {}

def extract_safari_data(article: Dict, custom_fields: Dict) -> Dict:
    """Transform Joomla article + custom fields into Safari model."""
    cf = custom_fields.get(article['id'], {})
    images = parse_joomla_json(article.get('images'))
    urls = parse_joomla_json(article.get('urls'))
    attribs = parse_joomla_json(article.get('attribs'))
    metadata = parse_joomla_json(article.get('metadata'))
    
    return {
        'joomla_id': article['id'],
        'title': article['title'],
        'alias': article['alias'],
        'category_id': article['catid'],
        'category_title': article.get('category_title'),
        'state': article['state'],
        'language': article['language'],
        'created': article['created'].isoformat() if article['created'] else None,
        'modified': article['modified'].isoformat() if article['modified'] else None,
        'introtext': article['introtext'],
        'fulltext': article['fulltext'],
        'images': images,
        'urls': urls,
        'meta_description': article['metadesc'],
        'meta_keywords': article['metakey'],
        'custom_fields': cf,
        'hits': article['hits'],
    }

# ──────────────────────────────────────────────
# MAIN
# ──────────────────────────────────────────────
def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    
    print(f"Connecting to {DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}...")
    conn = get_connection()
    
    try:
        print("Exporting categories...")
        categories = export_categories(conn)
        (OUTPUT_DIR / f'categories_{timestamp}.json').write_text(
            json.dumps(categories, indent=2, default=str)
        )
        print(f"  → {len(categories)} root categories")
        
        print("Exporting articles...")
        articles = export_articles(conn, SAFARI_CATEGORY_IDS + [ACCOMMODATION_CAT_ID])
        (OUTPUT_DIR / f'articles_{timestamp}.json').write_text(
            json.dumps(articles, indent=2, default=str)
        )
        print(f"  → {len(articles)} articles")
        
        print("Exporting custom fields...")
        custom_fields = export_custom_fields(conn)
        (OUTPUT_DIR / f'custom_fields_{timestamp}.json').write_text(
            json.dumps(custom_fields, indent=2, default=str)
        )
        print(f"  → {len(custom_fields)} items with custom fields")
        
        print("Exporting users...")
        users = export_users(conn)
        (OUTPUT_DIR / f'users_{timestamp}.json').write_text(
            json.dumps(users, indent=2, default=str)
        )
        print(f"  → {len(users)} users")
        
        print("Exporting media...")
        media = export_media(conn)
        (OUTPUT_DIR / f'media_{timestamp}.json').write_text(
            json.dumps(media, indent=2, default=str)
        )
        print(f"  → {len(media)} media files")
        
        print("Exporting tags...")
        tags = export_tags(conn)
        (OUTPUT_DIR / f'tags_{timestamp}.json').write_text(
            json.dumps(tags, indent=2, default=str)
        )
        print(f"  → {len(tags)} tags")
        
        print("Exporting menus...")
        menus = export_menus(conn)
        (OUTPUT_DIR / f'menus_{timestamp}.json').write_text(
            json.dumps(menus, indent=2, default=str)
        )
        print(f"  → {len(menus)} menu items")
        
        # Create transformed safari data
        print("Transforming safari data...")
        safaris = [extract_safari_data(a, custom_fields) for a in articles]
        (OUTPUT_DIR / f'safaris_transformed_{timestamp}.json').write_text(
            json.dumps(safaris, indent=2, default=str)
        )
        print(f"  → {len(safaris)} safari packages transformed")
        
        # Summary
        summary = {
            'exported_at': datetime.now().isoformat(),
            'database': DB_CONFIG['database'],
            'table_prefix': TABLE_PREFIX,
            'counts': {
                'categories': len(categories),
                'articles': len(articles),
                'custom_field_items': len(custom_fields),
                'users': len(users),
                'media': len(media),
                'tags': len(tags),
                'menus': len(menus),
                'safaris_transformed': len(safaris),
            },
            'safari_categories': SAFARI_CATEGORY_IDS,
        }
        (OUTPUT_DIR / f'summary_{timestamp}.json').write_text(
            json.dumps(summary, indent=2, default=str)
        )
        
        print(f"\n✅ Export complete! Files in {OUTPUT_DIR}")
        print(f"📋 Summary: {summary['counts']}")
        
    finally:
        conn.close()

if __name__ == '__main__':
    main()