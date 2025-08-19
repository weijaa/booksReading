# Kent Beck的實作模式

---

## 第三章 一種程式設計理論

---

## Why 需要程式設計理論

- 不論多詳細的模式清單，都不可能涵蓋程式設計中的所有情境，因此需要有 "針對特定問題的通用解決方案"
- 知道如何做&為何去做的那種**胸有成竹**的感覺

---

- 本章把貫穿於程式設計中的橫切概念分為兩類
    - 價值觀
    - 原則

---

## 價值觀
- 溝通
- 簡單
- 靈活

---

## 溝通
- 程式容易理解並且去做更改代表溝通效果好
- 文學式的程式
- 明確地考慮社會因素

---

## 簡單
- 程式的複雜有兩種
    - 要解決的問題真得複雜
    - 開發過程弄出來的腳印
- 要把讀者放心裡
- 有時候簡化會導致溝通變難，那要先考慮溝通
    - 通常代表有大規模簡化空間

---

## 靈活
- 只有會有變化時才需要靈活
- 增進軟體溝通也能提高靈活性

---

## 原則
- 模式的基礎
- 在未碰過的情況，導引方向

---

## 局部化影響
- 改 code 保證只會有局部影響
- 減少變化引起的代價

---

## 最小化重複
- 變動才能縮小範圍
- 大邏輯和其他大邏輯容易產生重複 => 模式誕生

---

## 將邏輯與資料綑綁
- 開發過程往往會發現資料和邏輯離得很遠
    - 要思考如何改

---

## 對稱性
- 無論在甚麼地方，都以同樣型式呈現

----

## 對稱性
- 缺少對稱性
```
void process(){
    input();
    count++;
    output();
}
```

----

## 對稱性
- 根據原則重寫 ( 以實作命名 )
```
void process(){
    input();
    incrementCount();
    output();
}
```

----

## 對稱性
- 實作背後的意圖
```
void process(){
    input();
    tally(); //計算,計點,得分
    output();
}
```

---

## 宣告式的表達
- JUnit 透過註記(@)來表示測試案例

---

## 變化率
- 依照變化率分開，機率相近的放一起
- 稅務軟體
    - 通用稅金
    - 某年特定稅金

----

- 設定金融票據數值
- 數值和幣種應該同時變化
```
setAmount(int value, String currency){
    this.value = value;
    this.currency = currency;
}
```

----

- 處理 code smell
```
setAmount(int value, String currency){
    this.value = new Money(value, currency);
}
```
```
setAmount(Money money){
    this.value = money;
}
```

---

## 總結

- 溝通, 靈活, 簡單 3 大核心價值觀引導出 6 條原則
- 下一章節會來探討透過程式碼與人溝通的價值


---

## 方法回傳型別(Method Return Type)

----

## 1️⃣ 方法的回傳型別代表什麼？

- 方法的回傳型別 **首先表明**：
  - 它是一個 **程序（Procedure）**（依靠副作用運作）
  - 還是一個 **函式（Function）**（回傳一個特定型別的值）

----

## 2️⃣ 回傳型別應該怎麼選？

- 假設你正在撰寫一個「函式」，那麼：
  - **請選擇一個能清楚表達你意圖的回傳型別**
  - 有時你希望明確表達，就是某個具體類別（Concrete Class）或原始型別（Primitive Type）

----

## 3️⃣ 越抽象越好？

- 為了讓方法更通用、更容易重構：
  - **選擇最抽象但仍能表達意圖的回傳型別**
  - 這樣即使日後需要變更實作，也能保有彈性

----

## 4️⃣ 抽象型別的好處？

- **隱藏實作細節**：
  - 例如：與其回傳 `List`，不如回傳 `Collection`
  - 這可以提醒使用者不要假設「順序一定固定」

----

## 5️⃣ 隨著演進，回傳型別會改變

- 一開始可能回傳某個具體類別
- 後來發現多個方法各自回傳不同的具體類別，但它們其實有共同介面
- 這時可以：
  - 宣告這個共通介面（若原本沒有）
  - 改為回傳這個介面
  - **好處：幫助讀者理解方法之間的共通性**

---

## 方法註解 ( Method Comment )

----

- 盡量透過 **命名與結構** 傳達意圖
- 註解只應補充**程式碼難以表達**的資訊
- javadoc / XML-doc 註解可用來說明：
  - 類別的責任
  - 方法的用途與限制

----

## ⚠️ 不良註解常見問題

- 🚫 **重複程式內容**（沒有附加價值）
- 🧯 **不一致風險高**（容易忘了更新）
- 🌀 **抽象層級尷尬**
  - 例如：「方法 A 要在方法 B 之前呼叫」，這種邏輯很難註解清楚

----

## ✅ 更好的替代方案：自動化測試

- 測試可以描述：
  - 限制條件（ex. 呼叫順序）
  - 方法間的契約（ex. 會拋出哪些例外）
- **好處**：
  - 測試寫在程式碼內，會一起演進
  - 重構時可以依靠工具維護
  - 測試**永遠比註解更能保證正確性**


---

## 助手方法 ( Helper Method )

----

## 💡 為什麼使用 Helper Method？

1. **提升可讀性：**  
   將細節邏輯抽出，使主流程更清晰易懂。

2. **透過方法名稱表達意圖：**  
   例如 `calculateTotal()` 比一段匿名邏輯更容易理解。

----

## 💡 為什麼使用 Helper Method？

3. **封裝重複邏輯，便於維護：**  
   相同邏輯重複出現在程式中，應該抽出成 Helper Method。

4. **提升可測性與重用性：**  
   即使是 `private` 方法，也可能未來需要對外開放使用。

