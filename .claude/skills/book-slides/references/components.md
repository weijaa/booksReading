# Slide 元件參考

## 封面頁

```html
<section class="center">
  <p style="color:#666; font-size:0.9em; margin-bottom:0.5em;">書名</p>
  <h1 style="font-size:3.5em; margin:0;">Chapter N</h1>
  <h2 style="border:none; margin-top:0.3em;">章節標題</h2>
</section>
```

## 本章目標頁

```html
<section>
  <h2>本章目標</h2>
  <ul>
    <li>目標一</li>
    <li>目標二</li>
  </ul>
</section>
```

## 節次分隔頁（section divider）

```html
<section class="center">
  <div class="chapter-title">
    <h1>9-1</h1>
    <h2>節次標題</h2>
  </div>
</section>
```

## 一般內容頁

```html
<section>
  <h2>頁面標題</h2>
  <ul>
    <li><strong>重點</strong> — 說明</li>
  </ul>
</section>
```

## 內容頁（含引言）

```html
<section>
  <h2>頁面標題</h2>
  <ul style="font-size:0.85em;">
    <li>條列一</li>
  </ul>
  <blockquote>核心金句或重要觀念</blockquote>
</section>
```

## 多頁分割（長內容）

```html
<!-- 第一頁 -->
<section>
  <h2>標題 <small style="font-size:0.5em; color:#666;">1/2</small></h2>
  ...
</section>

<!-- 第二頁 -->
<section>
  <h2>標題 <small style="font-size:0.5em; color:#666;">2/2</small></h2>
  ...
</section>
```

## 表格頁

```html
<section>
  <h2>頁面標題</h2>
  <table>
    <thead><tr><th>欄一</th><th>欄二</th></tr></thead>
    <tbody>
      <tr><td>A</td><td>B</td></tr>
    </tbody>
  </table>
</section>
```

## 程式碼頁

```html
<section>
  <h2>頁面標題</h2>
  <pre><code>程式碼內容</code></pre>
  <blockquote>說明或重點</blockquote>
</section>
```

## 實作題目頁

```html
<section class="center">
  <h2 style="border:none;">現場實作</h2>
  <p style="font-size:1.1em; color:#ccc; margin: 1em 0;">題目說明</p>
  <p style="font-size:0.85em; color:#888;">補充提示</p>
</section>
```

## Q&A 結尾頁

```html
<section class="center">
  <h2 style="border:none; font-size:2em;">Q &amp; A</h2>
  <p style="color:#aaa;">謝謝聆聽</p>
</section>
```

## 字體大小速查

| 情境 | font-size |
|------|-----------|
| 預設條列 | 繼承（~1em） |
| 條列稍多 | 0.88em |
| 條列很多 | 0.82em |
| 表格 | 0.85em |
| blockquote | 0.88em（可不設） |
