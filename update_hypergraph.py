import json
from datetime import datetime

# Load existing hypergraph data
with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'r') as f:
    hypergraph = json.load(f)

# Track new additions
new_nodes = []
new_edges = []

# Add new supplier nodes
new_suppliers = [
    {
        "id": "shay_and_company",
        "type": "supplier",
        "name": "Shay and Company",
        "website": "https://shayandcompany.com/",
        "focus": "wholesale_bulk_organic_skincare"
    },
    {
        "id": "veda_oils",
        "type": "supplier",
        "name": "Veda Oils",
        "website": "https://us.vedaoils.com/",
        "focus": "cosmetic_raw_materials_bulk",
        "quality_standards": "strict_quality_control"
    },
    {
        "id": "mckinley_resources",
        "type": "supplier",
        "name": "McKinley Resources",
        "website": "https://mckinleyresources.com/",
        "product_line": "McKinley Skin Care",
        "specialization": "anti_aging_actives"
    },
    {
        "id": "croda_beauty",
        "type": "supplier",
        "name": "Croda Beauty",
        "website": "https://www.crodabeauty.com/",
        "product_range": "200+",
        "notable_products": ["Matrixyl"],
        "focus": "innovative_active_ingredients"
    },
    {
        "id": "bulk_naturals",
        "type": "supplier",
        "name": "Bulk Naturals Wholesale",
        "website": "https://www.bulknaturalswholesale.com/",
        "focus": "cosmetic_actives_peptides_liposomes"
    },
    {
        "id": "nourish_us_naturals",
        "type": "supplier",
        "name": "NourishUs Naturals",
        "website": "https://nourishusnaturals.com/",
        "focus": "wholesale_skincare_ingredients"
    },
    {
        "id": "chemistry_store",
        "type": "supplier",
        "name": "The Chemistry Store",
        "website": "http://www.chemistrystore.com/",
        "focus": "soap_making_cosmetic_ingredients",
        "product_quality": "lab_grade"
    },
    {
        "id": "wholesale_botanics",
        "type": "supplier",
        "name": "Wholesale Botanics",
        "website": "https://wholesalebotanics.com/",
        "focus": "carrier_oils_essential_oils"
    },
    {
        "id": "nature_in_bottle",
        "type": "supplier",
        "name": "Nature in Bottle",
        "website": "https://www.natureinbottle.com/",
        "focus": "pure_natural_organic_carrier_oils",
        "pricing": "wholesale_bulk"
    },
    {
        "id": "new_directions_aromatics",
        "type": "supplier",
        "name": "New Directions Aromatics",
        "website": "https://www.newdirectionsaromatics.com/",
        "focus": "wholesale_carrier_oils",
        "bulk_pricing": "gallon_drum_pallet"
    }
]

# Add new ingredient nodes
new_ingredients = [
    {
        "id": "surfpro_sci",
        "type": "ingredient",
        "name": "SurfPro SCI",
        "category": "surfactant",
        "function": "cleansing_foaming",
        "price_per_kg_usd": 26.67
    },
    {
        "id": "polysorbate_60",
        "type": "ingredient",
        "name": "Polysorbate 60",
        "category": "emulsifier",
        "function": "emulsification",
        "price_per_kg_usd": 17.35
    },
    {
        "id": "phytocide_elderberry",
        "type": "ingredient",
        "name": "PhytoCide Elderberry OS",
        "category": "preservative",
        "function": "natural_preservation",
        "price_per_kg_usd": 122.58
    },
    {
        "id": "natrasil",
        "type": "ingredient",
        "name": "NatraSil",
        "category": "preservative",
        "function": "natural_preservation",
        "price_per_kg_usd": 25.95
    },
    {
        "id": "montanov_68_mb",
        "type": "ingredient",
        "name": "Montanov 68 MB",
        "category": "emulsifier",
        "function": "natural_emulsification",
        "price_per_kg_usd": 60.19
    },
    {
        "id": "meadowfoam_xpr",
        "type": "ingredient",
        "name": "Meadowfoam XPR (Expeller Pressed)",
        "category": "carrier_oil",
        "function": "moisturizing_emollient",
        "price_per_kg_usd": 60.83
    },
    {
        "id": "lotioncrafter_el51",
        "type": "ingredient",
        "name": "Lotioncrafter EL51",
        "category": "emulsifier",
        "function": "emulsification",
        "price_per_kg_usd": 57.60
    },
    {
        "id": "lotioncrafter_el40",
        "type": "ingredient",
        "name": "Lotioncrafter EL40",
        "category": "emulsifier",
        "function": "emulsification",
        "price_per_kg_usd": 82.67
    },
    {
        "id": "lotioncrafter_el3045",
        "type": "ingredient",
        "name": "Lotioncrafter EL3045",
        "category": "emulsifier",
        "function": "emulsification",
        "price_per_kg_usd": 80.00
    },
    {
        "id": "activated_charcoal",
        "type": "ingredient",
        "name": "Activated Charcoal",
        "category": "exfoliant",
        "function": "detoxifying_cleansing",
        "price_range_usd": "9.09-449.85"
    },
    {
        "id": "aha_fruit_enzyme",
        "type": "ingredient",
        "name": "AHA Fruit Enzyme Blend",
        "category": "exfoliant",
        "function": "exfoliating_brightening",
        "price_range_usd": "13.27-557.30"
    }
]

