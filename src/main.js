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

  const bemto = (props, options) => {
    const result = filterProps(props, options);

    result.rootProps.className = [
      result.rootProps.className,
      getModifiers(result.blockNames, result.modifiers).join(' '),
    ].join(' ').trim();

    result.elements[rootElem] = result.rootProps;

    result.getProps = (el, props) => {
      const isRoot = !el || el === rootElem;
      let elementProps;
      let elementBlock;
      if (isRoot) {
        elementBlock = result.blockNames.join(' ');
        elementProps = { ...result.rootProps };
      } else {
        elementBlock = getElement(result.blockNames, el).join(' ');
        elementProps = { ...result.elements[el] || {} };
        elementProps.className = [
          elementBlock,
          elementProps.className,
        ].join(' ').trim();
      }

      if (props) {
        elementProps.className = [
          elementProps.className,
          bemto(props, { block: elementBlock }).rootProps.className
        ].join(' ').trim();
      }
      return elementProps;
    };
    return result;
  };

  return { withSettings, bemto };
};

export const { withSettings, bemto } = bemtoFactory(initialSettings);
