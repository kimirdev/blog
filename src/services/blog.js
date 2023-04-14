class BlogService {
  blogapi = 'https://blog.kata.academy/api'

  async fetchArticles(endpoint, method, token, body) {
    const res = await fetch(`${this.blogapi}/articles${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body,
    })
    if (!res.ok) throw new Error(`${res.status}`)

    return res.json()
  }

  async fetchBlog(endpoint, method, token, body) {
    return fetch(`${this.blogapi}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body,
    })
  }
}

export default new BlogService()
