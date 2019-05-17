/* eslint-disable max-len */
import { bemto } from "../";

describe("bemto", () => {
  describe("Basic case with a modifier", () => {
    const props = {
      className: "Foo",
      href: "#hello",
      _mod: "bar",
      __Elem: {
        title: "elem title",
        className: "extraElemClass"
      }
    };
    const { getProps } = bemto(props);

    it("should output proper root", () => {
      expect(getProps()).toMatchInlineSnapshot(`
Object {
  "className": "Foo Foo_mod_bar",
  "href": "#hello",
}
`);
    });

    it("should output proper element", () => {
      expect(getProps("__Content")).toMatchInlineSnapshot(`
Object {
  "className": "Foo__Content",
}
`);
    });

    it("should output proper root via name with an extra modifier", () => {
      expect(getProps("__Root", { _mod2: "raz" })).toMatchInlineSnapshot(`
Object {
  "className": "Foo Foo_mod_bar Foo_mod2_raz",
  "href": "#hello",
}
`);
    });

    it("should output proper element with an extra modifier", () => {
      expect(getProps("__Content", { _elemmod: true })).toMatchInlineSnapshot(`
Object {
  "className": "Foo__Content Foo__Content_elemmod",
}
`);
    });

    it("should output proper root with an extra className untouched", () => {
      expect(getProps("__Root", { className: "u-extra" }))
        .toMatchInlineSnapshot(`
Object {
  "className": "Foo Foo_mod_bar u-extra",
  "href": "#hello",
}
`);
    });

    it("should output proper element with an extra className untouched", () => {
      expect(getProps("__Content", { className: "u-extra" }))
        .toMatchInlineSnapshot(`
Object {
  "className": "Foo__Content u-extra",
}
`);
    });

    it("should properly output elem with extra input props", () => {
      expect(getProps("__Elem", { className: "u-extra" }))
        .toMatchInlineSnapshot(`
Object {
  "className": "Foo__Elem extraElemClass u-extra",
  "title": "elem title",
}
`);
    });
  });
});

describe("withSettings", () => {});