# Add new platform nodes
new_platforms = [
    {
        "id": "book4time",
        "type": "platform",
        "name": "Book4Time",
        "platform_type": "spa_salon_software",
        "focus": "enterprise_spa_management"
    },
    {
        "id": "zenoti",
        "type": "platform",
        "name": "Zenoti",
        "platform_type": "enterprise_software",
        "focus": "multi_location_chains_franchises"
    },
    {
        "id": "boulevard",
        "type": "platform",
        "name": "Boulevard",
        "platform_type": "client_experience_platform",
        "focus": "high_end_salon_spa"
    },
    {
        "id": "booksy",
        "type": "platform",
        "name": "Booksy",
        "platform_type": "booking_marketplace",
        "focus": "beauty_wellness_professionals"
    },
    {
        "id": "setmore",
        "type": "platform",
        "name": "Setmore",
        "platform_type": "appointment_scheduling",
        "pricing_model": "free_paid_tiers"
    },
    {
        "id": "phorest",
        "type": "platform",
        "name": "Phorest",
        "platform_type": "salon_management",
        "focus": "client_retention_marketing"
    },
    {
        "id": "koalendar",
        "type": "platform",
        "name": "Koalendar",
        "platform_type": "booking_software",
        "pricing_model": "free_paid_tiers"
    },
    {
        "id": "connecteam",
        "type": "platform",
        "name": "Connecteam",
        "platform_type": "staff_management",
        "focus": "team_coordination_operations"
    },
    {
        "id": "beauty_pro",
        "type": "platform",
        "name": "Beauty Pro",
        "platform_type": "management_software",
        "pricing_usd": 50,
        "features": ["unlimited_employees", "data_transfer", "training"]
    },
    {
        "id": "aura_salon_ware",
        "type": "platform",
        "name": "Aura Salon Ware",
        "platform_type": "management_software",
        "pricing_usd": 199,
        "focus": "efficiency_streamlined_operations"
    },
    {
        "id": "salon_target",
        "type": "platform",
        "name": "Salon Target",
        "platform_type": "hair_salon_software",
        "focus": "booking_sales_management"
    },
    {
        "id": "square_appointments",
        "type": "platform",
        "name": "Square Appointments",
        "platform_type": "booking_pos_integration",
        "pricing_range_usd": "0-60",
        "integration": "square_ecosystem"
    },
    {
        "id": "fresha",
        "type": "platform",
        "name": "Fresha",
        "platform_type": "free_booking_platform",
        "pricing_usd": 0,
        "revenue_model": "commission_based"
    }
]

# Update GlossGenius with detailed pricing
for node in hypergraph['nodes']:
    if node['id'] == 'glossgenius':
        node.update({
            "pricing_tiers": {
                "standard": {"monthly": 28, "annual_monthly": 24, "savings_pct": 14},
                "gold": {"monthly": 56, "annual_monthly": 48, "savings_pct": 14},
                "platinum": {"monthly": 168, "annual_monthly": 148, "savings_pct": 12}
            },
            "payment_processing_rate": 0.026,
            "free_trial_days": 14,
            "metrics": {
                "avg_rebooking_rate_pct": 75,
                "avg_booking_increase_pct": 22,
                "avg_annual_savings_usd": 8000
            },
            "features_count": "100+"
        })
    elif node['id'] == 'vagaro':
        node.update({
            "user_base": "20000000+",
            "professionals": "220000+",
            "marketplace_fee": 0
        })

