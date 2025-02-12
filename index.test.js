const { JSDOM } = require("jsdom");
const { TextEncoder, TextDecoder } = require("util");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const {
  scrambleText,
  handleOptionChange,
  showSecondSection,
  showFirstSection,
  updateProjectImage,
  handleKeyNavigation,
  showThirdSection,
  returnToSecondSection,
  handleEscapeKey,
} = require("./src/index.js");

describe("scrambleText", () => {
  it("should scramble text and then display final text", (done) => {
    const dom = new JSDOM('<!DOCTYPE html><p id="test"></p>');
    const element = dom.window.document.getElementById("test");
    scrambleText(element, "final", 1000, () => {
      expect(element.textContent).toBe("final");
      done();
    });
  });
});

describe("handleOptionChange", () => {
  it("should call showSecondSection when radioO is checked", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><input type="radio" id="option-o" checked><input type="radio" id="option-n">'
    );
    const radioO = dom.window.document.getElementById("option-o");
    const radioN = dom.window.document.getElementById("option-n");
    const event = new dom.window.Event("change");
    radioO.checked = true;
    handleOptionChange(event);
    expect(showSecondSection).toHaveBeenCalled();
  });

  it("should call initSnakeGame when radioN is checked", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><input type="radio" id="option-o"><input type="radio" id="option-n" checked>'
    );
    const radioO = dom.window.document.getElementById("option-o");
    const radioN = dom.window.document.getElementById("option-n");
    const event = new dom.window.Event("change");
    radioN.checked = true;
    handleOptionChange(event);
    expect(initSnakeGame).toHaveBeenCalled();
  });
});

describe("showSecondSection", () => {
  it("should display the second section", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="container"></div><div class="second-section"></div>'
    );
    const container = dom.window.document.querySelector(".container");
    const secondSection = dom.window.document.querySelector(".second-section");
    showSecondSection();
    expect(secondSection.style.display).toBe("block");
  });
});

describe("showFirstSection", () => {
  it("should display the first section", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="container"></div><div class="second-section"></div>'
    );
    const container = dom.window.document.querySelector(".container");
    const secondSection = dom.window.document.querySelector(".second-section");
    showFirstSection();
    expect(container.style.display).toBe("block");
  });
});

describe("updateProjectImage", () => {
  it("should update project image on hover", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="project"><img src=""></div>'
    );
    const project = dom.window.document.querySelector(".project");
    const img = project.querySelector("img");
    updateProjectImage(project, true);
    expect(img.src).toContain("icons8-dossier-ouvert-80.png");
  });
});

describe("handleKeyNavigation", () => {
  it("should navigate projects with arrow keys", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="project"></div><div class="project"></div>'
    );
    const projects = dom.window.document.querySelectorAll(".project");
    const event = new dom.window.KeyboardEvent("keydown", {
      key: "ArrowRight",
    });
    handleKeyNavigation(event);
    expect(projects[1].classList.contains("focused")).toBe(true);
  });
});

describe("showThirdSection", () => {
  it("should display the third section", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="second-section"></div><div class="third-section"></div>'
    );
    const secondSection = dom.window.document.querySelector(".second-section");
    const thirdSection = dom.window.document.querySelector(".third-section");
    showThirdSection();
    expect(thirdSection.style.display).toBe("block");
  });
});

describe("returnToSecondSection", () => {
  it("should return to the second section", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="second-section"></div><div class="third-section"></div>'
    );
    const secondSection = dom.window.document.querySelector(".second-section");
    const thirdSection = dom.window.document.querySelector(".third-section");
    returnToSecondSection();
    expect(secondSection.style.display).toBe("block");
  });
});

describe("handleEscapeKey", () => {
  it("should handle escape key to navigate sections", () => {
    const dom = new JSDOM(
      '<!DOCTYPE html><div class="second-section"></div><div class="third-section"></div>'
    );
    const event = new dom.window.KeyboardEvent("keydown", { key: "Escape" });
    handleEscapeKey(event);
    expect(showFirstSection).toHaveBeenCalled();
  });
});
