import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function validateIPv4(ip) {
    const regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!regex.test(ip)) return false;

    const parts = ip.split('.');
    return parts.every(part => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}

export function validateIPv6(ip) {
    const regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return regex.test(ip) || ip === '::1';
}

export function validateIP(ip) {
    return validateIPv4(ip) || validateIPv6(ip);
}

export function validateDomain(domain) {
    if (!domain || domain.length === 0) return false;
    if (domain.length > 253) return false;

    const regex = /^[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]$/;
    return regex.test(domain) || domain === 'localhost';
}