# Add professional type nodes
professional_types = [
    {"id": "barber", "type": "professional", "name": "Barber", "services": ["haircuts", "shaves", "beard_trimming"]},
    {"id": "brow_artist", "type": "professional", "name": "Brow Artist", "services": ["eyebrow_shaping", "tinting", "microblading"]},
    {"id": "makeup_artist_pro", "type": "professional", "name": "Makeup Artist", "services": ["makeup_application", "special_effects"]},
    {"id": "personal_trainer_pro", "type": "professional", "name": "Personal Trainer", "services": ["fitness_training", "nutrition_coaching"]},
    {"id": "tanning_artist", "type": "professional", "name": "Tanning Artist", "services": ["spray_tanning", "tanning_beds"]},
    {"id": "tattoo_artist", "type": "professional", "name": "Tattoo & Piercing Artist", "services": ["tattoos", "piercings"]},
    {"id": "yoga_instructor_pro", "type": "professional", "name": "Yoga Instructor", "services": ["yoga_classes", "meditation"]}
]

# Add feature nodes
feature_nodes = [
    {"id": "hipaa_compliance", "type": "feature", "name": "HIPAA Compliance", "category": "compliance"},
    {"id": "bnpl", "type": "feature", "name": "Buy Now Pay Later", "category": "payment"},
    {"id": "flat_rate_processing", "type": "feature", "name": "Flat Rate Payment Processing", "category": "payment"},
    {"id": "free_data_transfer", "type": "feature", "name": "Free Data Transfer", "category": "onboarding"},
    {"id": "text_marketing", "type": "feature", "name": "Text Marketing", "category": "marketing"},
    {"id": "email_marketing", "type": "feature", "name": "Email Marketing", "category": "marketing"},
    {"id": "review_management", "type": "feature", "name": "Review Management", "category": "marketing"},
    {"id": "waitlist_management", "type": "feature", "name": "Waitlist Management", "category": "booking"},
    {"id": "resource_management", "type": "feature", "name": "Resource Management", "category": "operations"},
    {"id": "goal_setting", "type": "feature", "name": "Goal Setting", "category": "analytics"},
    {"id": "analytics", "type": "feature", "name": "Analytics", "category": "analytics"},
    {"id": "inventory_management", "type": "feature", "name": "Inventory Management", "category": "operations"},
    {"id": "payroll", "type": "feature", "name": "Payroll", "category": "hr"},
    {"id": "time_tracking", "type": "feature", "name": "Time Tracking", "category": "hr"}
]

# Combine all new nodes
new_nodes.extend(new_suppliers)
new_nodes.extend(new_ingredients)
new_nodes.extend(new_platforms)
new_nodes.extend(professional_types)
new_nodes.extend(feature_nodes)

# Add new edges for suppliers and ingredients
supplier_ingredient_edges = [
    {"source": "lotion_crafter", "target": "surfpro_sci", "type": "supplies", "price_per_kg_usd": 26.67, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "polysorbate_60", "type": "supplies", "price_per_kg_usd": 17.35, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "phytocide_elderberry", "type": "supplies", "price_per_kg_usd": 122.58, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "natrasil", "type": "supplies", "price_per_kg_usd": 25.95, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "montanov_68_mb", "type": "supplies", "price_per_kg_usd": 60.19, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "meadowfoam_xpr", "type": "supplies", "price_per_kg_usd": 60.83, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "lotioncrafter_el51", "type": "supplies", "price_per_kg_usd": 57.60, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "lotioncrafter_el40", "type": "supplies", "price_per_kg_usd": 82.67, "availability": "in_stock"},
    {"source": "lotion_crafter", "target": "lotioncrafter_el3045", "type": "supplies", "price_per_kg_usd": 80.00, "availability": "in_stock"},
    {"source": "shay_and_company", "target": "activated_charcoal", "type": "supplies", "availability": "in_stock"},
    {"source": "shay_and_company", "target": "aha_fruit_enzyme", "type": "supplies", "availability": "in_stock"}
]

