function base64urlEncode(data: string): string {
    const encodedData = btoa(unescape(encodeURIComponent(data)));
    return encodedData
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function generateJWT(payload: object, secret: string | ArrayBuffer, expiresIn?: number): Promise<string> {
    // Header
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const encodedHeader = base64urlEncode(JSON.stringify(header));

    // Payload
    const now = Math.floor(Date.now() / 1000);
    const exp = expiresIn ? now + expiresIn : undefined; // Expiration time
    const payloadWithExp = { ...payload, exp };
    const encodedPayload = base64urlEncode(JSON.stringify(payloadWithExp));

    // Signature
    const key = await window.crypto.subtle.importKey(
        'raw',
        typeof secret === 'string' ? new TextEncoder().encode(secret) : secret,
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
    );
    const signature = await window.crypto.subtle.sign(
        'HMAC',
        key,
        new TextEncoder().encode(encodedHeader + '.' + encodedPayload)
    );
    const decoder = new TextDecoder('utf-8');
    const encodedSignature = base64urlEncode(decoder.decode(signature));  
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export { generateJWT };
