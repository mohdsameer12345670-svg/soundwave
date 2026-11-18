-- =====================================================================
-- SOundWAVE AUDIO E-COMMERCE SEED DATA
-- seed.sql
-- =====================================================================

-- 1. SEED CATEGORIES
INSERT INTO public.categories (id, name, slug, description, image_url, sort_order)
VALUES




    ('c0000000-0000-0000-0000-000000000001', 'Headphones', 'headphones', 'Over-ear and on-ear audiophile acoustic systems featuring hybrid active noise cancellation.', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', 1),
    ('c0000000-0000-0000-0000-000000000002', 'Wireless Earbuds', 'wireless-earbuds', 'True wireless freedom with high-resolution LDAC codec and spatial audio tracking.', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80', 2),
    ('c0000000-0000-0000-0000-000000000003', 'Bluetooth Speakers', 'bluetooth-speakers', 'Rugged, portable sound engineered for room-filling acoustics and outdoor journeys.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80', 3),
    ('c0000000-0000-0000-0000-000000000004', 'Soundbars', 'soundbars', 'Cinematic multi-channel Dolby Atmos soundbars with wireless subwoofers.', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80', 4),
    ('c0000000-0000-0000-0000-000000000005', 'Gaming Headsets', 'gaming-headsets', 'Zero-latency lossless 2.4GHz wireless with broadcast-grade condenser microphones.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80', 5),
    ('c0000000-0000-0000-0000-000000000006', 'Earphones & IEMs', 'earphones', 'Precision balanced armature in-ear monitors for audio engineers and purists.', 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80', 6),
    ('c0000000-0000-0000-0000-000000000007', 'Audio Accessories', 'accessories', 'Premium braided cables, DAC amplifiers, aluminum headphone stands, and memory foam tips.', 'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=800&q=80', 7)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, image_url = EXCLUDED.image_url;

-- 2. SEED PRODUCTS
INSERT INTO public.products (
    id, category_id, name, slug, short_description, description, base_price, sale_price, main_image, gallery_images,
    is_active, is_featured, is_new_arrival, is_best_seller, rating, review_count, features, specifications
) VALUES
-- Product 1: SoundWave Apex Pro ANC Headphones
(
    'p0000000-0000-0000-0000-000000000001',
    'c0000000-0000-0000-0000-000000000001',
    'SoundWave Apex Pro ANC Headphones',
    'soundwave-apex-pro-anc',
    'Flagship wireless over-ear headphones with adaptive hybrid noise cancellation and 40mm bio-cellulose drivers.',
    'Engineered for true audiophiles and discerning listeners. The SoundWave Apex Pro delivers uncompromising high-fidelity acoustic reproduction with custom 40mm bio-cellulose dynamic drivers. Features advanced quad-microphone adaptive active noise cancellation that cancels up to 45dB of ambient noise. Enjoy up to 60 hours of continuous wireless playback on a single charge with fast-charging USB-C capabilities.',
    349.99,
    299.99,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, TRUE, FALSE, TRUE, 4.9, 142,
    '["Hybrid 45dB Adaptive Active Noise Cancellation", "Custom 40mm Bio-Cellulose Drivers", "60-Hour Battery Life with USB-C Quick Charge", "Lossless Bluetooth 5.4 with LDAC & aptX HD", "Ultra-plush lambskin memory foam ear cushions"]'::jsonb,
    '{"Driver Size": "40mm Bio-Cellulose", "Frequency Response": "10Hz - 45,000Hz", "Impedance": "32 Ohms", "Battery Life": "60h (ANC off) / 45h (ANC on)", "Weight": "265g", "Bluetooth Codecs": "LDAC, AAC, SBC, aptX HD"}'::jsonb
),
-- Product 2: SoundWave Pulse True Wireless Earbuds
(
    'p0000000-0000-0000-0000-000000000002',
    'c0000000-0000-0000-0000-000000000002',
    'SoundWave Pulse Earbuds Pro',
    'soundwave-pulse-earbuds-pro',
    'Compact true wireless earbuds with dynamic head tracking, IPX7 waterproof rating, and Qi wireless charging.',
    'Experience sound that moves with you. The SoundWave Pulse Earbuds Pro deliver spatial 360-degree theater audio in a compact, ergonomic in-ear footprint. Dual beryllium drivers reproduce deep, controlled sub-bass and glistening acoustic highs. Designed with sweat and weather-resistant IPX7 construction, smart gesture controls, and 36 hours total listening time with the companion aluminum charging case.',
    199.99,
    169.99,
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, TRUE, TRUE, FALSE, 4.8, 89,
    '["Spatial 360-degree Dynamic Audio", "Dual Beryllium Dynamic Drivers", "IPX7 Sweat and Water Resistance", "Wireless Qi Fast Charging Case", "Dual Beamforming Mics with AI Wind Suppression"]'::jsonb,
    '{"Driver": "11mm Beryllium Dynamic", "Frequency Response": "15Hz - 28,000Hz", "Battery": "9h earbuds + 27h case", "Charging": "USB-C & Qi Wireless", "Waterproof Rating": "IPX7", "Bluetooth": "5.3"}'::jsonb
),
-- Product 3: SonicCinema Dolby Atmos 5.1.2 Soundbar
(
    'p0000000-0000-0000-0000-000000000003',
    'c0000000-0000-0000-0000-000000000004',
    'SonicCinema 5.1.2 Dolby Atmos Soundbar',
    'soniccinema-dolby-atmos-soundbar',
    'Immersive home theater acoustic soundbar system with wireless 8-inch subwoofer and upward-firing elevation drivers.',
    'Transform your living room into an acoustic sanctuary. The SonicCinema Soundbar features 9 custom discrete drivers including dedicated upward-firing height channels certified for Dolby Atmos and DTS:X. Paired seamlessly with a wireless down-firing 8-inch 200W subwoofer that produces bone-shaking low frequencies down to 28Hz. Equipped with eARC HDMI 2.1, AirPlay 2, and Spotify Connect.',
    599.99,
    499.99,
    'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, TRUE, FALSE, TRUE, 5.0, 56,
    '["Dolby Atmos & DTS:X 5.1.2 Surround", "Wireless 8-inch 200W Powered Subwoofer", "HDMI eARC 4K HDR Pass-through", "Acoustic Room Calibration Microphone", "Wi-Fi, AirPlay 2 & Bluetooth 5.2 Streaming"]'::jsonb,
    '{"Total Power": "450W RMS", "Channels": "5.1.2 Discrete", "Subwoofer": "8-inch Wireless Ported", "Connectivity": "HDMI eARC, Optical, AUX, Wi-Fi", "Dimensions": "1040 x 65 x 110 mm"}'::jsonb
),
-- Product 4: SonicRoam Rugged Bluetooth Speaker
(
    'p0000000-0000-0000-0000-000000000004',
    'c0000000-0000-0000-0000-000000000003',
    'SonicRoam 360 Bluetooth Speaker',
    'sonicroam-360-speaker',
    'All-weather 360-degree portable audio powerhouse with dual passive radiators and 24-hour continuous battery.',
    'Built for outdoor journeys and indoor clarity. The SonicRoam 360 disperses rich, immersive sound in every direction thanks to opposing dual passive radiators and twin neodymium drivers. Features a ruggedized shock-absorbent silicone bumper, IP67 waterproof & dustproof housing, and reverse USB-A charging to power up your mobile devices while on the go.',
    149.99,
    129.99,
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, FALSE, TRUE, FALSE, 4.7, 73,
    '["360-Degree Omnidirectional Sound Field", "IP67 Submersible Waterproof & Dustproof", "24-Hour Battery Life with Power Bank Output", "PartySync: Pair up to 50 SonicRoam speakers", "Integrated Aircraft-Grade Aluminum Carabiner"]'::jsonb,
    '{"Output Power": "40W Peak", "Battery": "6000mAh Lithium-Ion (24h)", "Waterproof": "IP67", "Bluetooth": "5.4 LE Audio", "Weight": "680g"}'::jsonb
),
-- Product 5: SonicStrike Pro Wireless Gaming Headset
(
    'p0000000-0000-0000-0000-000000000005',
    'c0000000-0000-0000-0000-000000000005',
    'SonicStrike Pro Wireless Headset',
    'sonicstrike-pro-gaming-headset',
    'Ultra-low latency 2.4GHz wireless gaming headset with 50mm planar magnetic drivers and detachable broadcast microphone.',
    'Hear every footstep and cinematic explosion with pinpoint acoustic accuracy. The SonicStrike Pro utilizes 50mm planar magnetic drivers rarely found in gaming headsets, delivering near-zero harmonic distortion and lightning-fast transient response. Complete with simultaneous 2.4GHz USB-C dongle connection and Bluetooth 5.3 for mobile calls.',
    229.99,
    199.99,
    'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, FALSE, TRUE, TRUE, 4.9, 115,
    '["50mm Planar Magnetic Audio Drivers", "Lossless 2.4GHz Wireless with <15ms Latency", "Detachable 9.7mm Broadcast Condenser Mic", "Dual-Wireless: Connect to PC & Phone simultaneously", "Cooling Gel-infused Breathable Ear Cushions"]'::jsonb,
    '{"Drivers": "50mm Planar Magnetic", "Frequency Response": "12Hz - 32,000Hz", "Latency": "<15ms via 2.4GHz", "Battery Life": "50 Hours", "Weight": "310g", "Compatibility": "PC, PS5, Xbox, Switch, Mac, Mobile"}'::jsonb
),
-- Product 6: SonicClarion Audiophile In-Ear Monitors
(
    'p0000000-0000-0000-0000-000000000006',
    'c0000000-0000-0000-0000-000000000006',
    'SonicClarion IEM Reference Earphones',
    'sonicclarion-iem-reference',
    'Quad-driver hybrid in-ear monitors with 3 balanced armatures, 1 dynamic driver, and silver-plated MMCX cable.',
    'A masterpiece of acoustic micro-engineering. The SonicClarion combines a custom 10mm graphene dynamic driver for visceral sub-bass with 3 Knowles balanced armatures for hyper-detailed mid frequencies and crystalline vocal imaging. Encased in medical-grade 3D printed resin acoustic chambers with interchangeable acoustic tuning nozzles.',
    279.99,
    NULL,
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, FALSE, FALSE, FALSE, 4.8, 38,
    '["1 Dynamic + 3 Knowles Balanced Armatures", "3 Interchangeable Acoustic Tuning Nozzles", "Silver-Plated Monocrystalline Copper Cable", "Detachable MMCX Connectors", "Passive Noise Isolation up to -26dB"]'::jsonb,
    '{"Configuration": "4-Driver Hybrid", "Sensitivity": "112dB SPL/mW", "Impedance": "18 Ohms", "Connector": "0.78mm 2-Pin / MMCX", "Cable": "4-Core Silver Plated Copper"}'::jsonb
),
-- Product 7: SonicStand Precision Headphone Stand & Wireless Pad
(
    'p0000000-0000-0000-0000-000000000007',
    'c0000000-0000-0000-0000-000000000007',
    'SonicStand Aluminum Headphone Cradle',
    'sonicstand-aluminum-headphone-cradle',
    'Machined aircraft-grade aluminum headphone stand with weighted base and integrated 15W Qi fast wireless charger.',
    'Elevate your desk setup with an acoustic showcase. Crafted from solid CNC-machined anodized aluminum, the SonicStand protects your headphone headband curvature with a contoured silicone rest. The weighted base incorporates a 15W Qi wireless charging pad to recharge your phone or wireless earbuds case while you listen.',
    79.99,
    64.99,
    'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=1000&q=80',
    ARRAY[
        'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=1000&q=80'
    ],
    TRUE, FALSE, FALSE, FALSE, 4.9, 61,
    '["Solid CNC Machined Aircraft-Grade Aluminum", "15W Qi Fast Wireless Charging Base", "Curved Silicone Headband Protection Cradle", "Weighted Anti-Slip Base with Cable Routing"]'::jsonb,
    '{"Material": "6061 Aluminum & Silicone", "Wireless Charging": "15W / 10W / 7.5W Qi", "Input": "USB-C PD 20W+", "Height": "275 mm", "Weight": "520g"}'::jsonb
)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description, base_price = EXCLUDED.base_price, sale_price = EXCLUDED.sale_price;

-- 3. SEED PRODUCT VARIANTS (Functional colors, swatches, SKUs, inventory)
INSERT INTO public.product_variants (
    product_id, color_name, color_hex, sku, price, image_url, stock_quantity, is_active
) VALUES
-- Apex Pro variants
('p0000000-0000-0000-0000-000000000001', 'Obsidian Black', '#111111', 'SW-APX-BLK', NULL, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80', 45, TRUE),
('p0000000-0000-0000-0000-000000000001', 'Arctic White', '#F4F4F6', 'SW-APX-WHT', NULL, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80', 28, TRUE),
('p0000000-0000-0000-0000-000000000001', 'Midnight Navy', '#1A233A', 'SW-APX-NVY', NULL, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80', 14, TRUE),

-- Pulse Earbuds variants
('p0000000-0000-0000-0000-000000000002', 'Matte Black', '#18181B', 'SW-PLS-BLK', NULL, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80', 60, TRUE),
('p0000000-0000-0000-0000-000000000002', 'Pearl White', '#FAFAFA', 'SW-PLS-WHT', NULL, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=1000&q=80', 35, TRUE),
('p0000000-0000-0000-0000-000000000002', 'Electric Orange', '#FF5500', 'SW-PLS-ORG', NULL, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80', 12, TRUE),

-- Soundbar variants
('p0000000-0000-0000-0000-000000000003', 'Charcoal Anthracite', '#27272A', 'SW-CNM-CHR', NULL, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80', 20, TRUE),
('p0000000-0000-0000-0000-000000000003', 'Brushed Titanium', '#71717A', 'SW-CNM-TIT', 529.99, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80', 8, TRUE),

-- Speaker variants
('p0000000-0000-0000-0000-000000000004', 'Storm Black', '#09090B', 'SW-ROAM-BLK', NULL, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80', 50, TRUE),
('p0000000-0000-0000-0000-000000000004', 'Blaze Orange', '#EA580C', 'SW-ROAM-ORG', NULL, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80', 25, TRUE),
('p0000000-0000-0000-0000-000000000004', 'Alpine Teal', '#0D9488', 'SW-ROAM-TEA', NULL, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1000&q=80', 18, TRUE),

-- Gaming Headset variants
('p0000000-0000-0000-0000-000000000005', 'Cyber Stealth', '#18181B', 'SW-STRK-BLK', NULL, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1000&q=80', 32, TRUE),
('p0000000-0000-0000-0000-000000000005', 'Solar Orange', '#FF5500', 'SW-STRK-ORG', NULL, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=1000&q=80', 15, TRUE),

-- IEM variants
('p0000000-0000-0000-0000-000000000006', 'Crystal Smoke', '#3F3F46', 'SW-CLR-SMK', NULL, 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80', 20, TRUE),
('p0000000-0000-0000-0000-000000000006', 'Amber Gold', '#D97706', 'SW-CLR-GLD', NULL, 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80', 9, TRUE),

-- Stand variants
('p0000000-0000-0000-0000-000000000007', 'Space Gray', '#27272A', 'SW-STND-GRY', NULL, 'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=1000&q=80', 40, TRUE),
('p0000000-0000-0000-0000-000000000007', 'Silver Anodized', '#E4E4E7', 'SW-STND-SLV', NULL, 'https://images.unsplash.com/photo-1584679109597-c656b19974c9?auto=format&fit=crop&w=1000&q=80', 30, TRUE)
ON CONFLICT (sku) DO UPDATE
SET stock_quantity = EXCLUDED.stock_quantity;

-- 4. SEED COUPONS
INSERT INTO public.coupons (code, discount_type, discount_value, min_spend, is_active)
VALUES 
    ('SONIC10', 'percentage', 10.00, 50.00, TRUE),
    ('AUDIO50', 'fixed', 50.00, 300.00, TRUE),
    ('VIPWAVE', 'percentage', 15.00, 100.00, TRUE)
ON CONFLICT (code) DO NOTHING;
