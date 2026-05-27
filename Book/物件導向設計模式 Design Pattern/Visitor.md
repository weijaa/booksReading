# 物件導向設計模式 

## Interpreter (解釋器模式)

### 目的
-  針對標的語言定義出文法，以及可解讀這種語句的解釋器
### 動機
- 某種問題太常出現，就用個一勞永逸的作法 ex: html, css, 搜尋符合某樣式的字串 => 正則表達式(regular expression)
### 使用時機
-  語法很簡單
-  效率不重要
### 結構
![image](https://hackmd.io/_uploads/H1og7YJiR.png)
- AbstractExpression：定義一個在抽象語法樹(Abstract Syntax Tree)中所有節點都有共同的抽象化Interpret操作。
- TerminalExpression：
實現文法中與終結符號相關的轉譯操作。
在一個句子中，終結符號是必須的。
- NonterminalExpression：文法中的每一個規則都代表了一個非終結表達式。
- Context：包含 Interpreter 以外的全域訊息。
- Client：
建立抽象語法樹（Abstract Syntax Tree）者，抽象語法數的組成便是 TerminalExpression 和 NonterminalExpression 的實體。
調用 interpret 操作者。

#### 合作方式
1. **client** 端建立抽象與法樹並初始化 **context** 後交給 interpret() 執行
2. **NonterminalExpression** 做自己的 interpret() , **TerminalExpression** 定義遞迴終止時機
3. 每個節點的 interpret() 會用 context 存取解釋器狀態

### 效果
1. 容易改變及擴充文法
2. 文法也容易製作
3. 複雜的文法很難維護
4. 增加新的解釋方式

### Demo
#### 用四則運算為例子
![image](https://hackmd.io/_uploads/rJcAvjVh0.png)


---

## Visitor (訪問者模式)

### 目的
- 訪問者模式( Visitor )，表示一個作用於某物件結構中的各元素之操作。它使你可以再不改變各元素之類別的前提之下，定義作用於這些元素的新操作。
### 動機
- 程式類別散落在各個節點，系統難以理解和維護 -> 使用 visitor 把操作抽取出來做
### 使用時機
- 物件含有多個介面各異的類別，希望能依據物件的具體類別執行對應的動作
- 對物件結構執行不干擾得操作，又不想將操作全部塞入
- 當物件結構的類別不常變動，但施於其上的操作卻常有增減時

```
想像你有一個動物園,裡面有不同種類的動物,比如大象、鳥和魚。每種動物都有自己的特點和需要不同的照顧方式。現在,你想要執行一些操作,比如餵食、健康檢查或是清潔牠們的生活區域。
問題是:

每種動物的餵食方式不同
健康檢查的項目也不一樣
清潔工作也因動物而異

你可能會想:"我該怎麼處理這麼多不同的情況呢?"
這就是訪問者模式可以幫上忙的地方。它就像是請來了幾位專家:

一位餵食專家
一位獸醫
一位清潔專家

每位專家都知道如何處理每種動物。當他們"訪問"每個動物時,會根據動物的類型來執行正確的操作。
比如:

餵食專家知道給大象吃草,給鳥吃種子,給魚餵魚食
獸醫知道要檢查大象的腳和鼻子,鳥的翅膀,魚的鰓
清潔專家知道如何清理大象園,鳥舍和水族館

這樣,你就不需要在每個動物類別中加入大量的 if-else 語句來處理不同的操作。相反,你可以創建不同的"訪問者"來處理這些操作。
總的來說,訪問者模式就是:

當你有一群不同類型的物件（比如不同的動物）
你想對這些物件執行一些操作（比如餵食、檢查）
但每種物件需要以不同的方式處理這些操作

訪問者模式讓你能夠把這些操作的邏輯從物件本身分離出來,放到專門的"訪問者"類別中。這樣可以讓你的代碼更容易維護和擴展。
```
### 結構
![image](https://hackmd.io/_uploads/Sk5Snoap0.png)
- ObjectStructure：能枚舉他的元素，提供給Visitor訪問的介面。
- Element：以訪問者為參數的Accept操作。
- Visitor：為每一個具體的元素(Element)類別宣告一個Visit操作。
- ConcreteVisitor：需要對每一個元素實作具體的Visit行為。
- ConcreteElement：需要時做Accept方法，通常是指接受存取的方法的實作。
#### 合作方式
- ![image](https://hackmd.io/_uploads/SJc8bhTaC.png)

- 健康檢查


### 效果
- 把資料( element )跟行為( visitor )分開
- 新需求只要新增訪客就好

### Example Code

```csharp=
using System;
using System.Collections.Generic;

// 動物接口
public interface IAnimal
{
    void Accept(IVisitor visitor);
}

// 具體動物類
public class Elephant : IAnimal
{
    public void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }
}

public class Bird : IAnimal
{
    public void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }
}

public class Fish : IAnimal
{
    public void Accept(IVisitor visitor)
    {
        visitor.Visit(this);
    }
}

// 訪問者接口
public interface IVisitor
{
    void Visit(Elephant elephant);
    void Visit(Bird bird);
    void Visit(Fish fish);
}

// 具體訪問者：餵食員
public class FeedingVisitor : IVisitor
{
    public void Visit(Elephant elephant)
    {
        Console.WriteLine("餵大象吃草");
    }

    public void Visit(Bird bird)
    {
        Console.WriteLine("餵鳥吃種子");
    }

    public void Visit(Fish fish)
    {
        Console.WriteLine("餵魚吃魚食");
    }
}

// 具體訪問者：獸醫
public class VetVisitor : IVisitor
{
    public void Visit(Elephant elephant)
    {
        Console.WriteLine("檢查大象的腳和鼻子");
    }

    public void Visit(Bird bird)
    {
        Console.WriteLine("檢查鳥的翅膀");
    }

    public void Visit(Fish fish)
    {
        Console.WriteLine("檢查魚的鰓");
    }
}

// 動物園類
public class Zoo
{
    private List<IAnimal> animals = new List<IAnimal>();

    public void AddAnimal(IAnimal animal)
    {
        animals.Add(animal);
    }

    public void Accept(IVisitor visitor)
    {
        foreach (var animal in animals)
        {
            animal.Accept(visitor);
        }
    }
}

// 主程序
class Program
{
    static void Main(string[] args)
    {
        Zoo zoo = new Zoo();
        zoo.AddAnimal(new Elephant());
        zoo.AddAnimal(new Bird());
        zoo.AddAnimal(new Fish());

        Console.WriteLine("餵食時間：");
        zoo.Accept(new FeedingVisitor());

        Console.WriteLine("\n健康檢查時間：");
        zoo.Accept(new VetVisitor());
    }
}
```

重構案例
```csharp=
using System;
using System.Collections.Generic;

// 图形基类
abstract class Shape
{
    public abstract double CalculateArea();
}

// 圆形类
class Circle : Shape
{
    public double Radius { get; }

    public Circle(double radius)
    {
        Radius = radius;
    }

    public override double CalculateArea()
    {
        return Math.PI * Radius * Radius;
    }
}

// 矩形类
class Rectangle : Shape
{
    public double Width { get; }
    public double Height { get; }

    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }

    public override double CalculateArea()
    {
        return Width * Height;
    }
}

// 三角形类
class Triangle : Shape
{
    public double Base { get; }
    public double Height { get; }

    public Triangle(double @base, double height)
    {
        Base = @base;
        Height = height;
    }

    public override double CalculateArea()
    {
        return 0.5 * Base * Height;
    }
}

// 使用示例
class Program
{
    static void Main()
    {
        var shapes = new List<Shape>
        {
            new Circle(5),
            new Rectangle(4, 6),
            new Triangle(3, 7)
        };

        foreach (var shape in shapes)
        {
            Console.WriteLine($"Area: {shape.CalculateArea()}");
        }
    }
}

```
```csharp=
using System;
using System.Collections.Generic;

// 图形基类
abstract class Shape
{
    public abstract void Accept(IShapeVisitor visitor);
}

// 圆形类
class Circle : Shape
{
    public double Radius { get; }

    public Circle(double radius)
    {
        Radius = radius;
    }

    public override void Accept(IShapeVisitor visitor)
    {
        visitor.Visit(this);
    }
}

// 矩形类
class Rectangle : Shape
{
    public double Width { get; }
    public double Height { get; }

    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }

    public override void Accept(IShapeVisitor visitor)
    {
        visitor.Visit(this);
    }
}

// 三角形类
class Triangle : Shape
{
    public double Base { get; }
    public double Height { get; }

    public Triangle(double @base, double height)
    {
        Base = @base;
        Height = height;
    }

    public override void Accept(IShapeVisitor visitor)
    {
        visitor.Visit(this);
    }
}

// Visitor 接口
interface IShapeVisitor
{
    void Visit(Circle circle);
    void Visit(Rectangle rectangle);
    void Visit(Triangle triangle);
}

// 计算面积的 Visitor
class AreaCalculator : IShapeVisitor
{
    public void Visit(Circle circle)
    {
        double area = Math.PI * circle.Radius * circle.Radius;
        Console.WriteLine($"Circle Area: {area}");
    }

    public void Visit(Rectangle rectangle)
    {
        double area = rectangle.Width * rectangle.Height;
        Console.WriteLine($"Rectangle Area: {area}");
    }

    public void Visit(Triangle triangle)
    {
        double area = 0.5 * triangle.Base * triangle.Height;
        Console.WriteLine($"Triangle Area: {area}");
    }
}

// 使用 Visitor
class Program
{
    static void Main()
    {
        var shapes = new List<Shape>
        {
            new Circle(5),
            new Rectangle(4, 6),
            new Triangle(3, 7)
        };

        var areaCalculator = new AreaCalculator();

        foreach (var shape in shapes)
        {
            shape.Accept(areaCalculator);
        }
    }
}

```


## 大家有沒有想到甚麼常見的 visitor pattern 應用