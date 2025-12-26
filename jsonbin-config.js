// JSONBin.io Configuration
// https://jsonbin.io adresinden ücretsiz hesap oluşturun ve aşağıdaki bilgileri doldurun

const JSONBIN_CONFIG = {
    // JSONBin.io API Key (Dashboard > API Keys bölümünden alın)
    apiKey: '$2a$10$.kyqiHUyso1851v.r5t3d.zgUcAVqQV7dOx9OWVQNPaZTcraWFm36',

    // Bin ID (Yeni bir bin oluşturduğunuzda alacağınız ID)
    // Örnek: '65a1b2c3d4e5f6g7h8i9j0k1'
    binId: '694e32fe43b1c97be905c64d',

    // API Endpoint (Değiştirmeyin)
    apiUrl: 'https://api.jsonbin.io/v3/b'
};

// JSONBin.io bağlantı kontrolü
function isJSONBinConfigured() {
    return JSONBIN_CONFIG.apiKey !== 'YOUR_API_KEY_HERE' &&
        JSONBIN_CONFIG.binId !== 'YOUR_BIN_ID_HERE' &&
        JSONBIN_CONFIG.apiKey.length > 0 &&
        JSONBIN_CONFIG.binId.length > 0;
}
