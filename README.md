# babel-plugin-react-transform-attr-expression

## Installation

```sh
npm install --save-dev babel-plugin-react-transform-attr-expression
```

## The problem solved

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

thanks
[https://github.com/oliviertassinari/babel-plugin-react-remove-properties]