# Add edges for platforms and features
platform_feature_edges = [
    {"source": "glossgenius", "target": "hipaa_compliance", "type": "offers_feature"},
    {"source": "glossgenius", "target": "bnpl", "type": "offers_feature"},
    {"source": "glossgenius", "target": "flat_rate_processing", "type": "offers_feature"},
    {"source": "glossgenius", "target": "free_data_transfer", "type": "offers_feature"},
    {"source": "glossgenius", "target": "text_marketing", "type": "offers_feature"},
    {"source": "glossgenius", "target": "email_marketing", "type": "offers_feature"},
    {"source": "glossgenius", "target": "review_management", "type": "offers_feature"},
    {"source": "glossgenius", "target": "waitlist_management", "type": "offers_feature"},
    {"source": "glossgenius", "target": "resource_management", "type": "offers_feature"},
    {"source": "glossgenius", "target": "goal_setting", "type": "offers_feature"},
    {"source": "glossgenius", "target": "analytics", "type": "offers_feature"},
    {"source": "glossgenius", "target": "inventory_management", "type": "offers_feature"},
    {"source": "glossgenius", "target": "payroll", "type": "offers_feature"},
    {"source": "glossgenius", "target": "time_tracking", "type": "offers_feature"},
    {"source": "mangomint", "target": "hipaa_compliance", "type": "offers_feature"},
    {"source": "pocketsuite", "target": "free_data_transfer", "type": "offers_feature"}
]

# Add edges for platforms serving professionals
platform_professional_edges = [
    {"source": "glossgenius", "target": "barber", "type": "serves"},
    {"source": "glossgenius", "target": "brow_artist", "type": "serves"},
    {"source": "glossgenius", "target": "esthetician", "type": "serves"},
    {"source": "glossgenius", "target": "lash_tech", "type": "serves"},
    {"source": "glossgenius", "target": "makeup_artist_pro", "type": "serves"},
    {"source": "glossgenius", "target": "massage_therapist", "type": "serves"},
    {"source": "glossgenius", "target": "nail_tech", "type": "serves"},
    {"source": "glossgenius", "target": "personal_trainer_pro", "type": "serves"},
    {"source": "glossgenius", "target": "tanning_artist", "type": "serves"},
    {"source": "glossgenius", "target": "tattoo_artist", "type": "serves"},
    {"source": "glossgenius", "target": "yoga_instructor_pro", "type": "serves"},
    {"source": "pocketsuite", "target": "esthetician", "type": "serves"},
    {"source": "vagaro", "target": "esthetician", "type": "serves"},
    {"source": "vagaro", "target": "barber", "type": "serves"},
    {"source": "vagaro", "target": "nail_tech", "type": "serves"}
]

# Combine all new edges
new_edges.extend(supplier_ingredient_edges)
new_edges.extend(platform_feature_edges)
new_edges.extend(platform_professional_edges)

# Add new nodes to hypergraph (avoid duplicates)
existing_ids = {node['id'] for node in hypergraph['nodes']}
for node in new_nodes:
    if node['id'] not in existing_ids:
        hypergraph['nodes'].append(node)
        existing_ids.add(node['id'])

# Add new edges to hypergraph
hypergraph['edges'].extend(new_edges)

# Update metadata
hypergraph['metadata']['version'] = '3.0'
hypergraph['metadata']['last_updated'] = datetime.now().strftime('%Y-%m-%d')
hypergraph['metadata']['description'] = 'Enhanced Skin Zone marketplace hypergraph with comprehensive supplier pricing, salon/spa platforms, and professional networks'
hypergraph['metadata']['node_count'] = len(hypergraph['nodes'])
hypergraph['metadata']['edge_count'] = len(hypergraph['edges'])

# Save updated hypergraph
with open('/home/ubuntu/skin-zone/hypergraph_data.json', 'w') as f:
    json.dump(hypergraph, f, indent=2)

print(f"Hypergraph updated successfully!")
print(f"Total nodes: {hypergraph['metadata']['node_count']}")
print(f"Total edges: {hypergraph['metadata']['edge_count']}")
print(f"New nodes added: {len([n for n in new_nodes if n['id'] not in existing_ids])}")
print(f"New edges added: {len(new_edges)}")
