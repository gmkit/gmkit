export const req = {
  get(url: string) {
    return fetch(url).then((response) => response.json());
  },

  post(url: string, body: any) {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
    }).then((response) => response.json());
  },

  delete(url: string) {
    return fetch(url, { method: 'DELETE' }).then((response) => response.json());
  },
};
