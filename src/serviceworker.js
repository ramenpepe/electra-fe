// Service Worker script

self.addEventListener('fetch', event => {
  const request = event.request;

  // Check if the request is for an HTTP JSON resource
  if (request.url.startsWith('http://') && request.headers.get('Accept').includes('application/json')) {
    // Proxy the request by making a new HTTPS request to the same resource
    const httpsUrl = request.url.replace('http://', 'https://');
    const proxyRequest = new Request(httpsUrl, { method: request.method, headers: request.headers });

    event.respondWith(
      fetch(proxyRequest)
        .then(response => {
          // Pass the proxied HTTPS response back to the original request
          return response;
        })
        .catch(error => {
          // Handle any errors that occur during the proxying
          console.error('Error proxying request:', error);
          return new Response('Proxying error occurred.', { status: 500 });
        })
    );
  }
});
