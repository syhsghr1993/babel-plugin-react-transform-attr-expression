# babel-plugin-react-transform-attr-expression

## Installation

```sh
npm install --save-dev babel-plugin-react-transform-attr-expression
```

## The problem solved

基于 react 管理系统权限点代码编写侵入性比较强的问题,优雅的编写权限点代码
Write permission code gracefully

## Example

**In**

```js
class Foo extends React.Component {
  render() {
    const flag = ["p1", "p2"].includes("p2");

    return (
      <div className="bar">
        <span data-permession={flag}>Hello Wold!</span>
      </div>
    );
  }
}
```

**Out**

```js
class Foo extends React.Component {
  render() {
    const flag = ["p1", "p2"].includes("p2");

    return <div className="bar">{flag && <span>Hello Wold!</span>}</div>;
  }
}
```

## Usage

#### Via `.babelrc` (Recommended)

**.babelrc**

without options:

```json
{
  "env": {
    "production": {
      "plugins": ["react-transform-attr-expression"]
    }
  }
}
```

with options. We accepts an array of property names that can be either strings or regular expressions:

```json
{
  "env": {
    "production": {
      "plugins": [
        [
          "react-transform-attr-expression",
          { "properties": ["data-permession", , /my-suffix-expression$/] }
        ]
      ]
    }
  }
}``
```

## With reference to the document

参照文档,感谢
thanks
[https://github.com/oliviertassinari/babel-plugin-react-remove-properties]
