import initialSettings from "../src/initialSettings.js";
import getMethodsWithSettings from "../src/getMethodsWithSettings.js";

const { getModifiers, getElement, filterProps } = getMethodsWithSettings(
  initialSettings
);

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
      filterProps({
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
        __EmptyElement: "",
      })
    ).toMatchInlineSnapshot(`
Object {
  "blockNames": Array [
    "Foo",
    "Bar",
  ],
  "elements": Object {
    "__EmptyElement": Object {
      "children": "",
    },
    "__SomeElement": Object {
      "children": "element content",
    },
    "__ZeroElement": Object {
      "children": 0,
    },
  },
  "modifiers": Object {
    "_mod": true,
    "_mod2": "val",
  },
  "rootProps": Object {
    "className": "Foo Bar",
    "href": "#hello",
    "title": "Some title",
  },
}
`));
});
