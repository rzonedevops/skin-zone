#!/usr/bin/env python3.11
"""
Update Skin Zone hypergraph with November 2025 research findings
Includes updated pricing, new suppliers, and platform data
"""

import json
from datetime import datetime

# Load existing hypergraph data
with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'r') as f:
    hypergraph = json.load(f)

# Track updates
updates_made = []

# Update existing supplier nodes with new data
supplier_updates = {
    "lotion_crafter": {
        "processing_time_days": "1-3",
        "currencies": ["USD", "INR", "GBP", "CAD", "AUD", "EUR", "JPY"],
        "special_features": ["formulary_tools", "calculators", "wholesale_pricing"],
        "last_updated": "2025-11-10"
    },
    "making_cosmetics": {
        "catalog_size": "1000+",
        "certifications": ["ISO", "GMP", "FDA", "USDA_Organic"],
        "founded": 1997,
        "processing_time_days": 5,
        "last_updated": "2025-11-10"
    },
    "fnwl": {
        "founded": 1997,
        "certifications": ["CCOF", "Organic_Trade_Association"],
        "focus": "organic_natural",
        "rewards_program": True,
        "last_updated": "2025-11-10"
    }
}

# Update ingredient pricing with November 2025 data
ingredient_pricing_updates = {
    "thda": {
        "price_per_kg_usd": 759.95,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "sea_kelp_bioferment": {
        "price_per_kg_usd": 52.50,
        "availability": "sold_out",
        "last_updated": "2025-11-10"
    },
    "snow_mushroom_complex": {
        "price_per_kg_usd": 144.95,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "silk_amino_acids": {
        "price_per_kg_usd": 84.22,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "sepimax_zen": {
        "price_per_kg_usd": 122.16,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "sodium_pca": {
        "price_per_kg_usd": 39.12,
        "availability": "sold_out",
        "last_updated": "2025-11-10"
    },
    "phenonip_xb": {
        "price_per_kg_usd": 29.65,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "neodefend": {
        "price_per_kg_usd": 66.13,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "montanov_202": {
        "price_per_kg_usd": 63.45,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "stearic_acid": {
        "price_per_kg_usd": 8.53,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "surfpro_slsa": {
        "price_per_kg_usd": 31.53,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    },
    "potassium_sorbate": {
        "price_per_kg_usd": 13.01,
        "supplier": "lotion_crafter",
        "availability": "in_stock",
        "last_updated": "2025-11-10"
    }
}

# New ingredients from November 2025 research
new_ingredients = [
    {
        "id": "vitamin_e_tocopherols",
        "type": "ingredient",
        "name": "Vitamin E Mixed Tocopherols 95%",
        "category": "antioxidant",
        "function": "protective_antioxidant",
        "price_per_kg_usd": 518.55,
        "purity": "95%",
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    },
    {
        "id": "surfpro_sci",
        "type": "ingredient",
        "name": "SurfPro SCI",
        "category": "surfactant",
        "function": "cleansing_foaming",
        "price_per_kg_usd": 26.67,
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    },
    {
        "id": "polysorbate_60",
        "type": "ingredient",
        "name": "Polysorbate 60",
        "category": "emulsifier",
        "function": "emulsification",
        "price_per_kg_usd": 17.35,
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    },
    {
        "id": "phytocide_elderberry",
        "type": "ingredient",
        "name": "PhytoCide Elderberry OS",
        "category": "preservative",
        "function": "natural_preservation",
        "price_per_kg_usd": 122.58,
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    },
    {
        "id": "natrasil",
        "type": "ingredient",
        "name": "NatraSil",
        "category": "preservative",
        "function": "natural_preservation",
        "price_per_kg_usd": 25.95,
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    },
    {
        "id": "montanov_68_mb",
        "type": "ingredient",
        "name": "Montanov 68 MB",
        "category": "emulsifier",
        "function": "natural_emulsification",
        "price_per_kg_usd": 60.19,
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    },
    {
        "id": "meadowfoam_xpr",
        "type": "ingredient",
        "name": "Meadowfoam XPR (Expeller Pressed)",
        "category": "carrier_oil",
        "function": "moisturizing_emollient",
        "price_per_kg_usd": 60.83,
        "supplier": "lotion_crafter",
        "availability": "in_stock"
    }
]

# New suppliers from November 2025 research
new_suppliers = [
    {
        "id": "bulk_actives",
        "type": "supplier",
        "name": "BulkActives",
        "website": "https://www.bulkactives.com/",
        "focus": "cosmeceuticals_standardized_extracts",
        "specialty": "active_ingredients"
    },
    {
        "id": "ingredi",
        "type": "supplier",
        "name": "Ingredi",
        "website": "https://ingredi.com/",
        "product_range": "900+",
        "focus": "premium_wholesale_ingredients",
        "categories": ["skincare", "haircare", "food", "beverage"]
    },
    {
        "id": "new_directions_aromatics",
        "type": "supplier",
        "name": "New Directions Aromatics",
        "website": "https://www.newdirectionsaromatics.com/",
        "product_range": "900+",
        "essential_oils": "225+",
        "carrier_oils": "115+",
        "butters": "50+",
        "focus": "essential_oils_natural_ingredients"
    },
    {
        "id": "shay_and_company",
        "type": "supplier",
        "name": "Shay and Company",
        "website": "https://shayandcompany.com/",
        "focus": "organic_wholesale_bulk",
        "specialty": "active_ingredients_essential_oils"
    }
]

# Update platform nodes with November 2025 pricing
platform_updates = {
    "glossgenius": {
        "pricing_tiers": {
            "standard": {
                "monthly": 28,
                "annual_monthly": 24,
                "savings_pct": 14,
                "description": "Business essentials"
            },
            "gold": {
                "monthly": 56,
                "annual_monthly": 48,
                "savings_pct": 14,
                "description": "Growth tools for entrepreneurs and teams",
                "popular": True
            },
            "platinum": {
                "monthly": 168,
                "annual_monthly": 148,
                "savings_pct": 12,
                "description": "Power features for scaling growth"
            }
        },
        "features_count": "100+",
        "payment_processing_rate": 0.026,
        "free_trial_days": 14,
        "metrics": {
            "avg_rebooking_rate_pct": 75,
            "avg_booking_increase_pct": 22,
            "avg_annual_savings_usd": 8000
        },
        "instant_payout_fee": 0.018,
        "last_updated": "2025-11-10"
    },
    "vagaro": {
        "pricing_start_usd": 30,
        "additional_provider_usd": 10,
        "user_base": "20000000+",
        "professionals": "220000+",
        "marketplace_fee": 0,
        "geographic_coverage": ["US", "CA", "UK", "AU"],
        "last_updated": "2025-11-10"
    }
}

# New platforms from November 2025 research
new_platforms = [
    {
        "id": "fresha",
        "type": "platform",
        "name": "Fresha",
        "platform_type": "free_booking_platform",
        "pricing_usd": 0,
        "revenue_model": "commission_based",
        "features": ["cloud_scheduling", "built_in_pos", "marketplace"]
    },
    {
        "id": "mangomint",
        "type": "platform",
        "name": "Mangomint",
        "platform_type": "management_software",
        "specialization": "spa_medspa",
        "hipaa_compliant": True,
        "rating": "highest_rated"
    },
    {
        "id": "square_appointments",
        "type": "platform",
        "name": "Square Appointments",
        "platform_type": "booking_pos_integration",
        "pricing_range_usd": "0-60",
        "integration": "square_ecosystem"
    }
]

# Apply supplier updates
for node in hypergraph['nodes']:
    if node['id'] in supplier_updates:
        node.update(supplier_updates[node['id']])
        updates_made.append(f"Updated supplier: {node['name']}")

# Apply ingredient pricing updates
for node in hypergraph['nodes']:
    if node['id'] in ingredient_pricing_updates:
        node.update(ingredient_pricing_updates[node['id']])
        updates_made.append(f"Updated ingredient pricing: {node['name']}")

# Apply platform updates
for node in hypergraph['nodes']:
    if node['id'] in platform_updates:
        node.update(platform_updates[node['id']])
        updates_made.append(f"Updated platform: {node['name']}")

# Add new ingredients
existing_ids = {node['id'] for node in hypergraph['nodes']}
for ingredient in new_ingredients:
    if ingredient['id'] not in existing_ids:
        hypergraph['nodes'].append(ingredient)
        updates_made.append(f"Added new ingredient: {ingredient['name']}")

# Add new suppliers
for supplier in new_suppliers:
    if supplier['id'] not in existing_ids:
        hypergraph['nodes'].append(supplier)
        updates_made.append(f"Added new supplier: {supplier['name']}")

# Add new platforms
for platform in new_platforms:
    if platform['id'] not in existing_ids:
        hypergraph['nodes'].append(platform)
        updates_made.append(f"Added new platform: {platform['name']}")

# Create new edges for supplier-ingredient relationships
new_edges = []
for ingredient in new_ingredients:
    if 'supplier' in ingredient and ingredient['supplier'] == 'lotion_crafter':
        edge = {
            "source": "lotion_crafter",
            "target": ingredient['id'],
            "type": "supplies",
            "metadata": {
                "price_per_kg_usd": ingredient.get('price_per_kg_usd'),
                "availability": ingredient.get('availability', 'in_stock'),
                "last_updated": "2025-11-10"
            },
            "weight": 1.0
        }
        hypergraph['edges'].append(edge)
        new_edges.append(edge)
        updates_made.append(f"Added edge: lotion_crafter -> {ingredient['name']}")

# Update metadata
hypergraph['metadata']['version'] = "5.0"
hypergraph['metadata']['last_updated'] = "2025-11-10"
hypergraph['metadata']['node_count'] = len(hypergraph['nodes'])
hypergraph['metadata']['edge_count'] = len(hypergraph['edges'])
hypergraph['metadata']['description'] = "Skin Zone marketplace hypergraph with November 2025 pricing updates"
hypergraph['metadata']['updates_applied'] = len(updates_made)

# Save updated hypergraph
with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'w') as f:
    json.dump(hypergraph, f, indent=2)

# Save update log
update_log = {
    "timestamp": datetime.now().isoformat(),
    "version": "5.0",
    "updates_applied": len(updates_made),
    "details": updates_made,
    "new_ingredients_count": len(new_ingredients),
    "new_suppliers_count": len(new_suppliers),
    "new_platforms_count": len(new_platforms),
    "new_edges_count": len(new_edges)
}

with open('/home/ubuntu/skin-zone/hypergraph_update_log_nov2025.json', 'w') as f:
    json.dump(update_log, f, indent=2)

print(f"✓ Hypergraph updated successfully!")
print(f"✓ Version: {hypergraph['metadata']['version']}")
print(f"✓ Total nodes: {hypergraph['metadata']['node_count']}")
print(f"✓ Total edges: {hypergraph['metadata']['edge_count']}")
print(f"✓ Updates applied: {len(updates_made)}")
print(f"\nUpdate log saved to: hypergraph_update_log_nov2025.json")
