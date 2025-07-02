"""
Phone number utilities for handling Kenyan phone numbers.
Normalizes phone numbers to international format (+254XXXXXXXX).
"""

import re
from typing import Optional


def normalize_kenyan_phone(phone: str) -> Optional[str]:
    """
    Normalize Kenyan phone number to international format (+254XXXXXXXX).
    
    Handles common formats:
    - 0705982249 -> +254705982249
    - 705982249 -> +254705982249
    - +254705982249 -> +254705982249 (no change)
    - 254705982249 -> +254705982249
    
    Args:
        phone: Input phone number string
        
    Returns:
        Normalized phone number in format +254XXXXXXXX or None if invalid
    """
    if not phone:
        return None
    
    # Remove all non-digit characters except +
    cleaned = re.sub(r'[^\d+]', '', phone.strip())
    
    if not cleaned:
        return None
    
    # Handle different formats
    if cleaned.startswith('+254'):
        # Already in international format
        normalized = cleaned
    elif cleaned.startswith('254'):
        # Missing the + sign
        normalized = '+' + cleaned
    elif cleaned.startswith('0'):
        # Replace leading 0 with +254
        normalized = '+254' + cleaned[1:]
    elif len(cleaned) == 9 and cleaned.startswith(('7', '1')):
        # Missing country code and leading 0 (e.g., 705982249)
        normalized = '+254' + cleaned
    else:
        # Unknown format
        return None
    
    # Validate final format: +254 followed by 9 digits
    if re.match(r'^\+254[71]\d{8}$', normalized):
        return normalized
    
    return None


def is_valid_kenyan_phone(phone: str) -> bool:
    """
    Check if phone number is a valid Kenyan phone number.
    
    Args:
        phone: Phone number string
        
    Returns:
        True if valid, False otherwise
    """
    normalized = normalize_kenyan_phone(phone)
    return normalized is not None


def format_phone_for_display(phone: str) -> str:
    """
    Format phone number for display (e.g., +254 705 982 249).
    
    Args:
        phone: Phone number string
        
    Returns:
        Formatted phone number or original string if invalid
    """
    normalized = normalize_kenyan_phone(phone)
    if not normalized:
        return phone
    
    # Format as +254 XXX XXX XXX
    return f"{normalized[:4]} {normalized[4:7]} {normalized[7:10]} {normalized[10:]}"


def get_whatsapp_url(phone: str, message: str = "") -> Optional[str]:
    """
    Generate WhatsApp URL for the given phone number.
    
    Args:
        phone: Phone number string
        message: Optional pre-filled message
        
    Returns:
        WhatsApp URL or None if phone is invalid
    """
    normalized = normalize_kenyan_phone(phone)
    if not normalized:
        return None
    
    # Remove + for WhatsApp URL (WhatsApp expects just digits)
    whatsapp_number = normalized[1:]  # Remove the +
    
    if message:
        import urllib.parse
        encoded_message = urllib.parse.quote(message)
        return f"https://wa.me/{whatsapp_number}?text={encoded_message}"
    
    return f"https://wa.me/{whatsapp_number}"


def get_sms_url(phone: str, message: str = "") -> Optional[str]:
    """
    Generate SMS URL for the given phone number.
    
    Args:
        phone: Phone number string
        message: Optional pre-filled message
        
    Returns:
        SMS URL or None if phone is invalid
    """
    normalized = normalize_kenyan_phone(phone)
    if not normalized:
        return None
    
    if message:
        import urllib.parse
        encoded_message = urllib.parse.quote(message)
        return f"sms:{normalized}?body={encoded_message}"
    
    return f"sms:{normalized}"
