<template>
  <div class="page">
    <header class="site-header">
      <h1>📚 讀書會報告</h1>
      <p class="subtitle">{{ books.length }} 本書</p>
    </header>

    <div class="book-grid">
      <router-link
        v-for="book in books"
        :key="book.id"
        :to="`/book/${encodeURIComponent(book.id)}`"
        class="book-card"
      >
        <div class="book-title">{{ book.title }}</div>
        <div class="book-tags">
          <span v-if="book.notePath" class="tag tag-notes">筆記</span>
          <span v-if="book.chapters.length" class="tag tag-chapters">章節 ×{{ book.chapters.length }}</span>
          <span v-if="book.slides.length" class="tag tag-slides">投影片 ×{{ book.slides.length }}</span>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import manifest from '../data/manifest.json'

const books = manifest.books
</script>

<style scoped>
.page {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.site-header {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 1.5rem;
}

.site-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #f0f0f0;
  margin: 0 0 0.3rem;
}

.subtitle {
  color: #888;
  font-size: 0.95rem;
  margin: 0;
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.book-card {
  display: block;
  text-decoration: none;
  background: #242424;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1.2rem 1.4rem;
  transition: border-color 0.15s, background 0.15s;
}

.book-card:hover {
  border-color: #6ab0f5;
  background: #2a2e35;
}

.book-title {
  color: #e0e0e0;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
  margin-bottom: 0.8rem;
}

.book-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
}

.tag-notes {
  background: #1e3a2f;
  color: #5cde9a;
  border: 1px solid #2d5a40;
}

.tag-chapters {
  background: #2a1e3f;
  color: #b48ef5;
  border: 1px solid #4a2e70;
}

.tag-slides {
  background: #1a2e4a;
  color: #6ab0f5;
  border: 1px solid #2a4a70;
}
</style>
