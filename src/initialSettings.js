const initialSettings = {
  rootElem: '__Root',
  omitTrueModValue: true,
  getters: {
    modifier: key => key.indexOf('_') === 0 ? key.substring(1) : key,
    element: key => key.indexOf('__') === 0 ? key.substring(2) : key,
  },
  templates: {
    modifier: (block, modifier) => `${block}_${modifier}`,
    modifierValue: (key, value) => `${key}_${value}`,
    element: (block, element) => `${block}__${element}`,
  },
};

export default initialSettings;
