const getMethodsWithSettings = ({
  omitTrueModValue,
  getters,
  templates,
  rootElem
}) => {
  const renderModifier = (className, mod, value) => templates.modifier(
    className,
    typeof value === 'boolean' && omitTrueModValue
      ? getters.modifier(mod)
      : templates.modifierValue(getters.modifier(mod), value),
  );

  const renderElement = (className, el) =>
    templates.element(className, getters.element(el));

  const getModifiers = (blockNames, modifiers) => Object.keys(modifiers)
    .reduce((result, modifier) => {
      if (modifiers[modifier]) {
        blockNames.map(part => result.push(
          renderModifier(part, modifier, modifiers[modifier])
        ));
      }
      return result;
    }, []);

  const getElement = (blockNames, element) =>
    blockNames.map(part => renderElement(part, element));

  const normalizeElementProp = (input) => {
    if (
      typeof input === 'object'
      && !(input instanceof Array)
      && !input.props // treat as components, should go to children
    ) {
      return input;
    }
    return { children: input };
  };

  const isNully = val => val === undefined || val === null || val === false;

  const filterProps = (props, options = {}) =>
    Object.keys(props).reduce((result, prop) => {
      if (prop.indexOf('__') === 0) {
        if (prop !== rootElem && !isNully(props[prop])) {
          result.elements[prop] = normalizeElementProp(props[prop]);
        }
      } else if (prop.indexOf('_') === 0) {
        result.modifiers[prop] = props[prop];
      } else {
        result.rootProps[prop] = props[prop];
      }
      return result;
    }, {
      rootProps: { className: '', ...props[rootElem] },
      blockNames: (options.block || props.className || '').split(/\s+/),
      elements: {},
      modifiers: {},
    });

  return { getModifiers, getElement, filterProps };
};

export default getMethodsWithSettings;
