<template>
  <div class="page">
    <nav class="breadcrumb">
      <router-link to="/" class="back-link">← 書單</router-link>
    </nav>

    <div v-if="book">
      <header class="book-header">
        <h1>{{ book.title }}</h1>
        <div class="book-tags">
          <span v-if="book.notePath" class="tag tag-notes">筆記</span>
          <span v-if="book.slides.length" class="tag tag-slides">投影片 ×{{ book.slides.length }}</span>
        </div>
      </header>

      <!-- Slides Section -->
      <section v-if="book.slides.length" class="section">
        <h2>投影片</h2>
        <div class="slides-list">
          <a
            v-for="slide in book.slides"
            :key="slide.publicPath"
            :href="slide.publicPath"
            target="_blank"
            rel="noopener noreferrer"
            class="slide-link"
          >
            <span class="slide-chapter">{{ slide.chapter }}</span>
            <span class="slide-icon">↗</span>
          </a>
        </div>
      </section>

      <!-- Notes Section -->
      <section v-if="book.notePath" class="section">
        <h2>筆記</h2>
        <div v-if="noteLoading" class="loading">載入中…</div>
        <div v-else-if="noteError" class="error">{{ noteError }}</div>
        <div v-else-if="noteEmpty" class="empty">尚無筆記內容</div>
        <div v-else class="markdown-body" v-html="noteHtml" />
      </section>
    </div>

    <div v-else class="error">找不到書本</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import manifest from '../data/manifest.json'

const route = useRoute()
const noteHtml = ref('')
const noteLoading = ref(false)
const noteError = ref('')
const noteEmpty = ref(false)

const book = computed(() => {
  const id = decodeURIComponent(route.params.id as string)
  return manifest.books.find(b => b.id === id) ?? null
})

async function loadNote() {
  if (!book.value?.notePath) return
  noteLoading.value = true
  noteError.value = ''
  noteEmpty.value = false
  try {
    const res = await fetch(book.value.notePath)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const text = await res.text()
    if (!text.trim()) {
      noteEmpty.value = true
    } else {
      noteHtml.value = await marked.parse(text)
    }
  } catch (e) {
    noteError.value = '無法載入筆記'
  } finally {
    noteLoading.value = false
  }
}

onMounted(loadNote)
watch(book, loadNote)
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.breadcrumb {
  margin-bottom: 1.5rem;
}

.back-link {
  color: #6ab0f5;
  text-decoration: none;
  font-size: 0.9rem;
}

.back-link:hover {
  text-decoration: underline;
}

.book-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #333;
}

.book-header h1 {
  font-size: 1.7rem;
  font-weight: 700;
  color: #f0f0f0;
  margin: 0 0 0.8rem;
  line-height: 1.4;
}

.book-tags {
  display: flex;
  gap: 0.5rem;
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

.tag-slides {
  background: #1a2e4a;
  color: #6ab0f5;
  border: 1px solid #2a4a70;
}

.section {
  margin-bottom: 2.5rem;
}

.section h2 {
  font-size: 1.1rem;
  color: #aaa;
  font-weight: 600;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.slides-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.slide-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #242424;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.8rem 1.2rem;
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}

.slide-link:hover {
  border-color: #6ab0f5;
  background: #1a2e4a;
}

.slide-chapter {
  color: #e0e0e0;
  font-size: 0.95rem;
}

.slide-icon {
  color: #6ab0f5;
  font-size: 1.1rem;
}

.loading, .error, .empty {
  color: #888;
  font-size: 0.95rem;
  padding: 1rem 0;
}

.error {
  color: #e06c75;
}
</style>

<style>
.markdown-body {
  color: #ccc;
  line-height: 1.8;
  font-size: 0.95rem;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  color: #f0f0f0;
  margin-top: 1.8rem;
  margin-bottom: 0.6rem;
}

.markdown-body h1 { font-size: 1.5rem; }
.markdown-body h2 { font-size: 1.2rem; border-bottom: 1px solid #333; padding-bottom: 0.3rem; }
.markdown-body h3 { font-size: 1rem; }

.markdown-body p { margin: 0.8rem 0; }

.markdown-body ul,
.markdown-body ol {
  padding-left: 1.5rem;
  margin: 0.8rem 0;
}

.markdown-body li { margin: 0.3rem 0; }

.markdown-body code {
  background: #2a2a2a;
  color: #e5c07b;
  padding: 0.1em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

.markdown-body pre {
  background: #1e1e1e;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  color: #abb2bf;
}

.markdown-body blockquote {
  border-left: 3px solid #555;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  color: #999;
}

.markdown-body a {
  color: #6ab0f5;
}

.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #333;
  padding: 0.5rem 0.8rem;
  text-align: left;
}

.markdown-body th {
  background: #2a2a2a;
  color: #ddd;
}
</style>
