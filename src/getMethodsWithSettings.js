const SPACES_REGEX = /\s+/;
const MODIFIER_REGEX = /^(\S*?[^_])_[^_]/;

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

  const normalizeElementOption = (input) => {
    if (
      typeof input === 'object'
    ) {
      return input;
    }
    return { component: input };
  };

  const isNully = val => val === undefined || val === null || val === false;

  const getBlockNames = str => str.split(SPACES_REGEX)
    .filter((name, i, arr) => {
      const isModifier = name.match(MODIFIER_REGEX);
      if (isModifier && arr.indexOf(isModifier[1]) !== -1) {
        return false;
      }
      return true;
    });

  const filterProps = (props, options = {}) => {
    const rootProps = {
      className: '',
      ...props[rootElem],
    };

    const propsReducer = (ac, prop) => {
      if (prop.indexOf('__') === 0) {
        if (prop !== rootElem && !isNully(props[prop])) {
          if (!ac.elements[prop]) {
            ac.elements[prop] = {};
          }
          ac.elements[prop].props = normalizeElementProp(props[prop]);
        }
      } else if (prop.indexOf('_') === 0) {
        ac.modifiers[prop] = props[prop];
      } else {
        rootProps[prop] = props[prop];
      }
      return ac;
    };

    const optionsElementsReducer = (ac, elem) => {
      if (elem.indexOf('__') === 0) {
        if (props[elem] !== null && props[elem] !== false) {
          ac[elem] = normalizeElementOption(options[elem]);
        }
      }
      return ac;
    };

    const result = {
      blockNames: getBlockNames(options.block || props.className || ''),
      elements: Object.keys(options).reduce(optionsElementsReducer, {}),
      modifiers: {},
    };

    Object.keys(props).reduce(propsReducer, result);
    result.elements[rootElem] = {
      ...result.elements[rootElem],
      props: rootProps,
    };
    return result;
  };

  return { getBlockNames, getElement, getModifiers, filterProps };
};

export default getMethodsWithSettings;
