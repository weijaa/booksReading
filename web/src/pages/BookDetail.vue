<template>
  <div class="page">
    <nav class="breadcrumb">
      <router-link to="/" class="back-link">← 書單</router-link>
      <span v-if="activeChapter" class="sep">›</span>
      <span v-if="activeChapter" class="crumb-current">{{ activeChapter.title }}</span>
    </nav>

    <div v-if="book">
      <!-- Chapter content view -->
      <template v-if="activeChapter">
        <header class="book-header">
          <button class="back-chapter" @click="activeChapter = null">← 回到章節列表</button>
          <h1>{{ activeChapter.title }}</h1>
        </header>
        <div v-if="chapterLoading" class="loading">載入中…</div>
        <div v-else-if="chapterError" class="error">{{ chapterError }}</div>
        <div v-else class="markdown-body" v-html="chapterHtml" />
      </template>

      <!-- Book overview -->
      <template v-else>
        <header class="book-header">
          <h1>{{ book.title }}</h1>
          <div class="book-tags">
            <span v-if="book.notePath" class="tag tag-notes">筆記</span>
            <span v-if="book.chapters.length" class="tag tag-chapters">章節 ×{{ book.chapters.length }}</span>
            <span v-if="book.slides.length" class="tag tag-slides">投影片 ×{{ book.slides.length }}</span>
          </div>
        </header>

        <!-- Chapters Section -->
        <section v-if="book.chapters.length" class="section">
          <h2>章節</h2>
          <div class="chapter-list">
            <button
              v-for="ch in book.chapters"
              :key="ch.publicPath"
              class="chapter-link"
              @click="openChapter(ch)"
            >
              <span class="chapter-title">{{ ch.title }}</span>
              <span class="chapter-icon">→</span>
            </button>
          </div>
        </section>

        <!-- Slides Section -->
        <section v-if="book.slides.length" class="section">
          <h2>投影片</h2>
          <div class="slides-list">
            <a
              v-for="slide in book.slides"
              :key="slide.publicPath"
              :href="assetUrl(slide.publicPath)"
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
        <section v-if="book.notePath && book.chapters.length === 0" class="section">
          <h2>筆記</h2>
          <div v-if="noteLoading" class="loading">載入中…</div>
          <div v-else-if="noteError" class="error">{{ noteError }}</div>
          <div v-else-if="noteEmpty" class="empty">尚無筆記內容</div>
          <div v-else class="markdown-body" v-html="noteHtml" />
        </section>
      </template>
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
const base = import.meta.env.BASE_URL

interface Chapter { title: string; publicPath: string }
const activeChapter = ref<Chapter | null>(null)
const chapterHtml = ref('')
const chapterLoading = ref(false)
const chapterError = ref('')

const book = computed(() => {
  const id = decodeURIComponent(route.params.id as string)
  return manifest.books.find(b => b.id === id) ?? null
})

function assetUrl(p: string) {
  return base + p.slice(1)
}

async function loadMarkdown(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

async function loadNote() {
  if (!book.value?.notePath || book.value.chapters.length > 0) return
  noteLoading.value = true
  noteError.value = ''
  noteEmpty.value = false
  try {
    const text = await loadMarkdown(assetUrl(book.value.notePath))
    if (!text.trim()) {
      noteEmpty.value = true
    } else {
      noteHtml.value = await marked.parse(text)
    }
  } catch {
    noteError.value = '無法載入筆記'
  } finally {
    noteLoading.value = false
  }
}

async function openChapter(ch: Chapter) {
  activeChapter.value = ch
  chapterHtml.value = ''
  chapterError.value = ''
  chapterLoading.value = true
  try {
    const text = await loadMarkdown(assetUrl(ch.publicPath))
    chapterHtml.value = await marked.parse(text)
  } catch {
    chapterError.value = '無法載入章節內容'
  } finally {
    chapterLoading.value = false
  }
}

onMounted(() => {
  activeChapter.value = null
  loadNote()
})
watch(book, () => {
  activeChapter.value = null
  loadNote()
})
</script>

<style scoped>
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.back-link {
  color: #6ab0f5;
  text-decoration: none;
}
.back-link:hover { text-decoration: underline; }

.sep { color: #555; }
.crumb-current { color: #888; }

.book-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #333;
}

.back-chapter {
  background: none;
  border: none;
  color: #6ab0f5;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
  margin-bottom: 0.8rem;
  display: block;
}
.back-chapter:hover { text-decoration: underline; }

.book-header h1 {
  font-size: 1.7rem;
  font-weight: 700;
  color: #f0f0f0;
  margin: 0 0 0.8rem;
  line-height: 1.4;
}

.book-tags { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.tag {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-weight: 500;
}
.tag-notes   { background: #1e3a2f; color: #5cde9a; border: 1px solid #2d5a40; }
.tag-chapters{ background: #2a1e3f; color: #b48ef5; border: 1px solid #4a2e70; }
.tag-slides  { background: #1a2e4a; color: #6ab0f5; border: 1px solid #2a4a70; }

.section { margin-bottom: 2.5rem; }
.section h2 {
  font-size: 1.1rem;
  color: #aaa;
  font-weight: 600;
  margin: 0 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chapter-list, .slides-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chapter-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #242424;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s, background 0.15s;
}
.chapter-link:hover { border-color: #b48ef5; background: #2a1e3f; }

.chapter-title { color: #e0e0e0; font-size: 0.95rem; }
.chapter-icon  { color: #b48ef5; font-size: 1.1rem; }

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
.slide-link:hover { border-color: #6ab0f5; background: #1a2e4a; }
.slide-chapter { color: #e0e0e0; font-size: 0.95rem; }
.slide-icon    { color: #6ab0f5; font-size: 1.1rem; }

.loading, .empty { color: #888; font-size: 0.95rem; padding: 1rem 0; }
.error { color: #e06c75; font-size: 0.95rem; padding: 1rem 0; }
</style>

<style>
.markdown-body {
  color: #ccc;
  line-height: 1.8;
  font-size: 0.95rem;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3 { color: #f0f0f0; margin-top: 1.8rem; margin-bottom: 0.6rem; }
.markdown-body h1 { font-size: 1.5rem; }
.markdown-body h2 { font-size: 1.2rem; border-bottom: 1px solid #333; padding-bottom: 0.3rem; }
.markdown-body h3 { font-size: 1rem; }
.markdown-body p  { margin: 0.8rem 0; }
.markdown-body ul,
.markdown-body ol { padding-left: 1.5rem; margin: 0.8rem 0; }
.markdown-body li { margin: 0.3rem 0; }
.markdown-body code {
  background: #2a2a2a; color: #e5c07b;
  padding: 0.1em 0.4em; border-radius: 3px; font-size: 0.9em;
}
.markdown-body pre {
  background: #1e1e1e; border: 1px solid #333;
  border-radius: 6px; padding: 1rem; overflow-x: auto;
}
.markdown-body pre code { background: none; padding: 0; color: #abb2bf; }
.markdown-body blockquote {
  border-left: 3px solid #555; margin: 1rem 0;
  padding: 0.5rem 1rem; color: #999;
}
.markdown-body a { color: #6ab0f5; }
.markdown-body table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
.markdown-body th,
.markdown-body td { border: 1px solid #333; padding: 0.5rem 0.8rem; text-align: left; }
.markdown-body th { background: #2a2a2a; color: #ddd; }
.markdown-body img { max-width: 100%; border-radius: 4px; }
</style>
