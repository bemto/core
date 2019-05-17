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

    result.rootProps.className = [
      result.rootProps.className,
      getModifiers(result.blockNames, result.modifiers).join(' '),
    ].join(' ').trim();

    result.elements[rootElem] = result.rootProps;

    result.getProps = (el, props) => {
      const isRoot = !el || el === rootElem;
      let elemProps;
      let elemBlock;
      if (isRoot) {
        elemBlock = result.blockNames.join(' ');
        elemProps = { ...options[el || rootElem], ...result.rootProps };
      } else {
        elemBlock = getElement(result.blockNames, el).join(' ');
        elemProps = { ...options[el || rootElem], ...result.elements[el] };
        elemProps.className = [elemBlock, elemProps.className].join(' ').trim();
      }

      if (props) {
        const handledProps = bemto(props, { block: elemBlock }).rootProps;
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
