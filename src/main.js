import initialSettings from './initialSettings.js';
import getMethodsWithSettings from './getMethodsWithSettings.js';

const bemtoFactory = (settings) => {
  const { rootElem } = settings;

  // TODO: implement proper mergeSettings()
  const withSettings = (settings) => bemtoFactory({
    ...initialSettings,
    ...settings,
    getters: { ...initialSettings.getters, ...settings.getters },
    templates: { ...initialSettings.templates, ...settings.templates },
  });

  const {
    getModifiers,
    getElement,
    filterProps
  } = getMethodsWithSettings(settings);

  const bemto = (props, options = {}) => {
    const result = filterProps(props, options);

    result.elements[rootElem].props.className = [
      result.elements[rootElem].props.className,
      getModifiers(result.blockNames, result.modifiers).join(' '),
    ].join(' ').trim();

    result.getProps = (el, props) => {
      const isRoot = !el || el === rootElem;
      let elemProps;
      let elemBlock;
      if (isRoot) {
        elemBlock = result.blockNames.join(' ');
        elemProps = { ...result.elements[rootElem].props };
      } else {
        elemBlock = getElement(result.blockNames, el).join(' ');
        elemProps = {
          ...result.elements[el] && result.elements[el].props,
        };
        elemProps.className = [elemBlock, elemProps.className].join(' ').trim();
      }

      if (props) {
        const handledProps =
          bemto(props, { block: elemBlock }).elements[rootElem].props;
        const className = elemProps.className;
        elemProps = { ...elemProps, ...handledProps };
        elemProps.className =
          [className, handledProps.className].join(' ').trim();
      }
      return elemProps;
    };
    return result;
  };

  return { withSettings, bemto };
};

export const { withSettings, bemto } = bemtoFactory(initialSettings);
