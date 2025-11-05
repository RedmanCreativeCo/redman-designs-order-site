-- Update Christmas Ornament - single name only
UPDATE products 
SET customization_rules = '{"max_names": 1, "max_chars_per_name": 30, "allow_special_chars": false, "placeholder": "Enter name"}'
WHERE barcode = 'XMAS-ORN-001';

-- Update Wooden Sign - 6 names
UPDATE products 
SET customization_rules = '{"max_names": 6, "max_chars_per_name": 20, "allow_special_chars": false, "placeholder": "Enter family member names"}'
WHERE barcode = 'SIGN-WOOD-001';
