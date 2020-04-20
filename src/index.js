export default function({ types: t, template }) {
  return {
    visitor: {
      Program(path, state) {
        // On program start, do an explicit traversal up front for this plugin.
        const properties = state.opts.properties || [];

        if (state.opts.property) {
          /* eslint-disable no-console */
          console.warn(`
              babel-plugin-react-transform-attr-expression:
              The property option is deprecated, instead use the properties one.
            `);
          /* eslint-enable no-console */
          properties.push(state.opts.property);
        }

        // 配置项
        if (properties.length === 0) {
          properties.push(/^data-permession/);
        }

        path.traverse({
          JSXElement(path2) {
            // 开始标签
            if (path2.node.openingElement) {
              // 找到属性的索引
              const attrIndex = [];
              path2.node.openingElement.attributes.forEach((item, index) => {
                if (
                  properties.includes(item.name.name) ||
                  properties.some(
                    property => property instanceof RegExp && property.test(item.name.name)
                  )
                ) {
                  attrIndex.push(index);
                }
              });

              // 如果有标记并且标记值为jsx表达式容器
              if (
                attrIndex.length > 0 &&
                t.isJSXExpressionContainer(
                  path2.get(`openingElement.attributes.${attrIndex[0]}.value`)
                )
              ) {
                // 获取到定义的表达式
                const expression = path2.get(
                  `openingElement.attributes.${attrIndex[0]}.value.expression`
                );

                // 组装原始表达式字符串
                const originExpr = expression.hub.file.code.substring(
                  expression.node.start,
                  expression.node.end
                );

                // 根据原始表达式字符串生成新的表达式
                const expr = template.expression(originExpr)();

                // 删除标记 删除后attributes长度会-1
                attrIndex.reduce((total, item) => {
                  path2.get(`openingElement.attributes.${item - total}`).remove();
                  return total + 1;
                }, 0);

                if (attrIndex.length > 1) {
                  /* eslint-disable no-console */
                  console.warn(`
                    babel-plugin-react-transform-attr-expression:
                    The second property is overwritten by the first.
                  `);
                }

                // 创建新ast树模板
                const preOperationAST = template('{ EXPR && ARGS }');

                // 替换源 <div data-permession={flag}>test</div>
                // 替换结果 { flag && <div>test</div> }
                path2.replaceWith(
                  preOperationAST({
                    EXPR: expr,
                    ARGS: t.jSXElement(
                      path2.node.openingElement,
                      path2.node.closingElement,
                      path2.node.children,
                      false
                    ),
                  })
                );
              }
            }
          },
        });
      },
    },
  };
}
