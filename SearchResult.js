class SearchResult {
  constructor(url, title, summary) {
    this.url = (url || '').trim();
    this.title = (title || '').trim();
    this.summary = (summary || '').trim();
  }

  isComplete() {
    return this.url && this.title && this.summary;
  }
}

module.exports = SearchResult;
