#!/usr/bin/env python3
"""
Update Skin Zone Hypergraph with November 18, 2025 Research Data
- Add new bulk ingredient pricing from Lotion Crafter
- Update Making Cosmetics catalog size and pricing
- Add salon/spa platform nodes and pricing
- Create new edges for marketplace relationships
"""

import json
from datetime import datetime

def load_hypergraph(filepath):
    """Load existing hypergraph data"""
    with open(filepath, 'r') as f:
        return json.load(f)

def save_hypergraph(data, filepath):
    """Save updated hypergraph data"""
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)

def update_hypergraph():
    """Main update function"""
    
    # Load existing data
    data = load_hypergraph('/home/ubuntu/skin-zone/hypergraph_data.json')
    
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Update metadata
    data['metadata']['version'] = '6.0'
    data['metadata']['last_updated'] = today
    data['metadata']['description'] = 'Skin Zone marketplace hypergraph with November 18, 2025 bulk pricing and salon platform updates'
    
    # Track updates
    nodes_added = 0
    edges_added = 0
    nodes_updated = 0
    
    # Update Making Cosmetics node
    for node in data['nodes']:
        if node['id'] == 'making_cosmetics':
            node['catalog_size'] = '1124+'
            node['last_updated'] = today
            node['reward_points'] = 200
            nodes_updated += 1
            break
    
    # Update Lotion Crafter node
    for node in data['nodes']:
        if node['id'] == 'lotion_crafter':
            node['discount_codes'] = {
                'SAVE10': '10% off orders <$150',
                'SAVE15': '15% off orders $150+'
            }
            node['last_updated'] = today
            nodes_updated += 1
            break
    
    # New bulk ingredients from Lotion Crafter research
    new_ingredients = [
        {
            'id': 'vitamin_e_tocopherols_95_bulk',
            'type': 'ingredient',
            'name': 'Vitamin E, Mixed Tocopherols 95% (7lb Bulk)',
            'category': 'antioxidant',
            'bulk_size_lbs': 7,
            'price_usd': 1649.00,
            'price_per_lb': 235.57,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'thda_bulk',
            'type': 'ingredient',
            'name': 'Tetrahexyldecyl Ascorbate (THDA), Non-Deodorized (1kg Bulk)',
            'category': 'vitamin_c_derivative',
            'bulk_size_kg': 1,
            'price_usd': 808.50,
            'price_per_kg': 808.50,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'surfpro_slsa_bulk',
            'type': 'ingredient',
            'name': 'SurfPro™ SLSa (20lb Bulk)',
            'category': 'surfactant',
            'bulk_size_lbs': 20,
            'price_usd': 285.95,
            'price_per_lb': 14.30,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'surfpro_sci_bulk',
            'type': 'ingredient',
            'name': 'SurfPro™ SCI (20lb Bulk)',
            'category': 'surfactant',
            'bulk_size_lbs': 20,
            'price_usd': 241.95,
            'price_per_lb': 12.10,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'stearic_acid_bulk',
            'type': 'ingredient',
            'name': 'Stearic Acid XXX Flakes (55lb Bulk)',
            'category': 'emulsifier',
            'bulk_size_lbs': 55,
            'price_usd': 212.85,
            'price_per_lb': 3.87,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'sodium_pca_bulk',
            'type': 'ingredient',
            'name': 'Sodium PCA 50% (25kg Bulk)',
            'category': 'humectant',
            'bulk_size_kg': 25,
            'price_usd': 978.00,
            'price_per_kg': 39.12,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'snow_mushroom_bulk',
            'type': 'ingredient',
            'name': 'Snow Mushroom Complex (15kg Bulk)',
            'category': 'humectant',
            'bulk_size_kg': 15,
            'price_usd': 2174.25,
            'price_per_kg': 144.95,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'silk_amino_acids_bulk',
            'type': 'ingredient',
            'name': 'Silk Amino Acids PF (10kg Bulk)',
            'category': 'protein',
            'bulk_size_kg': 10,
            'price_usd': 842.20,
            'price_per_kg': 84.22,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'sepimax_zen_bulk',
            'type': 'ingredient',
            'name': 'Sepimax Zen™ (12kg Bulk)',
            'category': 'thickener',
            'bulk_size_kg': 12,
            'price_usd': 1465.95,
            'price_per_kg': 122.16,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'sea_kelp_bioferment_bulk',
            'type': 'ingredient',
            'name': 'Sea Kelp Bioferment (20kg Bulk)',
            'category': 'botanical',
            'bulk_size_kg': 20,
            'price_usd': 1050.00,
            'price_per_kg': 52.50,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'potassium_sorbate_bulk',
            'type': 'ingredient',
            'name': 'Potassium Sorbate (50lb Bulk)',
            'category': 'preservative',
            'bulk_size_lbs': 50,
            'price_usd': 295.00,
            'price_per_lb': 5.90,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'phenonip_xb_bulk',
            'type': 'ingredient',
            'name': 'Phenonip® XB (25kg Bulk)',
            'category': 'preservative',
            'bulk_size_kg': 25,
            'price_usd': 741.25,
            'price_per_kg': 29.65,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'neodefend_bulk',
            'type': 'ingredient',
            'name': 'NeoDefend™ (25 lbs Bulk)',
            'category': 'preservative',
            'bulk_size_lbs': 25,
            'price_usd': 749.95,
            'price_per_lb': 30.00,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'montanov_68mb_bulk',
            'type': 'ingredient',
            'name': 'Montanov™ 68 MB (25lb Bulk)',
            'category': 'emulsifier',
            'bulk_size_lbs': 25,
            'price_usd': 682.50,
            'price_per_lb': 27.30,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'montanov_202_bulk',
            'type': 'ingredient',
            'name': 'Montanov 202 (25lb Bulk)',
            'category': 'emulsifier',
            'bulk_size_lbs': 25,
            'price_usd': 719.50,
            'price_per_lb': 28.78,
            'supplier': 'lotion_crafter',
            'last_updated': today
        },
        {
            'id': 'meadowfoam_xpr_bulk',
            'type': 'ingredient',
            'name': 'Meadowfoam XPR Expeller Pressed (35lb Bulk)',
            'category': 'oil',
            'bulk_size_lbs': 35,
            'price_usd': 965.85,
            'price_per_lb': 27.60,
            'supplier': 'lotion_crafter',
            'last_updated': today
        }
    ]
    
    # Add new ingredient nodes
    for ingredient in new_ingredients:
        # Check if already exists
        exists = any(n['id'] == ingredient['id'] for n in data['nodes'])
        if not exists:
            data['nodes'].append(ingredient)
            nodes_added += 1
    
    # Add salon/spa platform nodes
    salon_platforms = [
        {
            'id': 'glossgenius',
            'type': 'platform',
            'name': 'GlossGenius',
            'category': 'salon_management',
            'pricing_min_usd': 24,
            'pricing_max_usd': 150,
            'pricing_model': 'subscription',
            'features': ['booking', 'payments', 'marketing', 'client_management'],
            'last_updated': today
        },
        {
            'id': 'vagaro',
            'type': 'platform',
            'name': 'Vagaro',
            'category': 'salon_management',
            'pricing_base_usd': 30,
            'pricing_per_provider_usd': 10,
            'pricing_max_usd': 150,
            'pricing_model': 'subscription',
            'features': ['booking', 'marketing', 'pos', 'inventory'],
            'last_updated': today
        },
        {
            'id': 'styleseat',
            'type': 'platform',
            'name': 'StyleSeat',
            'category': 'marketplace',
            'pricing_model': 'commission',
            'transaction_fee_percent': 2.75,
            'booking_fee_usd': 2.35,
            'features': ['portfolio', 'booking', 'payments'],
            'last_updated': today
        },
        {
            'id': 'fresha',
            'type': 'platform',
            'name': 'Fresha',
            'category': 'marketplace',
            'pricing_free': True,
            'pricing_plus_per_member_usd': 9.95,
            'pricing_model': 'freemium',
            'features': ['booking', 'marketplace', 'payments'],
            'last_updated': today
        },
        {
            'id': 'square_appointments',
            'type': 'platform',
            'name': 'Square Appointments',
            'category': 'salon_management',
            'pricing_min_usd': 0,
            'pricing_max_usd': 60,
            'pricing_model': 'freemium',
            'transaction_fee_percent': 2.6,
            'transaction_fee_fixed_usd': 0.10,
            'features': ['booking', 'pos', 'payments'],
            'last_updated': today
        },
        {
            'id': 'mindbody',
            'type': 'platform',
            'name': 'Mindbody',
            'category': 'enterprise_wellness',
            'pricing_min_usd': 129,
            'pricing_max_usd': 349,
            'pricing_model': 'subscription',
            'features': ['scheduling', 'marketing', 'analytics'],
            'last_updated': today
        }
    ]
    
    # Add salon platform nodes
    for platform in salon_platforms:
        exists = any(n['id'] == platform['id'] for n in data['nodes'])
        if not exists:
            data['nodes'].append(platform)
            nodes_added += 1
    
    # Create edges for new ingredients
    for ingredient in new_ingredients:
        edge = {
            'source': 'lotion_crafter',
            'target': ingredient['id'],
            'type': 'supplies',
            'metadata': {
                'price_usd': ingredient['price_usd'],
                'availability': 'in_stock',
                'last_updated': today
            },
            'weight': 1.0
        }
        # Check if edge exists
        exists = any(
            e['source'] == edge['source'] and 
            e['target'] == edge['target'] and 
            e['type'] == edge['type']
            for e in data['edges']
        )
        if not exists:
            data['edges'].append(edge)
            edges_added += 1
    
    # Create edges between salon platforms and services
    platform_service_edges = [
        ('glossgenius', 'facial_basic', 'enables_booking'),
        ('vagaro', 'facial_basic', 'enables_booking'),
        ('styleseat', 'facial_basic', 'marketplace_listing'),
        ('fresha', 'facial_basic', 'marketplace_listing'),
        ('square_appointments', 'facial_basic', 'enables_booking'),
        ('mindbody', 'facial_basic', 'enables_booking'),
    ]
    
    for source, target, edge_type in platform_service_edges:
        edge = {
            'source': source,
            'target': target,
            'type': edge_type,
            'metadata': {
                'integration_type': 'booking_management',
                'last_updated': today
            },
            'weight': 1.0
        }
        exists = any(
            e['source'] == edge['source'] and 
            e['target'] == edge['target'] and 
            e['type'] == edge['type']
            for e in data['edges']
        )
        if not exists:
            data['edges'].append(edge)
            edges_added += 1
    
    # Update metadata counts
    data['metadata']['node_count'] = len(data['nodes'])
    data['metadata']['edge_count'] = len(data['edges'])
    data['metadata']['bulk_ingredients_added'] = len(new_ingredients)
    data['metadata']['salon_platforms_added'] = len(salon_platforms)
    data['metadata']['nodes_added_nov18'] = nodes_added
    data['metadata']['edges_added_nov18'] = edges_added
    data['metadata']['nodes_updated_nov18'] = nodes_updated
    
    # Save updated data
    save_hypergraph(data, '/home/ubuntu/skin-zone/hypergraph_data.json')
    
    print(f"✅ Hypergraph updated successfully!")
    print(f"   Version: {data['metadata']['version']}")
    print(f"   Total nodes: {data['metadata']['node_count']}")
    print(f"   Total edges: {data['metadata']['edge_count']}")
    print(f"   Nodes added: {nodes_added}")
    print(f"   Nodes updated: {nodes_updated}")
    print(f"   Edges added: {edges_added}")
    print(f"   Bulk ingredients: {len(new_ingredients)}")
    print(f"   Salon platforms: {len(salon_platforms)}")
    
    return data

if __name__ == '__main__':
    update_hypergraph()