5. **為子類提供擴充點：**  
   初期用 `private`，如果類別需要被繼承，則改為 `protected`。

----

## ⚠️ 使用時的注意事項

1. **避免過度封裝：**  
   太短的方法可能沒有必要。  
   範例：

```java
   // 比較直觀的寫法
   return testClass.getConstructor().newInstance();

   // 過度封裝（可能不必要）
   return getTestConstructor().newInstance();
```

---

## 除厝輸出方法 ( Debug Print Method )

----

## 🐞 Debug Print Method 說明整理

在開發過程中，將物件轉換成字串有許多潛在用途，例如：

- 呈現給使用者看
- 儲存為日後檢索用的格式
- 顯示給開發者以便除錯

----

## 🔧 `toString()` 的多重用途與風險

Java 的 `Object` 類別包含 11 個方法，其中的 `toString()` 被用來將物件轉換為字串。

----

但要注意：

- **不同目的下的轉換格式不同**
  - 使用者介面要「美觀」；
  - 程式設計師要「結構清楚」；
  - 資料庫需要「格式一致」。
- **試圖滿足多種需求會導致妥協失敗**

因此： **不要企圖讓 `toString()` 同時滿足所有目的。**

----

## ✅ 為除錯而設計的 `toString()` 是值得投資的

- 在除錯時快速查看內部資訊比用滑鼠點擊查找快得多。
- 範例：一鍵顯示重要狀態 > 花 30 秒在 IDE 展開結構。

良好的 `toString()` 實作可節省數分鐘甚至數小時的除錯時間。

----

## ⚠️ toString() 是公開方法 → 容易被濫用

- 某些開發者會**解析 `toString()` 的輸出來取得資料**（例如用正則表達式抓取內容）。
- 這是非常 **脆弱的做法**，因為 `toString()` 常會改動。

----

### 💡 正確的做法：

1. **讓物件提供正確的存取協定（方法）：**
   - 不要讓別人非得用 `toString()` 來「偷看」資料。
   - 提供明確的方法，如 `getInternalState()`。

2. **toString() 應專注於開發者友好的除錯資訊**

3. **其他輸出需求應使用其他方法或類別實作**

----

## 🔁 實作策略建議

| 目的 | 建議方法 |
|------|-----------|
| 除錯用輸出 | `toString()` |
| 呈現給使用者 | `renderForUser()` 或 View 專用 class |
| 儲存/序列化 | `toJson()`, `toXml()`, 或 DTO 類別處理 |

----

## 🧠 小結

- `toString()` 是除錯的利器，但不是萬能。
- 不要用它同時滿足 UI、儲存與開發需求。
- 實作乾淨明確的協定方法，讓其他人不需要「解析字串」來用你的物件。

---

## 轉換 ( Conversion )

----

### 🔄 Conversion（物件轉換）

- 有時你擁有物件 A，但接下來的運算卻需要物件 B。這時就需要「轉換（conversion）」的設計方式。

----

## 🎯 Conversion 的目標

**清楚表達程式設計者的意圖。**

但這個轉換該怎麼實作？什麼時候該用哪種方式？以下幾點是選擇時的重要考量。

----

### 1. 🔁 轉換數量
- **只需轉換成一種型別：**
  - 可以用簡單的 `.toX()` 方法處理。
  - 例如：
    ```java
    Money toMoney() { ... }
    ```

----

- **可能轉換成多種型別：**
  - 應考慮使用 **轉換器類別（Converter class）** 或 **轉換服務（Converter Service）**。
  - 例如：
    ```java
    MoneyConverter.convert(orderPrice);
    ```

----

### 2. 🔗 類別間的相依性
- **不要為了轉換而創造不必要的依賴關係。**

----

### Entity 依賴 Dto
```
public class UserEntity
{
    public string Name { get; set; }
    public int Age { get; set; }

    // 加入轉換方法，依賴了 DTO（不該知道上層的型別）
    public UserDto ToDto()
    {
        return new UserDto
        {
            Name = this.Name,
            Age = this.Age
        };
    }
}
```

```
public class UserDto
{
    public string Name { get; set; }
    public int Age { get; set; }
}

```

---

## 轉換方法 ( Conversion Method )

----

當你需要在**類型相似的物件之間轉換**，而且轉換數量有限時，建議直接在**來源物件（source object）**上實作轉換方法。

----

```
public class Person
{
    public string Name { get; set; }
    public int Age { get; set; }

    // 轉換方法：將 Person 轉換為 Employee
    public Employee ToEmployee(string employeeId)
    {
        return new Employee
        {
            Name = this.Name,
            Age = this.Age,
            EmployeeId = employeeId
        };
    }
}
```

```
public class Employee
{
    public string Name { get; set; }
    public int Age { get; set; }
    public string EmployeeId { get; set; }
}
```

----

## 優點
- 方便好用
- eclipse 裡面時做了一百種轉換方法

----

## 缺點
- 物件可能會有不必要的依賴
- 物件會變笨拙 ( 一堆 toA(), tB(), toC()...)

---

## 轉換建構函式 ( Conversion Constructor ) 

----

## 📘 定義

- **Conversion Constructor** 是一種建構子，它接受一個「來源物件」作為參數，並建立出「目的物件」。
- 這種方式非常適合當**單一來源物件**（例如 `String`）需要被轉換為**多種目的類型**的情況。

----

## ✅ 優點

- 📦 **集中轉換邏輯於目的物件中**，而非來源物件。
- 🔄 **不污染來源類別的**（例如 `String.asFile()`, `String.asUrl()` 方法）。
``` java
  File file = new File("data.txt");
  URL url = new URL("https://example.com");
```

----

## 工廠方法
- 不必回傳具體類別
- 更自由