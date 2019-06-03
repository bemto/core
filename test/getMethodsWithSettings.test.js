import initialSettings from "../src/initialSettings.js";
import getMethodsWithSettings from "../src/getMethodsWithSettings.js";

const {
  getBlockNames,
  getElement,
  getModifiers,
  filterProps
} = getMethodsWithSettings(initialSettings);

describe("getBlockNames", () => {
  it("should get two block names", () =>
    expect(getBlockNames("Foo Bar")).toMatchInlineSnapshot(`
Array [
  "Foo",
  "Bar",
]
`));

  it("should not count a modifier", () =>
    expect(getBlockNames("Foo Foo_bar")).toMatchInlineSnapshot(`
Array [
  "Foo",
]
`));

  it("should count an element", () =>
    expect(getBlockNames("Foo Foo__Bar")).toMatchInlineSnapshot(`
Array [
  "Foo",
  "Foo__Bar",
]
`));

  it("should not count an element with a modifier", () =>
    expect(getBlockNames("Foo__Bar Foo__Bar_mod_val")).toMatchInlineSnapshot(`
Array [
  "Foo__Bar",
]
`));

  it("should count a modifier if there is no block for it", () =>
    expect(getBlockNames("Foo_bar Baz")).toMatchInlineSnapshot(`
Array [
  "Foo_bar",
  "Baz",
]
`));

  it("should count a block modifier if there is no block for it", () =>
    expect(getBlockNames("Foo Baz__Foo_mod")).toMatchInlineSnapshot(`
Array [
  "Foo",
  "Baz__Foo_mod",
]
`));

});

describe("getModifiers", () => {
  it("should add one simple modifier to one block name", () =>
    expect(getModifiers(["Foo"], { _bar: true })).toMatchInlineSnapshot(`
Array [
  "Foo_bar",
]
`));

  it("should add two modifiers to two block names", () =>
    expect(getModifiers(["Foo", "Bar"], { _baz: true, _raz: "qaz" }))
      .toMatchInlineSnapshot(`
Array [
  "Foo_baz",
  "Bar_baz",
  "Foo_raz_qaz",
  "Bar_raz_qaz",
]
`));
});

describe("getElement", () => {
  it("should create an element from one block name", () =>
    expect(getElement(["Foo"], "Content")).toMatchInlineSnapshot(`
Array [
  "Foo__Content",
]
`));

  it("should create an element from two block names", () =>
    expect(getElement(["Foo", "Bar"], "Content")).toMatchInlineSnapshot(`
Array [
  "Foo__Content",
  "Bar__Content",
]
`));
});

describe("filterProps", () => {
  it("should properly filter the props", () =>
    expect(
      filterProps(
        {
          className: "Foo Bar",
          title: "Some title",
          href: "#hello",
          _mod: true,
          _mod2: "val",
          __SomeElement: "element content",
          __FalseElement: false,
          __NullElement: null,
          __UndefinedElement: undefined,
          __ZeroElement: 0,
          __EmptyElement: ""
        },
        {
          __Root: "div",
          __SomeElement: "div",
          __NullElement: "span",
          __FalseElement: "whatevs",
          __DefinedElement: "em"
        }
      )
    ).toMatchInlineSnapshot(`
Object {
  "blockNames": Array [
    "Foo",
    "Bar",
  ],
  "elements": Object {
    "__DefinedElement": Object {
      "component": "em",
    },
    "__EmptyElement": Object {
      "props": Object {
        "children": "",
      },
    },
    "__Root": Object {
      "component": "div",
      "props": Object {
        "className": "Foo Bar",
        "href": "#hello",
        "title": "Some title",
      },
    },
    "__SomeElement": Object {
      "component": "div",
      "props": Object {
        "children": "element content",
      },
    },
    "__ZeroElement": Object {
      "props": Object {
        "children": 0,
      },
    },
  },
  "modifiers": Object {
    "_mod": true,
    "_mod2": "val",
  },
}
`));
});
