export const getWebSocketUrl = (token: string): string => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  let wsUrl = import.meta.env.VITE_WS_URL;

  if (!wsUrl) {
    const apiURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
    if (apiURL.startsWith('http://') || apiURL.startsWith('https://')) {
      wsUrl = apiURL.replace(/^http/, 'ws');
    } else {
      wsUrl = `${wsProtocol}//${window.location.host}${apiURL}`;
    }
  }

  let finalWsUrl = wsUrl;
  if (!finalWsUrl.includes('/ws/pedidos')) {
    if (finalWsUrl.endsWith('/')) {
      finalWsUrl = finalWsUrl.slice(0, -1);
    }
    finalWsUrl = `${finalWsUrl}/ws/pedidos`;
  }
  
  return `${finalWsUrl}?token=${encodeURIComponent(token)}`;
};
